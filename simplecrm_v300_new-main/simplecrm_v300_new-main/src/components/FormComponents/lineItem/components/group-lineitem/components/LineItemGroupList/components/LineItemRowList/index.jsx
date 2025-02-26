import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import useStyles from "./../../styles";
import LineItemRowButtonGroup from "./components/lineitem-row-button-group";
import LineItemRow from "./components/LineItemRow";
function LineItemRowList(props) {
  const {
    rowData,
    data,
    rowIndex,
    groupIndex,
    onChange,
    initialValues,
    view = "editview",
    module,
    calculateSingleGroupValue,
    productDataLabelsFieldsObj,
    serviceDataLabelsFieldsObj,
    productDataLabels,
    serviceDataLabels,
    handleGroupRemove,
  } = props;
  const classes = useStyles();
  const { control, getValues } = useFormContext();
  const { fields, remove, append } = useFieldArray({
    control,
    name: `line_items.grouped.${groupIndex}.data`,
  });
  return (
    <>
      {fields.map((rowData, rowIndex) => (
        <LineItemRow
          key={rowData.id}
          groupIndex={groupIndex}
          rowIndex={rowIndex}
          rowData={rowData}
          productDataLabels={productDataLabels}
          serviceDataLabels={serviceDataLabels}
          module={module}
          remove={remove}
          serviceDataLabelsFieldsObj={serviceDataLabelsFieldsObj}
          calculateSingleGroupValue={calculateSingleGroupValue}
        />
      ))}
      <LineItemRowButtonGroup
        append={append}
        groupIndex={groupIndex}
        handleGroupRemove={handleGroupRemove}
        productDataLabelsFieldsObj={productDataLabelsFieldsObj}
        serviceDataLabelsFieldsObj={serviceDataLabelsFieldsObj}
        calculateSingleGroupValue={calculateSingleGroupValue}
      />
    </>
  );
}

export default LineItemRowList;
