import React, { useCallback } from "react";
import { Grid } from "@material-ui/core";
import { VARIANT } from "@/constant";
import { PropTypes } from "prop-types";
import CustomFormInput from "@/components/CustomFormInput";
import { isEmpty, isNil } from "ramda";

const ParentField = ({ control, ...rest }) => {
  const { fieldMetaObj, onChange, value, moduleMetaData, fieldState } = rest;
  const parentTypeFieldRequired =
    fieldState?.required ||
    (isNil(value?.parent_type) && isEmpty(value?.parent_type));

  const parentRecordFieldRequired =
    fieldState?.required ||
    (isNil(value?.parent_id) && isEmpty(value?.parent_id));

  const handleOnModuleChange = useCallback(
    (selectedValue) => {
      const selectedData = {
        parent_id: "",
        parent_name: "",
        parent_type: selectedValue || "",
      };
      onChange(selectedData);
    },
    [onChange],
  );

  const handleOnRecordChange = useCallback(
    (selectedValue) => {
      const selectedData = {
        parent_type: value.parent_type,
        parent_id: selectedValue.id,
        parent_name: selectedValue.value,
      };
      onChange(selectedData);
    },
    [value, onChange],
  );
  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        sm={value && value?.parent_type ? 6 : 12}
        md={value && value?.parent_type ? 6 : 12}
        lg={value && value?.parent_type ? 6 : 12}
      >
        <CustomFormInput
          {...rest}
          fieldMetaObj={{
            ...fieldMetaObj,
            type: "enum",
          }}
          control={null}
          onChange={handleOnModuleChange}
          value={value?.parent_type}
          fieldState={{
            ...fieldState,
            required: parentTypeFieldRequired,
            error: fieldState?.error,
            helperText: fieldState?.helperText?.parent_type,
          }}
        />
      </Grid>
      {value && value?.parent_type && (
        <Grid
          item
          xs={12}
          sm={value && value?.parent_type ? 6 : 12}
          md={value && value?.parent_type ? 6 : 12}
          lg={value && value?.parent_type ? 6 : 12}
        >
          <CustomFormInput
            {...rest}
            fieldMetaObj={{
              ...fieldMetaObj,
              type: "relate",
              module: value?.parent_type,
            }}
            control={null}
            fieldState={{
              ...fieldState,
              required: parentRecordFieldRequired,
              error: fieldState?.error,
              helperText: fieldState?.helperText?.parent_name,
            }}
            onChange={handleOnRecordChange}
            value={{
              id: value?.parent_id ? value?.parent_id : "",
              value: value?.parent_name ? value?.parent_name : "",
            }}
            moduleMetaData={{
              ...moduleMetaData,
              currentModule: value?.parent_type,
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};
ParentField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

ParentField.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  value: { parent_type: "", parent_name: "", parent_id: "" },
  variant: VARIANT,
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
export default ParentField;
