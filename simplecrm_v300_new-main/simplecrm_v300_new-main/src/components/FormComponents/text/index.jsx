import React from "react";
// import useStyles from './styles';
import { Tooltip, TextField } from "@material-ui/core";
import { LBL_REQUIRED_FIELD } from "../../../constant";
import { isNil } from "ramda";

export default function Text({
  field,
  onChange,
  onBlur,
  errors = {},
  variant = "outlined",
  value,
  small = false,
  disabled = false,
  rows = 5,
  onCopy = null,
}) {
  let iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : false;

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Tooltip
      title={field.comment || ""}
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
        label={field.label}
        multiline
        size={small ? "small" : "medium"}
        fullWidth
        rows={isNil(field?.rows) ? rows : field?.rows}
        variant={variant}
        value={value || ""}
        onChange={handleChange}
        onBlur={(e) => onBlur(e.target.value)}
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
      />
    </Tooltip>
  );
}
