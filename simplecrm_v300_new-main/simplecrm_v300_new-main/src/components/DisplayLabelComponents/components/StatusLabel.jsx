import { Chip, useTheme } from "@material-ui/core";
import React from "react";
import { TextLabel } from "./TextLabel";
import useStyles from "./../styles";
import { isEmpty, pathOr } from "ramda";
import useCommonUtils from "@/hooks/useCommonUtils";
import { getChipStyle } from "@/common/utils";

export const StatusLabel = (props) => {
  const { listDataLabel, fieldValue, customArgs, moduleName } = props;
  const classes = useStyles();
  const currentTheme = useTheme();
  const { getStatusFieldBackgroundColor } = useCommonUtils();
  const isEnumType =
    listDataLabel?.type === "enum" ||
    listDataLabel?.type === "dynamicenum" ||
    listDataLabel?.type === "currency_id";

  if (isEmpty(fieldValue)) return null;

  const renderChipLabel = () => {
    const fieldOptions = pathOr({}, ["options"], listDataLabel);
    const optionsBgColor = getStatusFieldBackgroundColor(
      moduleName,
      listDataLabel.name,
    );
    const optionLabel = pathOr(fieldValue, [fieldValue], fieldOptions);
    const selectedOption =
      Object.keys(fieldOptions).find(
        (key) => fieldOptions[key] === fieldValue,
      ) || "";
    const chipBgColor = pathOr(
      pathOr("", ["default", "background_color"], optionsBgColor),
      [fieldValue, "background_color"],
      optionsBgColor,
    );
    const chipStyle = getChipStyle(currentTheme, chipBgColor);
    return isEmpty(optionsBgColor) ? (
      <TextLabel {...props} fieldValue={optionLabel} />
    ) : (
      <Chip
        size="small"
        className={classes.statusBg}
        style={chipStyle}
        label={optionLabel}
      />
    );
  };

  return isEnumType ? renderChipLabel() : <TextLabel {...props} />;
};
