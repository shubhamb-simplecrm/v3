import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
// styles
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useStyles from "./styles";
import {
  createOrEditRecordAction,
  getEditViewFormDataAction,
} from "../../../../store/actions/edit.actions";
import { toast } from "react-toastify";
import {
  Grid,
  useTheme,
  Paper,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  CircularProgress,
} from "@material-ui/core";
import { TabPanel, ControlledAccordions } from "../../..";
import {
  removeFieldHiddenValueRepeatCalendar,
  validateForm,
  checkInitGroupValidate,
  isValidationApplied,
} from "../../../../common/utils";
import { Scrollbars } from "react-custom-scrollbars";
import {
  calculate_duration,
  add_custom_duration,
} from "../../../../common/duration_dependency";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { Skeleton } from "../../../../components";
import { calculateTotal } from "../../../FormComponents/lineItem/calculate";
import {
  LBL_SAVE_BUTTON_TITLE,
  LBL_CANCEL_BUTTON_TITLE,
  LBL_CREATE_TASK_BUTTON,
  LBL_LOG_CALL,
  LBL_SCHEDULE_MEETING,
  SOMETHING_WENT_WRONG,
  LBL_RECORD_CREATED,
  LBL_SAVE_INPROGRESS,
} from "../../../../constant";
import SkeletonShell from "../../../Skeleton";
import dayjs from "dayjs";
import useCommonUtils from "../../../../hooks/useCommonUtils";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";

