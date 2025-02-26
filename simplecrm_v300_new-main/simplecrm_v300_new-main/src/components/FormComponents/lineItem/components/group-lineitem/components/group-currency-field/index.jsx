import { Grid } from "@material-ui/core";
import React from "react";
import { Controller } from "react-hook-form";
import FormInput from "../../../../../../FormInput";

function GroupCurrencyField(props) {
  const { module, field, control } = props;
  return field ? (
    <Grid item sm={12} xs={12} md={12}>
      <Controller
        control={control}
        name={`${field.field_key}`}
        render={({ field: { onChange, onBlur, value, name, ref } }) => (
          <FormInput
            field={field}
            small={true}
            module={module}
            value={field.value}
            readOnly={true}
            onChange={onChange}
          />
        )}
      />
    </Grid>
  ) : null;
}

export default GroupCurrencyField;
