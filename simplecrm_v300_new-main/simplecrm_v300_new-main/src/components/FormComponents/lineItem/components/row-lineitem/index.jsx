import React, { memo, useEffect, useState, useMemo, useCallback } from "react";
import { clone, isEmpty, isNil, pathOr } from "ramda";
import CurrencyField from "./components/currency-field";
import LineItemGrandTotal from "./components/lineitem-grand-total-fields";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import { calculateLine, calculateSingleGroupTotal } from "./calculate";
import LineItemRowContainer from "./components/lineitem-row-container";
import { checkNumberIsValid } from "../../../../../common/utils";

function RowLineItem(props) {
  const {
    field,
    onChange,
    module,
    errors = {},
    value,
    small = false,
    disabled1,
    gst_disable,
    initialValues,
  } = props;
  const { control, getValues, setValue, watch, update, formState, reset } =
    useFormContext();
  // const classes = useStyles();
  const [fieldObj, setFieldObj] = useState({});
  const isGroupLineItem = pathOr(0, ["linedata", "enable_group"], props.field);
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
    () =>
      pathOr([], ["linedata", "product_datalabels", 0], fieldObj.lineItemField),
    [fieldObj.lineItemField],
  );

  // service line items data labels
  const serviceDataLabels = useMemo(
    () =>
      pathOr([], ["linedata", "service_datalabels", 0], fieldObj.lineItemField),
    [fieldObj.lineItemField],
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
  // function to initialize value for edit view
  const initFieldsValues = (fieldObj) => {
    const initialValuesTemp = pathOr(
      [],
      ["linedata", "simple_data", "data"],
      field,
    );
    const tempGrandInitialValue = {};
    fieldObj.grandTotal.map((field) => {
      tempGrandInitialValue[field.field_key] = field.value;
    });
    reset((formValues) => {
      formValues["line_items"]["ungrouped"] = initialValuesTemp;
      return {
        ...formValues,
        ...tempGrandInitialValue,
      };
    });
  };

  useEffect(() => {
    const tempFieldObj = {
      currencyField: null,
      lineItemField: null,
      grandTotal: [],
    };
    const tempLineData = pathOr(null, ["linedata"], field);
    tempFieldObj["currencyField"] = pathOr(
      null,
      ["currency_field_datalabel", 0],
      tempLineData,
    );
    tempFieldObj["lineItemField"] = field;
    tempFieldObj["grandTotal"] = pathOr(
      null,
      ["total_field_datalabel"],
      tempLineData,
    );
    initFieldsValues(tempFieldObj);
    setFieldObj({ ...tempFieldObj });
  }, [field]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      let nestedFieldArr = [];
      if (name) nestedFieldArr = name?.split(".");
      //  if currency field value change
      if (nestedFieldArr.length == 1 && !isNil(value) && type == "change") {
        let rowFieldName = nestedFieldArr[0];
        let changedFieldValue = pathOr("", [rowFieldName], value);
        if (rowFieldName === "currency_id") {
          const currenciesRecords = pathOr(
            [],
            ["attributes", "CurrenciesRecords"],
            userPreference,
          );
          const selectedCurrency = currenciesRecords?.filter(
            (c) => c.id == changedFieldValue,
          )[0];
          const tempLineItemData = pathOr(
            [],
            ["line_items", "ungrouped"],
            value,
          );
          const tempCalculatedLineItemData = tempLineItemData?.map((lineItem) =>
            calculateLine(lineItem),
          );
          // const tempLineItemData = calculateLine(tempInitialValues[rowIndex]);
        } else if (
          rowFieldName === "shipping_amount" ||
          rowFieldName === "shipping_tax"
        ) {
          const tempLineItemData = getValues(`line_items.ungrouped`);
          calculateTotalValue(tempLineItemData);
        }
      }
      //  if line item field value change of any lineitem
      if (nestedFieldArr.length == 4 && !isNil(value) && type == "change") {
        let rowIndex = nestedFieldArr[2];
        let rowFieldName = nestedFieldArr[3];
        let changedFieldValue = pathOr(
          "",
          ["line_items", "ungrouped", rowIndex, rowFieldName],
          value,
        );
        let lineItemType = pathOr(
          "",
          ["line_items", "ungrouped", rowIndex, "lineItemType"],
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
          ["line_items", "ungrouped"],
          clone(getValues()),
        );

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
            value,
          );
          const id = pathOr("", ["rowData", "id"], value);
          const name = pathOr("", ["rowData", "attributes", "name"], value);
          const currencyId = pathOr(
            "",
            ["rowData", "attributes", "currency_id"],
            value,
          );
          console.log("tempInitialValues", tempInitialValues[rowIndex]);
          console.log("lineItemFieldsDataLabels", lineItemFieldsDataLabels);
          console.log("blankValue", blankValue);
          console.log("changedFieldValue", changedFieldValue);
          console.log("1.productPrice", productPrice);
          console.log("2.partNumber", partNumber);
          console.log("3.description", description);
          console.log("4.id", id);
          console.log("5.name", name);
          console.log("6.currencyId", currencyId);
          Object.keys(lineItemFieldsDataLabels).map((fieldName, fieldIndex) => {
            console.log("DsfsffieldName", fieldName);
            if (fieldName === "aos_products") {
              tempInitialValues[rowIndex]["aos_products"] = blankValue;
              tempInitialValues[rowIndex]["product_id"] = blankValue;
            } else if (
              fieldName === "product_list_price" ||
              fieldName === "product_unit_price" ||
              fieldName === "product_total_price"
            ) {
              tempInitialValues[rowIndex]["product_list_price"] = productPrice;
              tempInitialValues[rowIndex]["product_unit_price"] = productPrice;
              tempInitialValues[rowIndex]["product_total_price"] = productPrice;
            } else if (fieldName === "part_number") {
              tempInitialValues[rowIndex]["part_number"] = partNumber;
            } else if (fieldName === "item_description") {
              tempInitialValues[rowIndex]["item_description"] = description;
            } else if (fieldName === "id") {
              tempInitialValues[rowIndex]["id"] = id;
            } else if (fieldName === "name") {
              tempInitialValues[rowIndex]["name"] = name;
            } else if (fieldName === "currency_id") {
              tempInitialValues[rowIndex]["currency_id"] = currencyId;
            }
          });
          // let calculateResult = calculateLine(
          //   tempSingleInitialData,
          //   newTempData,
          // );
          console.log(
            "Dsfssssf",
            JSON.parse(JSON.stringify(tempInitialValues)),
          );
        } else {
          // tempInitialValues["ungrouped"][rowIndex][
          //   rowFieldName
          // ] = changedFieldValue;
        }
        const tempData = calculateLine(tempInitialValues[rowIndex]);
        setValue(`line_items.ungrouped.${rowIndex}`, tempData, {
          shouldDirty: true,
        });
        calculateTotalValue(tempInitialValues);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const calculateTotalValue = useCallback(
    (singleGroupValues, otherDetailObj = {}) => {
      if (isEmpty(otherDetailObj)) {
        otherDetailObj = {
          shipping_amount: getValues(`shipping_amount`),
          shipping_tax: getValues(`shipping_tax`),
        };
      }
      const lineItemFieldsTotal = calculateSingleGroupTotal(
        singleGroupValues,
        otherDetailObj,
      );
      const grandTotalFieldsArr = [
        "total_amt",
        "discount_amount",
        "subtotal_amount",
        "shipping_amount",
        "shipping_tax_amt",
        "tax_amount",
        "total_amount",
      ];

      grandTotalFieldsArr.map((fieldKey) => {
        setValue(fieldKey, lineItemFieldsTotal[fieldKey]);
      });
    },
    [calculateSingleGroupTotal],
  );

  return (
    <>
      <CurrencyField
        {...props}
        field={fieldObj?.currencyField}
        control={control}
      />
      <LineItemRowContainer
        isGroupLineItem={isGroupLineItem}
        lineItemField={fieldObj.lineItemField}
        productDataLabels={productDataLabels}
        serviceDataLabels={serviceDataLabels}
        productDataLabelsFieldsObj={productDataLabelsFieldsObj}
        serviceDataLabelsFieldsObj={serviceDataLabelsFieldsObj}
        calculateTotalValue={calculateTotalValue}
        {...props}
      />
      <LineItemGrandTotal fields={fieldObj.grandTotal} />
    </>
  );
}

export default memo(RowLineItem);
