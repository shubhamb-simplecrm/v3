import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { FormInput } from "../..";
import { pathOr } from "ramda";
import { removeFieldHiddenValueRepeatCalendar } from "../../../common/utils";
import dayjs from "dayjs";
import useCommonUtils from "../../../hooks/useCommonUtils";
export default function RepeatCalenderEvents({
  field,
  onChange,
  errors = {},
  variant = "outlined",
  value,
  small = false,
  onBlur,
  disabled = false,
  view = "",
  quickCreate = false,
  module,
  initialValues,
}) {
  const [fieldInitialValue, setFieldInitialValue] = useState({});
  const [hiddenField, setHiddenField] = useState([]);
  const { getParseDateFormat } = useCommonUtils();
  const fieldArr = pathOr([], ["data"], field);
  let dateStarted = pathOr("", ["date_start"], initialValues);
  dateStarted = dayjs(dateStarted.split(" ")[0], getParseDateFormat)
    .add(1, "months")
    .format(getParseDateFormat);

  useEffect(() => {
    fieldArr.map((field) => {
      fieldInitialValue[field.field_key] = field.value;
    });
    const hiddenAndFilterValuesObj = removeFieldHiddenValueRepeatCalendar(
      fieldInitialValue,
      dateStarted,
    );
    setFieldInitialValue(hiddenAndFilterValuesObj.filteredValues);
    setHiddenField(hiddenAndFilterValuesObj.hiddenFieldsArr);
  }, [field]);

  const handleOnChange = (field, value) => {
    if (field.field_key == "repeat_dow") {
      // for sort values for repeat dow field
      let checkedValues = value.split(",").filter((n) => n);
      checkedValues.sort();
      fieldInitialValue[field.field_key] = checkedValues.toString();
    } else {
      fieldInitialValue[field.field_key] = value;
    }
    const hiddenAndFilterValuesObj = removeFieldHiddenValueRepeatCalendar(
      fieldInitialValue,
      dateStarted,
    );
    setHiddenField(hiddenAndFilterValuesObj.hiddenFieldsArr);
    setFieldInitialValue(hiddenAndFilterValuesObj.filteredValues);
    onChange(hiddenAndFilterValuesObj.filteredValues);
  };
  const getCustomLabel = (field) => {
    if (field.field_key == "repeat_interval") {
      const repeatType = pathOr("", ["repeat_type"], fieldInitialValue);
      if (repeatType == "Daily") return "Day(s)";
      if (repeatType == "Weekly") return "Week(s)";
      if (repeatType == "Monthly") return "Month(s)";
      if (repeatType == "Yearly") return "Year(s)";
      return null;
    } else if (field.field_key == "repeat_count") {
      return "Recurrences";
    }
    return null;
  };
  const renderFormInput = (field, fieldKey) => {
    if (hiddenField.includes(field.field_key)) return <></>;
    let customLabel = getCustomLabel(field);
    return (
      <Grid item sm={12} xs={12} key={`${field.field_key}-${fieldKey}`}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={customLabel ? 9 : 12}>
            <FormInput
              field={field}
              key={field.field_key}
              value={fieldInitialValue[field.field_key] || ""}
              small={true}
              module={module}
              onChange={(val) => handleOnChange(field, val)}
            />
          </Grid>
          <Grid item xs={3} style={{ paddingLeft: 5 }}>
            {customLabel}
          </Grid>
        </Grid>
      </Grid>
    );
  };
  return (
    <Grid item md={6}>
      <Grid container spacing={2} xs={12}>
        {fieldArr.map((field, fieldKey) => renderFormInput(field, fieldKey))}
      </Grid>
    </Grid>
  );
}
