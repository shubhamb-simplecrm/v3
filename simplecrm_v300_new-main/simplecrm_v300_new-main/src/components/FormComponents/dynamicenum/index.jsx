import React, { useEffect } from "react";
import { TextField, MenuItem, Tooltip } from "@material-ui/core";
import { pathOr } from "ramda";
import { LBL_REQUIRED_FIELD } from "../../../constant";
const DynamicEnum = ({
  field,
  onChange,
  errors = {},
  value,
  small = false,
  disabled,
  initialValues,
  onCopy = null,
}) => {
  let iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : false;
  const parentEnumValue = pathOr("", [field.parentenum], initialValues);

  const renderOptions = () => {
    let optionsToRender = [];
    for (let optionKey in field.options) {
      if (optionKey.startsWith(parentEnumValue) && parentEnumValue !== "") {
        optionsToRender.push(
          <MenuItem key={optionKey} value={optionKey}>
            <span>{field.options[optionKey]}</span>
          </MenuItem>,
        );
      }
    }
    return optionsToRender;
  };

  useEffect(() => {
    if (parentEnumValue) {
      let tempParentValue = [];
      let tempValue = [];
      let resultValue = [];
      if (typeof parentEnumValue === "string") {
        tempParentValue = parentEnumValue.split(",");
      } else {
        tempParentValue = parentEnumValue;
      }
      if (typeof initialValues[field.name] === "string") {
        tempValue = initialValues[field.name].split(",");
      } else {
        tempValue = initialValues[field.name];
      }
      tempParentValue.map((parentenum) => {
        tempValue?.map((val) => {
          if (val.startsWith(parentenum)) {
            resultValue.push(val);
          }
        });
      });
      initialValues[field.name] = resultValue.toString();
    } else {
      initialValues[field.name] = "";
    }
  }, [parentEnumValue]);

  return (
    <Tooltip
      title={field.comment}
      disableHoverListener={field.comment ? false : true}
      placement="top-start"
      disableFocusListener={field.comment ? false : true}
      disableTouchListener={field.comment ? false : true}
    >
      <TextField
        id={field.name}
        name={field.name}
        error={iserror}
        required={
          field.required === "true" || errors[field.name] === LBL_REQUIRED_FIELD
            ? true
            : false
        }
        select
        label={field.label}
        value={value ? value : " "}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        fullWidth
        size={small ? "small" : "medium"}
        // helperText={pathOr(null,[field?.name],errors)}
        helperText={
          errors[field.name] && errors[field.name] !== "ReadOnly"
            ? errors[field.name]
            : null
        }
        disabled={errors[field.name] === "ReadOnly" ? true : !!disabled}
        onCut={onCopy}
        onCopy={onCopy}
        onPaste={onCopy}
        onContextMenu={onCopy}
      >
        {renderOptions()}
      </TextField>
    </Tooltip>
  );
};

export default DynamicEnum;
