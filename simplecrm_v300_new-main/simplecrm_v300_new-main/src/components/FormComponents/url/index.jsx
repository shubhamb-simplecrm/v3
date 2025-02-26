import React from "react";
import { Tooltip, TextField } from "@material-ui/core";
import { LBL_REQUIRED_FIELD } from "../../../constant";

export default function Url({
  field,
  onChange,
  onBlur,
  errors = {},
  value,
  small = false,
  onCopy = null,
}) {
  let iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : false;
  return (
    <Tooltip
      title={field.comment}
      disableHoverListener={field.comment ? false : true}
      placement="top-start"
      disableFocusListener={field.comment ? false : true}
      disableTouchListener={field.comment ? false : true}
    >
      <TextField
        type="url"
        id={field.name}
        error={iserror}
        required={
          field.required === "true" || errors[field.name] === LBL_REQUIRED_FIELD
            ? true
            : false
        }
        name={field.name}
        variant="outlined"
        size={small ? "small" : "medium"}
        label={field.label}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        value={value}
        helperText={
          errors[field.name] && errors[field.name] !== "ReadOnly"
            ? errors[field.name]
            : null
        }
        disabled={errors[field.name] === "ReadOnly" ? true : false}
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        onCut={onCopy}
        onCopy={onCopy}
        onPaste={onCopy}
        onContextMenu={onCopy}
      />
    </Tooltip>
  );
}
