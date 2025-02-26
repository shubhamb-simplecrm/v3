import { KeyboardDatePicker } from "@material-ui/pickers";
import { textEllipsis } from "../../../common/utils";
import {
  LBL_DATEPICKER_CANCEL_BUTTON,
  LBL_DATEPICKER_OK_BUTTON,
} from "../../../constant";

export const DatePicker = ({
  label,
  name,
  value,
  iserror,
  isFieldSmall = true,
  onChange,
  onBlur,
  helperText,
  format,
  allowKeyboardControl = false,
  disabled = false,
  autoOk = true,
}) => {
  return (
    <KeyboardDatePicker
      KeyboardButtonProps={{
        id: name,
      }}
      allowKeyboardControl={allowKeyboardControl}
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
      onBlur={onBlur}
      helperText={helperText}
      cancelLabel={LBL_DATEPICKER_CANCEL_BUTTON}
      okLabel={LBL_DATEPICKER_OK_BUTTON}
      disabled={disabled}
      animateYearScrolling={true}
    />
  );
};
