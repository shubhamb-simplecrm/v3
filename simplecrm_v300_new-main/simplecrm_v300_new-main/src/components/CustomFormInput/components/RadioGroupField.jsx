import React, { useMemo } from "react";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { PropTypes } from "prop-types";
import { isEmpty, isNil } from "ramda";
import { RadioGroup } from "@/components/SharedComponents/InputComponents";
const RadioGroupField = ({
  fieldMetaObj,
  onChange,
  value,
  fieldState,
  onBlur,
  size,
  variant,
}) => {
  const radioOptions = useMemo(() => {
    if (
      typeof fieldMetaObj?.options !== "object" ||
      isEmpty(fieldMetaObj?.options) ||
      isNil(fieldMetaObj?.options)
    )
      return [];
    return Object.entries(fieldMetaObj?.options).map(([key, value]) => {
      return (
        <FormControlLabel
          key={key}
          value={key}
          control={<Radio color="primary" disableRipple />}
          label={value}
          disabled={fieldState?.disabled}
        />
      );
    });
  }, [fieldMetaObj, fieldState]);
  return (
    <RadioGroup
      {...fieldState}
      name={fieldMetaObj?.name}
      tooltipTitle={fieldMetaObj?.comment}
      label={fieldMetaObj?.label}
      value={value || null}
      onChange={onChange}
      onBlur={onBlur}
      size={size}
      variant={variant}
      radioOptions={radioOptions}
    />
  );
};

RadioGroupField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

RadioGroupField.defaultProps = {
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

export default RadioGroupField;
