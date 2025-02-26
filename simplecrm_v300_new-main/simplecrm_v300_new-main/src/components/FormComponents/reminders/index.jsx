import React, { useState } from "react";
import useStyles, { getMuiTheme } from "./styles";
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
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
  Chip,
} from "@material-ui/core";
import { FormInput } from "../../";
import { Search as SearchIcon } from "@material-ui/icons";
import { pathOr, clone } from "ramda";
import { useSelector } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  LBL_ADD_REMINDER_BUTTON,
  LBL_ADD_REMINDER_FIELD_TITLE,
  LBL_REMINDER_ADD_INVITIES,
  LBL_REMINDER_POPUP,
  LBL_REMINDER_EMAIL,
  LBL_REMINDER_REMOVE_BUTTON,
  LBL_REMINDER_CHOOSE_LEADS,
  LBL_REMINDER_CHOOSE_CONTCATS,
  LBL_REMINDER_CHOOSE_USERS,
  LBL_REMINDER_MINUTE_PRIOR,
  LBL_REMINDER_HOUR_PRIOR,
  LBL_REMINDER_DAY_PRIOR,
  LBL_REQUIRED_FIELD,
} from "../../../constant";
import { Alert } from "@material-ui/lab";

export default function Reminders({
  field,
  onChange,
  errors = {},
  variant = "outlined",
  disabled = false,
  view = "",
  quickCreate = false,
  onCopy = null,
}) {
  let iserror = errors[field.name] ? true : false;
  const { currentUserData } = useSelector((state) => state.config);
  const classes = useStyles();
  const theme = useTheme();
  const defaultReminderData = {
    idx: 0,
    id: "",
    popup: true,
    email: true,
    timer_popup: "1800",
    timer_email: "3600",
    del_invitees: [],
    invitees: [
      {
        id: "",
        module_id: pathOr("", ["data", "id"], currentUserData),
        module: "Users",
        value: pathOr("", ["data", "attributes", "name"], currentUserData),
        name: pathOr("", ["data", "attributes", "name"], currentUserData),
        email: pathOr("", ["data", "attributes", "email1"], currentUserData),
      },
    ],
  };
  const [remindersData, setRemindersData] = useState(
    field.value ? field.value : [defaultReminderData],
  );

  const priorArr = [
    { label: `1 ${LBL_REMINDER_MINUTE_PRIOR}`, value: 60 },
    { label: `5 ${LBL_REMINDER_MINUTE_PRIOR}`, value: 300 },
    { label: `10 ${LBL_REMINDER_MINUTE_PRIOR}`, value: 600 },
    { label: `15 ${LBL_REMINDER_MINUTE_PRIOR}`, value: 900 },
    { label: `30 ${LBL_REMINDER_MINUTE_PRIOR}`, value: 1800 },
    { label: `1 ${LBL_REMINDER_HOUR_PRIOR}`, value: 3600 },
    { label: `2 ${LBL_REMINDER_HOUR_PRIOR}`, value: 7200 },
    { label: `3 ${LBL_REMINDER_HOUR_PRIOR}`, value: 10800 },
    { label: `5 ${LBL_REMINDER_HOUR_PRIOR}`, value: 18000 },
    { label: `1 ${LBL_REMINDER_DAY_PRIOR}`, value: 86400 },
  ];

  const [IsVisible, setIsVisible] = useState(false);

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

  const [cnt, setcnt] = useState(0);

  const addReminder = () => {
    if (cnt === 0 && field.value) {
      setRemindersData(remindersData.concat(defaultReminderData));
      let reminderDataArray = remindersData.concat(defaultReminderData);
      onChange(reminderDataArray);
      setIsVisible(true);
      setcnt(cnt + 1);
    } else if (cnt === 0) {
      onChange(remindersData);
      setIsVisible(true);
      setcnt(cnt + 1);
    } else {
      setRemindersData(remindersData.concat(defaultReminderData));
      let reminderDataArray = remindersData.concat(defaultReminderData);
      onChange(reminderDataArray);
      setcnt(cnt + 1);
    }
  };
  const removeReminder = (reminderKey) => {
    let newData = clone(remindersData);
    newData.splice(reminderKey, 1);
    onChange(newData);
    setRemindersData(newData);
  };
  const handleSelectInvitees = (val, reminderKey) => {
    const inputDataObj = Object.values(val?.selectedRecords).map((e) => {
      let type = pathOr("", ["type"], e);
      return {
        id: "",
        module_id: pathOr("", ["id"], e),
        module: `${type}s`,
        value: pathOr("", ["attributes", "name"], e),
        name: pathOr("", ["attributes", "name"], e),
        email1: pathOr("", ["attributes", "email1"], e),
      };
    });
    let newData = clone(remindersData);
    newData[reminderKey].invitees =
      newData[reminderKey].invitees.concat(inputDataObj);
    setRemindersData(newData);
    onChange(newData);
  };
  const handleDeleteInvitees = (reminderKey, inviteeKey) => {
    if (remindersData[reminderKey].del_invitees == undefined) {
      remindersData[reminderKey].del_invitees = [];
    }
    let selectedInviteesOld = clone(remindersData);
    selectedInviteesOld[reminderKey].del_invitees = [
      ...selectedInviteesOld[reminderKey].del_invitees,
      remindersData[reminderKey].invitees[inviteeKey],
    ];
    selectedInviteesOld[reminderKey].invitees.splice(inviteeKey, 1);
    onChange(selectedInviteesOld);
    setRemindersData(selectedInviteesOld);
  };
  const handleToggle = (key, value) => () => {
    let data = clone(remindersData);
    data[key][value] = !data[key][value];
    onChange(data);
    setRemindersData(data);
  };
  const handleChange = (e, key) => {
    let data = clone(remindersData);
    data[key][e.target.name] = e.target.value;
    setRemindersData(data);
    onChange(data);
  };

  return (
    <>
      {!disabled ? (
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {LBL_ADD_REMINDER_FIELD_TITLE}
        </Typography>
      ) : (
        ""
      )}
      <Paper>
        <Card className={classes.root}>
          {(field.value && view == "detailview") ||
          (view == "editview" && IsVisible) ||
          (field.value && view == "editview") ? (
            <CardContent>
              <MuiThemeProvider theme={getMuiTheme(theme)}>
                <Grid container spacing={3}>
                  {remindersData.map((reminder, reminderKey) => (
                    <>
                      <Grid
                        style={{
                          width: "100%",
                        }}
                        item
                        xs={12}
                        sm={quickCreate ? 12 : 12}
                      >
                        <Grid spacing={3}>
                          <Grid
                            item
                            xs={12}
                            style={{
                              [(reminderKey + 1) % 2 === 0
                                ? "marginLeft"
                                : "marginRight"]: quickCreate ? 0 : 20,
                              width: "100%",
                            }}
                            id={`reminder-card-${reminderKey}`}
                          >
                            <Box className={classes.inviteeNames}>
                              {reminder.invitees.map((data, key) => (
                                <>
                                  <Chip
                                    color={
                                      view == "detailview" ? "secondary" : ""
                                    }
                                    className={classes.invitee}
                                    disabled={disabled}
                                    label={data.value}
                                    variant="outlined"
                                    onDelete={() => {
                                      handleDeleteInvitees(reminderKey, key);
                                    }}
                                  />
                                </>
                              ))}
                            </Box>
                            <Box>
                              <Grid container>
                                {view != "detailview" ? (
                                  <Grid item xs={12}>
                                    <Grid
                                      container
                                      direction="row"
                                      justify="flex-start"
                                      alignItems="flex-start"
                                    >
                                      <Grid
                                        item
                                        className={classes.addInviteeBtn}
                                      >
                                        <FormInput
                                          field={{
                                            type: "relate",
                                            name: "invitees",
                                            module: "Users",
                                            label: {
                                              LBL_REMINDER_ADD_INVITIES,
                                            },
                                          }}
                                          module={"Users"}
                                          tooltipTitle={
                                            LBL_REMINDER_ADD_INVITIES
                                          }
                                          value={""}
                                          multiSelect={true}
                                          onChange={(val) =>
                                            handleSelectInvitees(
                                              val,
                                              reminderKey,
                                            )
                                          }
                                          component={"reminder"}
                                          isIconBtn={true}
                                          btnIcon={
                                            <>
                                              <SearchIcon />{" "}
                                              {LBL_REMINDER_CHOOSE_USERS}
                                            </>
                                          }
                                          isSelectBtn={true}
                                          color="primary"
                                          variant="outlined"
                                          disabled={disabled}
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        className={classes.addInviteeBtn}
                                      >
                                        <FormInput
                                          field={{
                                            type: "relate",
                                            name: "invitees",
                                            module: "Contacts",
                                            label: {
                                              LBL_REMINDER_ADD_INVITIES,
                                            },
                                          }}
                                          module={"Contacts"}
                                          tooltipTitle={
                                            LBL_REMINDER_ADD_INVITIES
                                          }
                                          value={""}
                                          multiSelect={true}
                                          onChange={(val) =>
                                            handleSelectInvitees(
                                              val,
                                              reminderKey,
                                            )
                                          }
                                          component={"reminder"}
                                          isIconBtn={true}
                                          btnIcon={
                                            <>
                                              <SearchIcon />{" "}
                                              {LBL_REMINDER_CHOOSE_CONTCATS}
                                            </>
                                          }
                                          isSelectBtn={true}
                                          variant="outlined"
                                          disabled={disabled}
                                          color="primary"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        className={classes.addInviteeBtn}
                                      >
                                        <FormInput
                                          field={{
                                            type: "relate",
                                            name: "invitees",
                                            module: "Leads",
                                            label: {
                                              LBL_REMINDER_ADD_INVITIES,
                                            },
                                          }}
                                          module={"Leads"}
                                          tooltipTitle={
                                            LBL_REMINDER_ADD_INVITIES
                                          }
                                          value={""}
                                          multiSelect={true}
                                          onChange={(val) =>
                                            handleSelectInvitees(
                                              val,
                                              reminderKey,
                                            )
                                          }
                                          component={"reminder"}
                                          isIconBtn={true}
                                          btnIcon={
                                            <>
                                              <SearchIcon />{" "}
                                              {LBL_REMINDER_CHOOSE_LEADS}
                                            </>
                                          }
                                          isSelectBtn={true}
                                          variant="outlined"
                                          disabled={disabled}
                                          color="primary"
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                ) : (
                                  ""
                                )}
                                <Grid
                                  item
                                  xs={12}
                                  className={classes.addInviteeBtn}
                                >
                                  <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                  >
                                    <Grid item xs={12} sm={6}>
                                      {!reminder.popup && !reminder.email && (
                                        <Alert severity="warning">
                                          Reminder is not set for either a popup
                                          or email
                                        </Alert>
                                      )}
                                      <FormControl component="fieldset">
                                        <FormGroup aria-label="position" row>
                                          <FormControlLabel
                                            control={
                                              <Switch
                                                edge="end"
                                                value={reminder.popup}
                                                onChange={handleToggle(
                                                  reminderKey,
                                                  "popup",
                                                )}
                                                checked={reminder.popup}
                                                disabled={disabled}
                                                color={
                                                  view == "detailview"
                                                    ? "secondary"
                                                    : "primary"
                                                }
                                              />
                                            }
                                            label={LBL_REMINDER_POPUP}
                                            labelPlacement="end"
                                          />
                                        </FormGroup>
                                      </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      {reminder.popup == true && (
                                        <TextField
                                          id={`timer_popup${reminderKey}`}
                                          name={"timer_popup"}
                                          error={iserror}
                                          required={
                                            field.required === "true" ||
                                            errors[field.name] ===
                                              LBL_REQUIRED_FIELD
                                              ? true
                                              : false
                                          }
                                          select
                                          label={field.label}
                                          value={reminder.timer_popup || "1800"}
                                          onChange={(e) =>
                                            handleChange(e, reminderKey)
                                          }
                                          variant={variant}
                                          size={"small"}
                                          disabled={disabled}
                                          fullWidth={true}
                                          className={classes.select}
                                          onCut={onCopy}
                                          onCopy={onCopy}
                                          onPaste={onCopy}
                                          onContextMenu={onCopy}
                                        >
                                          {renderOptions()}
                                        </TextField>
                                      )}
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid
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
                                                value={reminder.email}
                                                onChange={handleToggle(
                                                  reminderKey,
                                                  "email",
                                                )}
                                                checked={reminder.email}
                                                color={
                                                  view == "detailview"
                                                    ? "secondary"
                                                    : "primary"
                                                }
                                              />
                                            }
                                            label={LBL_REMINDER_EMAIL}
                                            labelPlacement="end"
                                            disabled={disabled}
                                          />
                                        </FormGroup>
                                      </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      {reminder.email == true && (
                                        <TextField
                                          id={field.name}
                                          name={"timer_email"}
                                          error={iserror}
                                          required={
                                            field.required === "true" ||
                                            errors[field.name] ===
                                              LBL_REQUIRED_FIELD
                                              ? true
                                              : false
                                          }
                                          select
                                          label={field.label}
                                          value={reminder.timer_email || "1800"}
                                          onChange={(e) =>
                                            handleChange(e, reminderKey)
                                          }
                                          variant={variant}
                                          size={"small"}
                                          disabled={disabled}
                                          fullWidth={true}
                                          className={classes.select}
                                          onCut={onCopy}
                                          onCopy={onCopy}
                                          onPaste={onCopy}
                                          onContextMenu={onCopy}
                                        >
                                          {renderOptions()}
                                        </TextField>
                                      )}
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                  {!disabled ? (
                                    <Button
                                      disabled={reminderKey === 0}
                                      variant="outlined"
                                      size="small"
                                      color="primary"
                                      onClick={() =>
                                        removeReminder(reminderKey)
                                      }
                                      className={classes.margin}
                                    >
                                      {LBL_REMINDER_REMOVE_BUTTON}
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                </Grid>
                              </Grid>
                            </Box>
                            <Box></Box>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  ))}
                </Grid>
              </MuiThemeProvider>
            </CardContent>
          ) : (
            ""
          )}
          <CardActions>
            {!disabled ? (
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={addReminder}
                className={classes.margin}
              >
                {LBL_ADD_REMINDER_BUTTON}
              </Button>
            ) : (
              ""
            )}
          </CardActions>
        </Card>
      </Paper>
    </>
  );
}
