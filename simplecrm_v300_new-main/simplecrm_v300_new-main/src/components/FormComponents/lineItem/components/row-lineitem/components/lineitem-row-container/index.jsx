import { Accordion, AccordionDetails, Grid } from "@material-ui/core";
import { isEmpty, pathOr } from "ramda";
import React from "react";
import { useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import LineItemButtonGroup from "./components/lineitem-row-button-group";
import LineItemRowList from "./components/lineitem-row-list";

function LineItemRowContainer(props) {
  const {
    lineItemField,
    isGroupLineItem,
    field,
    onChange,
    module,
    errors = {},
    value,
    small = false,
    disabled1,
    gst_disable,
    initialValues,
    productDataLabels,
    serviceDataLabels,
    productDataLabelsFieldsObj,
    serviceDataLabelsFieldsObj,
    calculateTotalValue,
  } = props;
  const { control, getValues } = useFormContext();
  const { fields, remove, append } = useFieldArray({
    control,
    name: `line_items.ungrouped`,
  });
  return (
    <Accordion  expanded={true}>
      <AccordionDetails>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          spacing={1}
          // className={classes.lineItemBox}
        >
          <Grid item xs={12} sm={12}>
            <LineItemRowList
              productDataLabels={productDataLabels}
              serviceDataLabels={serviceDataLabels}
              productDataLabelsFieldsObj={productDataLabelsFieldsObj}
              serviceDataLabelsFieldsObj={serviceDataLabelsFieldsObj}
              module={module}
              control={control}
              fields={fields}
              remove={remove}
              calculateTotalValue={calculateTotalValue}
              // productLabels={productLabels}
              // calculateSingleGroupValue={calculateSingleGroupValue}
              // initialValues={initialValues}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <LineItemButtonGroup
              productDataLabelsFieldsObj={productDataLabelsFieldsObj}
              serviceDataLabelsFieldsObj={serviceDataLabelsFieldsObj}
              append={append}
            />
          </Grid>
        </Grid>{" "}
      </AccordionDetails>
    </Accordion>
  );
}

export default LineItemRowContainer;
