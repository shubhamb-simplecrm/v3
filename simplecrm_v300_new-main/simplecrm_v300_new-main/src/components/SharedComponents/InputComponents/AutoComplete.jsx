import { Autocomplete as MUIAutoComplete } from "@material-ui/lab/";
import { TextField } from "@/components/SharedComponents/InputComponents";
import { NO_OPTION, VARIANT } from "@/constant";
import { PropTypes } from "prop-types";
import { Paper } from "@material-ui/core";
import Tooltip from "../Tooltip";

const AutoComplete = (props) => {
  const { label, name, error, helperText, renderInput, tooltipTitle, ...rest } =
    props;
  return (
    <Tooltip title={tooltipTitle || ""}>
      <MUIAutoComplete
        {...rest}
        id={name}
        name={name}
        PaperComponent={(props) => <Paper {...props} elevation={8} />}
        renderInput={(params) => {
          const inputParams =
            typeof renderInput === "function"
              ? renderInput(params)
              : typeof renderInput === "object"
                ? renderInput
                : {};
          return (
            <TextField
              {...params}
              {...inputParams}
              label={label}
              error={error}
              helperText={helperText}
            />
          );
        }}
      />
    </Tooltip>
  );
};

AutoComplete.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  tooltipTitle: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.string,
  size: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  renderInput: PropTypes.func,
};

AutoComplete.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  type: "text",
  tooltipTitle: "",
  autoComplete: "off",
  variant: VARIANT,
  size: "small",
  error: false,
  disabled: false,
  required: false,
  fullWidth: true,
  filterSelectedOptions: false,
  renderInput: (params) => params,
  noOptionsText: NO_OPTION,
};

export default AutoComplete;
