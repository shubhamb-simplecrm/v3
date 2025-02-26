import React, { useState, useEffect } from "react";
import useStyles, { getMuiTheme } from "./styles";

import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
  CircularProgress,
  Avatar,
  Chip,
  Grid,
  Checkbox,
  Box,
  MenuItem,
  TextField,
  useTheme,
  Paper,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@material-ui/core";
import { FormInput } from "../../";

import {
  NotificationsActive as NotificationsActiveIcon,
  Search as SearchIcon,
  Email as EmailIcon,
} from "@material-ui/icons";
import { pathOr, clone } from "ramda";
import { useSelector } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { LBL_REQUIRED_FIELD } from "../../../constant";
export default function ReminderTime({
  field,
  onChange,
  errors = {},
  variant = "outlined",
  value,
  small = false,
  onBlur,
  disabled = false,
  view = "",
  onCopy = null,
}) {
  let iserror = errors[field.name] ? true : false;
  const classes = useStyles();
  const theme = useTheme();
  const [remindersData, setRemindersData] = useState({
    reminder_checked: false,
    reminder_time: "-1",
    email_reminder_checked: false,
    email_reminder_time: "-1",
  });
  const priorArr = [
    { label: "1 minute prior", value: 60 },
    { label: "5 minute prior", value: 300 },
    { label: "10 minute prior", value: 600 },
    { label: "15 minute prior", value: 900 },
    { label: "30 minute prior", value: 1800 },
    { label: "1 hour prior", value: 3600 },
    { label: "2 hour prior", value: 7200 },
    { label: "3 hour prior", value: 10800 },
    { label: "5 hour prior", value: 18000 },
    { label: "1 day prior", value: 86400 },
  ];
  const renderOptions = () => {
    let optionsToRender = [];
    for (let optionKey in priorArr) {
      optionsToRender.push(
        <MenuItem key={optionKey} value={priorArr[optionKey].value}>
          <span>{priorArr[optionKey].label}</span>
        </MenuItem>,
      );
    }
    return optionsToRender;
  };
  const [IsChange, setIsChange] = useState(false);

  useEffect(() => {
    if (value && view === "detailview") {
      setRemindersData(value);
    } else if (view === "editview") {
      setRemindersData(field.value);
    }
  }, []);

  useEffect(() => {
    onChange({ remindersData });
  }, [remindersData, IsChange]);

  const handleChange1 = (event) => () => {
    let data = clone(remindersData);
    data[event.target.name] = event.target.value;
    setRemindersData(data);
  };

  const [isVisible1, setisVisible1] = useState(false);

  const [isVisible2, setisVisible2] = useState(false);

  const handleChange = (event, key) => {
    setIsChange(true);

    switch (key) {
      case "reminder_time":
        let data = clone(remindersData);
        data["reminder_time"] = event.target.value.toString();
        setRemindersData(data);
        break;

      case "reminder_checked":
        let data1 = clone(remindersData);
        data1["reminder_checked"] = !remindersData["reminder_checked"];
        if (data1["reminder_checked"] === false) {
          data1["reminder_time"] = "-1";
          setisVisible1(false);
        }
        setisVisible1(true);
        setRemindersData(data1);
        break;

      case "email_reminder_checked":
        let data2 = clone(remindersData);
        data2["email_reminder_checked"] =
          !remindersData["email_reminder_checked"];
        if (data2["email_reminder_checked"] === false) {
          data2["email_reminder_time"] = "-1";
          setisVisible2(false);
        }
        setisVisible2(true);
        setRemindersData(data2);
        break;

      case "email_reminder_time":
        let data3 = clone(remindersData);
        data3["email_reminder_time"] = event.target.value.toString();
        setRemindersData(data3);
        break;

      default:
        break;
    }
  };

  return (
    <>
      {!disabled ? (
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Reminder Time:
        </Typography>
      ) : (
        ""
      )}
      <Paper>
        <Card className={classes.root}>
          <CardContent className={classes.mobileLayoutReminTime}>
            <MuiThemeProvider theme={getMuiTheme(theme)}>
              <Grid container>
                <Grid item xs={12}>
                  <Box>
                    <Grid container>
                      <Grid item xs={12} className={classes.addInviteeBtn}>
                        <Grid
                          container
                          direction="row"
                          justify="flex-start"
                          alignItems="flex-start"
                        >
                          <Grid item xs={12} sm={6}>
                            <FormControl component="fieldset">
                              <FormGroup aria-label="position" row>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      edge="end"
                                      value={""}
                                      checked={remindersData.reminder_checked}
                                      disabled={disabled}
                                      onChange={(e) =>
                                        handleChange(e, "reminder_checked")
                                      }
                                      color={
                                        view == "detailview"
                                          ? "secondary"
                                          : "primary"
                                      }
                                    />
                                  }
                                  label=" Popup"
                                  labelPlacement="end"
                                />
                              </FormGroup>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {remindersData.reminder_checked ? (
                              <TextField
                                id={`reminder_time`}
                                name={"reminder_time"}
                                error={iserror}
                                required={
                                  field.required === "true" ||
                                  errors[field.name] === LBL_REQUIRED_FIELD
                                    ? true
                                    : false
                                }
                                select
                                label={field.label}
                                value={remindersData.reminder_time}
                                onChange={(e) =>
                                  handleChange(e, "reminder_time")
                                }
                                variant={variant}
                                size={"small"}
                                disabled={
                                  disabled || !remindersData.reminder_checked
                                    ? true
                                    : false
                                }
                                fullWidth={true}
                                className={classes.select}
                                onCut={onCopy}
                                onCopy={onCopy}
                                onPaste={onCopy}
                                onContextMenu={onCopy}
                              >
                                {renderOptions()}
                              </TextField>
                            ) : (
                              ""
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        style={{ borderColor: "green", borderWidth: 3 }}
                        item
                        xs={12}
                        className={classes.addInviteeBtn}
                      >
                        <Grid container>
                          <Grid item xs={12} sm={6}>
                            <FormControl component="fieldset">
                              <FormGroup aria-label="position" row>
                                <FormControlLabel
                                  value="start"
                                  control={
                                    <Switch
                                      edge="end"
                                      value={""}
                                      onChange={(e) =>
                                        handleChange(
                                          e,
                                          "email_reminder_checked",
                                        )
                                      }
                                      checked={
                                        remindersData.email_reminder_checked
                                      }
                                      color={
                                        view == "detailview"
                                          ? "secondary"
                                          : "primary"
                                      }
                                    />
                                  }
                                  label={" Email"}
                                  labelPlacement="end"
                                  disabled={disabled}
                                />
                              </FormGroup>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {remindersData.email_reminder_checked ? (
                              <TextField
                                id={"email_reminder_time"}
                                name={"email_reminder_time"}
                                error={iserror}
                                required={
                                  field.required === "true" ||
                                  errors[field.name] === LBL_REQUIRED_FIELD
                                    ? true
                                    : false
                                }
                                select
                                label={field.label}
                                value={remindersData.email_reminder_time}
                                onChange={(e) =>
                                  handleChange(e, "email_reminder_time")
                                }
                                variant={variant}
                                size={"small"}
                                disabled={
                                  disabled ||
                                  !remindersData.email_reminder_checked
                                    ? true
                                    : false
                                }
                                fullWidth={true}
                                className={classes.select}
                                onCut={onCopy}
                                onCopy={onCopy}
                                onPaste={onCopy}
                                onContextMenu={onCopy}
                              >
                                {renderOptions()}
                              </TextField>
                            ) : (
                              ""
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </MuiThemeProvider>
          </CardContent>
        </Card>
      </Paper>
    </>
  );
}
