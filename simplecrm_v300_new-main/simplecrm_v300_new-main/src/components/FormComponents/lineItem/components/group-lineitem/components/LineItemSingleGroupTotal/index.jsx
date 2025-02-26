import { Grid } from "@material-ui/core";
import React, { memo } from "react";
import { Controller } from "react-hook-form";
import FormInput from "../../../../../../FormInput";
import useStyles from "./../../styles";
function LineItemSingleGroupTotal(props) {
  const { module, groupIndex, groupTotalFields, control } = props;
  const classes = useStyles();
  return groupTotalFields.map((field, rowIndex) => {
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
            name={`line_items.grouped.${groupIndex}.meta.${field.name}`}
            defaultValue={field.value}
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <FormInput
                field={field}
                module={module}
                small={true}
                value={value}
                readOnly={true}
              />
            )}
          />
        </Grid>
      </Grid>
    );
  });
}

export default memo(LineItemSingleGroupTotal);
