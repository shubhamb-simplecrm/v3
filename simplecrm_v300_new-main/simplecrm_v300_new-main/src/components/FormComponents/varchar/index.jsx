import React from "react";
import {
  MuiThemeProvider,
  TextField,
  Tooltip,
  useTheme,
} from "@material-ui/core";
import SuggestionName from "./suggestion/index";
import { pathOr } from "ramda";
import { LBL_REQUIRED_FIELD } from "../../../constant";
import { getMuiTheme } from "../reminders/styles";
const VarChar = ({
  initialValues = null,
  field,
  onChange,
  onBlur,
  errors = {},
  variant = "outlined",
  value,
  small = false,
  disabled = false,
  onCopy = null,
  fullWidth = true,
  autoComplete = true,
}) => {
  let iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : false;
  const currentTheme = useTheme();
  const isReadOnly = errors[field.name] === "ReadOnly" ? true : false;
  return (
    <>
      <Tooltip
        title={field.comment || ""}
        disableHoverListener={field.comment ? false : true}
        placement="top-start"
        disableFocusListener={field.comment ? false : true}
        disableTouchListener={field.comment ? false : true}
      >
        <TextField
          id={field.name}
          error={iserror}
          required={
            field.required === "true" ||
            errors[field.name] === LBL_REQUIRED_FIELD
              ? true
              : false
          }
          name={field.name}
          size={small ? "small" : "medium"}
          label={field.label}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          value={value}
          variant={variant}
          // placeholder={field.label}
          helperText={
            errors[field.name] && errors[field.name] !== "ReadOnly"
              ? errors[field.name]
              : null
          }
          fullWidth={fullWidth}
          // inputProps={{
          //   autoComplete: autoComplete ? "on" : "off",
          //   form: {
          //     autoComplete: autoComplete ? "on" : "off",
          //   },
          // }}
          InputLabelProps={{
            shrink: true,
          }}
          // onBlur={onBlur}
          disabled={
            errors[field.name] === "ReadOnly"
              ? true
              : isReadOnly
                ? true
                : !!disabled
          }
          onCut={onCopy}
          onCopy={onCopy}
          onPaste={onCopy}
          onContextMenu={onCopy}
          // disabled={true}
        />
      </Tooltip>
      {field.type === "name" ? (
        <SuggestionName
          initialValues={initialValues}
          onChange={onChange}
          onBlur={onBlur}
        />
      ) : null}
    </>
  );
};
export default VarChar;
