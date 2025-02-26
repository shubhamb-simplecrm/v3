import React, { useState, memo, useCallback, useEffect } from "react";
import { Typography, Grid, Button } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import ClearIcon from "@material-ui/icons/Clear";
import useStyles from "./styles";
import {
  CREATE,
  LBL_RESET_BUTTON_LABEL,
  LBL_SEARCH_BUTTON_LABEL,
  LBL_SEARCH_FORM_TITLE,
} from "@/constant";
import AddIcon from "@material-ui/icons/Add";
import CustomFormInput from "@/components/CustomFormInput";
import QuickCreate from "@/components/QuickCreate";
import { clone, isEmpty, isNil, pathOr } from "ramda";
import { DATE_RANGE_TYPE } from "@/constant/date-constants";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";
import { buildFilterQueryObj } from "@/common/utils";

const RelateFieldDialogSearchForm = ({
  search,
  searchFormLayout = [],
  searchFormFieldsMeta,
  searchData,
  module,
  ACLAccess,
}) => {
  const classes = useStyles();
  const [searchFormInitialValue, setSearchFormInitialValue] = useState({});
  const [openQuickCreateDialog, setOpenQuickCreateDialog] = useState(false);
  const searchFormHandle = (event) => {
    event.preventDefault();
    const customFilterObj = buildFilterQueryObj(
      searchFormInitialValue,
      searchFormFieldsMeta,
    );
    searchData(1, customFilterObj);
  };
  const handleFieldChange = (field, value) => {
    const tempSearchFormInitialValue = clone(searchFormInitialValue);

    if (field.type === "multienum" && Array.isArray(value)) {
      value = value.toString();
    }

    if (field.type === "parent") {
      tempSearchFormInitialValue[field.field_key] = value;
      searchFormFieldsMeta[field.field_key] = field;
    } else {
      if (field) {
        if (typeof value === "string") {
          tempSearchFormInitialValue[field.field_key] = value.trim();
        } else {
          tempSearchFormInitialValue[field.field_key] = value;
        }
        searchFormFieldsMeta[field.field_key] = field;
      }
    }
    tempSearchFormInitialValue[field.field_key] = value;
    setSearchFormInitialValue(tempSearchFormInitialValue);
  };
  const resetFields = async () => {
    const fieldsCopy = clone(searchFormInitialValue);
    for (let val in fieldsCopy) {
      if (searchFormFieldsMeta[val] === "currency") {
        fieldsCopy[val][val] = "";
      }
      fieldsCopy[val] = "";
    }
    setSearchFormInitialValue({ ...fieldsCopy });
    Object.keys(fieldsCopy).length && (await searchData(1, ""));
  };

  const handleCloseDialog = useCallback(() => {
    setOpenQuickCreateDialog(false);
  }, []);

  const handleOnRecordSuccess = useCallback(() => {
    setOpenQuickCreateDialog(false);
    const customFilterObj = buildFilterQueryObj(
      searchFormInitialValue,
      searchFormFieldsMeta,
    );
    searchData(1, customFilterObj);
  }, []);
  useEffect(() => {
    const initDataSet = (filterFields) => {
      filterFields.forEach((field) => {
        let value = pathOr(null, ["value"], field);
        if (!isEmpty(value) && !isNil(value)) {
          if (
            field.type === "datetime" ||
            field.type === "datetimecombo" ||
            field.type === "currency"
          ) {
            searchFormInitialValue[field.field_key] = field.value;
          } else if (
            field.type === "relate" ||
            field.type === "assigned_user_name"
          ) {
            let temp = {};
            temp["value"] = field.value.value;
            temp["id"] = field.value.id;
            searchFormInitialValue[field.field_key] = temp;
          } else if (field.type === "parent") {
            let temp = {};
            temp["parent_name"] = field.value.parent_name;
            temp["parent_type"] = field.value.parent_type;
            temp["parent_id"] = field.value.parent_id;
            searchFormInitialValue[field.field_key] = temp;
          } else if (field.type === "multienum") {
            searchFormInitialValue[field.field_key] = field.value;
          } else {
            searchFormInitialValue[field.field_key] =
              field?.value?.toString() ?? "";
          }
        }
      });
      setSearchFormInitialValue({ ...searchFormInitialValue });
    };
    initDataSet(searchFormLayout);
  }, [searchFormLayout]);

  if (searchFormLayout.length == 0) return null;
  return (
    <>
      <Typography color="primary" className={classes.sectionTitle}>
        {LBL_SEARCH_FORM_TITLE}
      </Typography>
      <Grid container spacing={2}>
        {searchFormLayout.map((field) => {
          if (field.type === "email") {
            field.type = "varchar";
          }
          return (
            <Grid
              item
              xs={field.type === "currency" ? 12 : 12}
              md={field.type === "currency" ? 8 : 4}
              key={field.field_key}
            >
              <CustomFormInput
                fieldMetaObj={field}
                onChange={(val) => handleFieldChange(field, val)}
                value={searchFormInitialValue[field.field_key] || ""}
                moduleMetaData={{
                  currentView: LAYOUT_VIEW_TYPE.searchLayoutView,
                }}
              />
            </Grid>
          );
        })}
        <div className={classes.buttonsWrapper}>
          {!!ACLAccess?.create ? (
            <Button
              variant="contained"
              onClick={() => setOpenQuickCreateDialog(true)}
              color="primary"
              size="small"
              className={classes.cstmBtn}
              disableElevation
            >
              <AddIcon />
              {CREATE}
            </Button>
          ) : null}
          <Button
            variant="contained"
            onClick={() => resetFields()}
            color="primary"
            size="small"
            className={classes.cstmBtn}
            disableElevation
            type="button"
          >
            <ClearIcon /> {LBL_RESET_BUTTON_LABEL}
          </Button>

          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.cstmBtn}
            disableElevation
            onClick={searchFormHandle}
            form="relate-search-form"
          >
            <Search /> {LBL_SEARCH_BUTTON_LABEL}
          </Button>
        </div>
      </Grid>
      {openQuickCreateDialog && (
        <QuickCreate
          open={openQuickCreateDialog}
          moduleName={module}
          onCancelClick={handleCloseDialog}
          onRecordSuccess={handleOnRecordSuccess}
        />
      )}
    </>
  );
};

export default memo(RelateFieldDialogSearchForm);
