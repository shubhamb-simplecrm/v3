import React, { useState, useCallback, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  Modal,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  useTheme,
  Button,
  Link,
  IconButton,
  Tooltip,
  Box,
  TableCell,
  TableRow,
  Card,
  CardContent,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import {
  Close,
  Search as SearchIcon,
  EmojiObjectsOutlined as HelpOutlineIcon,
  Add,
  Save,
} from "@material-ui/icons";
import { pathOr, clone } from "ramda";
import { MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import { Scrollbars } from "react-custom-scrollbars";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
  getRelateFieldData,
  relateFieldSearch,
  relatePopupCreateSubmit,
} from "../../../store/actions/module.actions";
import { saveAs } from "file-saver";
import { validateForm } from "../../../common/utils";
import useStyles, { getMuiTheme } from "./styles";
import { FormInput } from "../../";
import SearchView from "./search-view";
import { toast } from "react-toastify";
import FileViewerComp from "../../FileViewer/FileViewer";
import "./styles.css";
import clsx from "clsx";
import parse from "html-react-parser";
import SuggestionName from "./suggestion/index";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_NO_RECORDS_FOUND_MESSAGE,
  LBL_PLEASE_WAIT_WHILE_DATA_LOADING,
  LBL_REQUIRED_FIELD,
  LBL_SAVE_BUTTON_TITLE,
  LBL_TABLE_DISPLAY_ROWS_TITLE,
  LBL_TABLE_PAGE_NEXT_TITLE,
  LBL_TABLE_PAGE_PREVIOUS_TITLE,
  LBL_TABLE_PER_PAGE_TITLE,
  LBL_TABLE_SORT_TITLE,
  SOMETHING_WENT_WRONG,
} from "../../../constant";

