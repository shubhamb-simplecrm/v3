import { KeyboardDateTimePicker } from "@material-ui/pickers";
import {
  LBL_DATEPICKER_CANCEL_BUTTON,
  LBL_DATEPICKER_OK_BUTTON,
} from "../../../constant";
import { PropTypes } from "prop-types";
import Tooltip from "../Tooltip";

const DateTimePicker = (props) => {
  const { name, minutesStep = 1, tooltipTitle } = props;
  return (
    <Tooltip title={tooltipTitle}>
      <KeyboardDateTimePicker
        {...props}
        id={name}
        KeyboardButtonProps={{
          id: name,
        }}
        InputAdornmentProps={{ position: "start" }}
        variant="dialog"
        minutesStep={minutesStep}
        cancelLabel={LBL_DATEPICKER_CANCEL_BUTTON}
        okLabel={LBL_DATEPICKER_OK_BUTTON}
      />
    </Tooltip>
  );
};

DateTimePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  value: PropTypes.any,
  tooltipTitle: PropTypes.any,
  helperText: PropTypes.string,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  inputVariant: PropTypes.string,
  size: PropTypes.string,
  small: PropTypes.bool,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  allowKeyboardControl: PropTypes.bool,
  autoOk: PropTypes.bool,
  fullWidth: PropTypes.bool,
  animateYearScrolling: PropTypes.bool,
};

DateTimePicker.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  variant: "dialog",
  inputVariant: "outlined",
  size: "small",
  tooltipTitle: "",
  small: true,
  error: false,
  disabled: false,
  required: false,
  allowKeyboardControl: false,
  autoOk: false,
  fullWidth: true,
  animateYearScrolling: true,
};
export default DateTimePicker;
