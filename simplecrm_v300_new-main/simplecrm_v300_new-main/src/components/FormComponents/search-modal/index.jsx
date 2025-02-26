import React, { useCallback, useState, useEffect, memo } from "react";
import {
  Button,
  Modal,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  useTheme,
  Link,
  Tooltip,
  Box,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { pathOr, clone, isEmpty } from "ramda";
import MUIDataTable from "mui-datatables";
import { Scrollbars } from "react-custom-scrollbars";
import { saveAs } from "file-saver";
import Alert from "@material-ui/lab/Alert";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Close, Search as SearchIcon, Add, Save } from "@material-ui/icons";
import { validateForm } from "../../../common/utils";
import useStyles, { getMuiTheme } from "../relate/styles";
import { FormInput } from "../../";
import SearchView from "../relate/search-view";
import { toast } from "react-toastify";
import FileViewerComp from "../../FileViewer/FileViewer";
import {
  getRelateFieldData,
  relateFieldSearch,
  relatePopupCreateSubmit,
} from "../../../store/actions/module.actions";
import {
  CREATE,
  LBL_CLOSE_BUTTON_TITLE,
  LBL_NEW_BUTTON_LABEL,
  LBL_NO_RECORDS_FOUND_MESSAGE,
  LBL_PLEASE_WAIT_WHILE_DATA_LOADING,
  LBL_RECORD_CREATED,
  LBL_SAVE_BUTTON_TITLE,
  LBL_SEARCH_BUTTON_LABEL,
  LBL_TABLE_DISPLAY_ROWS_TITLE,
  LBL_TABLE_PAGE_NEXT_TITLE,
  LBL_TABLE_PAGE_PREVIOUS_TITLE,
  LBL_TABLE_PER_PAGE_TITLE,
  LBL_TABLE_SORT_TITLE,
  SOMETHING_WENT_WRONG,
} from "../../../constant";
import "../relate/styles.css";
import CustomFooterSearch from "./CustomFooterSearch";
import EnvUtils from "../../../common/env-utils";

