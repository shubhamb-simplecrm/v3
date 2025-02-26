import React, { useState, memo } from "react";
import { Typography, Grid, Button } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import ClearIcon from "@material-ui/icons/Clear";
import useStyles from "./styles";
import { clone } from "ramda";
import { FormInput } from "@/components";
import { DATE_RANGE_TYPE } from "@/constant/date-constants";
import {
  LBL_RESET_BUTTON_LABEL,
  LBL_SEARCH_BUTTON_LABEL,
  LBL_SEARCH_FORM_TITLE,
} from "@/constant";
import { buildFilterQueryObj } from "@/common/utils";

const AuditSearchView = ({
  searchFormLayout = [],
  searchFormFieldsMeta = {},
  searchData,
}) => {
  const classes = useStyles();
  const [searchFormInitialValue, setSearchFormInitialValue] = useState(
    Object.values(searchFormFieldsMeta).reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {}),
  );

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
              <FormInput
                field={field}
                key={field.field_key}
                small={true}
                onChange={(val) => handleFieldChange(field, val)}
                value={searchFormInitialValue[field.field_key] || ""}
                view={"SearchLayout"}
              />
            </Grid>
          );
        })}
        <div className={classes.buttonsWrapper}>
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
    </>
  );
};

export default memo(AuditSearchView);
