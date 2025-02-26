import React, { useCallback, useMemo } from "react";
import { Chip } from "@material-ui/core";
import { PRIMARY, VARIANT } from "@/constant";
import { isNil, pathOr, isEmpty } from "ramda";
import { PropTypes } from "prop-types";
import { AutoComplete } from "@/components/SharedComponents/InputComponents";

const AutoCompleteMultiEnumField = (props) => {
  const {
    fieldMetaObj,
    fieldState,
    onChange,
    onBlur,
    value = [],
    size,
    variant,
    customProps,
  } = props;
  const inputValue = useMemo(() => {
    return Array.isArray(value)
      ? value
      : value && value !== "^^"
        ? value.split(",")
        : [];
  }, [value]);
  const optionList = useMemo(() => {
    const tempOptionList = [];
    const fieldOptions = pathOr({}, ["options"], fieldMetaObj);
    if (typeof fieldOptions == "object" && !isEmpty(fieldOptions)) {
      Object.entries(fieldOptions).forEach(([key, v]) => {
        tempOptionList.push({
          label: v,
          value: key,
        });
      });
    }
    return tempOptionList;
  }, [fieldMetaObj]);

  const handleRenderTags = useCallback(
    (selectedValues, getTagProps) => {
      const fieldOptions = pathOr({}, ["options"], fieldMetaObj);
      return selectedValues?.map((v, index) => {
        let optionLabel = null;
        if (typeof v == "object") {
          optionLabel = pathOr(null, ["label"], v);
        } else {
          optionLabel = pathOr(null, [v], fieldOptions);
        }
        if (isNil(optionLabel)) {
          return null;
        }
        return (
          <Chip
            style={{ height: "inherit" }}
            variant={variant}
            label={optionLabel}
            color={PRIMARY}
            {...getTagProps({ index })}
          />
        );
      });
    },
    [fieldMetaObj],
  );

  const handleChangeInput = useCallback(
    (event, selectedValue) => {
      const filteredValues = selectedValue
        .map((v) => (typeof v === "object" ? v?.value : v))
        .filter((v) => !isNil(v));
      onChange(filteredValues);
    },
    [onChange],
  );
  return (
    <AutoComplete
      {...fieldState}
      tooltipTitle={fieldMetaObj?.comment}
      disableCloseOnSelect
      filterSelectedOptions
      size={size}
      multiple
      variant={variant}
      id={fieldMetaObj?.name}
      name={fieldMetaObj?.name}
      label={fieldMetaObj?.label}
      onBlur={onBlur}
      onChange={handleChangeInput}
      renderTags={handleRenderTags}
      options={optionList}
      value={inputValue}
      getOptionLabel={(option) =>
        typeof option === "object" ? option?.label : option
      }
      getOptionSelected={(option, value) => option.value == value}
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

AutoCompleteMultiEnumField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

AutoCompleteMultiEnumField.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  variant: VARIANT,
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
export default AutoCompleteMultiEnumField;
