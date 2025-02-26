import React from "react";
import { PropTypes } from "prop-types";
import { TextField } from "@/components/SharedComponents/InputComponents";

export default function TextAreaField({
  fieldMetaObj,
  fieldState,
  onChange,
  onBlur,
  variant,
  value,
  size,
  multiline,
  fullWidth,
}) {
  return (
    <TextField
      {...fieldState}
      id={fieldMetaObj?.name}
      name={fieldMetaObj?.name}
      label={fieldMetaObj?.label}
      tooltipTitle={fieldMetaObj?.comment}
      size={size}
      variant={variant}
      value={value || ""}
      onChange={onChange}
      onBlur={onBlur}
      multiline={multiline}
      rows={fieldState?.rows || 5}
      fullWidth={fullWidth}
    />
  );
}
TextAreaField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  size: PropTypes.string,
  multiline: PropTypes.string,
  fullWidth: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

TextAreaField.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  variant: "outlined",
  size: "small",
  multiline: true,
  fullWidth: true,
  fieldState: {
    disabled: false,
    required: false,
    error: false,
    visible: true,
    helperText: null,
  },
  moduleMetaData: {},
  customProps: {},
};
