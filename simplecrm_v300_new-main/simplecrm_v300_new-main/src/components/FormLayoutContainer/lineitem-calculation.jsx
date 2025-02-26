import { isEmpty, isNil, pathOr } from "ramda";
import { checkNumberIsValid } from "@/common/utils";

// group total fields names
export const lineItemSingleGroupTotalFields = [
  "total_amt",
  "discount_amount",
  "subtotal_amount",
  // "shipping_amount",
  // "shipping_tax_amt",
  "tax_amount",
  "total_amount",
];

export const lineItemSingleGroupTotalFieldsInitialValue =
  lineItemSingleGroupTotalFields.reduce(function (o, val) {
    o[val] = "";
    return o;
  }, {});

export const setDefaultValuesToDataLabels = (
  dateLabels,
  defaultValueObj = null,
  isProductLine = true,
) => {
  let defaultFieldTypeValues = defaultValueObj || {
    decimal: 0,
    relate: { id: "", value: "" },
    varchar: "",
    text: "",
    isEnum: (options) =>
      isEmpty(options) ? null : Object.entries(options)[0][0],
  };
  const tempFieldsValueObj = {};
  dateLabels.forEach((field, fieldIndex) => {
    if (field.type == "enum") {
      tempFieldsValueObj[field.field_key] = defaultFieldTypeValues.isEnum(
        field.options,
      );
    } else {
      tempFieldsValueObj[field.field_key] = defaultFieldTypeValues[field.type];
    }
    if (!isProductLine && field.name === "product_qty") {
      tempFieldsValueObj[field.field_key] = 1;
    }
  });
  return tempFieldsValueObj;
};

export const lineItemFieldOnChangeCalculation = (fieldObj, customArgs) => {
  const { nestedFieldArr, formValues, fieldValue, changeFormFieldValue } =
    customArgs;
  const isLineItemTypeGroup = pathOr(
    false,
    ["linedata", "enable_group"],
    fieldObj,
  );
  const outputUpdatingFields = {};
  const productLineDataLabels = pathOr(
    [],
    ["linedata", "product_datalabels", 0],
    fieldObj,
  );
  const serviceLineDataLabels = pathOr(
    [],
    ["linedata", "product_datalabels", 0],
    fieldObj,
  );
  if (isLineItemTypeGroup) {
    if (isNil(formValues) || nestedFieldArr.length != 6) return;
    const groupIndex = parseInt(nestedFieldArr[2]);
    const rowIndex = parseInt(nestedFieldArr[4]);
    const rowFieldName = nestedFieldArr[5];
    const changedFieldValue = pathOr(
      "",
      ["grouped", groupIndex, "data", rowIndex, rowFieldName],
      fieldValue,
    );
    const lineItemType = pathOr(
      "",
      ["grouped", groupIndex, "data", rowIndex, "lineItemType"],
      fieldValue,
    );
    const lineItemFieldsDataLabels =
      lineItemType == "product"
        ? setDefaultValuesToDataLabels(productLineDataLabels, null, true)
        : setDefaultValuesToDataLabels(serviceLineDataLabels, null, false);
    const outputRowFieldsValues = pathOr(
      {},
      ["grouped", groupIndex, "data", rowIndex],
      fieldValue,
    );

    const groupAllRowValues = pathOr(
      [],
      ["grouped", groupIndex, "data"],
      fieldValue,
    );
    const groupAllValues = pathOr([], ["grouped"], fieldValue);
    if (rowFieldName === "aos_products") {
      const productPrice = pathOr(
        0.0,
        ["rowData", "attributes", "price"],
        changedFieldValue,
      );
      const productsValue = {
        id: pathOr("", ["id"], changedFieldValue),
        value: pathOr("", ["value"], changedFieldValue),
      };
      const parseValues = {
        aos_products: productsValue,
        product_qty: 1,
        product_id: productsValue,
        product_list_price: productPrice,
        product_unit_price: productPrice,
        product_total_price: productPrice,
        part_number: pathOr(
          0.0,
          ["rowData", "attributes", "part_number"],
          changedFieldValue,
        ),
        item_description: pathOr(
          "",
          ["rowData", "attributes", "description"],
          changedFieldValue,
        ),
        id: pathOr("", ["rowData", "id"], changedFieldValue),
        name: pathOr("", ["rowData", "attributes", "name"], changedFieldValue),
        currency_id: pathOr(
          "",
          ["rowData", "attributes", "currency_id"],
          changedFieldValue,
        ),
      };

      Object.keys(lineItemFieldsDataLabels).map((fieldName, fieldIndex) => {
        if (parseValues.hasOwnProperty(fieldName)) {
          if (fieldName === "aos_products") {
            outputRowFieldsValues["product_id"] = parseValues[fieldName];
          }
          outputRowFieldsValues[fieldName] = parseValues[fieldName];
        }
      });
    }
    const calculatedRowValues = calculateRowLine(outputRowFieldsValues);
    const outputGroupValues = groupAllRowValues.reduce((_, lineItem, index) => {
      if (index === rowIndex) _.push(calculatedRowValues);
      else _.push(lineItem);
      return _;
    }, []);
    const calculatedGroupValues = calculateGroupLineTotal(outputGroupValues);
    const outputGroupGrandValues = groupAllValues.reduce(
      (_, lineItem, index) => {
        if (index === groupIndex)
          _.push({ data: calculatedRowValues, meta: calculatedGroupValues });
        else _.push(lineItem);
        return _;
      },
      [],
    );
    const calculatedGroupGrandValues = calculateGroupGrandTotal(
      outputGroupGrandValues,
      formValues,
    );
    const fieldValuesChange = {
      [`line_items.grouped.${groupIndex}.data.${rowIndex}`]:
        calculatedRowValues,
      [`line_items.grouped.${groupIndex}.meta`]: calculatedGroupValues,
      ...calculatedGroupGrandValues,
    };

    changeFormFieldValue(fieldValuesChange);
  } else {
  }
  return outputUpdatingFields;
};

