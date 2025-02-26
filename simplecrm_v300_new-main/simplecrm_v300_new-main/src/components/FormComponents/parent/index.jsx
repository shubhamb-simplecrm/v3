import React, { useState } from "react";
import { isEmpty } from "ramda";
import { TextField, Grid, useTheme, Tooltip } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { FormInput } from "../../";
import { toast } from "react-toastify";
import { CustomPaper } from "../../../utils";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_RECORD_CREATED,
  LBL_REQUIRED_FIELD,
  LBL_SAVE_BUTTON_TITLE,
  NO_OPTION,
  SOMETHING_WENT_WRONG,
} from "../../../constant";

const Parent = (props) => {
  const {
    field,
    onChange,
    value = { parent_type: "", parent_name: "", parent_id: "" },
    errors = {},
    small = false,
    variant = "outlined",
    onCopy = null,
  } = props;
  const { options } = field;
  const [optionList, setOptionList] = useState([]);
  const theme = useTheme();
  let iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : null;

  const renderDropdown = () => {
    if (!isEmpty(options)) {
      let list = Object.keys(field.options);
      let listOfData = [];
      if (!isEmpty(list) && isEmpty(optionList)) {
        list.map((key, index) => {
          let newData = {
            label: field.options[key],
            value: key,
          };
          listOfData.push(newData);
        });
        setOptionList(listOfData);
      }
    }

    const onChangeInput = (selectedValue) => {
      let selectedData = {
        parent_id: "",
        parent_name: "",
        parent_type: selectedValue,
      };
      onChange(selectedData);
    };

    const onSelectInputData = (selectedValue) => {
      if (!isEmpty(value?.parent_type)) {
        let selectedData = {
          parent_id: "",
          parent_name: "",
          parent_type: selectedValue,
        };
        onChange(selectedData);
      }
      if (isEmpty(selectedValue) && !isEmpty(value?.parent_type)) {
        onChange("");
      }
    };

    return (
      <Tooltip
        title={field.comment || ""}
        disableHoverListener={field.comment ? false : true}
        placement="top-start"
        disableFocusListener={field.comment ? false : true}
        disableTouchListener={field.comment ? false : true}
      >
        <Autocomplete
          id={field.name}
          name={field.name}
          onChange={(event, value) => onChangeInput(value)}
          noOptionsText={isEmpty(options) ? "" : NO_OPTION}
          onInputChange={(event, newInputValue) => {
            onSelectInputData(newInputValue);
          }}
          disableClearable={!isEmpty(value?.parent_type) ? false : true}
          getOptionLabel={(option) => {
            let optionLabel = !isEmpty(optionList)
              ? optionList.filter((item) => item?.value === option)
              : "";
            return !isEmpty(optionLabel[0]?.label) ? optionLabel[0]?.label : "";
          }}
          freeSolo
          PaperComponent={CustomPaper}
          options={!isEmpty(options) ? Object.keys(options) : []}
          required={
            field.required === "true" ||
            errors[field.name] === LBL_REQUIRED_FIELD
              ? true
              : false
          }
          disabled={errors[field.name] === "ReadOnly" ? true : false}
          renderInput={(params) => {
            let selectedOptionData =
              !isEmpty(optionList) && !isEmpty(value)
                ? optionList.filter(
                    (item) => item?.value === value?.parent_type,
                  )
                : "";
            let optionLabel = !isEmpty(selectedOptionData[0]?.label)
              ? selectedOptionData[0]?.label
              : "";
            return (
              <TextField
                {...params}
                ref={params.InputProps.ref}
                variant={variant}
                inputProps={{
                  ...params.inputProps,
                  value: !isEmpty(optionLabel)
                    ? optionLabel
                    : value.parent_type
                      ? value.parent_type
                      : isEmpty(value)
                        ? ""
                        : params.inputProps.value,
                  style: {
                    padding: "1.7px",
                  },
                }}
                helperText={
                  errors[field.name] && errors[field.name] !== "ReadOnly"
                    ? errors[field.name]
                    : null
                }
                autoComplete="off"
                InputLabelProps={{
                  shrink: true,
                }}
                error={iserror}
                label={field.label}
                required={
                  field.required === "true" ||
                  errors[field.name] === LBL_REQUIRED_FIELD
                    ? true
                    : false
                }
                disabled={errors[field.name] === "ReadOnly" ? true : false}
                onCut={onCopy}
                onCopy={onCopy}
                onPaste={onCopy}
                onContextMenu={onCopy}
              />
            );
          }}
        />
      </Tooltip>
    );
  };

  return (
    <div style={{ display: "flex" }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={value && value.parent_type ? 6 : 12}
          md={value && value.parent_type ? 6 : 12}
          lg={value && value.parent_type ? 6 : 12}
        >
          {renderDropdown()}
        </Grid>
        {value && value.parent_type && (
          <Grid
            item
            xs={12}
            sm={value && value.parent_type ? 6 : 12}
            md={value && value.parent_type ? 6 : 12}
            lg={value && value.parent_type ? 6 : 12}
          >
            <Tooltip
              title={field.comment || ""}
              disableHoverListener={field.comment ? false : true}
              placement="top-start"
              disableFocusListener={field.comment ? false : true}
              disableTouchListener={field.comment ? false : true}
              style={{ marginTop: 10 }}
            >
              <FormInput
                comment=""
                field={{
                  ...field,
                  type: "relate",
                  parent: value.parent_type,
                  module: value.parent_type,
                }}
                value={{
                  id: value.parent_id ? value.parent_id : "",
                  value: value.parent_name ? value.parent_name : "",
                }}
                errors={errors}
                module={value.parent_type ? value.parent_type : ""}
                small={true}
                onChange={(val) =>
                  onChange({
                    parent_type: value.parent_type,
                    parent_id: val.id,
                    parent_name: val.value,
                  })
                }
                disabled={true}
                parent={true}
              />
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Parent;
