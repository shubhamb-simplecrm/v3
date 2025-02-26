import React, { useState, useEffect } from "react";
import { Box, Grid } from "@material-ui/core";
import CustomFormInput from "..";
import { pathOr } from "ramda";
import dayjs from "dayjs";
import useCommonUtils from "@/hooks/useCommonUtils";
import { removeFieldHiddenValueRepeatCalendar } from "@/common/utils";
export default function RepeatCalenderEvents({
  fieldMetaObj,
  onChange,
  customProps,
  ...rest
}) {
  const [fieldInitialValue, setFieldInitialValue] = useState({});
  const [hiddenField, setHiddenField] = useState([]);
  const { getParseDateFormat } = useCommonUtils();
  const fieldArr = pathOr([], ["data"], fieldMetaObj);
  let dateStarted = pathOr("", ["formValues", "date_start"], customProps);
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
  }, [fieldMetaObj]);

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
      <Grid xs={12} md={6} key={`${field.field_key}-${fieldKey}`}>
        <Box flexDirection={"row"} mb={1}>
          <CustomFormInput
            fullWidth={false}
            {...rest}
            control={null}
            key={field.field_key}
            fieldMetaObj={{
              ...field,
              label: `${field?.label}${customLabel ? ` - ${customLabel}` : ""}`,
            }}
            value={fieldInitialValue[field.field_key] || ""}
            onChange={(val) => handleOnChange(field, val)}
          />
        </Box>
      </Grid>
    );
  };
  return (
    <Grid container direction="column">
      {fieldArr.map((field, fieldKey) => renderFormInput(field, fieldKey))}
    </Grid>
  );
}
