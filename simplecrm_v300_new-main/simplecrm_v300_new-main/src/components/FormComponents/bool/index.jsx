import React from "react";
import useStyles from "./styles";
import { Checkbox, InputLabel, Tooltip } from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import { LBL_REQUIRED_FIELD } from "../../../constant";

export default function Bool({
  field,
  onChange,
  errors = {},
  small,
  value,
  disabled = false,
  displayLabel = true,
}) {
  const classes = useStyles();
  let iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : null;

  return (
    <>
      <div className={classes.wrapper}>
        {displayLabel && (
          <Tooltip title={field?.comment ?? ""} placement="top-start">
            <InputLabel>
              {field.label}
              {field.required === "true" ? " *" : ""}
            </InputLabel>
          </Tooltip>
        )}
        <Tooltip title={field?.comment ?? ""} placement="top-start">
          <Checkbox
            id={field.name}
            name={field.name}
            error={iserror}
            variant="outlined"
            size={small ? "small" : "medium"}
            // value={value}
            color="default"
            checked={value == 0 ? false : Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            // required={true}
            required={
              field.required === "true" ||
              errors[field.name] === LBL_REQUIRED_FIELD
                ? true
                : false
            }
            // helpertext={errors[field.name] && errors[field.name]!=='ReadOnly' ? errors[field.name] : null}
            disabled={errors[field.name] === "ReadOnly" ? true : !!disabled}
          />
        </Tooltip>
      </div>
      <FormHelperText className={classes.error}>
        {errors[field.name] && errors[field.name] !== "ReadOnly"
          ? errors[field.name]
          : null}
      </FormHelperText>
    </>
  );
}
