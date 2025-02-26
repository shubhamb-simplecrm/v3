import React from "react";
import { LBL_REQUIRED_FIELD } from "../../../constant";
import { DatePicker } from "../../SharedComponents/DatePicker";
import useCommonUtils from "../../../hooks/useCommonUtils";
import DateUtils from "../../../common/date-utils";

const DateField = ({
  field,
  onChange,
  onBlur,
  errors = {},
  value,
  small = false,
  disabled = false,
}) => {
  const { getParseDateFormat } = useCommonUtils();
  let iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : false;
  const fieldFormattedValue = DateUtils.getFormattedDateTime(value, getParseDateFormat)

  let isRequired =
    field.required === "true" || errors[field.name] === LBL_REQUIRED_FIELD
      ? "*"
      : "";

  const handleChange = (date, newDatef) => {
    if (date && date != "Invalid Date") {
      onChange(newDatef);
      delete errors[field.name];
    } else {
      onChange("");
      errors[field.name] = "Invalid Date";
    }
  };

  return (
    <DatePicker
      label={`${field.label} ${isRequired}`}
      name={field.name}
      iserror={iserror}
      value={fieldFormattedValue}
      helperText={
        errors[field.name] && errors[field.name] !== "ReadOnly"
          ? errors[field.name]
          : null
      }
      onChange={(date, newDatef) => handleChange(date, newDatef)}
      onBlur={(e) => onBlur(e.target.value)}
      isFieldSmall={small}
      format={getParseDateFormat}
      disabled={errors[field.name] === "ReadOnly" ? true : !!disabled}
    />
  );
};

export default DateField;
