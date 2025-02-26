import React, { useMemo } from "react";
import { pathOr } from "ramda";
import { PropTypes } from "prop-types";
import { AutoComplete } from "@/components/SharedComponents/InputComponents";

const AutoCompleteEnumField = (props) => {
  const {
    fieldMetaObj,
    onChange,
    onBlur,
    value,
    variant,
    fieldState,
    size,
    fullWidth,
    customProps,
  } = props;

  const optionList = useMemo(
    () =>
      Object.entries(fieldMetaObj?.options || {}).map(([value, label]) => ({
        label,
        value,
      })),
    [fieldMetaObj?.options],
  );

  const inputValue = useMemo(() => {
    const option = optionList.find((option) => option.value == value);
    return option ? option.label : "";
  }, [optionList, value]);

  const onChangeInput = (event, selectedValue) => {
    onChange(
      typeof selectedValue === "object"
        ? selectedValue?.value || ""
        : selectedValue,
    );
  };
  return (
    <AutoComplete
      {...fieldState}
      tooltipTitle={fieldMetaObj?.comment}
      fullWidth={fullWidth}
      variant={variant}
      id={fieldMetaObj?.name}
      name={fieldMetaObj?.name}
      label={fieldMetaObj?.label}
      onBlur={onBlur}
      onChange={onChangeInput}
      options={optionList}
      value={inputValue}
      size={size}
      getOptionLabel={(option) =>
        typeof option === "object"
          ? option?.label?.toString() ?? ""
          : option?.toString() ?? ""
      }
      getOptionSelected={(option, value) => option.value === value}
      renderInput={(params) => {
        const customFieldParams = pathOr({}, ["field"], customProps);
        const tempParams = Object.entries(customFieldParams).reduce(
          (pV, [key, value]) => {
            const defaultParams = pathOr({}, [key], params);
            return {
              ...pV,
              [key]: {
                ...defaultParams,
                ...value,
              },
            };
          },
          {},
        );
        return { ...fieldState, ...tempParams };
      }}
    />
  );
};

AutoCompleteEnumField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.string,
  size: PropTypes.string,
  fullWidth: PropTypes.bool,
  fieldState: PropTypes.object,
  customProps: PropTypes.object,
};

AutoCompleteEnumField.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  size: "small",
  fullWidth: true,
  fieldState: {
    disabled: false,
    required: false,
    error: false,
    visible: true,
    helperText: null,
  },
  customProps: {},
};

export default AutoCompleteEnumField;
