import React, { useState } from "react";
import useStyles from "./style";
import { Grid, CardContent, Collapse } from "@material-ui/core";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { useFormContext, Controller } from "react-hook-form";
import { isEmpty, pathOr } from "ramda";
import { isNumeric } from "../../../../../../../../calculate";
import CustomInput from "./components/custom-input";
export default function LineItemRow({
  rowIndex,
  rowData,
  productDataLabels,
  serviceDataLabels,
  module,
  initialValues,
  remove,
  calculateTotalValue,
}) {
  const classes = useStyles();
  const { control, getValues, setValue } = useFormContext();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleRemove = () => {
    let deletedRowId = pathOr(
      0,
      ["line_items", "ungrouped", rowIndex, "id"],
      getValues(),
    );
    if (deletedRowId) {
      let deletedRowArr = pathOr([], ["deleted"], getValues());
      setValue("line_items.ungrouped.deleted", [
        ...deletedRowArr,
        deletedRowId,
      ]);
    }

    remove(rowIndex);
    calculateTotalValue(getValues(`line_items.ungrouped`));
  };
  const parseFieldValue = (field, value) => {
    if (field.type === "varchar") {
      field.value = value.toString();
    }
    if (field.type === "decimal") {
      field.value = value.toString();
    }
    if (
      value !== "" &&
      isNumeric(value) &&
      field.name !== "vat" &&
      field.name !== "product_id" &&
      field.name !== "name" &&
      field.name !== "part_number" &&
      field.name !== "description" &&
      field.name !== "item_description" &&
      field.name !== "product_discount" &&
      field.name !== "hsn_code_c"
    ) {
      // return field.value;
      if (field.name === "product_qty") {
        return parseFloat(value);
      }

      return parseFloat(value);
    } else {
      return value;
    }
    // if (/<\/?[a-z][\s\S]*>/i.test(field.value) && view !== 'editview') {
    //     return parse(field.value);
    // }
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
                  name={`line_items.ungrouped.${rowIndex}.${field.field_key}`}
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
                              name={`line_items.ungrouped.${rowIndex}.${field.field_key}`}
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
}