export const calculateRowLine = (rowValues) => {
  const parsedValues = {
    ...rowValues,
    product_qty: checkNumberIsValid(
      !isNil(rowValues?.product_qty) ? rowValues?.product_qty : 1,
      1,
    ),
    product_list_price: checkNumberIsValid(rowValues?.product_list_price, 0),
    product_unit_price: checkNumberIsValid(rowValues?.product_unit_price, 0),
    discount: pathOr("Percentage", ["discount"], rowValues) || "Percentage",
    product_discount: checkNumberIsValid(rowValues?.product_discount, 0),
    vat: checkNumberIsValid(rowValues?.vat, 0),
    vat_amt: checkNumberIsValid(rowValues?.vat_amt, 0),
    product_discount_amount: checkNumberIsValid(
      rowValues?.product_discount_amount,
      0,
    ),
  };
  if (parsedValues?.discount === "Amount") {
    if (parsedValues?.product_discount > parsedValues?.product_list_price) {
      parsedValues.product_discount = parsedValues?.product_list_price;
    }
    parsedValues.product_unit_price =
      parsedValues?.product_list_price - parsedValues?.product_discount;
  } else if (parsedValues?.discount === "Percentage") {
    let discountAmount = parsedValues?.product_discount;
    if (discountAmount > 100) {
      parsedValues.product_discount = 100;
      discountAmount = 100;
    }
    discountAmount = (discountAmount / 100) * parsedValues?.product_list_price;
    parsedValues.product_unit_price =
      parsedValues?.product_list_price - discountAmount;
  } else {
    parsedValues.product_unit_price = parsedValues?.product_list_price;
    parsedValues.product_discount = 0;
  }
  if (parsedValues?.product_discount_amount != -1) {
    parsedValues.product_discount_amount =
      parsedValues.product_list_price - parsedValues.product_unit_price;
  }

  let productTotalPrice =
    parsedValues?.product_qty * parsedValues.product_unit_price;
  let totalVAT = (productTotalPrice * parsedValues?.vat) / 100;
  productTotalPrice += totalVAT;
  parsedValues.vat_amt = totalVAT;
  parsedValues.product_total_price = productTotalPrice;
  return { ...parsedValues };
};

