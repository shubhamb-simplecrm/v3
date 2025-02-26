import React from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import { FormControl, FormControlLabel, FormGroup } from "@material-ui/core";
import { PropTypes } from "prop-types";
import useCommonUtils from "@/hooks/useCommonUtils";
import Tooltip from "@/components/SharedComponents/Tooltip";

const JSONEditor = ({ fieldMetaObj, value, onChange, fieldState }) => {
  const { currentActiveTheme } = useCommonUtils();
  const handleOnChange = (e) => {
    if (e.jsObject) {
      onChange(e.jsObject);
    }
  };
  return (
    <Tooltip title={fieldMetaObj?.comment}>
      <FormControl
        required={!!fieldState?.required}
        error={!!fieldState?.error}
      >
        <FormGroup row>
          <FormControlLabel
            label={`${fieldMetaObj?.label}${!!fieldState?.required ? " *" : ""}`}
            control={
              <JSONInput
                id={fieldMetaObj?.name}
                placeholder={value ? value : []}
                colors={
                  currentActiveTheme === "dark"
                    ? { background: "white" }
                    : { background: "black" }
                }
                reset={false}
                onChange={handleOnChange}
                locale={locale}
                height="400px"
                width="100%"
                disabled={!!fieldState?.disabled}
              />
            }
          />
        </FormGroup>
        {fieldState?.helperText && (
          <FormHelperText error={!!fieldState?.error}>
            {fieldState?.helperText}
          </FormHelperText>
        )}
      </FormControl>
    </Tooltip>
  );
};

JSONEditor.propTypes = {
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

JSONEditor.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  errorMessage: "",
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

export default JSONEditor;
