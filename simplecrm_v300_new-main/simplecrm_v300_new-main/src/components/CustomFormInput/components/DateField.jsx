import React from "react";
import { PropTypes } from "prop-types";
import useCommonUtils from "@/hooks/useCommonUtils";
import { textEllipsis } from "@/common/utils";
import { DatePicker } from "@/components/SharedComponents/InputComponents";
import DateUtils from "@/common/date-utils";

const DateField = ({
  fieldMetaObj,
  value,
  onChange,
  size,
  fieldState,
  variant,
}) => {
  const { getParseDateFormat } = useCommonUtils();
  const minDate = DateUtils.getDateObjByDateTimeInput(
    fieldMetaObj?.minDate,
    getParseDateFormat,
  );
  const maxDate = DateUtils.getDateObjByDateTimeInput(
    fieldMetaObj?.maxDate,
    getParseDateFormat,
  );
  const handleChange = (date, newDatef) => {
    if (date && date != "Invalid Date") {
      const isDateValid = DateUtils.isDateValid(newDatef, getParseDateFormat);
      onChange(!!isDateValid ? newDatef : "");
    } else {
      onChange("");
    }
  };
  const getFieldValue = () => {
    const outputValue = DateUtils.getFormattedDateTime(
      value,
      getParseDateFormat,
    );
    return outputValue;
  };
  return (
    <DatePicker
      {...fieldState}
      minDate={minDate}
      maxDate={maxDate}
      label={fieldMetaObj?.label}
      tooltipTitle={fieldMetaObj?.comment}
      name={fieldMetaObj?.name}
      value={getFieldValue()}
      onChange={handleChange}
      variant={variant}
      size={size}
      format={getParseDateFormat}
    />
  );
};

DateField.propTypes = {
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

DateField.defaultProps = {
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

export default DateField;