import React, { useEffect, useState } from "react";
// styles
import { pathOr, clone } from "ramda";
import useStyles from "./styles";
import { useDispatch } from "react-redux";
import { Grid, Button } from "@material-ui/core";
import { Typography } from "../Wrappers/Wrappers";

import Skeleton from "@material-ui/lab/Skeleton";
import { getModuleFieldType } from "../../store/actions/detail.actions";

import { toast } from "react-toastify";
import { FormInput } from "..";
import { SOMETHING_WENT_WRONG } from "../../constant";

export default function AORConditions({
  data,
  handleSubmit = null,
  type = "AOR_Reports",
  handleOnChange = null,
  module,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [filterFields, setFilterFields] = useState(data);
  const [filterData, setFilterData] = useState(data);
  // const [valueFieldUI, setValueFieldUI] = useState(null);
  const [fieldValueLoader, setFieldValueLoader] = useState(null);
  const handleChange = (rowNum, value, operator, fieldId, type, field) => {
    let filterOldData = clone(filterData);
    let filter = filterFields[rowNum] ? filterFields[rowNum] : {};
    filter.parameter_field = field.field;
    filter.parameter_id = fieldId;
    switch (type) {
      case "operator":
        filter.parameter_operator = value;
        break;
      case "type":
        filter.parameter_type = value;
        setFieldValueLoader(fieldId);
        dispatch(
          getModuleFieldType(
            rowNum,
            field.report_module,
            field.field,
            `aor_conditions_value[${rowNum}]`,
            "",
            value,
            "",
          ),
        ).then((res) => {
          setFieldValueLoader(null);
          try {
            if (res.ok) {
              filterOldData[rowNum].condition_line[0].ModuleFieldType = pathOr(
                [],
                ["data", "data", "ModuleFieldType"],
                res,
              );
              setFilterFields(filterOldData);
            } else {
              toast(SOMETHING_WENT_WRONG);
            }
          } catch (e) {
            toast(SOMETHING_WENT_WRONG);
          }
        });

        break;
      case "value":
        value = value.id ? value.id : value;
        filter.parameter_value = value;
        break;
      default:
        break;
    }

    const tempProds = [...filterFields.map((filter) => filter)];
    tempProds[rowNum] = filter;
    if (handleOnChange) {
      handleOnChange(tempProds);
    }
    setFilterFields(tempProds);
  };

  // useEffect(() => {
  //     setFilterFields(data);
  // }, []);

  const triggerHandleSubmit = (e) => {
    e.preventDefault();
    if (handleSubmit) handleSubmit(filterFields);
  };

  return (
    <Grid container>
      <form
        onSubmit={triggerHandleSubmit}
        className={classes.root}
        noValidate
        autoComplete="off"
        style={{ width: "100%" }}
      >
        {filterData &&
          filterData.map((field, rowNum) => (
            <Grid container spacing={3} key={rowNum}>
              <Grid item xs={12} sm={field.length === 2 ? 6 : 12} key={rowNum}>
                <Grid
                  container
                  className={classes.fieldSpacing}
                  direction="row"
                  justify="space-between"
                  alignItems="stretch"
                >
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction="row"
                      justify="space-between"
                      alignItems="stretch"
                    >
                      {type === "AOR_Reports" ? (
                        <Grid xs={field.length === 2 ? 12 : 12}>
                          <Typography
                            className={classes.text}
                            variant="subtitle2"
                          >
                            {field.report_module_label || ""} -{" "}
                            {field.label || ""}
                          </Typography>
                        </Grid>
                      ) : null}
                      <Grid
                        item
                        xs={
                          type === "Dashlet" ? 12 : field.length === 2 ? 12 : 12
                        }
                      >
                        {!field ? (
                          <Grid item xs={12}></Grid>
                        ) : (
                          <Grid
                            item
                            xs={12}
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="stretch"
                          >
                            <Grid
                              item
                              xs={12}
                              container
                              direction="row"
                              justify="space-between"
                              alignItems="stretch"
                            >
                              {type !== "AOR_Reports" ? (
                                <Grid
                                  item
                                  xs={12}
                                  className={classes.fieldSpacing}
                                >
                                  <Typography
                                    className={classes.text}
                                    variant="subtitle2"
                                  >
                                    {field.report_module_label || ""} -{" "}
                                    {field.label || ""}
                                  </Typography>
                                </Grid>
                              ) : null}
                              {/* <Grid item xs={4} className={classes.fieldSpacing}> */}
                              <Grid
                                item
                                xs={12}
                                className={classes.fieldSpacing}
                              >
                                <FormInput
                                  field={field.condition_line[0].FieldOperator}
                                  value={
                                    field.condition_line[0].FieldOperator.value
                                  }
                                  module={module}
                                  small={true}
                                  onChange={(value) =>
                                    handleChange(
                                      rowNum,
                                      value,
                                      field.condition_line[0].FieldOperator
                                        .name,
                                      field.id,
                                      "operator",
                                      field,
                                    )
                                  }
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                className={classes.fieldSpacing}
                              >
                                <FormInput
                                  key={"field_" + rowNum}
                                  field={field.condition_line[0].FieldType}
                                  value={
                                    field.condition_line[0].FieldType.value
                                  }
                                  dynamicEnumValue=""
                                  module={module}
                                  small={true}
                                  onChange={(value) =>
                                    handleChange(
                                      rowNum,
                                      value,
                                      field.condition_line[0].FieldType.name,
                                      field.id,
                                      "type",
                                      field,
                                    )
                                  }
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                className={classes.fieldSpacing}
                              >
                                {fieldValueLoader === field.id ? (
                                  <Skeleton
                                    animation="wave"
                                    width="100%"
                                    style={{}}
                                    variant="rect"
                                    height={40}
                                  />
                                ) : field.condition_line[0].ModuleFieldType &&
                                  field.condition_line[0].FieldType.type !==
                                    "CurrentUserID" ? (
                                  <FormInput
                                    field={
                                      field.condition_line[0].ModuleFieldType
                                    }
                                    value={
                                      field.condition_line[0].ModuleFieldType
                                        .value
                                    }
                                    dynamicEnumValue=""
                                    small={true}
                                    module={module}
                                    onChange={(value) =>
                                      handleChange(
                                        rowNum,
                                        value,
                                        field.condition_line[0].ModuleFieldType
                                          .value,
                                        field.id,
                                        "value",
                                        field,
                                      )
                                    }
                                  />
                                ) : (
                                  ""
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        {type === "AOR_Reports" ? (
          <Grid container spacing={3} justify="space-between">
            <Grid
              item
              xs={12}
              sm={10}
              className={classes.updateMobileLayout}
            ></Grid>
            <Grid item xs={12} sm={2}>
              <Button
                type="submit"
                variant="contained"
                size="small"
                color="primary"
                style={{ float: "right" }}
                className={classes.buttonMobileLayout}
              >
                {" "}
                UPDATE{" "}
              </Button>
            </Grid>
          </Grid>
        ) : null}
      </form>
    </Grid>
  );
}
