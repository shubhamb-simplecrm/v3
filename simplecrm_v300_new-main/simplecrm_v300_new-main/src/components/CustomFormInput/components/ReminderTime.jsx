import { Grid, Box, Checkbox, InputAdornment } from "@material-ui/core";
import CustomFormInput from "..";
import {
  LBL_REMINDER_DAY_PRIOR,
  LBL_REMINDER_HOUR_PRIOR,
  LBL_REMINDER_MINUTE_PRIOR,
} from "@/constant";
const priorArr = {
  60: `1 ${LBL_REMINDER_MINUTE_PRIOR}`,
  300: `5 ${LBL_REMINDER_MINUTE_PRIOR}`,
  600: `10 ${LBL_REMINDER_MINUTE_PRIOR}`,
  900: `15 ${LBL_REMINDER_MINUTE_PRIOR}`,
  1800: `30 ${LBL_REMINDER_MINUTE_PRIOR}`,
  3600: `1 ${LBL_REMINDER_HOUR_PRIOR}`,
  7200: `2 ${LBL_REMINDER_HOUR_PRIOR}`,
  10800: `3 ${LBL_REMINDER_HOUR_PRIOR}`,
  18000: `5 ${LBL_REMINDER_HOUR_PRIOR}`,
  86400: `1 ${LBL_REMINDER_DAY_PRIOR}`,
};
const REMINDER_FIELDS = [
  {
    type: "popup",
    name: "reminder_time",
    checked: "reminder_checked",
  },
  {
    type: "email",
    name: "email_reminder_time",
    checked: "email_reminder_checked",
  },
];

const AdornedCheckbox = ({ checked, onChange, disabled, name }) => (
  <InputAdornment position="start">
    <Checkbox
      checked={checked}
      onChange={onChange}
      color="primary"
      disabled={disabled}
      name={name}
    />
  </InputAdornment>
);
const ReminderTime = ({ value = {}, onChange, fieldState, ...rest }) => {
  const handleFieldChange = (fieldName, fieldValue) => {
    const newValue = { ...value, [fieldName]: fieldValue };
    if (fieldName.endsWith("_checked") && !fieldValue) {
      const timeField = fieldName.replace("_checked", "_time");
      newValue[timeField] = "-1";
    }
    onChange(newValue);
  };
  return (
    <Grid component={Box} container direction="row" spacing={1}>
      {REMINDER_FIELDS.map(({ type, checked, name }) => (
        <Grid item md={6} xs={12} key={type}>
          <CustomFormInput
            {...rest}
            control={null}
            fieldState={{
              ...fieldState,
              disabled: fieldState?.disabled || !value[checked],
            }}
            fieldMetaObj={{
              label: `${type[0].toUpperCase() + type.slice(1)} ${rest.fieldMetaObj?.label}`,
              type: "enum",
              options: priorArr,
              name: name,
            }}
            value={value[name]}
            onChange={(v) => handleFieldChange(name, v)}
            customProps={{
              field: {
                InputProps: {
                  startAdornment: (
                    <AdornedCheckbox
                      checked={value[checked]}
                      onChange={() =>
                        handleFieldChange(checked, !value[checked])
                      }
                      disabled={fieldState?.disabled}
                      name={checked}
                    />
                  ),
                },
              },
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ReminderTime;
