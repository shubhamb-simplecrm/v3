import { Button } from "@material-ui/core";
import { clone, pathOr } from "ramda";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import useStyles from "../../styles";
import LineItemRow from "./components/lineitem-row";
function LineItemRowList(props) {
  const {
    productDataLabels,
    serviceDataLabels,
    productDataLabelsFieldsObj,
    serviceDataLabelsFieldsObj,
    rowData,
    data,
    rowIndex,
    groupIndex,
    onChange,
    productLabels,
    initialValues,
    view = "editview",
    module,
    control,
    fields,
    remove,
    calculateTotalValue
    // orignalPrice
  } = props;
  const classes = useStyles();

  return (
    <>
      {fields.map((rowData, rowIndex) => (
        <LineItemRow
          key={rowData.id}
          rowIndex={rowIndex}
          rowData={rowData}
          productDataLabels={productDataLabels}
          serviceDataLabels={serviceDataLabels}
          module={module}
          remove={remove}
          calculateTotalValue={calculateTotalValue}
        />
      ))}
    </>
  );
}

export default LineItemRowList;
