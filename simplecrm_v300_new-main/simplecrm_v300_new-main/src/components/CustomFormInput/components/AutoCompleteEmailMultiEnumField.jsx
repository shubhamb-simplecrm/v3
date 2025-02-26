import React, { useCallback, useMemo, useState } from "react";
import { Avatar, Chip, Typography } from "@material-ui/core";
import { LBL_DUPLICATE_EMAIL, LBL_VALID_EMAIL, VARIANT } from "@/constant";
import { isNil, pathOr, isEmpty, clone } from "ramda";
import { PropTypes } from "prop-types";
import { AutoComplete } from "@/components/SharedComponents/InputComponents";
import { getFirstAlphabet, stringToColor } from "@/common/utils";
import { createFilterOptions } from "@material-ui/lab";
import { toast } from "react-toastify";
import useComposeViewData from "@/components/ComposeEmail/hooks/useComposeViewData";
import useStyles from "./styles";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import clsx from "clsx";

const filter = createFilterOptions();
const tagLimit = 3;

const AutoCompleteEmailMultiEnumField = (props) => {
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
  const classes = useStyles();
  const isMobile = useIsMobileView();
  const { actions } = useComposeViewData((state) => ({
    actions: state.actions,
  }));
  const [fieldOptions, setFieldOptions] = useState(() => {
    if (isEmpty(fieldMetaObj?.options)) return [];
    let options = [];
    Object.entries(fieldMetaObj?.options).map(([option, label]) => {
      options.push({
        label,
        module: "Emails",
        value: option,
      });
    });
    return options;
  });
  const [showAllEmails, setShowAllEmails] = useState(false);
  const [inputValueObj, setInputValueObj] = useState(fieldMetaObj?.options);

  let inputValue = useMemo(() => {
    return Array.isArray(value) ? value : [];
  }, [value]);

  const removeEmailChip = (email) => {
    inputValue = inputValue.filter((v) => v != email);
    onChange({ value: inputValue, options: inputValueObj });
  };
  const renderChip = (data, index, getTagProps) => {
    let optionLabel = pathOr(null, [data], inputValueObj);
    if (isNil(optionLabel)) {
      return null;
    }
    return (
      <Chip
        {...getTagProps({ index })}
        size="small"
        className={classes.emailChip}
        label={
          <Typography
          className={clsx(classes.emailChipLabelStyle, {
            [classes.emailChipMobile]: isMobile, 
          })}
            variant="subtitle2"
          >
            {optionLabel}
          </Typography>
        }
        onDelete={() => removeEmailChip(data)}
        avatar={
          <Avatar
            style={{
              backgroundColor: stringToColor(optionLabel),
              color: "#ffffff",
            }}
            className={classes.emailAvatar}
          >
            {getFirstAlphabet(optionLabel)}
          </Avatar>
        }
      />
    );
  };
  const handleRenderTags = useCallback(
    (selectedValues, getTagProps) => {
      return (
        <div className={classes.emailTagsContainer}>
          {showAllEmails ? (
            selectedValues?.map((v, index) => {
              return renderChip(v, index, getTagProps);
            })
          ) : (
            <>
              {selectedValues?.map((v, index) => {
                if (index >= tagLimit) {
                  return null;
                }
                return renderChip(v, index, getTagProps);
              })}
              {selectedValues.length > tagLimit ? (
                <div className={classes.emailMore}>
                  {`+${selectedValues.length - tagLimit}more `}
                </div>
              ) : null}
            </>
          )}
        </div>
      );
    },
    [inputValueObj, showAllEmails],
  );

  const handleChangeInput = useCallback(
    (event, selectedValue) => {
      let tempObj = clone(inputValueObj);
      let duplicateOption = false;
      const filteredValues = selectedValue
        .map((v) => {
          if (typeof v === "object") {
            if (v.label.startsWith('Select "')) {
              const emailPattern =
                /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
              if (emailPattern.test(v?.value)) {
                fieldMetaObj["options"][v.value] = v.value;
                tempObj[v?.value] = v?.value;
                if (inputValue.includes(v?.value)) {
                  toast(LBL_DUPLICATE_EMAIL);
                  return;
                }
                return v?.value;
              } else {
                toast(LBL_VALID_EMAIL);
                return;
              }
            }
            tempObj[v?.value] = v?.label;
            return v?.value;
          } else {
            if (
              inputValue.includes(selectedValue[selectedValue.length - 1]) &&
              !duplicateOption &&
              event.key != "Backspace"
            ) {
              toast(LBL_DUPLICATE_EMAIL);
              duplicateOption = true;
              return;
            }
            return v;
          }
        })
        ?.filter((v) => !isNil(v));

      setInputValueObj({ ...tempObj });

      actions.updateFieldOptions("", fieldMetaObj);

      onChange({ value: filteredValues, options: { ...tempObj } });
    },
    [onChange],
  );

  const handleInputChange = (_, newInputValue) => {
    if (newInputValue.length > 3) {
      actions
        .updateFieldOptions(newInputValue, fieldMetaObj)
        .then((options) => {
          setFieldOptions([...options]);
        });
    }
  };

  const emailField = useMemo(
    () => (
      <AutoComplete
        {...fieldState}
        tooltipTitle={fieldMetaObj?.comment}
        filterSelectedOptions
        size={size}
        disableClearable={false}
        disableCloseOnSelect
        multiple
        getOptionDisabled={(option) =>
          !!inputValue.find((element) => element === option)
        }
        onFocus={() => setShowAllEmails(true)}
        onBlur={() => {
          onBlur();
          setShowAllEmails(false);
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          // Adding new options
          if (
            params.inputValue !== "" &&
            !inputValue.includes(params.inputValue)
          ) {
            filtered.push({
              value: params.inputValue,
              label: `Select "${params.inputValue}"`,
              module: `Emails`,
            });
          }
          return filtered;
        }}
        freeSolo
        variant={variant}
        id={fieldMetaObj?.name}
        name={fieldMetaObj?.name}
        label={fieldMetaObj?.label}
        onChange={handleChangeInput}
        onKeyPress={(event, selectedValue) => {
          if (event.key == "Enter") {
            handleChangeInput(event, selectedValue);
          }
        }}
        renderTags={handleRenderTags}
        options={isEmpty(fieldOptions) ? [] : fieldOptions}
        value={inputValue}
        getOptionLabel={(option) => {
          if (option.inputValue) {
            return option.inputValue;
          }
          return option?.label;
        }}
        onInputChange={handleInputChange}
        groupBy={(option) => option.module}
        getOptionSelected={(option, value) => {
          return option.value == value;
        }}
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
    ),
    [fieldOptions, inputValue, showAllEmails],
  );
  return emailField;
};

AutoCompleteEmailMultiEnumField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

AutoCompleteEmailMultiEnumField.defaultProps = {
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
export default AutoCompleteEmailMultiEnumField;
