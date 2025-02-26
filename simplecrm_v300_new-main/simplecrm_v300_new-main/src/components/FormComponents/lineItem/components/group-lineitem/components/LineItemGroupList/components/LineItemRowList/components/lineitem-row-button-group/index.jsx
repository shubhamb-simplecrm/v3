import { Button, IconButton } from "@material-ui/core";
import { pathOr } from "ramda";
import React, { memo } from "react";
import { useStyles } from "./styles";
import DeleteIcon from "@material-ui/icons/Delete";

function LineItemButtonGroup(props) {
  const {
    productDataLabelsFieldsObj,
    serviceDataLabelsFieldsObj,
    append,
    groupIndex,
    handleGroupRemove,
  } = props;
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
      <IconButton
        size="small"
        aria-label="delete"
        onClick={() => handleGroupRemove(groupIndex)}
        className={classes.margin}
      >
        <DeleteIcon />
      </IconButton>
    </>
  );
}

export default memo(LineItemButtonGroup);
