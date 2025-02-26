import React, { useState } from "react";
import useStyles from "./styles";
import InfoIcon from "@material-ui/icons/Info";
import {
  useTheme,
  Tooltip,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import {
  LBL_ONLY_NUMBERS_ALLOWED,
  LBL_REQUIRED_FIELD,
} from "../../../constant";
import { isEmpty } from "ramda";

export default function Integer({
  field,
  onChange,
  onBlur,
  errors = {},
  value,
  small = false,
  variant = "outlined",
  readOnly,
  disabled,
  module,
  onCopy = null,
}) {
  const classes = useStyles();
  const currentTheme = useTheme();
  const [incorrectDataMsg, setIncorrectDataMsg] = useState("");
  const handleOnChange = (e) => {
    const regex = field?.type === "int" ? /[^0-9]/ : /[^0-9.]/;
    let tempValue = e.target.value;
    if (
      [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Enter",
        "Tab",
      ].includes(e.key)
    ) {
      if (e.key === "Backspace") {
        tempValue = tempValue.slice(0, -1);
        onChange(tempValue);
      }
      return;
    }
    if (regex.test(tempValue)) {
      setIncorrectDataMsg(LBL_ONLY_NUMBERS_ALLOWED);
    } else {
      setIncorrectDataMsg("");
      onChange(tempValue);
    }
  };
  let iserror =
    errors[field.name] && errors[field.name] !== "ReadOnly" ? true : false;
  return (
    <Tooltip
      title={field.comment || ""}
      disableHoverListener={field.comment ? false : true}
      placement="top-start"
      disableFocusListener={field.comment ? false : true}
      disableTouchListener={field.comment ? false : true}
    >
      <>
        <TextField
          id={field.name}
          error={iserror}
          required={
            field.required === "true" ||
            errors[field.name] === LBL_REQUIRED_FIELD
              ? true
              : false
          }
          name={field.name}
          variant={variant}
          size={small ? "small" : "medium"}
          label={field.label}
          onChange={(e) => handleOnChange(e)}
          onBlur={(e) => onBlur(e.target.value)}
          value={value}
          // placeholder={field.label}
          className={classes.decimalInput}
          helperText={
            errors[field.name] && errors[field.name] !== "ReadOnly"
              ? errors[field.name]
              : null
          }
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            // readOnly: readOnly,
            readOnly: errors[field.name] === "ReadOnly" ? true : false,
          }}
          disabled={errors[field.name] === "ReadOnly" ? true : !!disabled}
          onCut={onCopy}
          onCopy={onCopy}
          onPaste={onCopy}
          onContextMenu={onCopy}
        />
        {!errors?.[field.name] && !isEmpty(incorrectDataMsg) ? (
          <FormHelperText
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <InfoIcon
              color="action"
              fontSize="small"
              style={{ padding: "2px" }}
            />
            {incorrectDataMsg}
          </FormHelperText>
        ) : null}
      </>
    </Tooltip>
  );
}
