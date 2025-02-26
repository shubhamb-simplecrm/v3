import React, { memo, useState } from "react";
import {
  InputAdornment,
  IconButton,
  TextField,
  Tooltip,
  Grid,
  FormHelperText,
} from "@material-ui/core";
import useStyles from "./styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { LBL_REQUIRED_FIELD } from "../../../constant";
import { isEmpty, isNil, pathOr } from "ramda";
import { useSelector } from "react-redux";
import useCommonUtils from "@/hooks/useCommonUtils";

const Password = ({
  field,
  onChange,
  errors = {},
  variant = "outlined",
  value,
  small = false,
  onBlur,
  isAutoComplete = false,
  onCopy = null,
  validation,
}) => {
  const classes = useStyles();
  let iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : false;
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    oneUpper: false,
    oneLower: false,
    oneSpecial: false,
    oneNumber: false,
    minLength: false,
  });
  const { passwordValidation } = useCommonUtils();
  let showVisibilityIcon = pathOr(true, ["showVisibilityIcon"], field);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handlePasswordCheck = (value) => {
    const requirements = {
      oneUpper: /[A-Z]/.test(value),
      oneLower: /[a-z]/.test(value),
      oneSpecial: /[~!@#$%^&*]/.test(value),
      oneNumber: /\d/.test(value),
      minLength: value.length >= passwordValidation?.minLength,
    };
    setPasswordRequirements(requirements);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    handlePasswordCheck(e.target.value);
  };

  function renderTooltip() {
    return Object.entries(passwordRequirements).map(([key, value]) => {
      return (
        passwordValidation &&
        passwordValidation[key] && (
          <div className={classes.tooltip}>
            {value ? (
              <CheckIcon className={classes.checkBtn} />
            ) : (
              <ClearIcon className={classes.clearBtn} color="error" />
            )}
            {passwordValidation["pwdRequirementMessages"][key]}
          </div>
        )
      );
    });
  }
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Tooltip
        title={renderTooltip()}
        classes={{ tooltip: classes.customWidth }}
        arrow
        disableHoverListener
        disableTouchListener
        disableFocusListener={
          field.name === "password" ||
          field.name === "confirm_new_password" ||
          field.name === "old_password" ||
          !passwordValidation?.isPasswordValidationApplied
        }
        placement="top-start"
      >
        <TextField
          id={field.name}
          error={iserror}
          required={
            field.required || errors[field.name] === LBL_REQUIRED_FIELD
              ? true
              : false
          }
          autoComplete={isAutoComplete ? "on" : "new-password"}
          type={showPassword ? "text" : "password"}
          name={field.name}
          size={small ? "small" : "medium"}
          label={field.label}
          onChange={handleChange}
          onBlur={(e) => onBlur(e.target.value)}
          value={value}
          variant={variant}
          helperText={
            errors[field.name] && errors[field.name] !== "ReadOnly"
              ? errors[field.name]
              : null
          }
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          // onBlur={onBlur}
          disabled={errors[field.name] === "ReadOnly" ? true : false}
          InputProps={{
            endAdornment: showVisibilityIcon && (
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
            ),
          }}
          onCut={onCopy}
          onCopy={onCopy}
          onPaste={onCopy}
          onContextMenu={onCopy}
        />
      </Tooltip>
    </>
  );
};

export default memo(Password);
