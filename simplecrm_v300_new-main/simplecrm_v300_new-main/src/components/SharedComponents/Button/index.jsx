import React from "react";
import PropTypes from "prop-types";
import { Button as MUIButton } from "@material-ui/core";

export const Button = ({
  label,
  onClick,
  startIcon = null,
  className = null,
  variant = "contained",
  color = "primary",
  size = "small",
  type = "button",
  disabled = false,
  fullWidth = false,
  style = {},
}) => {
  return (
    <MUIButton
      style={style}
      type={type}
      variant={variant}
      color={color}
      size={size}
      className={className}
      startIcon={startIcon}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
    >
      {label}
    </MUIButton>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
};
