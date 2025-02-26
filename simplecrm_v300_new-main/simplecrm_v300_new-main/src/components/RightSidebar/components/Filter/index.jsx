import React, { useCallback, useEffect, useRef, useState } from "react";
import { isEmpty, isNil, pathOr } from "ramda";
import { Skeleton } from "@/components";
import { getFilterFormData } from "@/store/actions/listview.actions";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Box,
  CardContent,
  CardActions,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import { Close, Search } from "@material-ui/icons";
import Scrollbars from "react-custom-scrollbars";
import LockIcon from "@material-ui/icons/Lock";
import InfoIcon from "@material-ui/icons/Info";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { Alert } from "@material-ui/lab";

import {
  LBL_CLEAR_BUTTON_LABEL,
  LBL_FILTER_HEADER_TITLE,
  LBL_SEARCH_BUTTON_LABEL,
} from "@/constant";
import { setFilterOpenState } from "@/store/actions/listview.actions";
import { FormInput } from "@/components";
import useStyles from "./styles";
import DrawerHeader from "../DrawerHeader";
import { buildFilterQueryObj } from "@/common/utils";
import { toast } from "react-toastify";

const advanceFieldNameArr = [
  "sort_column",
  "sort_order",
  "save_filter",
  "text",
];
const Filter = ({ handleCloseRightSideBar, customData, drawerState }) => {
  const classes = useStyles();
  const {
    savedSearchId = null,
    onListStateChange = null,
    currentModule,
    withFilterRefresh,
    listViewFilterPreference,
  } = customData;

  const [loading, setLoading] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [filterValuesMeta, setFilterValuesMeta] = useState({});
  const [basicFieldsArr, setBasicFieldsArr] = useState([]);
  const [advanceFieldsArr, setAdvanceFieldsArr] = useState([]);
  const [isFilterLockApplied, setIsFilterLockApplied] = useState(false);
  const initDataSet = (filterFields) => {
    let tempAdvanceFields = [];
    let tempBasicFields = [];
    let fieldInitialValueObj = {};
    let fieldInitialMetaValueObj = {};
    filterFields.forEach((field) => {
      if (advanceFieldNameArr.includes(field.field_key)) {
        tempAdvanceFields = [...tempAdvanceFields, field];
      } else {
        tempBasicFields = [...tempBasicFields, field];
      }
      let value = pathOr(null, ["value"], field);
      if (!isEmpty(value) && !isNil(value)) {
        if (
          field.type === "datetime" ||
          field.type === "datetimecombo" ||
          field.type === "currency"
        ) {
          fieldInitialValueObj[field.field_key] = field.value;
          fieldInitialMetaValueObj[field.field_key] = field;
        } else if (
          field.type === "relate" ||
          field.type === "assigned_user_name"
        ) {
          let temp = [];
          temp["value"] = field.value.value;
          temp["id"] = field.value.id;
          fieldInitialValueObj[field.field_key] = temp;
          fieldInitialMetaValueObj[field.field_key] = field;
        } else if (field.type === "parent") {
          let temp = {};
          temp["parent_name"] = field.value.parent_name;
          temp["parent_type"] = field.value.parent_type;
          temp["parent_id"] = field.value.parent_id;
          fieldInitialValueObj[field.field_key] = temp;
          fieldInitialMetaValueObj[field.field_key] = field;
        } else if (field.type === "multienum") {
          fieldInitialValueObj[field.field_key] = field.value;
          fieldInitialMetaValueObj[field.field_key] = field;
        } else {
          fieldInitialValueObj[field.field_key] =
            field?.value?.toString() ?? "";
          fieldInitialMetaValueObj[field.field_key] = field;
        }
      } else {
        fieldInitialMetaValueObj[field.field_key] = field;
      }
    });
    setBasicFieldsArr([...tempBasicFields]);
    setFilterValues({ ...fieldInitialValueObj });
    setAdvanceFieldsArr([...tempAdvanceFields]);
    setFilterValuesMeta({ ...fieldInitialMetaValueObj });
  };
  const handleFieldChange = useCallback(
    (val, field) => {
      if (!field) return;
      // if (field.type === "multienum" && Array.isArray(val)) {
      //   val = val.toString();
      // }

      setFilterValues((prevValues) => ({
        ...prevValues,
        [field.field_key]: typeof val === "string" ? val.trim() : val,
      }));

      setFilterValuesMeta((prevMeta) => ({
        ...prevMeta,
        [field.field_key]: field,
      }));
    },
    [filterValues],
  );
  const handleResetFilter = () => {
    onListStateChange({
      pageNo: 1,
      resetFilter: true,
      withFilterRefresh: false,
      withSelectedRecords: false,
    });
  };
  const searchFormHandle = (e) => {
    e.preventDefault();
    const saveFilterName = pathOr("", ["text"], filterValues);
    const savedSearchId = pathOr("", ["save_filter"], filterValues);
    const sortColumn = pathOr("", ["sort_column"], filterValues);
    const sortOrder = pathOr("", ["sort_order"], filterValues).toLowerCase();
    const filterObj = buildFilterQueryObj(filterValues, filterValuesMeta);
    if (!isEmpty(sortColumn)) {
      const sort = `${sortOrder == "desc" ? "-" : ""}${sortColumn}`;
      filterObj["sort"] = sort;
    }
    if (!isEmpty(saveFilterName)) {
      const saveFilterList = pathOr(
        {},
        ["save_filter", "options"],
        filterValuesMeta,
      );
      const isSaveFilterNameExist = Object.values(saveFilterList).some(
        (filterName) =>
          filterName.toLowerCase() == saveFilterName.toLowerCase(),
      );
      if (isSaveFilterNameExist) {
        toast(`'${saveFilterName}' name is already exist`);
        return;
      }
      filterObj["saved_search_name"] = saveFilterName;
    } else if (!isEmpty(savedSearchId) && savedSearchId != "_none") {
      filterObj["saved_search_id"] = savedSearchId;
    }
    onListStateChange({
      pageNo: 1,
      filterOption: filterObj,
      withFilterRefresh: false,
      withSelectedRecords: false,
    });
  };
  const handleFilterLockState = () => {
    setFilterOpenState(currentModule, !isFilterLockApplied).then((res) => {
      if (res.ok) {
        setIsFilterLockApplied(!isFilterLockApplied);
      }
    });
  };
  const getFilterData = (withLoading) => {
    if (withLoading) setLoading(true);
    getFilterFormData(currentModule)
      .then((response) => {
        const formData = pathOr(
          [],
          ["data", "data", "templateMeta", "data", "advanced_search"],
          response,
        );
        const isFilterLockApplied = pathOr(
          0,
          [
            "data",
            "data",
            "templateMeta",
            "additionalData",
            "isFilterLockApplied",
          ],
          response,
        );
        setIsFilterLockApplied(isFilterLockApplied);
        initDataSet(formData);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getFilterData(withFilterRefresh);
    // if (!withFilterRefresh) return;
  }, [customData]);

  if (loading) {
    return <Skeleton />;
  }
  return (
    <>
      <form
        id="filter-form"
        onSubmit={searchFormHandle}
        noValidate
        autoComplete="off"
      >
        <Card className={classes.root}>
          <CardHeader
            className={classes.cardHeaderRoot}
            action={
              <>
                <Tooltip
                  title={`Filter Drawer keep to be ${true ? `lock` : `unlock`}`}
                >
                  <IconButton
                    aria-label="settings"
                    onClick={handleFilterLockState}
                  >
                    {isFilterLockApplied ? <LockIcon /> : <LockOpenIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={"Close Filter"}>
                  <IconButton
                    aria-label="settings"
                    onClick={handleCloseRightSideBar}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </>
            }
            title={
              <Typography
                gutterBottom
                variant="body1"
                color="primary"
                component="p"
                className={classes.headerTitle}
                classes={{ p: classes.headerTitle }}
              >
                {LBL_FILTER_HEADER_TITLE}
              </Typography>
            }
          />
          <Scrollbars style={{ height: "70vh" }}>
            <CardContent className={classes.cardContentRoot}>
              {basicFieldsArr &&
                basicFieldsArr.map((field, index) => (
                  <Grid
                    item
                    xs={12}
                    key={field.field_key}
                    className={classes.flexRows}
                  >
                    <div
                      dataCustomFieldType={field.type}
                      dataFieldIndex={`field-${index}`}
                    >
                      <FormInput
                        field={field}
                        initialValue={filterValues}
                        dynamicEnumValue={filterValues[field.parentenum] || ""}
                        onChange={(val) => handleFieldChange(val, field)}
                        small={true}
                        value={filterValues[field.field_key] || ""}
                        view={"SearchLayout"}
                      />
                    </div>
                  </Grid>
                ))}
              {advanceFieldsArr && <Divider className={classes.divider} />}
              {advanceFieldsArr &&
                advanceFieldsArr.map((field, index) => (
                  <Grid
                    item
                    xs={12}
                    key={field.field_key}
                    className={classes.flexRows}
                  >
                    <div
                      dataCustomFieldType={field.type}
                      dataFieldIndex={`field-${index}`}
                    >
                      <FormInput
                        field={field}
                        dynamicEnumValue={filterValues[field.parentenum] || ""}
                        onChange={(val) => handleFieldChange(val, field)}
                        small={true}
                        value={filterValues[field.field_key] || ""}
                        view={"SearchLayout"}
                      />
                      {savedSearchId &&
                      filterValues["save_filter"] != "_none" &&
                      field.field_key === "save_filter" ? (
                        <Alert
                          severity="warning"
                          className={classes.warning}
                          icon={<InfoIcon fontSize="inherit" />}
                        >
                          {`Modify current filter: ${
                            field?.options[filterValues["save_filter"]]
                          }`}
                        </Alert>
                      ) : null}
                    </div>
                  </Grid>
                ))}
            </CardContent>
          </Scrollbars>

          <CardActions className={classes.cardFooterRoot}>
            <div className={classes.grow} />
            <Grid
              container
              alignItems="center"
              justifyContent="flex-end"
              direction="row"
              className={classes.btnContainer}
            >
              <Button
                variant="contained"
                onClick={handleResetFilter}
                size="small"
                className={classes.btn}
                disableElevation
                type="button"
              >
                <Close /> {LBL_CLEAR_BUTTON_LABEL}
              </Button>
              <Button
                variant="contained"
                size="small"
                className={classes.btn}
                disableElevation
                type="submit"
                form="filter-form"
              >
                <Search /> {LBL_SEARCH_BUTTON_LABEL}
              </Button>
            </Grid>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default Filter;
