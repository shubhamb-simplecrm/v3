import React, { useMemo, useState } from "react";
import {
  InputAdornment,
  FormHelperText,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
  Tooltip,
} from "@material-ui/core";
import useStyles from "./styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { isEmpty, isNil, pathOr } from "ramda";
import { PropTypes } from "prop-types";

const PasswordField = ({
  fieldMetaObj,
  fieldState,
  onChange,
  variant = "outlined",
  value,
  size,
  onBlur,
}) => {
  const inputProps = useMemo(() => {
    let props = {
      autoComplete: "off",
      form: {
        autoComplete: "off",
      },
    };
    if (!!fieldMetaObj?.len) {
      props["maxLength"] = fieldMetaObj?.len;
    }
    return props;
  }, [fieldMetaObj]);

  let showVisibilityIcon = pathOr(true, ["showVisibilityIcon"], fieldMetaObj);
  let fieldValidation = pathOr(true, ["validation"], fieldMetaObj);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    oneUpper: false,
    oneLower: false,
    oneSpecial: false,
    oneNumber: false,
    minLength: false,
  });
  const classes = useStyles();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordCheck = (value) => {
    const requirements = {
      oneUpper: /[A-Z]/.test(value),
      oneLower: /[a-z]/.test(value),
      oneSpecial: /[~!@#$%^&*]/.test(value),
      oneNumber: /\d/.test(value),
      minLength: value.length >= fieldValidation?.minLength,
    };
    setPasswordRequirements(requirements);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    if (!isNil(fieldValidation) && !isEmpty(fieldValidation)) {
      handlePasswordCheck(e.target.value);
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function renderTooltip() {
    return !isNil(fieldValidation) && !isEmpty(fieldValidation)
      ? Object.entries(passwordRequirements).map(([key, value]) => {
          return (
            fieldValidation[key] && (
              <div
                className={classes.tooltip}
                key={`${key}-${fieldMetaObj?.name}`}
              >
                {value ? (
                  <CheckIcon className={classes.checkBtn} />
                ) : (
                  <ClearIcon className={classes.clearBtn} color="error" />
                )}
                {fieldValidation["pwdRequirementMessages"][key]}
              </div>
            )
          );
        })
      : fieldMetaObj?.comment;
  }

  if (fieldMetaObj?.name == "user_hash") return null;

  return (
    <Tooltip
      title={renderTooltip()}
      classes={{ tooltip: classes.customWidth }}
      arrow
      disableHoverListener
      disableTouchListener
      disableFocusListener={
        fieldMetaObj.name === "password" ||
        fieldMetaObj.name === "confirm_new_password" ||
        fieldMetaObj.name === "old_password" ||
        !fieldValidation?.isPasswordValidationApplied
      }
      placement="top-start"
    >
      <FormControl
        size={size}
        variant={variant}
        fullWidth
        error={fieldState?.error}
        disabled={fieldState?.disabled}
      >
        <InputLabel htmlFor="outlined-adornment-password" shrink={true}>
          {fieldMetaObj?.label}
        </InputLabel>
        <OutlinedInput
          {...fieldState}
          autoComplete="new-password"
          type={showPassword ? "text" : "password"}
          name={fieldMetaObj?.name}
          inputProps={inputProps}
          id={fieldMetaObj?.name}
          notched
          fullWidth
          onBlur={onBlur}
          value={value}
          onChange={handleChange}
          label={fieldMetaObj.label}
          endAdornment={
            showVisibilityIcon && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }
        />
        <FormHelperText error={fieldState?.error}>
          {fieldState?.helperText}
        </FormHelperText>
      </FormControl>
    </Tooltip>
  );
};

PasswordField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

PasswordField.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  variant: "outlined",
  size: "small",
  fieldState: {
    disabled: false,
    required: false,
    error: false,
    visible: true,
    helperText: null,
  },
  moduleMetaData: {},
  customProps: {},
};

export default PasswordField;