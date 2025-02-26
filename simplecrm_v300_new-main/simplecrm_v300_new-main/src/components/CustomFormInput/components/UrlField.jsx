import React from "react";
import { PropTypes } from "prop-types";
import { TextField } from "@/components/SharedComponents/InputComponents";
export default function UrlField({
  fieldMetaObj,
  fieldState,
  variant,
  onChange,
  onBlur,
  value,
  size,
}) {
  return (
    <TextField
      {...fieldState}
      name={fieldMetaObj.name}
      label={fieldMetaObj?.label}
      tooltipTitle={fieldMetaObj?.comment}
      type="url"
      variant={variant}
      size={size}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      inputProps={{
        ...(fieldMetaObj?.len && { maxLength: fieldMetaObj.len }),
      }}
    />
  );
}
UrlField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

UrlField.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  variant: "outlined",
  size: "small",
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
