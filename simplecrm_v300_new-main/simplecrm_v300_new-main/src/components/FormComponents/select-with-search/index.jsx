import React, { useEffect, useState } from "react";
import { isEmpty } from "ramda";
import { TextField, Tooltip, useTheme } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { CustomPaper } from "../../../utils";
import { LBL_REQUIRED_FIELD, NO_OPTION, VARIANT } from "../../../constant";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { getMuiTheme } from "./styles";
import { isNil } from "ramda";
const SelectAndSearchDropdwonComponent = (props) => {
  const {
    field,
    onChange,
    onBlur,
    errors = {},
    value,
    helperText = "",
    variant = VARIANT,
    disabled,
    onCopy = null,
  } = props;
  const { options } = field;
  let iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : false;
  const theme = useTheme();
  const [optionList, setOptionList] = useState([]);

  const onChangeInput = (selectedValue) => {
    onChange(selectedValue);
  };
  const onBlurInput = (selectedValue) => {
    onBlur(selectedValue);
  };

  const onSelectInputData = (selectedValue) => {
    if (!isEmpty(value)) {
      onChange(selectedValue);
    } else if (isEmpty(selectedValue) && !isEmpty(value)) {
      onChange("");
    }
  };
  useEffect(() => {
    if (!isNil(options) && !isEmpty(options)) {
      let list = Object.keys(options);
      let listOfData = [];
      list.map((key, index) => {
        let newData = {
          label: options[key],
          value: key,
        };
        listOfData.push(newData);
      });
      setOptionList(listOfData);
    }
  }, [options]);

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
          //disablePortal
          id={field.name}
          name={field.name}
          onChange={(event, value) => onChangeInput(value)}
          onBlur={(event, value) => onBlurInput(value)}
          noOptionsText={isEmpty(options) ? "" : NO_OPTION}
          getOptionLabel={(option) => {
            let optionLabel = !isEmpty(optionList)
              ? optionList.filter(
                  (item) => item?.value?.toString() === option?.toString(),
                )
              : "";
            return !isEmpty(optionLabel[0]?.label?.toString())
              ? optionLabel[0]?.label?.toString()
              : "";
          }}
          disabled={errors[field.name] === "ReadOnly" ? true : !!disabled}
          PaperComponent={CustomPaper}
          options={
            !isEmpty(options)
              ? Object.keys(options).includes("")
                ? Object.keys(options).filter((item) => item !== "")
                : Object.keys(options)
              : []
          }
          error={iserror}
          renderInput={(params) => {
            let selectedOptionData =
              !isEmpty(optionList) && !isEmpty(value)
                ? optionList.filter(
                    (item) => item?.value?.toString() === value?.toString(),
                  )
                : "";
            let optionLabel = !isEmpty(selectedOptionData[0]?.label?.toString())
              ? selectedOptionData[0]?.label?.toString()
              : "";
            return (
              <TextField
                {...params}
                ref={params.InputProps.ref}
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  value: !isEmpty(optionLabel)
                    ? optionLabel?.toString()
                    : params.inputProps.value.toString(),
                  readOnly: errors[field.name] === "ReadOnly" ? true : false,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={errors[field.name] === "ReadOnly" ? true : !!disabled}
                required={
                  field.required === "true" ||
                  errors[field.name] === LBL_REQUIRED_FIELD
                    ? true
                    : false
                }
                error={iserror}
                helperText={
                  helperText !== ""
                    ? helperText
                    : errors[field.name] && errors[field.name] !== "ReadOnly"
                      ? errors[field.name]
                      : null
                }
                label={field.label}
                onCut={onCopy}
                onCopy={onCopy}
                onPaste={onCopy}
                onContextMenu={onCopy}
              />
            );
          }}
        />
      </Tooltip>
    </MuiThemeProvider>
  );
};

export default SelectAndSearchDropdwonComponent;
