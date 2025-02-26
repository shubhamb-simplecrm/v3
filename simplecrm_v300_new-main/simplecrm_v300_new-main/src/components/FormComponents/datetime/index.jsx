import React from "react";
import { pathOr, isEmpty } from "ramda";
import { LBL_REQUIRED_FIELD } from "../../../constant";
import { DateTimePicker } from "../../SharedComponents/DateTimePicker";
import useCommonUtils from "../../../hooks/useCommonUtils";
import DateUtils from "../../../common/date-utils";

const DateTime = ({
  field,
  onChange,
  errors = {},
  value,
  small = false,
  module,
}) => {
  const { getParseDateTimeFormat } = useCommonUtils();
  const errorMessage = pathOr("", [field?.name], errors);
  let iserror =
    !isEmpty(errorMessage) && errorMessage !== "ReadOnly" ? true : false;
  const isDisable = errorMessage === "ReadOnly" ? true : false;
  const minutesStep =
    module === "Meetings" &&
    (field.name === "date_start" || field.name === "date_end")
      ? 15
      : 1;
  const fieldFormattedValue = DateUtils.getFormattedDateTime(
    value,
    getParseDateTimeFormat,
  );
  const fieldHelperText = errorMessage !== "ReadOnly" ? errorMessage : null;
  let isRequired =
    field.required === "true" || errorMessage === LBL_REQUIRED_FIELD ? "*" : "";
  const handleChange = (date, newDatef) => {
    if (date && date !== "Invalid Date") {
      onChange(newDatef);
      delete errors[field.name];
    } else {
      onChange("");
      errors[field.name] = "Invalid Date";
    }
  };
  return (
    <DateTimePicker
      label={`${field.label} ${isRequired}`}
      name={field.name}
      iserror={iserror}
      value={fieldFormattedValue}
      helperText={fieldHelperText}
      isFieldSmall={small}
      onChange={handleChange}
      format={getParseDateTimeFormat}
      disabled={isDisable}
      minutesStep={minutesStep}
    />
  );
};

export default DateTime;
