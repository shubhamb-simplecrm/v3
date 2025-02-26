import { isTrue } from "@/common/utils";
import { Checkbox } from "@material-ui/core";
import React from "react";

export const BoolLabel = (props) => {
  const { fieldValue } = props;
  return (
    <Checkbox
      disabled
      checked={isTrue(fieldValue)}
      color="primary"
      inputProps={{ "aria-label": "secondary checkbox" }}
    />
  );
};
