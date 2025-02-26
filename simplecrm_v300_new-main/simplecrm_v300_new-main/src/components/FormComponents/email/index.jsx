import React, { useEffect, useState } from "react";
import {
  ListItem,
  List,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Popover,
  Radio,
  useTheme,
  TextField,
  Tooltip,
  InputAdornment,
} from "@material-ui/core";
import { Close, Settings, AddCircleOutline } from "@material-ui/icons";
import useStyles, { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { clone, pathOr } from "ramda";
import {
  LBL_EMAIL_INVALID,
  LBL_EMAIL_INVALID_ERROR,
  LBL_EMAIL_OPTED_OUT,
  LBL_EMAIL_PRIMARY,
  LBL_EMAIL_REQUIRED_ERROR,
  LBL_REQUIRED_FIELD,
} from "../../../constant";

export default function Email({
  initialValues,
  module,
  field,
  onChange,
  errors = {},
  variant = "outlined",
  value,
  small = false,
  onBlur,
  quickCreate = false,
  onCopy = null,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const theme = useTheme();
  const newField = {
    email: "",
    primary: true,
    optOut: false,
    invalid: false,
    deleted: false,
    error: false,
  };

  const [emailError, setEmailError] = useState(errors);
  const [pophover, setPophover] = useState(null);

  const [editValues, setEditValues] = useState(
    value.length ? value : [newField],
  );

  const handleChange = (key, name, value) => {
    let emailData = clone(editValues);
    if (value) {
      emailData[key].error = false;
      delete emailError[field.name + "" + key];
      setEmailError(emailError);
    }
    if (name !== "email") {
      emailData.map((config, configKey) => {
        if (name === "primary") {
          emailData[configKey][name] = configKey === key ? value : false;
        } else {
          emailData[key][name] = value;
        }
      });
    } else {
      emailData[key][name] = value;
    }
    setEditValues(emailData);
    onChange(emailData);
  };

  const addEmailRow = (key) => {
    if (!editValues[key].email) {
      editValues[key].error = LBL_EMAIL_REQUIRED_ERROR;
      setEmailError({
        ...emailError,
        [field.name + "" + key]: LBL_EMAIL_REQUIRED_ERROR,
      });
      setEditValues([...editValues]);
      return;
    }

    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
    );
    if (!pattern.test(editValues[key].email)) {
      editValues[key].error = LBL_EMAIL_INVALID_ERROR;
      setEmailError({
        ...emailError,
        [field.name + "" + key]: LBL_EMAIL_INVALID_ERROR,
      });
      setEditValues([...editValues]);
      return;
    }
    if (editValues.length > 4) {
      return;
    }
    newField.primary = false;
    setEditValues([...editValues, newField]);
  };
  const removeEmailRow = (key) => {
    editValues.splice(key, 1);
    setEditValues([...editValues]);
  };
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setPophover(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPophover(null);
  };

  useEffect(() => {
    if (errors.length) {
      setEmailError(errors);
    }
  }, [errors]);

  useEffect(() => {
    if (quickCreate && field && field.name && initialValues[field.name]) {
      setEditValues([
        {
          email: pathOr("", [field.name, 0, "email"], initialValues),
          primary: true,
          optOut: false,
          invalid: false,
          deleted: false,
          error: false,
        },
      ]);
    }
  }, [initialValues]);

  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      {editValues &&
        editValues.map((emailField, key) => (
          <Tooltip
            key={field.name}
            title={field.comment || ""}
            disableHoverListener={field.comment ? false : true}
            placement="top-start"
            disableFocusListener={field.comment ? false : true}
            disableTouchListener={field.comment ? false : true}
          >
            <TextField
              id={`${field.name}${key}`}
              error={
                errors[field.name] !== "ReadOnly"
                  ? emailError[field.name + "" + key] ||
                    errors[field.name + "" + key]
                  : null
              }
              required={
                key == 0 && field.required === "true"
                  ? true
                  : errors[field.name] === LBL_REQUIRED_FIELD
                    ? true
                    : false
              }
              name={`${field.name}${key}`}
              size={small ? "small" : "medium"}
              label={field.label}
              onChange={(e) => handleChange(key, "email", e.target.value)}
              value={emailField.email || ""}
              variant={variant}
              disabled={errors[field.name] === "ReadOnly" ? true : false}
              // placeholder={field.label}
              helperText={
                errors[field.name] !== "ReadOnly"
                  ? emailError[field.name + "" + key] ||
                    errors[field.name + "" + key]
                  : null
              }
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="start"
                    className={classes.adornment}
                  >
                    {key != 0 ? (
                      <Close
                        onClick={() => removeEmailRow(key)}
                        id={`remove-email-btn-${key}`}
                      />
                    ) : (
                      ""
                    )}
                    {editValues.length - 1 === key ? (
                      <AddCircleOutline
                        onClick={() => addEmailRow(key)}
                        id={`add-email-btn-${key}`}
                      />
                    ) : (
                      ""
                    )}
                    <Settings
                      onClick={(event) => handleClick(event, key)}
                      aria-controls={`add-email-setting-btn-${key}`}
                      id={`add-email-setting-btn${key}`}
                      aria-haspopup="true"
                    />
                    <Popover
                      id={`add-email-setting-btn-${key}`}
                      open={key === pophover}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <List className={classes.root}>
                        <ListItem
                          key={`primary${key}`}
                          role={undefined}
                          dense
                          button
                          onClick={() =>
                            handleChange(key, "primary", !emailField.primary)
                          }
                        >
                          <ListItemIcon>
                            <Radio
                              edge="start"
                              checked={Boolean(emailField.primary)}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{
                                "aria-labelledby": `primary${key}`,
                                id: `primary${key}`,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            id={`primary${key}`}
                            primary={LBL_EMAIL_PRIMARY}
                          />
                        </ListItem>
                        <ListItem
                          key={`optOut${key}`}
                          role={undefined}
                          dense
                          button
                          onClick={() =>
                            handleChange(key, "optOut", !emailField.optOut)
                          }
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={emailField.optOut}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{
                                "aria-labelledby": `optOut${key}`,
                                id: `optOut${key}`,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            id={`optOut${key}`}
                            primary={LBL_EMAIL_OPTED_OUT}
                          />
                        </ListItem>
                        <ListItem
                          key={`invalid${key}`}
                          role={undefined}
                          dense
                          button
                          onClick={() =>
                            handleChange(key, "invalid", !emailField.invalid)
                          }
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={emailField.invalid}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{
                                "aria-labelledby": `invalid${key}`,
                                id: `invalid${key}`,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            id={`invalid${key}`}
                            primary={LBL_EMAIL_INVALID}
                          />
                        </ListItem>
                      </List>
                    </Popover>
                  </InputAdornment>
                ),
              }}
              onBlur={onBlur}
              className={classes.emailField}
              onCut={onCopy}
              onCopy={onCopy}
              onPaste={onCopy}
              onContextMenu={onCopy}
            />
          </Tooltip>
        ))}
    </MuiThemeProvider>
  );
}
