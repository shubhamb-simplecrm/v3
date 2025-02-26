import React, { useCallback, useEffect, useState } from "react";
import { isEmpty, pathOr } from "ramda";
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

import clsx from "clsx";
import { Close, Search } from "@material-ui/icons";
import Scrollbars from "react-custom-scrollbars";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { Alert } from "@material-ui/lab";

import {
  LBL_CLEAR_BUTTON_LABEL,
  LBL_FILTER_HEADER_TITLE,
  LBL_RESET_BUTTON_LABEL,
  LBL_SEARCH_BUTTON_LABEL,
  LBL_SEARCH_FORM_TITLE,
} from "@/constant";
import { useModuleViewDetail } from "@/hooks/useModuleViewDetail";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import { setFilterOpenState } from "@/store/actions/module.actions";
import { FormInput } from "@/components";
import { useLayoutState } from "@/customStrore/useLayoutState";
import useStyles from "./styles";
import InfoIcon from "@material-ui/icons/Info";
import CustomDialog from "@/components/SharedComponents/CustomDialog";
import { buildFilterQueryObj } from "@/common/utils";

const advanceFieldNameArr = [
  "sort_column",
  "sort_order",
  "save_filter",
  "text",
];
const FilterDialog = ({
  dialogStatus,
  optionEventCurrentTarget,
  onClose,
  optionKey,
  savedSearchId,
  onListStateChange,
  fullScreen = true,
  fullWidth = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [formMetaData, setFormMetaData] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [filterValuesMeta, setFilterValuesMeta] = useState({});
  const [basicFieldsArr, setBasicFieldsArr] = useState([]);
  const [advanceFieldsArr, setAdvanceFieldsArr] = useState([]);
  const { currentModule } = useModuleViewDetail();
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
      let value = pathOr("null", ["value"], field);

      if (!isEmpty(value)) {
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
          let temp = [];
          temp["parent_name"] = field.value.parent_name;
          temp["parent_type"] = field.value.parent_type;
          temp["parent_id"] = field.value.parent_id;
          fieldInitialValueObj[field.field_key] = temp;
          fieldInitialMetaValueObj[field.field_key] = field;
        } else if (field.type === "multienum") {
          fieldInitialValueObj[field.field_key] = field.value;
          fieldInitialMetaValueObj[field.field_key] = field;
        } else {
          fieldInitialValueObj[field.field_key] = field.value.toString();
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
      if (field.type === "multienum" && Array.isArray(val)) {
        val = val.toString();
      }

      if (field.type === "parent") {
        filterValues[field.field_key] = val;
        filterValuesMeta[field.field_key] = field;
      } else {
        if (field) {
          if (typeof val === "string") {
            filterValues[field.field_key] = val.trim();
          } else {
            filterValues[field.field_key] = val;
          }
          filterValuesMeta[field.field_key] = field;
        }
      }
      setFilterValues({ ...filterValues });
      setFilterValuesMeta({ ...filterValuesMeta });
    },
    [filterValues],
  );
  const resetFilter = () => {
    onListStateChange({
      pageNo: 1,
      resetFilter: true,
      withSelectedRecords: false,
    });
    onClose();
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
      filterObj["saved_search_name"] = saveFilterName;
    } else if (!isEmpty(savedSearchId) && savedSearchId != "_none") {
      filterObj["saved_search_id"] = savedSearchId;
    }
    onListStateChange({
      pageNo: 1,
      filterOption: filterObj,
      withSelectedRecords: false,
    });
    onClose();
  };

  useEffect(() => {
    if (!currentModule) return;
    setLoading(true);
    currentModule &&
      getFilterFormData(currentModule)
        .then((response) => {
          const formData = pathOr(
            ["ss"],
            ["data", "data", "templateMeta", "data", "advanced_search"],
            response,
          );
          initDataSet(formData);
          setFormMetaData(formData);
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
        });
  }, [currentModule]);
  return (
    <CustomDialog
      isDialogOpen={dialogStatus}
      handleCloseDialog={onClose}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      bodyContent={
        loading ? (
          <Skeleton />
        ) : (
          <FilterDialogBody
            basicFieldsArr={basicFieldsArr}
            advanceFieldsArr={advanceFieldsArr}
            filterValues={filterValues}
            handleFieldChange={handleFieldChange}
            savedSearchId={savedSearchId}
          />
        )
      }
      bottomActionContent={
        <>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={resetFilter}
          >
            {LBL_CLEAR_BUTTON_LABEL}
          </Button>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={searchFormHandle}
          >
            {LBL_SEARCH_BUTTON_LABEL}
          </Button>
        </>
      }
      title={LBL_FILTER_HEADER_TITLE}
      maxWidth="md"
    />
  );
};

const FilterDialogBody = ({
  basicFieldsArr,
  advanceFieldsArr,
  filterValues,
  handleFieldChange,
  savedSearchId,
}) => {
  const classes = useStyles();
  return (
    <Grid container spacing={2} className={classes.filterBody}>
      {basicFieldsArr &&
        basicFieldsArr.map((field, index) => (
          <Grid item xs={12} key={field.field_key} className={classes.flexRows}>
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
            </div>
          </Grid>
        ))}
      {advanceFieldsArr && <Divider className={classes.divider} />}
      {advanceFieldsArr &&
        advanceFieldsArr.map((field, index) => (
          <>
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
              </div>
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
            </Grid>
          </>
        ))}
    </Grid>
  );
};
export default FilterDialog;
