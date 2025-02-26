import React from "react";
import { Checkbox } from "@/components/SharedComponents/InputComponents";
import { PropTypes } from "prop-types";

const BoolField = ({
  fieldMetaObj,
  value,
  onChange,
  onBlur,
  fieldState,
  size,
}) => {
  return (
    <Checkbox
      {...fieldState}
      tooltipTitle={fieldMetaObj?.comment}
      label={fieldMetaObj?.label}
      name={fieldMetaObj?.name}
      value={!!value}
      size={size}
      checked={!!value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

BoolField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

BoolField.defaultProps = {
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

export default BoolField;
