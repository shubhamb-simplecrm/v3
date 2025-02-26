import { KeyboardDateTimePicker } from "@material-ui/pickers";
import {
  LBL_DATEPICKER_CANCEL_BUTTON,
  LBL_DATEPICKER_OK_BUTTON,
} from "../../../constant";
import { textEllipsis } from "../../../common/utils";

export const DateTimePicker = ({
  label,
  name,
  value,
  iserror,
  isFieldSmall = true,
  onChange,
  helperText,
  format,
  allowKeyboardControl = false,
  disabled = false,
  autoOk = false,
  minutesStep = 1,
}) => {
  return (
    <KeyboardDateTimePicker
      allowKeyboardControl={allowKeyboardControl}
      KeyboardButtonProps={{
        id: name,
      }}
      autoOk={autoOk}
      error={iserror}
      variant="dialog"
      inputVariant="outlined"
      label={textEllipsis(label, 22)}
      id={name}
      name={name}
      format={format}
      value={value}
      size={isFieldSmall ? "small" : "medium"}
      fullWidth
      InputAdornmentProps={{ position: "start" }}
      onChange={onChange}
      helperText={helperText}
      animateYearScrolling={true}
      minutesStep={minutesStep}
      cancelLabel={LBL_DATEPICKER_CANCEL_BUTTON}
      okLabel={LBL_DATEPICKER_OK_BUTTON}
      disabled={disabled}
    />
  );
};
