import React, { useCallback } from "react";
import {
  FormControl,
  Grid,
  Box,
  Button,
  Chip,
  InputLabel,
  ButtonGroup,
  InputAdornment,
  Avatar,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { Search as SearchIcon } from "@material-ui/icons";
import { pathOr, isNil, isEmpty } from "ramda";
import useStyles from "./styles";
import {
  LBL_ADD_REMINDER_BUTTON,
  LBL_REMINDER_ADD_INVITIES,
  LBL_REMINDER_POPUP,
  LBL_REMINDER_EMAIL,
  LBL_REMINDER_MINUTE_PRIOR,
  LBL_REMINDER_HOUR_PRIOR,
  LBL_REMINDER_DAY_PRIOR,
} from "@/constant";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";
import { PropTypes } from "prop-types";
import CustomFormInput from "..";
import { Checkbox } from "@/components/SharedComponents/InputComponents";
import { getFirstAlphabet, stringToColor } from "@/common/utils";
const priorArr = {
  60: `1 ${LBL_REMINDER_MINUTE_PRIOR}`,
  300: `5 ${LBL_REMINDER_MINUTE_PRIOR}`,
  600: `10 ${LBL_REMINDER_MINUTE_PRIOR}`,
  900: `15 ${LBL_REMINDER_MINUTE_PRIOR}`,
  1800: `30 ${LBL_REMINDER_MINUTE_PRIOR}`,
  3600: `1 ${LBL_REMINDER_HOUR_PRIOR}`,
  7200: `2 ${LBL_REMINDER_HOUR_PRIOR}`,
  10800: `3 ${LBL_REMINDER_HOUR_PRIOR}`,
  18000: `5 ${LBL_REMINDER_HOUR_PRIOR}`,
  86400: `1 ${LBL_REMINDER_DAY_PRIOR}`,
};
const addInviteeModules = ["Users", "Contacts", "Leads"];

const DEFAULT_REMINDER = {
  idx: 0,
  id: "",
  popup: true,
  email: true,
  timer_popup: 1800,
  timer_email: 3600,
  del_invitees: [],
  invitees: [],
};
export default function Reminders(props) {
  const {
    fieldMetaObj,
    field,
    onChange,
    disabled = false,
    size,
    variant,
    fieldState,
    moduleMetaData,
    value,
  } = props;
  const classes = useStyles();
  const defaultReminder = pathOr(
    DEFAULT_REMINDER,
    ["defaultReminder"],
    fieldMetaObj,
  );
  const isContentVisible =
    // !!field?.value &&
    moduleMetaData?.currentView == LAYOUT_VIEW_TYPE?.createView ||
    moduleMetaData?.currentView == LAYOUT_VIEW_TYPE?.editView ||
    moduleMetaData?.currentView == LAYOUT_VIEW_TYPE?.quickCreateView ||
    moduleMetaData?.currentView == LAYOUT_VIEW_TYPE?.detailView ||
    moduleMetaData?.currentView == LAYOUT_VIEW_TYPE?.createView ||
    moduleMetaData?.currentView == LAYOUT_VIEW_TYPE?.duplicateView;

  const addReminder = useCallback(() => {
    let tempFieldValue = [...value];
    const reminderDataArray = tempFieldValue.concat(defaultReminder);
    onChange(reminderDataArray);
  }, [value, onChange, defaultReminder]);

  const handleRemoveReminder = useCallback(
    (reminderCardIndex) => {
      let tempFieldValue = [...value];
      tempFieldValue.splice(reminderCardIndex, 1);
      onChange(tempFieldValue);
    },
    [value, onChange],
  );
  const handleReminderFieldChange = useCallback(
    (reminderCardIndex, fieldKey, inputValue) => {
      if (fieldKey === "invitees") {
        const selectedRecords = pathOr([], ["selectedRecords"], inputValue);
        const prevSelectedInvitees = pathOr(
          [],
          [reminderCardIndex, "invitees"],
          value,
        );
        const inputDataObj =
          inputValue?.selectedRecords &&
          Object.values(selectedRecords).map((e) => {
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
        const uniqueInvitees = [
          ...new Map(
            [...prevSelectedInvitees, ...inputDataObj].map((item) => [
              item["module_id"],
              item,
            ]),
          ).values(),
        ];
        value[reminderCardIndex][fieldKey] = uniqueInvitees;
      } else if (fieldKey === "del_invitees") {
        if (
          !value[reminderCardIndex].hasOwnProperty("del_invitees") ||
          isNil(value[reminderCardIndex]?.del_invitees) ||
          isEmpty(value[reminderCardIndex]?.del_invitees)
        ) {
          value[reminderCardIndex].del_invitees = [];
        }
        value[reminderCardIndex].del_invitees = [
          ...value[reminderCardIndex].del_invitees,
          value[reminderCardIndex].invitees[inputValue],
        ];
        value[reminderCardIndex].invitees.splice(inputValue, 1);
      } else {
        if (fieldKey == "email" || fieldKey == "popup") {
          value[reminderCardIndex][`timer_${fieldKey}`] = -1;
        }
        value[reminderCardIndex][fieldKey] = inputValue;
      }
      onChange(value);
    },
    [value, onChange],
  );
  return (
    <FormControl
      size={size}
      variant={variant}
      fullWidth
      error={fieldState?.error}
      disabled={fieldState?.disabled}
      className={classes.formControl}
    >
      <InputLabel shrink={true} className={classes.inputLabel}>
        {fieldMetaObj?.label}
      </InputLabel>
      <div className={classes.reminder}>
        {isContentVisible &&
          !!value &&
          value.map((reminder, reminderKey) => (
            <Grid
              item
              xs={12}
              id={`reminder-card-${reminderKey}`}
              key={`reminder-card-${reminderKey}`}
              // style={{ border: "1px dashed black", boxShadow: "none" }}
            >
              <ReminderCardContent
                {...props}
                reminderIndex={reminderKey}
                reminder={reminder}
                onRemoveReminder={handleRemoveReminder}
                onReminderFieldChange={handleReminderFieldChange}
              />
            </Grid>
          ))}
        <div className={classes.reminderBox}>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={addReminder}
            disabled={disabled}
            startIcon={<AddIcon />}
          >
            {LBL_ADD_REMINDER_BUTTON}
          </Button>
        </div>
      </div>
    </FormControl>
  );
}

const ReminderCardContent = (props) => {
  const {
    reminder,
    reminderIndex,
    fieldState,
    moduleMetaData,
    variant,
    fieldMetaObj,
    onRemoveReminder,
    onReminderFieldChange,
    ...rest
  } = props;
  const classes = useStyles();
  return (
    <Box elevation={1} className={classes.reminderCard}>
      {moduleMetaData?.currentView !== LAYOUT_VIEW_TYPE?.detailView && (
        <ReminderInputForm
          {...rest}
          fieldState={fieldState}
          fieldMetaObj={fieldMetaObj}
          reminder={reminder}
          reminderIndex={reminderIndex}
          onReminderFieldChange={onReminderFieldChange}
          onRemoveReminder={onRemoveReminder}
        />
      )}
      <ReminderInviteeList
        {...rest}
        reminder={reminder}
        reminderIndex={reminderIndex}
        onReminderFieldChange={onReminderFieldChange}
      />
      {moduleMetaData?.currentView !== LAYOUT_VIEW_TYPE?.detailView && (
        <RemiderAddInvitee
          {...rest}
          fieldState={fieldState}
          reminderIndex={reminderIndex}
          onReminderFieldChange={onReminderFieldChange}
        />
      )}
      {/* <CardActions> */}
      {/* <Button
          variant="outlined"
          size="small"
          color="primary"
          startIcon={<DeleteIcon/>}
          onClick={() => onRemoveReminder(reminderIndex)}
        >
          {LBL_REMINDER_REMOVE_BUTTON}
        </Button> */}
      {/* </CardActions> */}
    </Box>
  );
};

const RemiderAddInvitee = ({
  onReminderFieldChange,
  reminderIndex,
  fieldState,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <ButtonGroup
      component={Box}
      size="small"
      color="primary"
      className={classes.addInvitees}
    >
      {addInviteeModules?.map((moduleName) => (
        <CustomFormInput
          {...rest}
          control={null}
          fieldState={fieldState}
          fieldMetaObj={{
            type: "relate",
            name: "invitees",
            module: moduleName,
            label: LBL_REMINDER_ADD_INVITIES,
          }}
          comment={LBL_REMINDER_ADD_INVITIES}
          customProps={{
            isSelectTypeBtn: true,
            multiSelect: true,
            isIconBtn: true,
            btnLabel: moduleName,
            btnIcon: <SearchIcon className={classes.searchIcon} />,
          }}
          onChange={(val) =>
            onReminderFieldChange(reminderIndex, "invitees", val)
          }
        />
      ))}
    </ButtonGroup>
  );
};
const ReminderInviteeList = ({
  reminderIndex,
  reminder,
  onReminderFieldChange,
  fieldState,
}) => {
  const { invitees = [] } = reminder;
  const classes = useStyles();
  return (
    <Box className={classes.inviteeList}>
      {!!invitees &&
        invitees.map((data, key) => (
          <Chip
            key={`${data.value}-${key}`}
            // color={view == "detailview" ? "secondary" : ""}
            className={classes.inviteeChip}
            disabled={fieldState?.disabled}
            label={data?.value}
            variant="outlined"
            icon={
              <Avatar
                className={classes.inviteeAvatar}
                style={{ backgroundColor: `${stringToColor(data?.value)}40` }}
                src={data?.value}
              >
                {getFirstAlphabet(data?.value)}
              </Avatar>
            }
            size="small"
            onDelete={() =>
              onReminderFieldChange(reminderIndex, "del_invitees", key)
            }
          />
        ))}
    </Box>
  );
};

const ReminderInputForm = ({
  reminder,
  reminderIndex,
  fieldState,
  variant,
  fieldMetaObj,
  onReminderFieldChange,
  onRemoveReminder,
  ...rest
}) => {
  const {
    timer_popup = "1800",
    timer_email = "1800",
    email = true,
    popup = true,
  } = reminder;
  const classes = useStyles();
  return (
    <Box className={classes.reminderFieldBox}>
      <Grid component={Box} direction="row" container spacing={1}>
        <Grid item xs={12} md={6}>
          <CustomFormInput
            {...rest}
            control={null}
            fieldState={{
              ...fieldState,
              disabled: !!fieldState?.disabled || !popup,
            }}
            fieldMetaObj={{
              name: `timer_popup${reminderIndex}`,
              label: `${LBL_REMINDER_POPUP} ${fieldMetaObj?.label}`,
              type: "enum",
              options: priorArr,
            }}
            value={timer_popup}
            onChange={(v) =>
              onReminderFieldChange(reminderIndex, "timer_popup", v)
            }
            customProps={{
              field: {
                InputProps: {
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      className={classes.reminderField}
                    >
                      <Checkbox
                        value={email}
                        onChange={(v) => {
                          onReminderFieldChange(reminderIndex, "popup", !popup);
                        }}
                        checked={popup}
                        size="small"
                        color="primary"
                        labelPlacement="end"
                        disabled={!!fieldState?.disabled}
                      />
                    </InputAdornment>
                  ),
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomFormInput
            {...rest}
            control={null}
            fieldState={{
              ...fieldState,
              disabled: !!fieldState?.disabled || !email,
            }}
            fieldMetaObj={{
              name: `timer_email${reminderIndex}`,
              label: `${LBL_REMINDER_EMAIL} ${fieldMetaObj?.label}`,
              type: "enum",
              options: priorArr,
            }}
            value={timer_email}
            onChange={(v) =>
              onReminderFieldChange(reminderIndex, "timer_email", v)
            }
            customProps={{
              field: {
                InputProps: {
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      className={classes.reminderField}
                    >
                      <Checkbox
                        value={email}
                        onChange={(v) =>
                          onReminderFieldChange(reminderIndex, "email", !email)
                        }
                        checked={email}
                        size="small"
                        color="primary"
                        labelPlacement="end"
                        disabled={!!fieldState?.disabled}
                      />
                    </InputAdornment>
                  ),
                },
              },
            }}
          />
        </Grid>
      </Grid>
      <IconButton size="small" onClick={() => onRemoveReminder(reminderIndex)}>
        <DeleteIcon color="action" size="small" />
      </IconButton>
    </Box>
  );
};

Reminders.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

Reminders.defaultProps = {
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