const SearchModal = (props) => {
  const { modalVisible, propsData, toggleModalVisibility } = props;
  const {
    component = "",
    errors = {},
    field,
    module = "",
    multiSelect = false,
    onChange,
    reportsTo = null,
    userData = [],
    view = null,
    setFieldValues,
  } = propsData;
  const classes = useStyles();
  const theme = useTheme();
  const currentUserData = useSelector(
    (state) => state?.config?.currentUserData,
  );
  const userPreference = useSelector((state) => state?.config?.userPreference);
  const currentUserId = pathOr(
    "",
    ["data", "attributes", "id"],
    currentUserData,
  );
  const currentUserName = pathOr(
    "",
    ["data", "attributes", "full_name"],
    currentUserData,
  );
  const [createViewVisible, setCreateViewVisibility] = useState(false);
  const [filterViewVisible, setFilterViewVisibility] = useState(false);
  const [relateFieldData, setRelateFieldData] = useState({});
  const { sidebarLinks } = useSelector((state) => state.layout);
  const [data, setData] = useState([]);
  const [listViewMeta, setListViewMeta] = useState({
    page: 0,
  });
  const [createRecordFields, setCreateRecordFields] = useState({
    assigned_user_name: { id: currentUserId, value: currentUserName },
  });
  const [searchFields, setSearchFields] = useState({});
  const [searchFieldsMeta, setSearchFieldsMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setErrors] = useState(errors);
  const [label, setLabel] = useState();
  const currentSelectedModule = field.module ? field.module : module;
  const { CalendarListViewTabData } = useSelector((state) => state.calendar);
  const [selectedRecord, setSelectedRecords] = useState(
    view === "calendar"
      ? pathOr([], ["Calendar", "data", "user_ids"], CalendarListViewTabData)
      : userData,
  );
  const [selectedRecordIndex, setSelectedRecordIndexes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRecordLength, setselectedRecordLength] = useState(
    selectAll ? "All " : selectedRecord.length,
  );
  const site_url = useSelector((state) => state.config.config.site_url);
  const calendar_format = pathOr(
    config?.default_date_format,
    ["attributes", "global", "calendar_format"],
    userPreference,
  );
  const date_reg_format = pathOr(
    config?.default_date_format,
    ["attributes", "global", "date_reg_format"],
    userPreference,
  );
  const time_reg_format = pathOr(
    config?.default_date_format,
    ["attributes", "global", "time_reg_format"],
    userPreference,
  );
  const date_reg_positions = pathOr(
    config?.default_date_format,
    ["attributes", "global", "date_reg_positions"],
    userPreference,
  );
  const [previewFile, setPreviewFile] = useState({
    open: false,
    filename: "",
    filepath: "",
  });

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

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

  const fetchRelateFieldData = useCallback(async () => {
    if (modalVisible) {
      try {
        setLoading(true);
        const res = await getRelateFieldData(
          currentSelectedModule,
          "20",
          "1",
          "-date_entered",
          "",
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
  }, [currentSelectedModule, modalVisible]);

  useEffect(() => {
    fetchRelateFieldData();
  }, [fetchRelateFieldData]);

  const buildFilterQuery = () => {
    let filterQuery = "";
    let operator = "eq";
    for (let key in searchFields) {
      let operator = "eq";
      let likeTypes = ["name", "url"];
      if (likeTypes.includes(searchFieldsMeta[key].type)) {
        operator = "lke";
      }
      let multiTypes = ["multienum"];
      if (multiTypes.includes(searchFieldsMeta[key].type)) {
        operator = "multi";
      }
      if (searchFields[key]) {
        if (typeof searchFields[key] !== "object") {
          if (
            searchFieldsMeta[key].type === "datetime" ||
            searchFieldsMeta[key].type === "datetimecombo"
          ) {
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
          } else if (searchFieldsMeta[key].type === "bool") {
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
        } else if (searchFieldsMeta[key].type === "relate") {
          filterQuery =
            filterQuery + `filter[${key}][]=${searchFields[key].id}&`;
        } else if (searchFieldsMeta[key].type === "parent") {
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
    setFilterViewVisibility(false);
    if (fieldsType === "setCreateRecordFields") {
      setCreateRecordFields(fieldsCopy);
      return;
    }
    setSearchFields(fieldsCopy);
    Object.keys(fieldsCopy).length && (await fetchRelateFieldData());
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
      toast(SOMETHING_WENT_WRONG);
    }
  };

  const saveRecord = async () => {
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
          setCreateViewVisibility(!createViewVisible);
          setListViewMeta({
            page: 0,
          });
          changePageOrSort(0, "-date_entered");
          toast(LBL_RECORD_CREATED);
          setLoading(false);
        }
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

  const renderCreateView = () => {
    let createViewFields = pathOr(
      [],
      ["data", "templateMeta", "quickcreateview", 0, "attributes"],
      relateFieldData,
    );

    if (!createViewFields.length) {
      return null;
    }

    return (
      <div className={classes.perSectionWrapper}>
        {loading ? (
          renderLoader()
        ) : (
          <>
            <Typography color="primary" className={classes.sectionTitle}>
              {CREATE}
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
                          createRecordFields[field.name] = val.value;
                          createRecordFields[field.id_name] = val.id;
                          setCreateRecordFields(createRecordFields);
                          return;
                        }
                        createRecordFields[field.field_key] = val;
                        setCreateRecordFields(createRecordFields);
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
                  <Close /> {LBL_CLOSE_BUTTON_TITLE}
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  // type="submit"
                  onClick={saveRecord}
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

  const meta = pathOr([], ["meta"], relateFieldData);

  let columns = pathOr(
    [],
    ["data", "templateMeta", "listview", "datalabels"],
    relateFieldData,
  ).map((it) => {
    if (it.name === "name" || it.name === "document_name") {
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
          customBodyRender: (value, tableMeta, updateValue) => {
            const id = data[tableMeta["rowIndex"]].id;
            return (
              <Typography>
                <Link
                  className={classes.link}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (!multiSelect) {
                      toggleModalVisibility(!modalVisible);
                      if (field.field_key === "aos_products") {
                        onChange({
                          id,
                          value,
                          rowData: data[tableMeta["rowIndex"]],
                        });
                      } else if (module === "EmailTemplates") {
                        onChange({
                          id,
                          value: pathOr(
                            "",
                            [tableMeta["rowIndex"], "attributes", "subject"],
                            data,
                          ),
                          email_template: pathOr(
                            "",
                            [tableMeta["rowIndex"], "attributes", "body_html"],
                            data,
                          ),
                        });
                      } else {
                        onChange({
                          id,
                          value,
                          email:
                            data[tableMeta["rowIndex"]].attributes &&
                            data[tableMeta["rowIndex"]].attributes.email1
                              ? data[tableMeta["rowIndex"]].attributes.email1
                              : "",
                          rowData: data[tableMeta["rowIndex"]],
                        });
                      }
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
      const url = new URL(EnvUtils.getValue("REACT_APP_BASE_URL"));
      const baseUrl = `${url.protocol}//${url.hostname}`;
      return {
        ...it,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            let furl = `${site_url}/index.php?entryPoint=customDownload&id=${
              data[tableMeta["rowIndex"]].id
            }&type=${module}&field_id=${it.name}`;
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
    if (it.name === "last_rev_create_date") {
      return {
        ...it,
        options: {
          sort: false,
        },
      };
    }
    return it;
  });

  const handleSelectChange = (
    currentRowsSelected = null,
    allRowsSelected = null,
    rowsSelected = null,
  ) => {
    setSelectAll(false);
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
    setselectedRecordLength(selectAll ? "All " : selectedRecord.length);
  };

  const multiSelectRecords = (inputData) => {
    if (setFieldValues) {
      const oo = [];
      inputData.forEach((id) => {
        const filteredId = data.filter((o) => o.id == id)[0];
        if (!isEmpty(filteredId)) {
          const name = pathOr("", ["attributes", "name"], filteredId);
          const id = pathOr("", ["id"], filteredId);
          if (!isEmpty(id)) {
            oo.push({
              id,
              name,
            });
          }
        }
      });
      setFieldValues((v) => {
        v["idsArr"] = oo;
        return { ...v };
      });
    }
    toggleModalVisibility(!modalVisible);
    if (
      ["Users", "ACLRoles", "SecurityGroups"].includes(currentSelectedModule)
    ) {
      onChange(inputData);
    } else {
      onChange(inputData);
    }
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
      setSelectAll(false);
      setselectedRecordLength(selectAll ? "All " : selectedRecord.length);
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
        if (!nodetr) {
          nodetr = table.children[2].querySelector(
            "#MUIDataTableBodyRow-RelateListViewTable-" +
              tableState.curExpandedRows[0].index,
          );
        }
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
              tableId: "RelateListViewTable",
              filter: false,
              download: false,
              print: false,
              viewColumns: false,
              selectableRows: multiSelect ? true : false,

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
              rowsPerPageOptions: [20],
              onTableChange: (action, tableState) => {
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
                    tableState.announceText = currentSelectedModule;
                    handleTableChange(action, tableState);
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
              expandableRows: window.innerWidth < 995.95,
              customFooter: meta["total-records"]
                ? null
                : (
                    count,
                    page,
                    rowsPerPage,
                    changeRowsPerPage,
                    changePage,
                    textLabels,
                    data,
                  ) => {
                    return (
                      <CustomFooterSearch
                        count={count}
                        relateFieldData={relateFieldData}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        changeRowsPerPage={changeRowsPerPage}
                        changePage={changePage}
                        textLabels={textLabels}
                        totalRecords={
                          meta["total-records"] ? meta["total-records"] : 0
                        }
                      />
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
                setFilterViewVisibility(!filterViewVisible);
              }}
            >
              <SearchIcon /> {LBL_SEARCH_BUTTON_LABEL}
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
                setCreateViewVisibility(!createViewVisible);
              }}
            >
              <Add /> {LBL_NEW_BUTTON_LABEL}
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
    <Modal
      open={!!modalVisible ? true : false}
      onClose={() => toggleModalVisibility(!!modalVisible ? false : true)}
    >
      {renderBody()}
    </Modal>
  );
};

export default memo(SearchModal);
