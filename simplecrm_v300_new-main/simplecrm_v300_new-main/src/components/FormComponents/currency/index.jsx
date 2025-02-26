import React from "react";
import { Tooltip, TextField, MenuItem } from "@material-ui/core";
import { LBL_REQUIRED_FIELD } from "../../../constant";

const Enum = ({
  field,
  onChange,
  onBlur,
  errors = {},
  value,
  small = false,
  onCopy = null,
}) => {
  let iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : false;
  const renderOptions = () => {
    let optionsToRender = [];
    for (let optionKey in field.options) {
      optionsToRender.push(
        <MenuItem key={optionKey} value={optionKey}>
          <span>{field.options[optionKey]}</span>
        </MenuItem>,
      );
    }
    return optionsToRender;
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
        select
        label={field.label}
        value={value ? value : " "}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        variant="outlined"
        fullWidth
        size={small ? "small" : "medium"}
        // disabled={true}
        disabled={errors[field.name] === "ReadOnly" ? true : false}
        helperText={
          errors[field.name] && errors[field.name] !== "ReadOnly"
            ? errors[field.name]
            : null
        }
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

export default Enum;
