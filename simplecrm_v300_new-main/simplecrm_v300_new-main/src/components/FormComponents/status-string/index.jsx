import React from "react";
import { Link } from "react-router-dom";
import useStyles, { getMuiTheme } from "./styles";
import { Chip, useTheme } from "@material-ui/core";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";
import { checkMaskingCondition } from "../../../common/utils";
const StatusString = ({ field, value, module, fieldConfiguratorData }) => {
  const classes = useStyles();
  const currentTheme = useTheme();
  const config = useSelector((state) => state.config?.config);
  const statusBackground = pathOr([], ["fields_background", module], config);
  let statusField = Object.keys(statusBackground);

  let option = field.options
    ? Object.keys(field.options).find((key) => field.options[key] === value)
    : "";
  let optionBgColor = `${pathOr(
    "",
    [field.name, option, "background_color"],
    statusBackground,
  )}`;
  let statusStyle = {};

  if (currentTheme.palette.type === "dark") {
    statusStyle = {
      color: optionBgColor,
      fontWeight: "bolder",
      background: "transparent",
      border: "1px solid",
    };
  } else {
    statusStyle = {
      color: optionBgColor,
      background: optionBgColor + "20",
      border: "none",
    };
  }
  const valueData = checkMaskingCondition(
    fieldConfiguratorData,
    { [field.field_key]: value },
    "masking",
  );
  value = valueData[field.field_key];

  return value && optionBgColor ? (
    <Chip
      size="small"
      className={classes.statusBg}
      style={statusStyle}
      label={value}
      id={field?.name}
    />
  ) : (
    value
  );
};

export default StatusString;