export default function QuickCreate({
  calendarView = false,
  selectedDate,
  openQuickCreateDialog,
  setOpenQuickCreateDialog,
  whichQuickCreate,
  parent_name,
  parent_id,
  record_name = null,
  parent_type,
  setIsSubpanelUpdated,
  setValue,
  value,
  view = "Detail",
  calendarViewType = null,
  initialData = {},
  isEmailDetailView = false,
  relationShipName = "",
  relationShipModule = "",
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [data, setData] = useState([]);
  const [moduleLable, setModuleLable] = useState(whichQuickCreate);
  const [loading, setLoading] = useState(false);
  const [module, setModule] = useState(whichQuickCreate);
  let [initialValues, setInitialValues] = useState({});
  const [fields, setFields] = useState({});
  const [fieldConfigurator, setFieldConfigurator] = useState({});
  const [errors, setErrors] = useState({});
  const classes = useStyles();
  const currentTheme = useTheme();
  const fullScreen = useMediaQuery(
    currentTheme.breakpoints.down(calendarView ? "md" : "sm"),
  );
  const isApplyFieldConfigErrorOnBlurOptions = [
    // "bool",
    // "JSONeditor",
    // "currency",
    // "date",
    // "datetime",
    // "datetimecombo",
    // "dynamicenum",
    // "enum",
    // "radioenum",
    // "file",
    // "image",
    "decimal",
    "float",
    "int",
    // "suggestion",
    // "multienum",
    // "parent",
    // "assigned_user_name",
    // "relate",
    "text",
    // "iframe",
    "url",
    "wysiwyg",
    // "line_item",
    "address",
    "email",
    // "password",
    "name",
    "phone",
    "varChar",
  ];
  var isTab = false;
  const { editViewLoading } = useSelector((state) => state.edit);
  const config = useSelector((state) => state.config?.config);
  const userPreference = useSelector((state) => state.config?.userPreference);
  const currentUserData = useSelector((state) => state.config?.currentUserData);
  const { getParseDateTimeFormat } = useCommonUtils();
  const calendar_format = pathOr(
    config?.default_date_format,
    ["attributes", "global", "calendar_format"],
    userPreference,
  );
  const date_reg_format = pathOr(
    config?.default_date_format,
    ["attributes", "global", "date_reg_format"],
    userPreference,
  );
  const time_reg_format = pathOr(
    config?.default_date_format,
    ["attributes", "global", "time_reg_format"],
    userPreference,
  );
  const date_reg_positions = pathOr(
    config?.default_date_format,
    ["attributes", "global", "date_reg_positions"],
    userPreference,
  );
  const configurator = pathOr(
    [],
    ["hideShowConf", "appConfigurator", module],
    config,
  );
  const { disabledAlways, hiddenAlways, ...rest } = configurator;
  let [hiddenAll, setHiddenAll] = useState({
    hidden: hiddenAlways || [],
    disabled: disabledAlways || [],
  });
  const defaultReminderData = [
    {
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
    },
  ];

  const CurrenciesRecords = pathOr(
    [],
    ["attributes", "CurrenciesRecords"],
    useSelector((state) => state.config.userPreference),
  );
  let [cchange, setCchange] = useState({});
  let [lastCurrency, setLastCurrency] = useState([]);
  const getQuickCreateData = useCallback((module) => {
    getEditViewFormDataAction(module, LAYOUT_VIEW_TYPE?.quickCreateView, null, {
      calendarSelectedDate: selectedDate,
      calendarViewType: calendarViewType,
    }).then(function (res) {
      let fieldConfigData = pathOr(
        [],
        [
          "data",
          "templateMeta",
          "FieldConfigursion",
          "data",
          "JSONeditor",
          "dynamicLogic",
          "fields",
        ],
        res,
      );
      setFieldConfigurator(fieldConfigData);
      if (res) {
        setData(pathOr([], ["data", "templateMeta", "data"], res));
        setModuleLable(pathOr([], ["data", "module_label"], res));
      } else {
        toast(SOMETHING_WENT_WRONG);
      }
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    setLoading(true);
    getQuickCreateData(module);
    setErrors({});
    setFields({});
    setInitialValues({});
  }, [module]);

  useEffect(() => {
    if (data.length) {
      let initialState = [];
      let fieldState = [];
      Object.keys(data).map((row) => {
        setValues(data[row].attributes, initialState, fieldState);
        data[row].panels &&
          data[row].panels.map((panelRow) => {
            setValues(panelRow.attributes, initialState, fieldState);
          });
      });

      initialValues = initialState;
      setInitialValues(initialValues);

      if (module === "Meetings") {
        let duration = {
          duration: initialValues.duration || "",
          duration_hours: initialValues.duration_hours || "",
          duration_minutes: initialValues.duration_minutes || "",
        };
        duration.duration_hours = 0;
        duration.duration_minutes = 15;
        duration.duration = 900;
        initialValues["duration"] = duration.duration;
        initialValues["duration_hours"] = duration.duration_hours;
        initialValues["duration_minutes"] = duration.duration_minutes;

        if (initialValues?.reminders?.length > 0) {
          setInitialValues(initialValues);
        } else {
          initialValues["reminders"] = defaultReminderData;
          setInitialValues(initialValues);
        }
      }
      if (module === "Calls") {
        if (initialValues?.reminders?.length > 0) {
          setInitialValues(initialValues);
        } else {
          initialValues["reminders"] = defaultReminderData;
          setInitialValues(initialValues);
        }
      }
    }
  }, [data]);
  let count = 0;
  const setValues = (attributes, initialState, fieldState) => {
    attributes.map((rowField) => {
      rowField.map((field) => {
        setDependencyHidden(field, field.value);
        if (field.name === "parent_name") {
          return (
            field.name
              ? (initialState[field.name] = parent_name
                  ? { parent_name, parent_id, parent_type }
                  : "")
              : null,
            field.name ? (fields[field.name] = field) : null
          );
        } else if (field.name === "duration") {
          return (
            field.name
              ? (initialState[field.name] = field.value ? field.value : "0")
              : null,
            field.name
              ? (initialState["duration_hours"] = field.duration_hours || "0")
              : null,
            field.name
              ? (initialState["duration_minutes"] =
                  field.duration_minutes || "0")
              : null,
            field.name ? (fields[field.name] = field) : null
          );
        } else if (isEmailDetailView) {
          return (
            field.name
              ? (initialState[field.name] = initialData[field.name]
                  ? initialData[field.name]
                  : "")
              : null,
            field.name ? (fields[field.name] = field) : null
          );
        } else if (field.module === parent_type) {
          return (
            field.name
              ? (initialState[field.name] = parent_id
                  ? { id: parent_id, value: record_name }
                  : "")
              : null,
            field.name ? (fields[field.name] = field) : null
          );
        } else if (field.type === "decimal") {
          if (field.hasOwnProperty("decimalcurrency")) {
            field.value === ""
              ? (initialState[field.name] = 0.0)
              : (initialState[field.name] = field.value);
            cchange[count] = field.name;
            setCchange(cchange);
            count++;
          }
        } else {
          return (
            field.name
              ? (initialState[field.name] = field.value ? field.value : "")
              : null,
            field.name ? (fields[field.name] = field) : null,
            field.name === "currency_id" ? lastCurrency.push(field.value) : null
          );
        }
      });
    });
  };
  const setDependencyHidden = (field, value) => {
    if (rest) {
      const innerHiddenAlways = Object.values(rest).find(
        (o) => o.fieldsSel[0] === field.name,
      );
      const newCaptureCond = pathOr([], ["condition"], innerHiddenAlways);

      const innCond = Object.values(newCaptureCond).find((o) =>
        o.field_value[0] === field.options
          ? field.options[value]
          : field.type === "bool"
            ? value === 0
              ? "false"
              : value
                ? "true"
                : "false"
            : value,
      );
      const hiddField = pathOr([], ["hiddenField"], innCond);
      if (field.type === "bool") {
        if (value === "0" || value === false) {
          let array3 = [...hiddenAll["hidden"], ...hiddField];
          array3 = array3.filter((item, index) => {
            return array3.indexOf(item) == index;
          });
          setHiddenAll({ ...hiddenAll, hidden: array3 });
        } else if (value !== "") {
          let array3 = [...hiddenAll["hidden"], ...hiddField];
          array3 = hiddenAll["hidden"].filter((item, index) => {
            return hiddField.indexOf(item) !== index;
          });
          setHiddenAll({ ...hiddenAll, ["hidden"]: array3 });
        }
      } else {
        if (innerHiddenAlways && value) {
          const innerHiddenAlways2 = field.options
            ? Object.values(newCaptureCond).find(
                (o) => o.field_value[0] === field.options[value],
              )
              ? Object.values(newCaptureCond).find(
                  (o) => o.field_value[0] === field.options[value],
                )
              : Object.values(newCaptureCond).find(
                  (o) => o.field_value[0] === value,
                )
            : Object.values(newCaptureCond).find(
                (o) => o.field_value[0] === field.options[value],
              );
          if (innerHiddenAlways2 && hiddField) {
            let array3 = [...hiddenAll["hidden"], ...hiddField];

            array3 = array3.filter((item, index) => {
              return array3.indexOf(item) == index;
            });

            setHiddenAll({ ...hiddenAll, ["hidden"]: array3 });
          } else {
            setHiddenAll({ ...hiddenAll, ["hidden"]: hiddenAll["hidden"] });
          }
        }
      }
    }
  };
  const handleDateTimeChange = (date) => {
    let current_datetime = new Date(date);
    return (
      current_datetime.getFullYear() +
      "-" +
      ("0" + (current_datetime.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + current_datetime.getDate()).slice(-2) +
      " " +
      ("0" + current_datetime.getHours()).slice(-2) +
      ":" +
      ("0" + current_datetime.getMinutes()).slice(-2) +
      ":" +
      ("0" + current_datetime.getSeconds()).slice(-2)
    );
  };

  const getFormatedValue = () => {
    let init = initialValues;
    for (let key in init) {
      if (typeof init[key] === "object" && key === "parent_name") {
        init = { ...init, ...init[key] };
      }
    }
    return init;
  };
  const getBase64 = (file, cb) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve({ name: file.name, file_content: reader.result });
      reader.onerror = (error) => reject(error);
    });
  };

  const onChange = (field, value) => {
    setDependencyHidden(field, value);
    if (field.type === "relate") {
      initialValues[field.name] = { value: value.value, id: value.id };
      setInitialValues(initialValues);
      return;
    } else if (field.type === "file") {
      if (module === "Documents") {
        value
          ? getBase64(value).then((data) => {
              let tempInitialValues = clone(initialValues);
              tempInitialValues[field.name] = [data];
              tempInitialValues["document_name"] = value.name || "";
              tempInitialValues["revision"] = "1";
              setInitialValues({ ...tempInitialValues });
            })
          : setInitialValues({
              ...initialValues,
              [field.name]: [{ name: null, file_content: "" }],
              document_name: "" || "",
              revision: "",
              status_id: "",
            });
      } else {
        value
          ? getBase64(value).then((data) => {
              initialValues[field.name] = [data];
              setInitialValues(initialValues);
            })
          : setInitialValues({
              ...initialValues,
              [field.name]: [{ name: null, file_content: "" }],
            });
      }
      return;
    }
    initialValues[field.name] = value;
    setInitialValues(initialValues);
    if (module === "Meetings") {
      if (field.name === "date_start" || field.name === "date_end") {
        let initialValuesData = clone(initialValues);
        initialValuesData[field.name] = value;
        initialValues[field.name] = value;
        let date_start = initialValues.date_start || "";
        let date_end = initialValues.date_end || "";
        let duration = {
          duration: initialValues.duration || "",
          duration_hours: initialValues.duration_hours || "",
          duration_minutes: initialValues.duration_minutes || "",
        };
        if (date_start && date_end) {
          duration = calculate_duration(
            date_start,
            date_end,
            calendar_format,
            date_reg_format,
            date_reg_positions,
            time_reg_format,
          );
          handleMeetingDuration(data, duration.duration);
        }
        setInitialValues({ ...initialValuesData, ...duration });
      } else if (field.type == "function") {
        const hiddenAndFilterValuesObj =
          removeFieldHiddenValueRepeatCalendar(value);
        initialValues[field.name] = hiddenAndFilterValuesObj.filteredValues;
      } else if (field.name === "duration") {
        initialValues[field.name] = value;
        const dateStart = initialValues.date_start || "";
        const newEndDate = dayjs(dateStart, getParseDateTimeFormat)
          .add(value, "s")
          .format(getParseDateTimeFormat);
        initialValues["date_end"] = newEndDate;
        setInitialValues({ ...initialValues });
      }
    }

    if (field.name === "currency_id") {
      lastCurrency.push(value);
      initialValues[field.name] = value;
    }

    if (module === "AOS_Quotes" || module === "AOS_Invoices") {
      initialValues[field.name] = value;
      let calResult = calculateTotal(
        initialValues,
        CurrenciesRecords,
        fields,
        lastCurrency,
        field.name,
      );
      setInitialValues(calResult);
    }
    if (module !== "AOS_Quotes" && field.name === "currency_id") {
      initialValues[field.name] = value;

      let id = initialValues.currency_id;
      if (id === -99.0 || id === -99 || id === "-99.00") {
      } else {
        let newRate = 1;
        let oldRate = 1;
        let getLastCurrency = lastCurrency[lastCurrency.length - 2];
        Object.values(CurrenciesRecords).map((getCurrency) => {
          if (getCurrency.id === id) {
            newRate =
              id === -99.0 || id === "-99.00" || id === "-99"
                ? 1
                : getCurrency.conversion_rate;
          }
          if (getCurrency.id === getLastCurrency) {
            oldRate =
              getLastCurrency === -99.0 ||
              getLastCurrency === "-99.00" ||
              getLastCurrency === "-99"
                ? 1
                : getCurrency.conversion_rate;
          }
        });
        let cchangeArray = [];
        Object.keys(cchange).map((field) => {
          let convertVal = parseFloat(
            ConvertFromDollar(
              parseFloat(
                ConvertToDollar(
                  parseFloat(unformat2Number(initialValues[cchange[field]])),
                  oldRate,
                ),
              ),
              newRate,
            ),
          );
          initialValues[cchange[field]] = formatCurrency(convertVal);
        });
        setInitialValues(initialValues);
      }
    }
    if (
      !isApplyFieldConfigErrorOnBlurOptions.some((item) => field.type === item)
    ) {
      onChangeApplyErrors(field, value, initialValues);
    }
  };
  const ConvertToDollar = (amount, rate) => {
    return amount / rate;
  };
  const ConvertFromDollar = (amount, rate) => {
    return amount * rate;
  };
  const unformat2Number = (num) => {
    return num.toString().replace(/\$|\,/g, "");
  };
  const formatCurrency = (strValue) => {
    strValue = strValue.toString().replace(/\$|\,/g, "");
    let dblValue = parseFloat(strValue);

    let blnSign = dblValue == (dblValue = Math.abs(dblValue));
    dblValue = Math.floor(dblValue * 100 + 0.50000000001);
    let intCents = dblValue % 100;
    let strCents = intCents.toString();
    dblValue = Math.floor(dblValue / 100).toString();
    if (intCents < 10) strCents = "0" + strCents;
    for (var i = 0; i < Math.floor((dblValue.length - (1 + i)) / 3); i++)
      dblValue =
        dblValue.substring(0, dblValue.length - (4 * i + 3)) +
        "," +
        dblValue.substring(dblValue.length - (4 * i + 3));

    return (blnSign ? "" : "-") + dblValue + "." + strCents;
  };
  const handleMeetingDuration = (data, duration) => {
    let cstm = add_custom_duration(duration);
    for (var x in data) {
      if (typeof data[x] == typeof {}) {
        handleMeetingDuration(data[x], duration);
      }
      if (data[x] == "duration") {
        data["value"] = cstm?.value;
        data["options"] = {
          ...data["options"],
          [cstm?.value]: cstm?.label.trim(),
        };
      }
    }
  };

  const onSubmit = async (data) => {
    let view = "QuickCreate";
    try {
      createOrEditRecordAction(data, LAYOUT_VIEW_TYPE?.quickCreateView).then(
        function (res) {
          if (res && res.data.id) {
            toast(LBL_RECORD_CREATED);
            setOpenQuickCreateDialog(false);
            setIsSubpanelUpdated(true);
            if (!calendarView) {
              setValue(value);
            }
          } else {
            toast(
              res.ok
                ? pathOr("", ["data", "meta", "message"], res)
                : pathOr("", ["data", "errors", "detail"], res),
            );
          }
        },
      );
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    let validate = validateForm(
      fields,
      initialValues,
      {
        calendar_format,
        date_reg_format,
        time_reg_format,
        date_reg_positions,
      },
      fieldConfigurator,
    );
    setErrors(validate.errors);
    if (validate.formIsValid) {
      let convert_attributes = getFormatedValue();
      convert_attributes = Array.isArray(convert_attributes)
        ? Object.assign({}, convert_attributes)
        : convert_attributes;

      var submitData = {
        data: {
          type: module,
          attributes: convert_attributes,
        },
      };

      if (!initialValues.hasOwnProperty("parent_name")) {
        submitData["data"]["relateBean"] = [
          {
            type: parent_type,
            id: parent_id,
            relationshipName: relationShipName ? relationShipName : "",
            relationshipModule: relationShipModule ? relationShipModule : "",
          },
        ];
      }

      onSubmit(submitData);
    }
  };

  const handleClose = () => {
    setOpenQuickCreateDialog(false);
  };

  const onChangeApplyErrors = (field, value, initialValues) => {
    const iValidationOnFields = isValidationApplied(
      field.name,
      fieldConfigurator,
      fields,
    );
    const configuratorValidation = onChangeValidationCheck(
      iValidationOnFields,
      initialValues,
      fieldConfigurator,
      true,
      errors,
      ["visible", "readOnly"],
    );
    setErrors({ ...errors, ...configuratorValidation });
  };

  const onBlur = (field, value) => {
    if (
      isApplyFieldConfigErrorOnBlurOptions.some((item) => field.type === item)
    ) {
      onChangeApplyErrors(field, value, initialValues);
    }
  };

  const onChangeValidationCheck = (
    fields,
    initialValues,
    fieldConfigurator,
    status,
    errors,
    typeList,
  ) => {
    const getValidation = checkInitGroupValidate(
      fields,
      initialValues,
      fieldConfigurator,
      status,
      errors,
      typeList,
    );
    return pathOr(errors, ["errors"], getValidation);
  };

  useEffect(() => {
    const getNewErrors = onChangeValidationCheck(
      fields,
      initialValues,
      fieldConfigurator,
      true,
      errors,
      ["visible", "readOnly"],
    );
    setErrors({ ...errors, getNewErrors });
  }, [initialValues]);

  const innerView = () => {
    return (
      <form
        onSubmit={handleSubmit}
        className={`${classes.root} ${classes.mobileLayoutFormHt} ${classes.tryone}`}
        noValidate
        autoComplete="off"
      >
        <DialogTitle id="alert-dialog-title">
          <Paper className={classes.dialogTitle}>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              spacing={2}
            >
              {loading && !data.length && !initialValues.length ? (
                !calendarView ? (
                  <SkeletonShell />
                ) : null
              ) : (
                <>
                  <Grid item>
                    {calendarView ? (
                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          aria-label="position"
                          name="position"
                          defaultValue={module}
                        >
                          <FormControlLabel
                            value="Meetings"
                            onChange={() => {
                              setModule("Meetings");
                              setModuleLable("Meetings");
                            }}
                            control={<Radio color="primary" />}
                            label={LBL_SCHEDULE_MEETING}
                          />
                          <FormControlLabel
                            value="Calls"
                            onChange={() => {
                              setModule("Calls");
                              setModuleLable("Calls");
                            }}
                            control={<Radio color="primary" />}
                            label={LBL_LOG_CALL}
                          />
                          <FormControlLabel
                            value="Tasks"
                            onChange={() => {
                              setModule("Tasks");
                              setModuleLable("Tasks");
                            }}
                            control={<Radio color="primary" />}
                            label={LBL_CREATE_TASK_BUTTON}
                          />
                        </RadioGroup>
                      </FormControl>
                    ) : (
                      <strong style={{ fontSize: "16px" }}>
                        {moduleLable}
                      </strong>
                    )}
                  </Grid>
                  <Grid item>
                    {editViewLoading ? (
                      <Button variant="contained" size="small" color="primary">
                        {LBL_SAVE_INPROGRESS}
                        <CircularProgress
                          size={14}
                          style={{ marginLeft: 10, color: "White" }}
                        />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        color="primary"
                      >
                        {LBL_SAVE_BUTTON_TITLE}
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={handleClose}
                      className={classes.margin}
                    >
                      {LBL_CANCEL_BUTTON_TITLE}
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </DialogTitle>
        <DialogContent>
          <Scrollbars autoHide style={{ height: "80vh" }}>
            <Paper className={view !== "Calendar" ? classes.paperEdit : ""}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm container>
                  {loading && calendarView ? (
                    <div style={{ minHeight: "500px", minWidth: "500px" }}>
                      <Skeleton />
                    </div>
                  ) : isTab ? (
                    initialValues ? (
                      <TabPanel
                        data={data}
                        errors={errors}
                        initialValues={initialValues}
                        module={module}
                        onChange={onChange}
                        hiddenAll={hiddenAll}
                      />
                    ) : null
                  ) : initialValues ? (
                    <ControlledAccordions
                      data={data}
                      errors={errors}
                      initialValues={initialValues}
                      module={module}
                      headerBackground="true"
                      onChange={onChange}
                      hiddenAll={hiddenAll}
                      onBlur={onBlur}
                      quickCreate={true}
                      fieldConfiguratorData={fieldConfigurator}
                    />
                  ) : null}
                </Grid>
              </Grid>
            </Paper>
          </Scrollbars>
        </DialogContent>

        <DialogActions></DialogActions>
      </form>
    );
  };
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      {view !== "Calendar" ? (
        <Dialog
          fullScreen={fullScreen}
          fullWidth={true}
          maxWidth={calendarView ? "md" : "md"}
          open={openQuickCreateDialog}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          {innerView()}
        </Dialog>
      ) : (
        innerView()
      )}
    </MuiThemeProvider>
  );
}
