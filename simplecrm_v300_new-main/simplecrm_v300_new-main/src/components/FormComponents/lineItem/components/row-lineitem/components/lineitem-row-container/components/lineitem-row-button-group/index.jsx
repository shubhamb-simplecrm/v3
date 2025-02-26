import { Button } from "@material-ui/core";
import { pathOr } from "ramda";
import React, { memo } from "react";
import { useStyles } from "./styles";

function LineItemButtonGroup(props) {
  const { productDataLabelsFieldsObj, serviceDataLabelsFieldsObj, append } =
    props;
  const classes = useStyles();
  const handleAddRow = (lineItemType) => {
    let lineItemLabels =
      lineItemType == "product"
        ? productDataLabelsFieldsObj
        : serviceDataLabelsFieldsObj;
    lineItemLabels["line_type"] = lineItemType;
    append(lineItemLabels);
  };
  return (
    <>
      <Button
        className={classes.mobileLayoutFullWidth + " " + classes.marginBottom}
        variant="outlined"
        color="primary"
        onClick={() => handleAddRow("product")}
        style={{ marginRight: 10 }}
      >
        ADD PRODUCT LINE
      </Button>
      <Button
        className={`${classes.mobileLayoutFullWidth} ${classes.marginBottom}`}
        variant="outlined"
        color="primary"
        onClick={() => handleAddRow("service")}
      >
        ADD SERVICE LINE
      </Button>
    </>
  );
}

export default memo(LineItemButtonGroup);
