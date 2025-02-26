import React, { memo } from "react";
import { Grid, Container } from "@material-ui/core";
import FormInput from "../../../../../../FormInput";
import useStyles from "./styles";
import { Controller, useFormContext } from "react-hook-form";
const LineItemGrandTotal = (props) => {
  const { module, fields } = props;
  const classes = useStyles();
  const { control } = useFormContext();
  const readOnlyFieldsArr = [
    "total_amt",
    "discount_amount",
    "subtotal_amount",
    "shipping_tax_amt",
    "tax_amount",
    "total_amount",
  ];
  return (
    <Container>
      {fields?.map((field, key) => {
        return (
          <Grid
            container
            className={classes.fieldSpacing}
            direction="row"
            justify="space-between"
            alignItems="stretch"
          >
            <Grid item xs className={classes.mobileLayoutHide}></Grid>
            <Grid item xs className={classes.mobileLayoutHide}></Grid>
            <Grid item xs>
              <Controller
                control={control}
                name={`${field.field_key}`}
                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                  <FormInput
                    field={field}
                    small={true}
                    module={module}
                    value={value}
                    readOnly={readOnlyFieldsArr.includes(field.field_key)}
                    onChange={onChange}
                  />
                )}
              />
            </Grid>
          </Grid>
        );
      })}
    </Container>
  );
};

export default memo(LineItemGrandTotal);
