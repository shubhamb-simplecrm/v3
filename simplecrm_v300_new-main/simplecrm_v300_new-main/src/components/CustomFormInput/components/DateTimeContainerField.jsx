import React from "react";
import { PropTypes } from "prop-types";
import { getDateObject } from "@/common/validations";
import useCommonUtils from "@/hooks/useCommonUtils";
import { textEllipsis } from "@/common/utils";
import { DateTimePicker } from "@/components/SharedComponents/InputComponents";
import { DatePicker } from "@/components/SharedComponents/InputComponents";
import { pathOr, isEmpty } from "ramda";
import { Grid } from "@material-ui/core";
import { DATE_RANGE_TYPE } from "@/constant/date-constants";
import CustomFormInput from "@/components/CustomFormInput";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";
import Tooltip from "@/components/SharedComponents/Tooltip";
import DateUtils from "@/common/date-utils";

const singleDateRange = ["=", "not_equal", "greater_than", "less_than"];

const DateTimeContainerField = (props) => {
  const { moduleMetaData } = props;
  return moduleMetaData?.view === LAYOUT_VIEW_TYPE.searchLayoutView ? (
    <DateSearchField {...props} />
  ) : (
    <DateTimeField {...props} />
  );
};

const DateTimeField = ({
  fieldMetaObj,
  onChange,
  value,
  variant,
  size,
  fieldState,
  moduleMetaData,
}) => {
  const { getParseDateTimeFormat } = useCommonUtils();
  const minutesStep = 1;
  const minDate = DateUtils.getDateObjByDateTimeInput(
    fieldMetaObj?.minDate,
    getParseDateTimeFormat,
  );
  const maxDate = DateUtils.getDateObjByDateTimeInput(
    fieldMetaObj?.maxDate,
    getParseDateTimeFormat,
  );
  // const minutesStep =
  //   moduleMetaData?.currentModule === "Meetings" &&
  //   (fieldMetaObj?.name === "date_start" || fieldMetaObj?.name === "date_end")
  //     ? 15
  //     : 1;

  const handleChange = (date, newDatef) => {
    if (date && date !== "Invalid Date") {
      const isDateValid = DateUtils.isDateValid(
        newDatef,
        getParseDateTimeFormat,
      );
      onChange(!!isDateValid ? newDatef : "");
    } else {
      onChange("");
    }
  };
  const getFieldValue = () => {
    const outputValue = DateUtils.getFormattedDateTime(
      value,
      getParseDateTimeFormat,
    );
    return outputValue;
  };
  return (
    <DateTimePicker
      {...fieldState}
      minDate={minDate}
      maxDate={maxDate}
      label={fieldMetaObj?.label}
      tooltipTitle={fieldMetaObj?.comment}
      name={fieldMetaObj?.name}
      value={getFieldValue()}
      size={size}
      onChange={handleChange}
      format={getParseDateTimeFormat}
      minutesStep={minutesStep}
      variant={variant}
    />
  );
};

const DateSearchField = (props) => {
  const {
    fieldMetaObj,
    onChange,
    value = {},
    size,
    fieldState,
    moduleMetaData,
  } = props;
  const { getCurrentFormattedDate, getParseDateFormat } = useCommonUtils();
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
    const outputValue =
      DateUtils.getFormattedDateTime(value[fieldName], getParseDateFormat) ??
      new Date();
    return outputValue;
  };

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
        key={fieldMetaObj?.field_key}
      >
        <CustomFormInput
          {...fieldState}
          fieldMetaObj={{
            ...fieldMetaObj,
            field_key: `${fieldMetaObj.name}_range_choice`,
            name: `${fieldMetaObj.name}_range_choice`,
            type: "enum",
          }}
          moduleMetaData={moduleMetaData}
          onChange={(value) => handleRangeFieldChange(fieldMetaObj, value)}
          size={size}
          value={rangeValue}
        />
      </Grid>
      {rangeValue != "between" &&
        singleDateRange.includes(rangeValue) &&
        !isEmpty(rangeValue) && (
          <Grid
            item
            xs={fieldMetaObj?.type === "currency" ? 12 : 6}
            md={fieldMetaObj?.type === "currency" ? 8 : 6}
            key={`range_${fieldMetaObj?.name}`}
          >
            <Tooltip title={fieldMetaObj?.label}>
              <DatePicker
                {...fieldState}
                label={fieldMetaObj?.label}
                tooltipTitle={fieldMetaObj?.comment}
                name={`range_${fieldMetaObj?.name}`}
                value={getFieldValue(`range_${fieldMetaObj?.name}`)}
                onChange={(dateValue, value) =>
                  handleDateFieldValueChange(
                    `range_${fieldMetaObj?.name}`,
                    dateValue,
                    value,
                  )
                }
                size={size}
                format={getParseDateFormat}
              />
            </Tooltip>
          </Grid>
        )}
      {rangeValue === "between" && !isEmpty(rangeValue) ? (
        <>
          <Grid item xs={6} md={6} key={`start_range_${fieldMetaObj?.name}`}>
            <Tooltip title={fieldMetaObj?.label}>
              <DatePicker
                {...fieldState}
                label={fieldMetaObj?.label}
                tooltipTitle={fieldMetaObj?.comment}
                name={`start_range_${fieldMetaObj?.name}`}
                value={getFieldValue(`start_range_${fieldMetaObj?.name}`)}
                size={size}
                onChange={(dateValue, value) =>
                  handleDateFieldValueChange(
                    `start_range_${fieldMetaObj?.name}`,
                    dateValue,
                    value,
                  )
                }
                format={getParseDateFormat}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={6} md={6} key={`end_range_${fieldMetaObj?.name}`}>
            <Tooltip title={fieldMetaObj?.label}>
              <DatePicker
                {...fieldState}
                label={fieldMetaObj?.label}
                tooltipTitle={fieldMetaObj?.comment}
                name={`end_range_${fieldMetaObj.name}`}
                value={getFieldValue(`end_range_${fieldMetaObj.name}`)}
                size={size}
                onChange={(dateValue, value) =>
                  handleDateFieldValueChange(
                    `end_range_${fieldMetaObj.name}`,
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

DateTimeContainerField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

DateTimeContainerField.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  variant: "outlined",
  size: "small",
  fieldState: {
    disabled: false,
    required: false,
    error: false,
    visible: true,
    helperText: null,
  },
  moduleMetaData: {},
  customProps: {},
};

export default DateTimeContainerField;