const Suggestions = ({
  field,
  onChange,
  value,
  errors = {},
  small = false,
  module = "",
  isIconBtn = false,
  btnIcon = null,
  isSelectBtn = false,
  tooltipTitle,
  variant = "outlined",
  multiSelect = false,
  component = "",
  reportsTo = null,
  view = null,
  disabled = false,
  userData = [],
  color = "",
  initialValues,
  onCopy = null,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const currentUserId = pathOr(
    "",
    ["data", "attributes", "id"],
    useSelector((state) => state.config.currentUserData),
  );
  const currentUserName = pathOr(
    "",
    ["data", "attributes", "full_name"],
    useSelector((state) => state.config.currentUserData),
  );
  const [modalVisible, toggleModalVisibility] = useState(false);
  const [createViewVisible, setCreateViewVisibility] = useState(false);
  const [filterViewVisible, setFilterViewVisibility] = useState(false);
  const [relateFieldData, setRelateFieldData] = useState({});
  const [data, setData] = useState([]);
  const [label, setLabel] = useState();
  const [listViewMeta, setListViewMeta] = useState({
    page: 0,
  });
  const [createRecordFields, setCreateRecordFields] = useState({
    assigned_user_name: { id: currentUserId, value: currentUserName },
  });
  const [searchFields, setSearchFields] = useState({
    name: initialValues.name || "",
  });
  const [searchFieldsMeta, setSearchFieldsMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [detailExpanded, setDetailExpanded] = useState([]);
  const [fieldErrors, setErrors] = useState(errors);
  let iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : false;
  const currentSelectedModule = field.module ? field.module : module;
  const { CalendarListViewTabData } = useSelector((state) => state.calendar);

  const [selectedRecord, setSelectedRecords] = useState(
    view === "calendar"
      ? pathOr([], ["Calendar", "data", "user_ids"], CalendarListViewTabData)
      : userData,
  );
  const [selectedRecordIndex, setSelectedRecordIndexes] = useState([]);
  const { config } = useSelector((state) => state.config);
  const calendar_format = pathOr(
    config?.default_date_format,
    ["attributes", "global", "calendar_format"],
    useSelector((state) => state.config.userPreference),
  );
  const site_url = useSelector((state) => state.config.config.site_url);
  const date_reg_format = pathOr(
    config?.default_date_format,
    ["attributes", "global", "date_reg_format"],
    useSelector((state) => state.config.userPreference),
  );
  const time_reg_format = pathOr(
    config?.default_date_format,
    ["attributes", "global", "time_reg_format"],
    useSelector((state) => state.config.userPreference),
  );
  const date_reg_positions = pathOr(
    config?.default_date_format,
    ["attributes", "global", "date_reg_positions"],
    useSelector((state) => state.config.userPreference),
  );
  const [previewFile, setPreviewFile] = useState({
    open: false,
    filename: "",
    filepath: "",
  });

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const handleShowPreviewFile = (fname, url) => {
    let arr = fname.split(".");
    let ext = arr[arr.length - 1].toUpperCase();
    setPreviewFile({
      open: true,
      filename: fname,
      filepath: url,
      filetype: ext,
    });
  };
  const fetchRelateFieldData = useCallback(
    async (isReset = false) => {
      if (modalVisible) {
        try {
          let query = `&filter[status][multi]=published_public`;
          query +=
            initialValues && initialValues.name
              ? `&filter[name][lke]=${initialValues.name}`
              : "";
          if (isReset) {
            query = "";
          }
          setLoading(true);
          const res = await getRelateFieldData(
            currentSelectedModule,
            "20",
            "1",
            "-date_entered",
            query,
            reportsTo,
          );
          if (res.ok) {
            setRelateFieldData(res.data);
            setLabel(pathOr("", ["data", "data", "module_label"], res));
          }
          setLoading(false);
        } catch (ex) {
          setLoading(false);
          toast(SOMETHING_WENT_WRONG);
        }
      }
    },
    [currentSelectedModule, modalVisible],
  );

  useEffect(() => {
    fetchRelateFieldData();
  }, [fetchRelateFieldData]);

  const buildFilterQuery = () => {
    let filterQuery = "";
    let operator = "eq";
    for (let key in searchFields) {
      let searchType = pathOr("", [key, "type"], searchFieldsMeta);
      let operator = "eq";
      let likeTypes = ["name", "url"];
      if (likeTypes.includes(searchType)) {
        operator = "lke";
      }
      let multiTypes = ["multienum"];
      if (multiTypes.includes(searchType)) {
        operator = "multi";
      }
      if (searchFields[key]) {
        if (typeof searchFields[key] !== "object") {
          if (searchType === "datetime" || searchType === "datetimecombo") {
            let dateSingleValue = [
              "next_7_days",
              "last_7_days",
              "last_month",
              "this_month",
              "next_month",
              "last_30_days",
              "next_30_days",
              "this_year",
              "last_year",
              "next_year",
            ];
            let dateDoubleValue = [
              "=",
              "not_equal",
              "less_than",
              "greater_than",
              "less_than_equals",
              "greater_than_equals",
            ];
            let dateTripalValue = ["between"];

            if (dateSingleValue.some((item) => searchFields[key] === item)) {
              filterQuery =
                filterQuery +
                `filter[range_${key}][${`operator`}]=${searchFields[key]}&`;
            } else if (
              dateDoubleValue.some((item) => searchFields[key] === item)
            ) {
              filterQuery =
                filterQuery +
                `filter[range_${key}][${operator}]=${
                  searchFields["range_" + key]
                }&filter[${key}_range_choice][${`operator`}]=${
                  searchFields[key]
                }&`;
            } else if (
              dateTripalValue.some((item) => searchFields[key] === item)
            ) {
              filterQuery =
                filterQuery +
                `filter[start_range_${key}][${operator}]=${
                  searchFields["start_range_" + key]
                }&filter[end_range_${key}][${operator}]=${
                  searchFields["end_range_" + key]
                }&filter[${key}_range_choice][${`operator`}]=${
                  searchFields[key]
                }&`;
            }
          } else if (searchType === "bool") {
            filterQuery =
              filterQuery +
              `filter[${key}][${operator}]=${searchFields[key] ? 1 : 0}&`;
          } else {
            let fval = encodeURIComponent(searchFields[key]);
            filterQuery = filterQuery + `filter[${key}][${operator}]=${fval}&`;
          }
        } else if (operator === "multi") {
          if (searchFields[key].length > 0) {
            filterQuery =
              filterQuery +
              `filter[${key}][${operator}]=${searchFields[key] || []}&`;
          }
        } else if (searchType === "relate") {
          filterQuery =
            filterQuery + `filter[${key}][]=${searchFields[key].id}&`;
        } else if (searchType === "parent") {
          filterQuery =
            filterQuery +
            `filter[parent_type][${operator}]=${searchFields[key].parent_type}&filter[parent_name][${operator}]=${searchFields[key].parent_id}`;
        } else {
          filterQuery =
            filterQuery +
            `filter[${key}][${operator}]=${searchFields[key].id || []}&`;
        }
      }
    }
    return filterQuery;
  };

  const resetFields = async (fields, fieldsType) => {
    const fieldsCopy = clone(fields);
    for (let val in fieldsCopy) {
      fieldsCopy[val] = "";
    }

    if (fieldsType === "setCreateRecordFields") {
      setCreateRecordFields(fieldsCopy);
      return;
    }
    setSearchFields(fieldsCopy);
    Object.keys(fieldsCopy).length && (await fetchRelateFieldData(true));
  };

  const stopParentSubmit = (event) => {
    event.stopPropagation();
  };

  const search = async () => {
    setLoading(true);
    try {
      const res = await relateFieldSearch(
        currentSelectedModule,
        buildFilterQuery(),
      );
      setListViewMeta({
        page: 0,
      });
      setLoading(false);
      if (res.ok) {
        setRelateFieldData(res.data);
        return;
      }
    } catch (ex) {
      console.log("Error:", ex);
      toast(SOMETHING_WENT_WRONG);
    }
  };

  const saveRecord = async (event) => {
    event.preventDefault();
    stopParentSubmit(event);
    setLoading(true);
    let createViewFields = pathOr(
      [],
      ["data", "templateMeta", "quickcreateview", 0, "attributes"],
      relateFieldData,
    );
    try {
      let validate = validateForm(createViewFields.flat(), createRecordFields, {
        calendar_format,
        date_reg_format,
        time_reg_format,
        date_reg_positions,
      });

      setErrors(validate.errors);

      if (validate.formIsValid) {
        const data = {
          data: {
            type: currentSelectedModule,
            attributes: createRecordFields,
          },
        };
        let res = await relatePopupCreateSubmit(data);

        if (res.ok) {
          resetFields(createRecordFields, "setCreateRecordFields");
          setCreateViewVisibility(true);
          setListViewMeta({
            page: 0,
          });
          changePageOrSort(0, "-date_entered");
          toast("Record created.");
          setLoading(false);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (ex) {
      setLoading(false);
      toast(SOMETHING_WENT_WRONG);
    }
  };

  const renderLoader = () => (
    <div className={classes.progressWrapper}>
      <CircularProgress />
    </div>
  );
  useEffect(() => {
    let selectedIds = [];
    data.map((content, key) => {
      if (selectedRecord.some((item) => item === content.id)) {
        selectedIds.push(key);
      }
      setSelectedRecordIndexes(selectedIds);
    });
  }, [data]);
  useEffect(() => {
    setDetailExpanded(detailExpanded);
  }, [detailExpanded]);
  useEffect(() => {
    setSearchFields({
      ...searchFields,
      name: initialValues.name,
      status: "published_public",
    });
  }, [initialValues.name]);

  const renderCreateView = () => {
    let createViewFields = pathOr(
      [],
      ["data", "templateMeta", "quickcreateview", 0, "attributes"],
      relateFieldData,
    );

    if (!createViewFields.length) return null;

    return (
      <div className={classes.perSectionWrapper}>
        {loading ? (
          renderLoader()
        ) : (
          <>
            <Typography color="primary" className={classes.sectionTitle}>
              Create
            </Typography>
            <Grid container spacing={2}>
              {createViewFields.map((fieldArr) =>
                fieldArr.map((field) => (
                  <Grid item xs={12} sm={6} md={4} ey={field.field_key}>
                    <FormInput
                      field={field}
                      key={field.field_key}
                      errors={fieldErrors}
                      value={createRecordFields[field.field_key]}
                      small={true}
                      onChange={(val) => {
                        if (field.type === "relate") {
                          setCreateRecordFields({
                            ...createRecordFields,
                            [field.name]: val.value,
                            [field.id_name]: val.id,
                          });
                          return;
                        }
                        setCreateRecordFields({
                          ...createRecordFields,
                          [field.field_key]: val,
                        });
                      }}
                    />
                  </Grid>
                )),
              )}
              <div className={classes.buttonsWrapper}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setCreateViewVisibility(!createViewVisible);
                    resetFields(createRecordFields, "setCreateRecordFields");
                  }}
                  color="primary"
                  size="small"
                  disableElevation
                  className={classes.cstmBtn}
                >
                  <Close /> {LBL_CANCEL_BUTTON_TITLE}
                </Button>

                <Button
                  variant="contained"
                  onClick={saveRecord}
                  color="primary"
                  size="small"
                  //type="submit"
                  disableElevation
                  className={classes.cstmBtn}
                  form="relate-create-form"
                >
                  <Save /> {LBL_SAVE_BUTTON_TITLE}
                </Button>
              </div>
            </Grid>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    setData(
      pathOr([], ["data", "templateMeta", "listview", "data"], relateFieldData),
    );
  }, [relateFieldData]);

  let columns = pathOr(
    [],
    ["data", "templateMeta", "listview", "datalabels"],
    relateFieldData,
  ).map((it) => {
    if (
      it.name === "name" ||
      (module === "Documents" && it.name === "document_name")
    ) {
      return {
        ...it,
        options: {
          setCellProps: (value) => {
            return {
              className: clsx({
                [classes.NameCell]: true,
              }),
            };
          },
          filter: false,
          customBodyRender: (value, tableMeta) => {
            const resolution = pathOr(
              "test",
              [tableMeta["rowIndex"], "attributes", "additional_info"],
              data,
            );
            return (
              <Typography>
                <Link
                  className={classes.link}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (!multiSelect) {
                      toggleModalVisibility(!modalVisible);
                      onChange({ value: value || "", resolution: resolution });
                    }
                  }}
                  to="#"
                  variant="body2"
                >
                  {value}
                </Link>
              </Typography>
            );
          },
        },
      };
    }
    if (it.type === "file") {
      return {
        ...it,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            let furl = `${site_url}/index.php?entryPoint=customDownload&id=${
              data[tableMeta["rowIndex"]].id
            }&type=${module}`;
            return value ? (
              <Typography>
                <VisibilityIcon
                  fontSize="small"
                  style={{
                    margin: "-1vh",
                    marginLeft: "1vh",
                    marginRight: "1vw",
                    cursor: "pointer",
                  }}
                  onClick={() => handleShowPreviewFile(value, furl)}
                />
                <Tooltip title={value}>
                  <Link
                    style={{ cursor: "pointer" }}
                    to={`#`}
                    className={classes.link}
                    onClick={() => {
                      saveAs(furl, data[tableMeta["rowIndex"]].filename);
                      toast("Download is in progress...");
                    }}
                    variant="body2"
                  >
                    {truncate(value, 20) ||
                      truncate(data[tableMeta["rowIndex"]].document_name, 20) ||
                      ""}
                  </Link>
                </Tooltip>
              </Typography>
            ) : (
              ""
            );
          },
        },
      };
    }
    return it;
  });

  const handleSelectChange = (currentRowsSelected = null) => {
    if (currentRowsSelected.length === 0) {
      data.forEach((feed, i) => {
        var indexselectedRecord = selectedRecord.indexOf(feed.id);
        var indexselectedIndex = selectedRecordIndex.indexOf(i);
        if (indexselectedRecord !== -1) {
          selectedRecord.splice(indexselectedRecord, 1);
        }
        if (indexselectedIndex !== -1) {
          selectedRecordIndex.splice(indexselectedIndex, 1);
        }
      });
    } else {
      currentRowsSelected.forEach((feed, i) => {
        if (selectedRecord.some((item) => data[feed.index].id === item)) {
          var indexselectedRecord = selectedRecord.indexOf(data[feed.index].id);
          var indexselectedIndex = selectedRecordIndex.indexOf(feed.index);
          if (indexselectedRecord !== -1) {
            selectedRecord.splice(indexselectedRecord, 1);
          }
          if (indexselectedIndex !== -1) {
            selectedRecordIndex.splice(indexselectedIndex, 1);
          }
        } else {
          let dataArr = data[feed.index].id;
          if (component === "reminder") {
            dataArr = {
              id: "",
              module_id: data[feed.index].id,
              module: module,
              value: pathOr("", ["attributes", "name"], data[feed.index]),
              name: pathOr("", ["attributes", "name"], data[feed.index]),
              email1: pathOr("", ["attributes", "email1"], data[feed.index]),
            };
          }
          selectedRecord.push(dataArr);
          selectedRecordIndex.push(feed.index);
        }
      });
    }
  };
  const multiSelectRecords = (data) => {
    toggleModalVisibility(!modalVisible);
    onChange(data);
  };
  const changePageOrSort = async (page, sort) => {
    try {
      setLoading(true);
      setListViewMeta({ page });
      const res = await getRelateFieldData(
        currentSelectedModule,
        20,
        page + 1,
        sort,
        buildFilterQuery(),
        reportsTo,
      );
      setRelateFieldData(res.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const handleTableChange = (action, tableState) => {
    let tableCont = document.getElementsByClassName(tableState.announceText);
    if (tableCont[0] && tableCont[0].children[2]) {
      let table = tableCont[0].children[2].children[0];
      if (tableState.curExpandedRows) {
        let nodetr = table.children[2].querySelector(
          "#MUIDataTableBodyRow-" + tableState.curExpandedRows[0].index,
        );
        if (nodetr) {
          var svgElement = nodetr.querySelector("svg");
          var nodetd = nodetr.children;
          for (var i = 1; i < nodetd.length; i++) {
            if (
              nodetd[i].style.display === "" ||
              nodetd[i].style.display === "none"
            ) {
              nodetd[i].style.display = "block";
              svgElement.classList.add("MUIDataTableSelectCell-expanded");
            } else if (nodetd[i].style.display === "block") {
              nodetd[i].style.display = "none";
              let cls = "MUIDataTableSelectCell-expanded";
              svgElement.classList.remove.apply(
                svgElement.classList,
                Array.from(svgElement.classList).filter((v) =>
                  v.startsWith(cls),
                ),
              );
            }
          }
        }
      }
    }
  };

  const renderListView = () => {
    return (
      <MuiThemeProvider theme={getMuiTheme(theme)}>
        {loading ? renderLoader() : ""}
        <Box display={!loading ? "block" : "none"}>
          <MUIDataTable
            className={currentSelectedModule}
            data={data.map((it) => it.attributes)}
            columns={columns}
            options={{
              responsive: "vertical",
              filter: false,
              download: false,
              print: false,
              viewColumns: false,
              selectableRows: false,
              selectableRowsHeader: false,

              onRowSelectionChange: (
                currentRowsSelected,
                allRowsSelected,
                rowsSelected,
              ) =>
                handleSelectChange(
                  currentRowsSelected,
                  allRowsSelected,
                  rowsSelected,
                ),
              rowsSelected: selectedRecordIndex,
              page: listViewMeta["page"],
              count: pathOr(0, ["meta", "total-records"], relateFieldData),
              search: false,
              rowsPerPage: 20,
              fixedHeader: true,
              serverSide: true,
              //tableBodyHeight: "500px",
              customToolbar: () => {
                return view === "calendar" ? (
                  <Button
                    className={classes.btn}
                    style={{ float: "left" }}
                    color="primary"
                    variant="outlined"
                    onClick={() => multiSelectRecords(["clear"])}
                  >
                    Clear
                  </Button>
                ) : null;
              },
              customToolbarSelect: (
                selectedRows,
                displayData,
                setSelectedRows,
              ) => {
                return (
                  <Button
                    className={classes.btn}
                    color="primary"
                    variant="outlined"
                    onClick={() => multiSelectRecords(selectedRecord)}
                  >
                    Select
                  </Button>
                );
              },
              rowsPerPageOptions: false,
              onTableChange: (action, tableState) => {
                // console.log("onTableChange tableState",action,tableState);
                switch (action) {
                  case "changePage":
                    if (tableState.sortOrder.hasOwnProperty("name")) {
                      let directionToSort =
                        tableState.sortOrder.direction === "desc"
                          ? `-${tableState.sortOrder.name}`
                          : tableState.sortOrder.name;
                      changePageOrSort(tableState.page, directionToSort);
                      break;
                    }
                    changePageOrSort(tableState.page);
                    break;
                  case "sort":
                    if (tableState.sortOrder.direction === "desc") {
                      changePageOrSort(
                        tableState.page,
                        `-${tableState.sortOrder.name}`,
                      );
                      break;
                    }
                    changePageOrSort(
                      tableState.page,
                      tableState.sortOrder.name,
                    );

                    break;
                  default:
                    break;
                }
              },
              textLabels: {
                body: {
                  noMatch: loading ? (
                    LBL_PLEASE_WAIT_WHILE_DATA_LOADING
                  ) : (
                    <div style={{ padding: "10px 5px 10px 5px" }}>
                      <Alert variant="outlined" severity="warning">
                        {LBL_NO_RECORDS_FOUND_MESSAGE}
                      </Alert>
                    </div>
                  ),
                  toolTip: LBL_TABLE_SORT_TITLE,
                },
                pagination: {
                  next: LBL_TABLE_PAGE_NEXT_TITLE,
                  previous: LBL_TABLE_PAGE_PREVIOUS_TITLE,
                  rowsPerPage: LBL_TABLE_PER_PAGE_TITLE,
                  displayRows: LBL_TABLE_DISPLAY_ROWS_TITLE,
                },
              },

              expandableRows: true,
              rowsExpanded: detailExpanded,
              expandableRowsHeader: false,
              renderExpandableRow: (rowData, rowMeta) => {
                const colSpan = rowData.length + 1;
                let description = pathOr(
                  "",
                  [rowMeta.dataIndex, "attributes", "additional_info"],
                  data,
                );
                return (
                  <TableRow className={classes.nestedTableRow}>
                    <TableCell colSpan={colSpan}>
                      <Card>
                        <CardContent
                          style={{
                            maxHeight: description ? "60vh" : "10vh",
                            overflowY: "auto",
                          }}
                        >
                          <Typography
                            className={module === "Emails" ? "" : classes.text}
                            variant="subtitle1"
                          >
                            {parse(description) || ""}
                          </Typography>
                        </CardContent>
                      </Card>
                    </TableCell>
                  </TableRow>
                );
              },
            }}
          />
        </Box>

        {previewFile.open ? (
          <FileViewerComp
            previewFile={previewFile}
            setPreviewFile={setPreviewFile}
          />
        ) : (
          ""
        )}
      </MuiThemeProvider>
    );
  };

  useEffect(() => {
    if (window.innerWidth > 767) {
      setFilterViewVisibility(true);
    }
  }, []);

  const renderViews = () => {
    let createViewFields = pathOr(
      null,
      ["data", "templateMeta", "quickcreateview", 0],
      relateFieldData,
    );
    let searchViewFields = pathOr(
      null,
      ["data", "templateMeta", "searchview", 0],
      relateFieldData,
    );

    return (
      <div className={classes.sectionsWrappers}>
        <Box style={{ marginBottom: 10 }}>
          {searchViewFields && view !== "calendar" && (
            <Button
              size="small"
              className={classes.btn}
              color="primary"
              variant="outlined"
              onClick={() => {
                setCreateViewVisibility(false);
                setFilterViewVisibility(true);
              }}
            >
              <SearchIcon /> Search
            </Button>
          )}
          {createViewFields && currentSelectedModule !== "AOR_Reports" && (
            <Button
              size="small"
              className={classes.btn}
              color="primary"
              variant="outlined"
              onClick={() => {
                setFilterViewVisibility(false);
                setCreateViewVisibility(true);
              }}
            >
              <Add /> Create
            </Button>
          )}
        </Box>
        <Box>
          {filterViewVisible && view !== "calendar" ? (
            <SearchView
              relateFieldData={relateFieldData.data}
              stopParentSubmit={stopParentSubmit}
              resetFields={resetFields}
              search={search}
              searchFields={searchFields}
              setSearchFields={setSearchFields}
              moduleLabel={currentSelectedModule}
              searchFieldsMeta={searchFieldsMeta}
              setSearchFieldsMeta={setSearchFieldsMeta}
            />
          ) : (
            ""
          )}
          {createViewVisible ? renderCreateView() : ""}
          {renderListView()}
        </Box>
      </div>
    );
  };

  const renderBody = () => {
    return (
      <Paper square className={classes.paper}>
        <Scrollbars autoHide={true}>
          <div className={classes.titleHeadWrapper}>
            <Typography
              variant="h6"
              style={{ fontWeight: "500", color: theme.palette.text.primary }}
            >
              {label}
            </Typography>
            <Close
              onClick={() => toggleModalVisibility(!modalVisible)}
              className={classes.closeIcon}
            />
          </div>
          {renderViews()}
        </Scrollbars>
      </Paper>
    );
  };

  return (
    <>
      <Tooltip
        title={field.comment ? field.comment : ""}
        disableHoverListener={field.comment ? false : true}
        placement="top-start"
        disableFocusListener={field.comment ? false : true}
        disableTouchListener={field.comment ? false : true}
      >
        {!isIconBtn ? (
          <>
            <TextField
              id={field.name}
              name={field.name}
              error={iserror}
              required={
                field.required === "true" ||
                errors[field.name] === LBL_REQUIRED_FIELD
                  ? true
                  : false
              }
              variant={variant}
              size={small ? "small" : "medium"}
              label={field.label}
              onChange={(e) => onChange(e.target.value)}
              value={typeof value === "object" ? value.value : value}
              disabled={errors[field.name] === "ReadOnly" ? true : disabled}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" className={classes.adornment}>
                    {value.value && <Close onClick={() => onChange("")} />}
                    <Tooltip title="Suggestions">
                      <HelpOutlineIcon
                        onClick={() => toggleModalVisibility(!modalVisible)}
                      />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              helperText={
                errors[field.name] && errors[field.name] !== "ReadOnly"
                  ? errors[field.name]
                  : null
              }
              onCut={onCopy}
              onCopy={onCopy}
              onPaste={onCopy}
              onContextMenu={onCopy}
            />
            <SuggestionName initialValues={initialValues} onChange={onChange} />
          </>
        ) : (
          <Tooltip
            title={tooltipTitle ? tooltipTitle : ""}
            aria-label={tooltipTitle}
          >
            {isSelectBtn ? (
              <Button
                className={classes.mobileLayoutButton}
                color={color}
                variant={variant}
                size="small"
                disabled={disabled}
                onClick={() => toggleModalVisibility(!modalVisible)}
              >
                {btnIcon} Select{view === "calendar" ? " Users" : null}
              </Button>
            ) : (
              <IconButton onClick={() => toggleModalVisibility(!modalVisible)}>
                {btnIcon}
              </IconButton>
            )}
          </Tooltip>
        )}
      </Tooltip>
      <Modal
        open={modalVisible}
        onClose={() => toggleModalVisibility(!modalVisible)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {renderBody()}
      </Modal>
    </>
  );
};

export default Suggestions;
