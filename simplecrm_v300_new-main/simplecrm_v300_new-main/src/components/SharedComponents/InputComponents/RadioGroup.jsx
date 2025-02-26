import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  RadioGroup as MUIRadioGroup,
} from "@material-ui/core";
import { PropTypes } from "prop-types";
import Tooltip from "../Tooltip";

const RadioGroup = ({
  name,
  label,
  disabled,
  required,
  error,
  size,
  helperText,
  onBlur,
  onChange,
  value,
  row,
  variant,
  fullWidth,
  radioOptions,
  tooltipTitle,
}) => {
  return (
    <FormControl
      disabled={disabled}
      required={required}
      error={error}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      name={name}
    >
      <Tooltip title={tooltipTitle}>
        <>
          <InputLabel shrink>{label}</InputLabel>
          <MUIRadioGroup
            row={row}
            aria-label={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          >
            {radioOptions}
          </MUIRadioGroup>
        </>
      </Tooltip>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
};
RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  row: PropTypes.bool,
  value: PropTypes.any,
  tooltipTitle: PropTypes.any,
  helperText: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.string,
  size: PropTypes.string,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  radioOptions: PropTypes.node,
};

RadioGroup.defaultProps = {
  variant: "outlined",
  size: "small",
  tooltipTitle: "",
  error: false,
  disabled: false,
  required: false,
  fullWidth: true,
  row: true,
  radioOptions: null,
};
export default RadioGroup;
