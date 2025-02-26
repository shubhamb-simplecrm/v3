import React from "react";
import useCommonUtils from "../../../hooks/useCommonUtils";
import { NumericFormat } from "react-number-format";
import { Typography } from "@material-ui/core";

export const CurrencyLabel = (props) => {
  const { fieldValue, customArgs } = props;
  const { getUserPrefCurrencySymbol } = useCommonUtils();
  return (
    <>
      {getUserPrefCurrencySymbol}
      <NumericFormat
        value={fieldValue}
        displayType={"text"}
        thousandSeparator={true}
        decimalSeparator="."
        decimalScale={2}
      />
    </>
  );
};
