import { useEffect } from "react";
import { Grid, Tooltip } from "@material-ui/core";
import { getDateObject } from "../../../common/validations";
import { FormInput } from "../..";
import { LBL_REQUIRED_FIELD } from "../../../constant";
import { pathOr, isEmpty } from "ramda";
import { DATE_RANGE_TYPE } from "../../../constant/date-constants";
import { DatePicker } from "../../SharedComponents/DatePicker";
import useCommonUtils from "../../../hooks/useCommonUtils";
import DateUtils from "@/common/date-utils";
const singleDateRange = ["=", "not_equal", "greater_than", "less_than"];
const DateSearch = (props) => {
  const {
    field,
    onChange,
    errors = {},
    value = {},
    small = false,
    view = "",
  } = props;
  const { getCurrentFormattedDate, getParseDateFormat } = useCommonUtils();
  const iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : false;
  const isRequired =
    field.required || (errors[field.name] === LBL_REQUIRED_FIELD) === "true"
      ? "*"
      : "";
  const rangeValue = pathOr("", ["range"], value);
  const handleRangeFieldChange = (field, value) => {
    const valueObj = {};
    valueObj[field.field_key] = value;
    valueObj["range"] = value;
    if (DATE_RANGE_TYPE?.singleField?.some((item) => item === value)) {
      valueObj[`${field.field_key}_range_choice`] = getCurrentFormattedDate;
    } else if (DATE_RANGE_TYPE?.doubleField?.some((item) => item === value)) {
      valueObj[`range_${field.field_key}`] = getCurrentFormattedDate;
    } else if (DATE_RANGE_TYPE?.tripleField?.some((item) => item === value)) {
      valueObj[`${field.field_key}_range_choice`] = getCurrentFormattedDate;
      valueObj[`range_${field.field_key}`] = getCurrentFormattedDate;
      valueObj[`start_range_${field.field_key}`] = getCurrentFormattedDate;
      valueObj[`end_range_${field.field_key}`] = getCurrentFormattedDate;
    } else if (!isEmpty(value)) {
      valueObj[`${field.field_key}_range_choice`] = "";
      valueObj[`range_${field.field_key}`] = "";
    } else {
      valueObj[`${field.field_key}_range_choice`] = getCurrentFormattedDate;
      valueObj[`range_${field.field_key}`] = getCurrentFormattedDate;
    }
    onChange(valueObj);
  };
  const handleDateFieldValueChange = (fieldName, dateValue, formattedValue) => {
    const valueObj = { ...value };
    if (dateValue != "Invalid Date") {
      valueObj[fieldName] = formattedValue;
    } else {
      valueObj[fieldName] = "";
    }
    onChange(valueObj);
  };
  const getFieldValue = (fieldName) => {
    const outputValue = DateUtils.getFormattedDateTime(
      value[fieldName],
      getParseDateFormat,
    );
    return outputValue;
    // const outputValue = value[fieldName]
    //   ? getDateObject(value[fieldName])
    //     ? getDateObject(value[fieldName])
    //     : new Date()
    //   : new Date();
    // return outputValue;
  };
  // useEffect(() => {
  //   if (typeof value === "string") {
  //     handleRangeFieldChange(field, value);
  //   }
  // }, []);

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={
          singleDateRange.includes(rangeValue) && !isEmpty(rangeValue) ? 6 : 12
        }
        md={
          singleDateRange.includes(rangeValue) && !isEmpty(rangeValue) ? 6 : 12
        }
        key={field.field_key}
      >
        <Tooltip
          title={field.comment || ""}
          disableHoverListener={field.comment ? false : true}
          placement="top-start"
          disableFocusListener={field.comment ? false : true}
          disableTouchListener={field.comment ? false : true}
        >
          <FormInput
            field={{
              ...field,
              field_key: `${field.name}_range_choice`,
              name: `${field.name}_range_choice`,
              type: "enum",
            }}
            view={view}
            onChange={(value) => handleRangeFieldChange(field, value)}
            small={small}
            value={rangeValue}
          />
        </Tooltip>
      </Grid>
      {rangeValue != "between" &&
        singleDateRange.includes(rangeValue) &&
        !isEmpty(rangeValue) && (
          <Grid
            item
            xs={field.type === "currency" ? 12 : 6}
            md={field.type === "currency" ? 8 : 6}
            key={`range_${field.name}`}
          >
            <Tooltip
              title={field.label + " " + isRequired || ""}
              disableHoverListener={
                field.label + " " + isRequired ? false : true
              }
              placement="top-start"
              disableFocusListener={
                field.label + " " + isRequired ? false : true
              }
              disableTouchListener={
                field.label + " " + isRequired ? false : true
              }
            >
              <DatePicker
                label={`${field.label} ${isRequired}`}
                name={`range_${field.name}`}
                iserror={iserror}
                value={getFieldValue(`range_${field.name}`)}
                helperText={pathOr("", [`range_${field.name}`], errors)}
                onChange={(dateValue, value) =>
                  handleDateFieldValueChange(
                    `range_${field.name}`,
                    dateValue,
                    value,
                  )
                }
                isFieldSmall={small}
                format={getParseDateFormat}
              />
            </Tooltip>
          </Grid>
        )}
      {rangeValue === "between" && !isEmpty(rangeValue) ? (
        <>
          <Grid item xs={6} md={6} key={`start_range_${field.name}`}>
            <Tooltip
              title={field.label + " " + isRequired || ""}
              disableHoverListener={
                field.label + " " + isRequired ? false : true
              }
              placement="top-start"
              disableFocusListener={
                field.label + " " + isRequired ? false : true
              }
              disableTouchListener={
                field.label + " " + isRequired ? false : true
              }
            >
              <DatePicker
                label={`${field.label} ${isRequired}`}
                name={`start_range_${field.name}`}
                iserror={iserror}
                value={getFieldValue(`start_range_${field.name}`)}
                helperText={pathOr("", [`start_range_${field.name}`], errors)}
                isFieldSmall={small}
                onChange={(dateValue, value) =>
                  handleDateFieldValueChange(
                    `start_range_${field.name}`,
                    dateValue,
                    value,
                  )
                }
                format={getParseDateFormat}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={6} md={6} key={`end_range_${field.name}`}>
            <Tooltip
              title={field.label + " " + isRequired || ""}
              disableHoverListener={
                field.label + " " + isRequired ? false : true
              }
              placement="top-start"
              disableFocusListener={
                field.label + " " + isRequired ? false : true
              }
              disableTouchListener={
                field.label + " " + isRequired ? false : true
              }
            >
              <DatePicker
                label={`${field.label} ${isRequired}`}
                name={`end_range_${field.name}`}
                iserror={iserror}
                value={getFieldValue(`end_range_${field.name}`)}
                helperText={pathOr("", [`end_range_${field.name}`], errors)}
                isFieldSmall={small}
                onChange={(dateValue, value) =>
                  handleDateFieldValueChange(
                    `end_range_${field.name}`,
                    dateValue,
                    value,
                  )
                }
                format={getParseDateFormat}
              />
            </Tooltip>
          </Grid>
        </>
      ) : null}
    </Grid>
  );
};
export default DateSearch;
