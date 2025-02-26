import { useCallback } from "react";
import { TextField as MUITextField } from "@material-ui/core";
import { PropTypes } from "prop-types";
import Tooltip from "../Tooltip";
import useCommonUtils from "@/hooks/useCommonUtils";

const TextField = (props) => {
  const {
    name,
    disabled,
    InputProps,
    InputLabelProps,
    tooltipTitle,
    inputProps,
  } = props;
  const { isCopyPasteContentAllow } = useCommonUtils();

  const handleOnCopyEvent = useCallback(
    (e) => {
      if (!isCopyPasteContentAllow) {
        e.preventDefault();
      }
      return null;
    },
    [isCopyPasteContentAllow],
  );

  return (
    <Tooltip title={tooltipTitle}>
      <MUITextField
        id={name}
        {...props}
        InputLabelProps={{
          ...InputLabelProps,
          shrink: true,
        }}
        InputProps={{
          ...InputProps,
          readOnly: disabled,
        }}
        inputProps={inputProps}
        onCut={handleOnCopyEvent}
        onCopy={handleOnCopyEvent}
        onPaste={handleOnCopyEvent}
        onContextMenu={handleOnCopyEvent}
      />
    </Tooltip>
  );
};

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  format: PropTypes.string,
  value: PropTypes.any,
  tooltipTitle: PropTypes.any,
  helperText: PropTypes.string,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  size: PropTypes.string,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  InputProps: PropTypes.object,
  inputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
};

TextField.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  inputProps: {},
  InputProps: {},
  InputLabelProps: {},
  type: "text",
  tooltipTitle: "",
  variant: "outlined",
  size: "small",
  error: false,
  disabled: false,
  required: false,
  fullWidth: true,
};
export default TextField;