export const calculateGroupLineTotal = (initialValues) => {
  const groupRowLineValues = [...initialValues];
  const outputFinalObj = {};
  let totalAmount = 0;
  let totalSubAmount = 0;
  let totalTaxAmount = 0;
  let totalDiscountAmount = 0;

  groupRowLineValues.forEach((rowValues, index) => {
    const parsedValues = {
      ...rowValues,
      product_qty: checkNumberIsValid(rowValues?.product_qty, 1),
      product_list_price: checkNumberIsValid(rowValues?.product_list_price, 0),
      product_unit_price: checkNumberIsValid(rowValues?.product_unit_price, 0),
      discount: pathOr("Percentage", ["discount"], rowValues) || "Percentage",
      product_discount: checkNumberIsValid(rowValues?.product_discount, 0),
      vat: checkNumberIsValid(rowValues?.vat, 0),
      vat_amt: checkNumberIsValid(rowValues?.vat_amt, 0),
      product_discount_amount: checkNumberIsValid(
        rowValues?.product_discount_amount,
        0,
      ),
    };
    let productFinalTotalTax = 0;
    let productTotalPrice =
      parsedValues?.product_qty * parsedValues.product_list_price;

    // calculate product total amount
    const allProductTotalDiscount =
      Math.abs(parsedValues?.product_discount_amount) *
      parsedValues?.product_qty;
    productFinalTotalTax =
      parsedValues?.product_qty *
      parsedValues.product_unit_price *
      (parsedValues?.vat / 100);
    productFinalTotalTax = checkNumberIsValid(productFinalTotalTax, 0);
    totalAmount += productTotalPrice;
    totalDiscountAmount += allProductTotalDiscount;
    totalTaxAmount += productFinalTotalTax;
  });

  totalSubAmount = parseFloat(totalAmount) - parseFloat(totalDiscountAmount);

  outputFinalObj["total_amt"] = totalAmount;
  outputFinalObj["subtotal_amount"] = totalSubAmount;
  outputFinalObj["discount_amount"] = totalDiscountAmount;
  outputFinalObj["tax_amount"] = totalTaxAmount;
  outputFinalObj["subtotal_tax_amount"] = totalSubAmount + totalTaxAmount;
  outputFinalObj["total_amount"] = totalSubAmount + totalTaxAmount;

  return outputFinalObj;
};

export const calculateGroupGrandTotal = (groupTotalValues, formValues) => {
  const outputFinalObj = {};
  let totalAmount = 0;
  let totalSubAmount = 0;
  let totalTaxAmount = 0;
  let totalSubTaxAmount = 0;
  let totalDiscountAmount = 0;
  let totalShippingTaxAmount = 0;
  let totalFinalAmount = 0;

  let shippingAmount = checkNumberIsValid(formValues?.shipping_amount, 0);
  let shippingTax = checkNumberIsValid(formValues?.shipping_tax, 0);
  let shippingTaxAmount = (shippingAmount * shippingTax) / 100;
  // totalTaxAmount += shippingTaxAmount;

  groupTotalValues.map((groupValues, index) => {
    const groupMetaValues = pathOr({}, ["meta"], groupValues);

    totalAmount += checkNumberIsValid(groupMetaValues?.total_amt, 0);
    totalSubAmount += checkNumberIsValid(groupMetaValues?.subtotal_amount, 0);
    totalDiscountAmount += checkNumberIsValid(
      groupMetaValues?.discount_amount,
      0,
    );
    totalTaxAmount += checkNumberIsValid(groupMetaValues?.tax_amount, 0);
    totalSubTaxAmount += checkNumberIsValid(
      groupMetaValues?.subtotal_tax_amount,
      0,
    );
    totalShippingTaxAmount += checkNumberIsValid(
      groupMetaValues?.shipping_tax_amt,
      0,
    );
    totalFinalAmount += checkNumberIsValid(groupMetaValues?.total_amount, 0);
  });
  const finalTotalAmount =
    totalTaxAmount + shippingAmount + shippingTaxAmount + totalSubAmount;

  outputFinalObj["shipping_amount"] = shippingAmount;
  outputFinalObj["shipping_tax_amt"] = shippingTaxAmount;
  outputFinalObj["total_amt"] = totalAmount;
  outputFinalObj["subtotal_amount"] = totalSubAmount;
  outputFinalObj["discount_amount"] = -totalDiscountAmount;
  outputFinalObj["tax_amount"] = totalTaxAmount;
  outputFinalObj["subtotal_tax_amount"] = totalSubTaxAmount;
  outputFinalObj["total_amount"] = finalTotalAmount;
  return outputFinalObj;
};

export const calculateGrandTotalGroupValue = (
  groupTotalValues,
  formValues,
  setValueFn,
) => {
  let calculateGrandGroupCalculate = calculateGroupGrandTotal(
    groupTotalValues,
    formValues,
  );
  Object.entries(calculateGrandGroupCalculate).forEach(([fieldName, value]) => {
    setValueFn(fieldName, value);
  });
};
