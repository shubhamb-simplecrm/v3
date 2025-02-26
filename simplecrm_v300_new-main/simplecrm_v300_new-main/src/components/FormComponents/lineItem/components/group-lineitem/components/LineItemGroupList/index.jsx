import { Accordion, AccordionDetails, Button, Grid } from "@material-ui/core";
import React, { useCallback, useEffect, useMemo } from "react";
import useStyles from "./styles";
import { useFieldArray, useFormContext } from "react-hook-form";
import LineItemSingleGroupTotal from "./../LineItemSingleGroupTotal";
import { isEmpty, isNil, pathOr, clone } from "ramda";
import LineItemRowList from "./components/LineItemRowList";
import { useSelector } from "react-redux";
import {
  calculateLine,
  calculateSingleGroupTotal,
  calculateTotalGroup,
} from "../../calculate";

function LineItemGroupList(props) {
  const {
    module,
    groupTotalFields,
    field,
    initialValues,
    singleGroupTotalFieldsInitialValue,
  } = props;
  const classes = useStyles();
  const { control, getValues, setValue, watch, update, formState, reset } =
    useFormContext();
  const { fields, append, insert, remove } = useFieldArray({
    control,
    name: `line_items.grouped`,
  });
  const addGroup = () => {
    append({
      meta: {
        ...singleGroupTotalFieldsInitialValue,
      },
      data: [],
    });
  };
  const handleGroupRemove = (groupIndex) => {
    let lineItemIds = pathOr(
      [],
      ["line_items", "grouped", groupIndex, "data"],
      getValues(),
    ).map((e) => {
      let deletedRowId = pathOr(0, ["id"], e);
      return deletedRowId;
    });
    let deletedRowArr = pathOr([], ["line_items", "deleted"], getValues());
    setValue("line_items.deleted", [...deletedRowArr, ...lineItemIds]);
    remove(groupIndex);
    calculateGrandTotalGroupValue();
  };
  const setDefaultValuesToDataLabels = (dateLabels, defaultValueObj = null) => {
    let defaultFieldTypeValues = defaultValueObj || {
      decimal: 0,
      relate: { id: "", value: "" },
      varchar: "",
      text: "",
      isEnum: (options) =>
        isEmpty(options) ? null : Object.entries(options)[0][0],
    };
    const tempFieldsValueObj = {};
    dateLabels.map((field, fieldIndex) => {
      if (field.type == "enum") {
        tempFieldsValueObj[field.field_key] = defaultFieldTypeValues.isEnum(
          field.options,
        );
      } else {
        tempFieldsValueObj[field.field_key] =
          defaultFieldTypeValues[field.type];
      }
    });
    return tempFieldsValueObj;
  };

  // product line items data labels
  const productDataLabels = useMemo(
    () => pathOr([], ["linedata", "product_datalabels", 0], field),
    [field],
  );

  // service line items data labels
  const serviceDataLabels = useMemo(
    () => pathOr([], ["linedata", "service_datalabels", 0], field),
    [field],
  );
  // product line items data labels fied
  const productDataLabelsFieldsObj = useMemo(
    () => setDefaultValuesToDataLabels(productDataLabels),
    [productDataLabels],
  );

  // service line items data labels
  const serviceDataLabelsFieldsObj = useMemo(
    () => setDefaultValuesToDataLabels(serviceDataLabels),
    [serviceDataLabels],
  );
  const calculateSingleGroupValue = useCallback(
    (groupIndex, singleGroupValues, hasCalculateTotal = true) => {
      let calculateSingleGroupResult = calculateSingleGroupTotal(
        singleGroupValues[groupIndex]["data"],
      );
      setValue(
        `line_items.grouped.${groupIndex}.meta`,
        calculateSingleGroupResult,
      );
      if (hasCalculateTotal) {
        calculateGrandTotalGroupValue();
      }
    },
    [calculateSingleGroupTotal],
  );

  const calculateGrandTotalGroupValue = () => {
    const InitialLineItemValue = { ...clone(getValues()) };
    let calculateAllGroupResult = calculateTotalGroup(InitialLineItemValue);
    const grandTotalFieldsArr = [
      "total_amt",
      "discount_amount",
      "subtotal_amount",
      "shipping_amount",
      "shipping_tax_amt",
      "tax_amount",
      "total_amount",
    ];
    grandTotalFieldsArr.map((fieldName) => {
      setValue(fieldName, calculateAllGroupResult[fieldName]);
    });
  };
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      let nestedFieldArr = [];
      if (name) nestedFieldArr = name?.split(".");
      // return;
      //  if currency field value change
      if (nestedFieldArr.length == 1 && !isNil(value) && type == "change") {
        let rowFieldName = nestedFieldArr[0];
        let changedFieldValue = pathOr("", [rowFieldName], value);
        if (rowFieldName === "currency_id") {
        } else if (
          rowFieldName === "shipping_amount" ||
          rowFieldName === "shipping_tax"
        ) {
          calculateGrandTotalGroupValue();
        }
      }
      //  if line item field value change of any lineitem
      if (nestedFieldArr.length == 6 && !isNil(value) && type == "change") {
        let groupIndex = nestedFieldArr[2];
        let rowIndex = nestedFieldArr[4];
        let rowFieldName = nestedFieldArr[5];
        let changedFieldValue = pathOr(
          "",
          ["line_items", "grouped", groupIndex, "data", rowIndex, rowFieldName],
          value,
        );
        let lineItemType = pathOr(
          "",
          ["line_items", "grouped", rowIndex, "lineItemType"],
          value,
        );
        const productDataLabels = pathOr(
          [],
          ["linedata", "product_datalabels", 0],
          field,
        );
        const serviceDataLabels = pathOr(
          [],
          ["linedata", "product_datalabels", 0],
          field,
        );
        const lineItemFieldsDataLabels =
          lineItemType == "product"
            ? setDefaultValuesToDataLabels(productDataLabels)
            : setDefaultValuesToDataLabels(serviceDataLabels);
        const tempInitialValues = pathOr(
          {},
          ["line_items", "grouped"],
          clone(getValues()),
        );
        let tempSingleInitialData = pathOr(
          {},
          [groupIndex, "data", rowIndex],
          tempInitialValues,
        );
        // return;
        if (rowFieldName === "aos_products") {
          const blankValue = {
            id: changedFieldValue.id || "",
            value: changedFieldValue.value || "",
          };
          const productPrice = pathOr(
            0.0,
            ["rowData", "attributes", "price"],
            changedFieldValue,
          );
          const partNumber = pathOr(
            0.0,
            ["rowData", "attributes", "part_number"],
            changedFieldValue,
          );
          const description = pathOr(
            "",
            ["rowData", "attributes", "description"],
            changedFieldValue,
          );
          const id = pathOr("", ["rowData", "id"], changedFieldValue);
          const name = pathOr(
            "",
            ["rowData", "attributes", "name"],
            changedFieldValue,
          );
          const currencyId = pathOr(
            "",
            ["rowData", "attributes", "currency_id"],
            changedFieldValue,
          );
          Object.keys(lineItemFieldsDataLabels).map((fieldName, fieldIndex) => {
            if (fieldName === "aos_products") {
              tempSingleInitialData["aos_products"] = blankValue;
              tempSingleInitialData["product_id"] = blankValue;
            } else if (
              fieldName === "product_list_price" ||
              fieldName === "product_unit_price" ||
              fieldName === "product_total_price"
            ) {
              tempSingleInitialData["product_list_price"] = productPrice;
              tempSingleInitialData["product_unit_price"] = productPrice;
              tempSingleInitialData["product_total_price"] = productPrice;
            } else if (fieldName === "part_number") {
              tempSingleInitialData["part_number"] = partNumber;
            } else if (fieldName === "item_description") {
              tempSingleInitialData["item_description"] = description;
            } else if (fieldName === "id") {
              tempSingleInitialData["id"] = id;
            } else if (fieldName === "name") {
              tempSingleInitialData["name"] = name;
            } else if (fieldName === "currency_id") {
              tempSingleInitialData["currency_id"] = currencyId;
            }
          });
        } else {
        }
        const tempData = calculateLine(tempSingleInitialData);
        setValue(
          `line_items.grouped.${groupIndex}.data.${rowIndex}`,
          tempData,
          {
            shouldDirty: true,
          },
        );
        calculateSingleGroupValue(groupIndex, tempInitialValues);
        return;
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      {fields.map((item, key) => {
        return (
          <>
            <Accordion key={item.id} expanded={true}>
              <AccordionDetails>
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="center"
                  spacing={1}
                  className={classes.lineItemBox}
                >
                  <Grid item xs={12} sm={12}>
                    <LineItemRowList
                      module={module}
                      groupIndex={key}
                      control={control}
                      productDataLabels={productDataLabels}
                      serviceDataLabels={serviceDataLabels}
                      productDataLabelsFieldsObj={productDataLabelsFieldsObj}
                      serviceDataLabelsFieldsObj={serviceDataLabelsFieldsObj}
                      calculateSingleGroupValue={calculateSingleGroupValue}
                      initialValues={initialValues}
                      handleGroupRemove={handleGroupRemove}
                    />
                    <LineItemSingleGroupTotal
                      groupIndex={key}
                      module={module}
                      groupTotalFields={groupTotalFields}
                      control={control}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </>
        );
      })}
      <Button
        variant="outlined"
        color="primary"
        className={classes.btn}
        onClick={addGroup}
      >
        ADD GROUP
      </Button>
    </>
  );
}

export default LineItemGroupList;
