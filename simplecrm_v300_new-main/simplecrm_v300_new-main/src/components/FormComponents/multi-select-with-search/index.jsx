import React, { useEffect, useState } from "react";
import { Chip, Tooltip, TextField, useTheme } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { getMuiTheme } from "./styles";
import { CustomPaper } from "../../../utils";
import { LBL_REQUIRED_FIELD, PRIMARY, VARIANT } from "../../../constant";
import { isEmpty, pathOr } from "ramda";
import { useSelector } from "react-redux";

const MultiSelectWithSearch = (props) => {
  const {
    field,
    onChange,
    errors = {},
    helperText = "",
    value = [],
    small = false,
    variant = VARIANT,
    disabled = false,
    onCopy = null,
  } = props;
  const theme = useTheme();
  const fieldOptionArr = useSelector((state) => state.edit.enumFieldOption);
  let iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : false;
  let [optionList, setOptionList] = useState([]);
  let [fieldOptions, setFieldOptions] = useState(
    Object.keys(pathOr([], ["options"], field)),
  );

  let tempValue = [];
  if (value && Array.isArray(value) && value != "^^") {
    tempValue = value;
  } else if (typeof value == "string") {
    tempValue = value?.split(",");
  }

  const handleRenderTags = (value, getTagProps) => {
    if (tempValue.length == 0) {
      return;
    }
    return value.map((option, index) => {
      let optionLabel = !isEmpty(optionList)
        ? optionList.filter((item) => item?.value === option)
        : "";
      return (
        <Chip
          variant={variant}
          label={!isEmpty(optionLabel[0]?.label) ? optionLabel[0]?.label : ""}
          color={PRIMARY}
          {...getTagProps({ index })}
        />
      );
    });
  };

  useEffect(() => {
    if (fieldOptionArr.hasOwnProperty(field.name)) {
      if (!isEmpty(fieldOptionArr[field.name])) {
        let list = Object.keys(fieldOptionArr[field.name]);
        let listOfData = [];
        if (!isEmpty(list)) {
          list.map((key, index) => {
            let newData = {
              label: fieldOptionArr[field.name][key],
              value: key,
            };
            listOfData.push(newData);
          });
          setFieldOptions(fieldOptionArr[field.name]);
          setOptionList([...listOfData]);
        }
      } else {
        setFieldOptions([]);
        setOptionList([]);
      }
    }
  }, [fieldOptionArr]);

  useEffect(() => {
    if (!isEmpty(field?.options)) {
      let list = Object.keys(field.options);
      let listOfData = [];
      if (!isEmpty(list)) {
        list.map((key, index) => {
          let newData = {
            label: field.options[key],
            value: key,
          };
          listOfData.push(newData);
        });
        setFieldOptions(pathOr([], ["options"], field));
        setOptionList(listOfData);
      }
    }
  }, [field]);
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Tooltip
        title={field.comment || ""}
        disableHoverListener={field.comment ? false : true}
        placement="top-start"
        disableFocusListener={field.comment ? false : true}
        disableTouchListener={field.comment ? false : true}
      >
        <Autocomplete
          disabled={errors[field.name] === "ReadOnly" ? true : !!disabled}
          allowEmpty={false}
          multiple
          disableCloseOnSelect={true}
          id={field.name}
          name={field.name}
          size={small ? "small" : "medium"}
          error={iserror}
          value={
            value && value != "^^"
              ? typeof value === "string"
                ? value.split(",")
                : value
              : []
          }
          required={field.required === "true" ? true : false}
          onChange={(event, inputValue) => {
            onChange(inputValue);
          }}
          options={Object.keys(fieldOptions)}
          getOptionLabel={(option) => {
            let optionLabel = !isEmpty(optionList)
              ? optionList.filter((item) => item?.value === option)
              : "";
            return !isEmpty(optionLabel[0]?.label) ? optionLabel[0]?.label : "";
          }}
          // defaultValue={
          //   value && Array.isArray(value) && value != "^^" ? value : value.split(",")
          // }
          PaperComponent={CustomPaper}
          // helperText={helperText !== "" ? helperText : errors[field.name] ? errors[field.name] : null}
          renderTags={(value, getTagProps) =>
            handleRenderTags(value, getTagProps)
          }
          renderInput={(params) => (
            <TextField
              error={iserror}
              required={
                field.required === "true" ||
                errors[field.name] === LBL_REQUIRED_FIELD
                  ? true
                  : false
              }
              helperText={
                errors[field.name] && errors[field.name] !== "ReadOnly"
                  ? errors[field.name]
                  : null
              }
              {...params}
              variant={variant}
              label={field.label}
              onCut={onCopy}
              onCopy={onCopy}
              onPaste={onCopy}
              onContextMenu={onCopy}
            />
          )}
        />
      </Tooltip>
    </MuiThemeProvider>
  );
};

export default MultiSelectWithSearch;
