import React, { useMemo } from "react";
import { PropTypes } from "prop-types";
import { Select } from "@/components/SharedComponents/InputComponents";
import { MenuItem } from "@material-ui/core";

const EnumField = ({
  fieldMetaObj,
  onChange,
  onBlur,
  value,
  size,
  variant,
  fullWidth,
  fieldState,
}) => {
  const renderOptions = useMemo(() => {
    let optionsToRender = [];
    for (let optionKey in fieldMetaObj?.options) {
      optionsToRender.push(
        <MenuItem key={optionKey} value={optionKey}>
          <span>{fieldMetaObj?.options[optionKey]}</span>
        </MenuItem>,
      );
    }
    return optionsToRender;
  }, [fieldMetaObj]);

  return (
    <Select
      {...fieldState}
      tooltipTitle={fieldMetaObj?.comment}
      label={fieldMetaObj?.label}
      name={fieldMetaObj?.name}
      value={value}
      selectItems={renderOptions}
      onChange={onChange}
      onBlur={onBlur}
      size={size}
      fullWidth={fullWidth}
      variant={variant}
    />
  );
};

EnumField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

EnumField.defaultProps = {
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

export default EnumField;
