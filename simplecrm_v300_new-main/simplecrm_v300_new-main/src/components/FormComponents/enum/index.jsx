import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Tooltip,
  MuiThemeProvider,
  useTheme,
} from "@material-ui/core";
import { LBL_REQUIRED_FIELD } from "../../../constant";
import { getMuiTheme } from "./styles";
const Enum = ({
  field,
  onChange,
  errors = {},
  onBlur,
  value,
  small = false,
  helperText = "",
  variant = "outlined",
  fullWidth = true,
  onCopy = null,
}) => {
  const theme = useTheme();
  let iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : false;
  const [displayTooltip, setDisplayTooltip] = useState(false);
  const renderOptions = () => {
    let optionsToRender = [];
    for (let optionKey in field?.options ?? {}) {
      optionsToRender.push(
        <MenuItem
          key={optionKey}
          onMouseEnter={() => handleTooltipVisibilty(false)}
          value={optionKey}
        >
          <span>{field.options[optionKey]}</span>
        </MenuItem>,
      );
    }
    return optionsToRender;
  };
  const handleTooltipVisibilty = (state) => {
    setDisplayTooltip(state);
  };
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Tooltip
        title={field.comment || ""}
        placement="top-start"
        open={displayTooltip}
      >
        <TextField
          id={field.name}
          name={field.name}
          error={iserror}
          required={
            field.required === "true" ||
            errors[field.name] === LBL_REQUIRED_FIELD
              ? true
              : false
          }
          onMouseEnter={() => handleTooltipVisibilty(true)}
          onMouseLeave={() => handleTooltipVisibilty(false)}
          onMouseClick={() => handleTooltipVisibilty(false)}
          select
          label={field.label}
          value={value ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          variant={variant}
          fullWidth={fullWidth}
          size={small ? "small" : "medium"}
          helperText={
            helperText !== ""
              ? helperText
              : errors[field.name] && errors[field.name] !== "ReadOnly"
                ? errors[field.name]
                : null
          }
          disabled={
            errors[field.name] === "ReadOnly" || field.disabled ? true : false
          }
          onCut={onCopy}
          onCopy={onCopy}
          onPaste={onCopy}
          onContextMenu={onCopy}
          InputLabelProps={{
            shrink: true,
          }}
        >
          {renderOptions()}
        </TextField>
      </Tooltip>
    </MuiThemeProvider>
  );
};

export default Enum;
