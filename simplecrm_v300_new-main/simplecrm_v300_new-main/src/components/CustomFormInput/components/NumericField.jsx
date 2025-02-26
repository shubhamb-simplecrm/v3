import React, { useState } from "react";
import { PropTypes } from "prop-types";
import Tooltip from "@/components/SharedComponents/Tooltip";
import { TextField } from "@/components/SharedComponents/InputComponents";
import { NumericFormat } from "react-number-format";
import { FormHelperText, InputAdornment } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { isEmpty } from "ramda";
import { validatePrecision } from "@/common/utils";
import { LBL_ONLY_NUMBERS_ALLOWED } from "@/constant";

const NumericField = ({
  fieldMetaObj,
  fieldState,
  onChange,
  onBlur,
  value,
  size,
  thousandSeparator,
  variant,
}) => {
  const [incorrectDataMsg, setIncorrectDataMsg] = useState("");
  const handleKeyDown = (e) => {
    const regex = fieldMetaObj?.type === "int" ? /[^0-9]/ : /[^0-9.]/;
    let tempValue = value;
    if (
      [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Enter",
        "Tab",
      ].includes(e.key)
    ) {
      if (e.key === "Backspace") {
        tempValue = tempValue.slice(0, -1);
      }
      setIncorrectDataMsg(
        validatePrecision(tempValue, fieldMetaObj?.precision),
      );
      return;
    }
    if (regex.test(e.key)) {
      setIncorrectDataMsg(LBL_ONLY_NUMBERS_ALLOWED);
      e.preventDefault();
    } else {
      tempValue = value + e.key;
      setIncorrectDataMsg(
        validatePrecision(tempValue, fieldMetaObj?.precision),
      );
    }
  };

  const handleOnBlur = () => {
    setIncorrectDataMsg("");
    onBlur();
  };

  const handleValueChange = (values) => {
    setIncorrectDataMsg(
      validatePrecision(values.value, fieldMetaObj?.precision),
    );
    onChange(values?.value);
  };

  return (
    <Tooltip title={fieldMetaObj?.comment || ""}>
      <>
        <NumericFormat
          {...fieldState}
          id={fieldMetaObj?.name}
          value={value}
          thousandSeparator={thousandSeparator}
          customInput={TextField}
          name={fieldMetaObj?.name}
          variant={variant}
          size={size}
          valueIsNumericString={true}
          label={fieldMetaObj?.label}
          min={!isNaN(fieldMetaObj?.min) ? fieldMetaObj?.min : -Infinity}
          max={!isNaN(fieldMetaObj?.max) ? fieldMetaObj?.max : Infinity}
          onValueChange={handleValueChange}
          onKeyDown={handleKeyDown}
          onBlur={handleOnBlur}
          InputProps={{
            startAdornment: fieldMetaObj.hasOwnProperty("decimalcurrency") &&
              !!fieldMetaObj.decimalcurrency && (
                <InputAdornment position="start">
                  {fieldMetaObj?.currencySymbol}
                </InputAdornment>
              ),
          }}
          inputProps={{
            ...(fieldMetaObj?.len && { maxLength: fieldMetaObj.len }),
          }}
        />
        {!fieldState?.error && !isEmpty(incorrectDataMsg) ? (
          <FormHelperText
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <InfoIcon
              color="action"
              fontSize="small"
              style={{ padding: "2px" }}
            />
            {incorrectDataMsg}
          </FormHelperText>
        ) : null}
      </>
    </Tooltip>
  );
};

NumericField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
  thousandSeparator: PropTypes.bool,
};

NumericField.defaultProps = {
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
  thousandSeparator: true,
  moduleMetaData: {},
  customProps: {},
};
export default NumericField;