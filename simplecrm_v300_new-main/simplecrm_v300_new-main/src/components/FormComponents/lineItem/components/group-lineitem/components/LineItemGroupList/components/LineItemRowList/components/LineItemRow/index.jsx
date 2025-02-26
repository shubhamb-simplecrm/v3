import React, { memo, useMemo, useState } from "react";
import useStyles from "./style";
import { Grid, CardContent, Collapse } from "@material-ui/core";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { useFormContext, Controller } from "react-hook-form";
import CustomInput from "../custom-input";
import { pathOr } from "ramda";
const LineItemRow = ({
  groupIndex,
  rowIndex,
  rowData,
  productDataLabels,
  serviceDataLabels,
  module,
  initialValues,
  remove,
  calculateSingleGroupValue,
}) => {
  const classes = useStyles();
  const { control, getValues, setValue } = useFormContext();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleRemove = () => {
    let deletedRowId = pathOr(
      0,
      ["line_items", "grouped", groupIndex, "data", rowIndex, "id"],
      getValues(),
    );
    if (deletedRowId) {
      let deletedRowArr = pathOr(
        [],
        ["line_items", "grouped", "deleted"],
        getValues(),
      );
      setValue("line_items.deleted", [...deletedRowArr, deletedRowId]);
    }
    remove(rowIndex);
    calculateSingleGroupValue(groupIndex, getValues(`line_items.grouped`));
  };

  const renderFields = (dataLabels) => {
    const handleCheck = dataLabels.some((item) => "aos_products" === item.name);
    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        spacing={1}
        className={classes.lineItemBox}
      >
        {dataLabels.map(
          (field, fieldNum) =>
            field.field_key !== "item_description" &&
            field.field_key !== "description" && (
              <Grid
                key={fieldNum}
                item
                sm={6}
                xs={12}
                md={
                  field.field_key === "name" || field.type === "relate" ? 2 : 2
                }
              >
                <Controller
                  control={control}
                  name={`line_items.grouped.${groupIndex}.data.${rowIndex}.${field.field_key}`}
                  render={(methods) => {
                    return (
                      <CustomInput
                        module={module}
                        initialValues={initialValues}
                        methods={methods}
                        field={field}
                      />
                    );
                  }}
                />
              </Grid>
            ),
        )}

        <Grid sm={4} md={4} xs={4} container justifyContent="space-between">
          <Grid item>
            {handleCheck && (
              <IconButton
                size="small"
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            )}
          </Grid>
          <Grid item>
            <IconButton
              size="small"
              aria-label="delete"
              onClick={handleRemove}
              className={classes.margin}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
        {handleCheck && (
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={0}
          >
            <Collapse
              className={classes.collapseBox}
              in={expanded}
              timeout="auto"
              unmountOnExit
            >
              <CardContent className={classes.collapseCardContent}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  {dataLabels &&
                    dataLabels.map(
                      (field, fieldNum) =>
                        (field.field_key === "item_description" ||
                          field.field_key === "description") && (
                          <Grid
                            key={field.field_key}
                            item
                            sm="auto"
                            xs="6"
                            md="6"
                          >
                            <Controller
                              control={control}
                              name={`line_items.grouped.${groupIndex}.data.${rowIndex}.${field.field_key}`}
                              render={(methods) => {
                                return (
                                  <CustomInput
                                    module={module}
                                    initialValues={initialValues}
                                    methods={methods}
                                    field={field}
                                  />
                                );
                              }}
                            />
                          </Grid>
                        ),
                    )}
                </Grid>
              </CardContent>
            </Collapse>
          </Grid>
        )}
      </Grid>
    );
  };

  return rowData?.line_type == "product"
    ? renderFields(productDataLabels)
    : renderFields(serviceDataLabels);
};

export default memo(LineItemRow);
