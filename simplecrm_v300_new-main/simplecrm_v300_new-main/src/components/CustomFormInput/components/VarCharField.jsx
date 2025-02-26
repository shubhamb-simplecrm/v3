import React, { memo, useMemo } from "react";
import { PropTypes } from "prop-types";
import Tooltip from "@/components/SharedComponents/Tooltip";
import { TextField } from "@/components/SharedComponents/InputComponents";
import { isEmpty, isNil, pathOr } from "ramda";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@material-ui/core";
import FaIcon from "@/components/FaIcon";

const useStyles = makeStyles((theme) => ({
  suggestionText: {
    fontStyle: "italic",
    textDecoration: "none !important",
    lineHeight: "2.5",
  },
  suggestionCopyBtn: {
    cursor: "pointer",
  },
}));

const VarCharField = ({
  fieldMetaObj,
  onChange,
  onBlur,
  variant,
  value,
  size,
  fieldState,
  customProps,
}) => {
  const inputProps = pathOr({}, ["field", "inputProps"], customProps);
  if (!inputProps?.hasOwnProperty("maxLength") && !!fieldMetaObj?.len) {
    inputProps["maxLength"] = fieldMetaObj?.len;
  }
  return (
    <>
      <TextField
        {...customProps.field}
        {...fieldState}
        name={fieldMetaObj?.name}
        size={size}
        label={fieldMetaObj?.label}
        tooltipTitle={fieldMetaObj?.comment}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        variant={variant}
        inputProps={inputProps}
      />
      {fieldMetaObj?.hasOwnProperty("dependentFields") && (
        <ShowSuggestionText
          onChange={onChange}
          customProps={customProps}
          fieldMetaObj={fieldMetaObj}
        />
      )}
    </>
  );
};
const ShowSuggestionText = memo(({ customProps, onChange, fieldMetaObj }) => {
  const classes = useStyles();
  const formValues = pathOr({}, ["formValues"], customProps);
  const formFields = pathOr({}, ["formFields"], customProps);
  const suggestionTextLabel = useMemo(() => {
    let resultStr = "";
    const suggestionTextArr = pathOr([], ["dependentFields"], fieldMetaObj);
    if (Array.isArray(suggestionTextArr)) {
      suggestionTextArr.forEach((fieldKey) => {
        const tempFieldValue = pathOr("", [fieldKey], formValues);
        const tempFieldObj = pathOr("", [fieldKey], formFields);
        if (typeof tempFieldValue === "object") {
          if (
            tempFieldValue.hasOwnProperty("value") &&
            !isNil(tempFieldValue?.value) &&
            !isEmpty(tempFieldValue?.value)
          ) {
            resultStr += `${tempFieldValue?.value} - `;
          }
        } else if (!isEmpty(tempFieldValue)) {
          if (
            ["enum", "dynamicenum", "radioenum"].includes(tempFieldObj?.type) ||
            tempFieldObj?.options.hasOwnProperty(tempFieldValue)
          ) {
            resultStr += `${tempFieldObj.options[tempFieldValue]} - `;
          } else {
            resultStr += `${tempFieldValue} - `;
          }
        }
      });
    }
    return resultStr.replace(/^-+|-+$/g, "");
  }, [fieldMetaObj, customProps]);

  return (
    !isEmpty(suggestionTextLabel) && (
      <Tooltip title={"Click to pick suggestion"} placement="top-start">
        <Link
          className={classes.suggestionText}
          onClick={() => onChange(suggestionTextLabel)}
        >
          {suggestionTextLabel}
          <FaIcon
            className={classes.suggestionCopyBtn}
            icon={`fas fa-copy`}
            size="1x"
          />
        </Link>
      </Tooltip>
    )
  );
});

VarCharField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

VarCharField.defaultProps = {
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
export default VarCharField;
