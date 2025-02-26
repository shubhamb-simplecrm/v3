import React, { useMemo } from "react";
import { isNil, pathOr } from "ramda";
import { isEmpty } from "ramda";
import { PropTypes } from "prop-types";
import { AutoComplete } from "@/components/SharedComponents/InputComponents";

const DynamicEnumField = ({
  fieldMetaObj,
  onChange,
  value,
  small,
  customProps,
  fieldState,
  size,
  variant,
}) => {
  const parentEnumValue = pathOr(
    "",
    ["formValues", fieldMetaObj?.parentenum],
    customProps,
  );
  const optionList = useMemo(() => {
    const listOfData = [];
    if (
      !isEmpty(fieldMetaObj?.options) &&
      typeof fieldMetaObj?.options == "object" &&
      !isNil(fieldMetaObj?.options)
    ) {
      Object.entries(fieldMetaObj?.options).map(([key, value]) => {
        if (parentEnumValue !== "" && key.startsWith(`${parentEnumValue}_`)) {
          listOfData.push({ label: value, value: key });
        }
      });
    }
    return listOfData;
  }, [fieldMetaObj, customProps]);

  const inputValue = useMemo(() => {
    let tempValue = "";
    if (!isEmpty(optionList) && !isEmpty(value)) {
      optionList.forEach((item) => {
        if (item?.value?.toString() === value) {
          tempValue = item?.label.toString();
        }
      });
    }
    return tempValue;
  }, [optionList, value]);

  const onChangeInput = (event, selectedValue) => {
    if (typeof selectedValue == "object") {
      onChange(selectedValue?.value);
    } else {
      onChange(selectedValue);
    }
  };

  return (
    <AutoComplete
      {...fieldState}
      variant={variant}
      id={fieldMetaObj?.name}
      name={fieldMetaObj?.name}
      label={fieldMetaObj?.label}
      tooltipTitle={fieldMetaObj?.comment}
      // onBlur={onBlur}
      onChange={onChangeInput}
      options={optionList}
      value={inputValue}
      size={size}
      getOptionLabel={(option) =>
        typeof option === "object" ? option?.label : option
      }
    />
  );
};

DynamicEnumField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.string,
  small: PropTypes.bool,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

DynamicEnumField.defaultProps = {
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

export default DynamicEnumField;
