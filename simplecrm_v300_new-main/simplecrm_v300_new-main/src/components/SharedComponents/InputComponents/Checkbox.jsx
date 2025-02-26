import React from "react";
import {
  Checkbox as MuiCheckbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from "@material-ui/core";
import { PropTypes } from "prop-types";
import Tooltip from "../Tooltip";

const Checkbox = (props) => {
  const {
    required,
    variant,
    error,
    disabled,
    label,
    name,
    helperText,
    tooltipTitle,
  } = props;
  return (
    <Tooltip title={tooltipTitle || ""}>
      <FormControl
        required={required}
        error={error}
        disabled={disabled}
        variant={variant}
      >
        <FormGroup row>
          <FormControlLabel
            label={label}
            control={<MuiCheckbox {...props} id={name} color={"grey"} />}
          />
        </FormGroup>
        <FormHelperText error={error}>{helperText}</FormHelperText>
      </FormControl>
    </Tooltip>
  );
};

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  tooltipTitle: PropTypes.any,
  value: PropTypes.any,
  checked: PropTypes.any,
  helperText: PropTypes.string,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  small: PropTypes.bool,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};
Checkbox.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  variant: "outlined",
  tooltipTitle: "",
  small: true,
  error: false,
  disabled: false,
  required: false,
};

export default Checkbox;
