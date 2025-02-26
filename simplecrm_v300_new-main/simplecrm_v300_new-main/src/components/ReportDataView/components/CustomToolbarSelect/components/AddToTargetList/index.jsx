import React, { useState, useCallback, useEffect } from "react";
import {
  CircularProgress,
  Grid,
  Button,
  useTheme,
  Typography,
  Box,
  Link,
} from "@material-ui/core";
import { toast } from "react-toastify";
import { pathOr, clone } from "ramda";
import { MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import { Modal } from "../../..";
import { FormInput } from "../../../../..";
import {
  getRelateFieldData,
  relateFieldSearch,
} from "../../../../../../store/actions/module.actions";
import { createOrEditRecordAction } from "../../../../../../store/actions/edit.actions";
import { validateForm } from "../../../../../../common/utils";
import useStyles, { getMuiTheme } from "./styles";
import SearchView from "./search-view";
import { Search as SearchIcon } from "@material-ui/icons";
import {
  LBL_ADD_RECORD_BUTTON_TITLE,
  LBL_CANCEL_BUTTON_TITLE,
  LBL_RECORD_CREATED,
  LBL_SAVE_BUTTON_TITLE,
  LBL_SEARCH_BUTTON_LABEL,
  SOMETHING_WENT_WRONG,
} from "../../../../../../constant";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";

const AddToTargetList = ({
  modalVisible,
  toggleModalVisibility,
  addIdToTargetList,
  errors = {},
  selectedModule,
}) => {
  const [prospectListData, setProspectListData] = useState({});
  const [loading, setLoading] = useState(false);
  const [createViewVisible, setCreateViewVisibility] = useState(false);
  const [listViewLoading, setListViewLoading] = useState(false);
  const [searchFields, setSearchFields] = useState({});
  const [searchFieldsMeta, setSearchFieldsMeta] = useState({});
  const [fieldErrors, setErrors] = useState(errors);
  const [createRecordFields, setCreateRecordFields] = useState({});
  const [listViewMeta, setListViewMeta] = useState({
    page: 0,
  });
  const [filterViewVisible, setFilterViewVisibility] = useState(false);
  const classes = useStyles();
  const theme = useTheme();

  const getProspectListData = useCallback(async () => {
    try {
      setLoading(true);
      let res = await getRelateFieldData("ProspectLists");
      setLoading(false);
      if (res.ok) {
        setProspectListData(res.data);
        return;
      }
      toast(SOMETHING_WENT_WRONG);
      toggleModalVisibility();
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
      toggleModalVisibility();
    }
  }, [toggleModalVisibility]);

  useEffect(() => {
    getProspectListData();
  }, [getProspectListData]);

  const buildFilterQuery = () => {
    let filterQuery = "";
    let operator = "eq";
    for (let key in searchFields) {
      if (searchFields[key] && searchFields[key].length > 0) {
        let likeTypes = ["name", "url"];
        if (likeTypes.includes(searchFieldsMeta[key].name)) {
          operator = "lke";
        }
        if (searchFields[key]) {
          if (typeof searchFields[key] !== "object") {
            filterQuery =
              filterQuery + `filter[${key}][${operator}]=${searchFields[key]}&`;
          } else {
            if (searchFields[key].length > 1) {
              operator = "multi";
            }
            filterQuery =
              filterQuery +
              `filter[${key}][${operator}]=${searchFields[key].toString()}&`;
          }
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
    Object.keys(fieldsCopy).length && (await getProspectListData());
  };

  const search = async () => {
    setLoading(true);
    try {
      const res = await relateFieldSearch("ProspectLists", buildFilterQuery());
      setLoading(false);
      if (res.ok) {
        setProspectListData(res.data);
        return;
      }
    } catch (ex) {
      toast(SOMETHING_WENT_WRONG);
    }
  };

  const saveRecord = async () => {
    let createViewFields = pathOr(
      [],
      ["data", "templateMeta", "quickcreateview", 0, "attributes"],
      prospectListData,
    );
    try {
      let validate = validateForm(createViewFields.flat(), createRecordFields);
      setErrors(validate.errors);
      if (validate.formIsValid) {
        const record = JSON.stringify({
          data: {
            type: selectedModule,
            attributes: createRecordFields,
          },
        });
        const res = await createOrEditRecordAction(
          record,
          LAYOUT_VIEW_TYPE?.createView,
        );
        if (res.ok) {
          resetFields(createRecordFields, "setCreateRecordFields");
          setCreateViewVisibility(!createViewVisible);
          await getProspectListData();
          toast(LBL_RECORD_CREATED);
        }
      }
    } catch (ex) {
      toast(SOMETHING_WENT_WRONG);
    }
  };

  const renderLoader = () => (
    <div className={classes.progressWrapper}>
      <CircularProgress />
    </div>
  );

  const renderListView = () => {
    let data = pathOr(
      [],
      ["data", "templateMeta", "listview", "data"],
      prospectListData,
    );

    let columns = pathOr(
      [],
      ["data", "templateMeta", "listview", "datalabels"],
      prospectListData,
    ).map((it) => {
      if (it.name === "name") {
        return {
          ...it,
          options: {
            filter: false,
            customBodyRender: (value, tableMeta, updateValue) => {
              const id = data[tableMeta["rowIndex"]].id;
              return (
                <Typography>
                  <Link
                    className={classes.link}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      toggleModalVisibility(!modalVisible);
                      addIdToTargetList(id);
                    }}
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
      return it;
    });

    const changePageOrSort = async (page, sort) => {
      try {
        setListViewLoading(true);
        setListViewMeta({ page });
        const res = await getRelateFieldData(
          "ProspectLists",
          20,
          page + 1,
          sort,
        );
        setProspectListData(res.data);

        setListViewLoading(false);
      } catch (e) {
        setListViewLoading(false);
      }
    };

    return (
      <MuiThemeProvider theme={getMuiTheme(theme)}>
        <Box>
          <MUIDataTable
            title={listViewLoading ? <CircularProgress /> : "Target List"}
            data={data.map((it) => it.attributes)}
            columns={columns}
            options={{
              filter: false,
              download: false,
              print: false,
              viewColumns: false,
              selectableRows: false,
              page: listViewMeta["page"],
              count: pathOr(20, ["meta", "total-records"], prospectListData),
              search: false,
              rowsPerPage: 20,
              fixedHeader: true,
              serverSide: true,
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
                    console.log("action not handled.");
                }
              },
            }}
          />
        </Box>
      </MuiThemeProvider>
    );
  };

  const renderCreateView = () => {
    let createViewFields = pathOr(
      [],
      ["data", "templateMeta", "quickcreateview", 0, "attributes"],
      prospectListData,
    );

    if (!createViewFields.length) return null;

    return (
      <div className={classes.perSectionWrapper}>
        <Typography color="primary" className={classes.sectionTitle}>
          {LBL_ADD_RECORD_BUTTON_TITLE}
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
              size="medium"
              className={classes.cstmBtn}
              disableElevation
              style={{ margin: 5, width: "100px" }}
            >
              {LBL_CANCEL_BUTTON_TITLE}
            </Button>

            <Button
              variant="contained"
              onClick={saveRecord}
              color="primary"
              size="medium"
              className={classes.cstmBtn}
              disableElevation
              style={{ margin: 5, width: "100px" }}
            >
              {LBL_SAVE_BUTTON_TITLE}
            </Button>
          </div>
        </Grid>
      </div>
    );
  };

  const renderViews = () => {
    return (
      <div className={classes.sectionsWrappers}>
        <Box style={{ marginBottom: 10 }}>
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
            <SearchIcon /> {LBL_SEARCH_BUTTON_LABEL}
          </Button>

          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              setCreateViewVisibility(true);
              setFilterViewVisibility(false);
            }}
            className={classes.perSecWrapCont}
          >
            {LBL_ADD_RECORD_BUTTON_TITLE}
          </Button>
        </Box>
        {filterViewVisible && (
          <SearchView
            prospectListData={prospectListData.data}
            resetFields={resetFields}
            search={search}
            searchFields={searchFields}
            setSearchFields={setSearchFields}
            searchFieldsMeta={searchFieldsMeta}
            setSearchFieldsMeta={setSearchFieldsMeta}
          />
        )}
        {createViewVisible && renderCreateView()}
        {renderListView()}
      </div>
    );
  };

  return (
    <Modal
      visible={modalVisible}
      onClose={() => toggleModalVisibility(!modalVisible)}
      toggleVisibility={() => toggleModalVisibility(!modalVisible)}
      title="Target list"
      size="full-width"
    >
      {loading ? renderLoader() : renderViews()}
    </Modal>
  );
};

export default AddToTargetList;
