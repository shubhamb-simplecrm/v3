import { KeyboardDatePicker } from "@material-ui/pickers";
import {
  LBL_DATEPICKER_CANCEL_BUTTON,
  LBL_DATEPICKER_OK_BUTTON,
} from "../../../constant";
import { PropTypes } from "prop-types";
import Tooltip from "../Tooltip";

const DatePicker = (props) => {
  const { name, variant, tooltipTitle } = props;
  return (
    <Tooltip title={tooltipTitle}>
      <KeyboardDatePicker
        {...props}
        id={name}
        KeyboardButtonProps={{
          id: name,
        }}
        InputAdornmentProps={{ position: "start" }}
        cancelLabel={LBL_DATEPICKER_CANCEL_BUTTON}
        okLabel={LBL_DATEPICKER_OK_BUTTON}
      />
    </Tooltip>
  );
};

DatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  tooltipTitle: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  size: PropTypes.string,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  allowKeyboardControl: PropTypes.bool,
  autoOk: PropTypes.bool,
  fullWidth: PropTypes.bool,
  helperText: PropTypes.any,
};

DatePicker.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  variant: "dialog",
  inputVariant: "outlined",
  size: "small",
  tooltipTitle: "",
  error: false,
  disabled: false,
  required: false,
  allowKeyboardControl: false,
  autoOk: true,
  fullWidth: true,
  helperText: null,
};
export default DatePicker;
