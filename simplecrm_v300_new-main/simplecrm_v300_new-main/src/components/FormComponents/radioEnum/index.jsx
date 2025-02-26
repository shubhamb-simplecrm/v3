import React, { useEffect, useState } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Tooltip, FormHelperText } from "@material-ui/core";
import { LBL_REQUIRED_FIELD } from "../../../constant";

const RadioEnum = ({
  field,
  onChange,
  errors = {},
  value,
  small = false,
  disabled = false,
  isRow = true,
}) => {
  const renderOptions = () => {
    let optionsToRender = [];
    for (let value in field.options) {
      if (value !== "") {
        optionsToRender.push(
          <FormControlLabel
            value={value}
            control={<Radio color="primary" disableRipple />}
            label={field.options[value]}
            style={{ color: "rgb(119,112,110)" }}
            disabled={errors[field.name] === "ReadOnly" ? true : !!disabled}
          />,
        );
      }
    }
    return optionsToRender;
  };

  return (
    <Tooltip
      title={field.comment}
      disableHoverListener={field.comment ? false : true}
      placement="top-start"
      disableFocusListener={field.comment ? false : true}
      disableTouchListener={field.comment ? false : true}
    >
      <FormControl component="fieldset">
        <FormLabel
          component="legend"
          style={{
            color:
              errors[field.name] && errors[field.name] !== "ReadOnly"
                ? "rgb(244,76,60)"
                : "rgb(119,112,110)",
          }}
        >
          {field.label}
          {field.required ||
          (errors[field.name] === LBL_REQUIRED_FIELD) === "true"
            ? "*"
            : ""}
        </FormLabel>
        <RadioGroup
          row={isRow}
          aria-label="position"
          name="position"
          defaultValue="top"
          value={value ? value : ""}
          disabled={errors[field.name] === "ReadOnly" ? true : !!disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          {renderOptions()}
        </RadioGroup>
        <FormHelperText
          style={{ color: "rgb(244,76,60)", paddingLeft: "13px" }}
        >
          {errors[field.name] && errors[field.name] !== "ReadOnly"
            ? errors[field.name]
            : null}
        </FormHelperText>
      </FormControl>
    </Tooltip>
  );
};

export default RadioEnum;
