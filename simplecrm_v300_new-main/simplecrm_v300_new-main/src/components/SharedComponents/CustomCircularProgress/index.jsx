import React from "react";
import PropTypes from "prop-types";
import { CircularProgress } from "@material-ui/core";

const CustomCircularProgress = ({
  size = 16,
  thickness = 5,
  className,
  style,
  variant = "indeterminate",
}) => {
  return (
    <CircularProgress
      size={size}
      thickness={thickness}
      className={className}
      style={style}
      variant={variant}
    />
  );
};
CustomCircularProgress.propTypes = {
  size: PropTypes.number.isRequired,
  thickness: PropTypes.number,
};

export default CustomCircularProgress;
