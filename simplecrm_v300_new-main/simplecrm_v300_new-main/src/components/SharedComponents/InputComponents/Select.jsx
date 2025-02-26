import React from "react";
import {
  FormControl,
  InputLabel,
  Select as MUISelect,
  FormHelperText,
} from "@material-ui/core";
import { PropTypes } from "prop-types";
import Tooltip from "../Tooltip";

const Select = ({
  required,
  variant,
  error,
  disabled,
  label,
  name,
  value,
  onChange,
  helperText,
  selectItems,
  size,
  fullWidth,
  tooltipTitle,
}) => {
  return (
    <Tooltip title={tooltipTitle || ""}>
      <FormControl
        variant={variant}
        disabled={disabled}
        size={size}
        fullWidth={fullWidth}
        required={required}
        error={error}
      >
        <InputLabel id={`${name}-label`} shrink>
          {label}
        </InputLabel>
        <MUISelect
          labelId={name}
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          label={label}
          error={error}
          required={required}
        >
          {selectItems}
        </MUISelect>
        <FormHelperText error={error}>{helperText}</FormHelperText>
      </FormControl>
    </Tooltip>
  );
};
Select.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  tooltipTitle: PropTypes.any,
  checked: PropTypes.any,
  helperText: PropTypes.string,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  small: PropTypes.bool,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
};
Select.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  variant: "outlined",
  tooltipTitle: "",
  small: true,
  selectItems: null,
  fullWidth: true,
  error: false,
  disabled: false,
  required: false,
};

export default Select;
