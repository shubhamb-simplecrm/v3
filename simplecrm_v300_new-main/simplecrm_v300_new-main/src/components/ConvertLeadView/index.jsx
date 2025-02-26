import React, { useState, useEffect } from "react";
// styles
import useStyles from "./styles";
import { useHistory, useParams } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Checkbox,
  Typography,
  Grid,
  Paper,
} from "@material-ui/core";
import { ControlledAccordions } from "..";
import {
  getBase64,
  removeFieldHiddenValueRepeatCalendar,
  validateForm,
} from "../../common/utils";
import { FormInput } from "../";
import { toast } from "react-toastify";
import ConvertSuccessModal from "./components/ConvertSuccessModal";
import { pathOr, clone, isEmpty, isNil } from "ramda";
import { useSelector } from "react-redux";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_CONVERT_TO_LEAD_FILL_REQUIRED_FIELDS,
  LBL_RECORD_CREATED,
  LBL_RESOLUTION_ADDED,
  LBL_SAVE_BUTTON_TITLE,
  SOMETHING_WENT_WRONG,
} from "../../constant";
import { api } from "../../common/api-utils";
import SkeletonShell from "../Skeleton";
import {
  add_custom_duration,
  calculate_duration,
} from "../../common/duration_dependency";
import {
  ConvertFromDollar,
  ConvertToDollar,
  formatCurrency,
  unformat2Number,
} from "../../common/validations";
import { calculateTotal } from "../FormComponents/lineItem/calculate";
import dayjs from "dayjs";
import useCommonUtils from "../../hooks/useCommonUtils";

const ConvertLeadView = ({ id, data, module }) => {
  let [initialValues, setInitialValues] = useState({});
  let [isLoading, setIsLoading] = useState(false);
  let [isHasError, setIsHasError] = useState(false);
  let [formSubmitting, setFormSubmitting] = useState(false);
  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({});
  const [moveToActivity, setMoveToActivity] = useState({});
  const { returnModule, returnRecord, recordName } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const { userPreference, config } = useSelector((state) => state.config);
  let [lastCurrency, setLastCurrency] = useState([]);
  let [cchange, setCchange] = useState({});
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

  const CurrenciesRecords = pathOr(
    [],
    ["attributes", "CurrenciesRecords"],
    userPreference,
  );
  const moreActivityFields = {
    type: "enum",
    name: "lead_conv_ac_op_sel",
    label: ``,
    options: initialValues["lead_conv_ac_op_sel_options"]
      ? initialValues["lead_conv_ac_op_sel_options"]
      : {},
  };
  const setValues = (attributes, initialState, fieldState) => {
    attributes.map((rowField) => {
      rowField.map((field) => {
        return (
          field.name
            ? (initialState[field.name] = field.value ? field.value : "")
            : null,
          field.name ? (fieldState[field.name] = field) : null
        );
      });
    });
  };

  //var isTab = handleCheck(data, 'tab');
  const getFieldArr = (module) => {
    return {
      module: module,
      id_name: module === "Contacts" ? "reports_to_id" : "account_id",
      type: "relate",
      field_key: module === "Contacts" ? "report_to_name" : "account_name",
      name: module === "Contacts" ? "report_to_name" : "account_name",
      label: `Select ${module}`,
    };
  };
  useEffect(() => {
    let initialState = [];
    let fieldState = [];
    initialState.lead_conv_ac_op_sel_options = {};
    Object.keys(data).forEach((row) => {
      setValues(data[row].attributes, initialState, fieldState);
      data[row].panels &&
        data[row].panels.forEach((panelRow) => {
          setValues(panelRow.attributes, initialState, fieldState);
        });
      if (data[row].copyData) {
        setMoveToActivity({
          ...moveToActivity,
          [data[row].module]: data[row].module,
        });
        initialState["new" + data[row].module] = true;
        initialState.lead_conv_ac_op_sel_options = {
          ...initialState.lead_conv_ac_op_sel_options,
          [data[row].module]: data[row].module,
        };
      }
      if (data[row].module === "Contacts" || data[row].module === "Accounts") {
        initialState["convert_create_" + data[row].module] = true;
      }
    });
    setFields(fieldState);
    setInitialValues({ ...initialValues, ...initialState });
  }, [data]);

  useEffect(() => {
    if (isHasError) {
      let initialState = [];
      initialState.lead_conv_ac_op_sel_options = {};
      Object.keys(data).forEach((row) => {
        if (data[row].copyData) {
          setMoveToActivity({
            ...moveToActivity,
            [data[row].module]: data[row].module,
          });
          initialState["new" + data[row].module] = true;
          initialState.lead_conv_ac_op_sel_options = {
            ...initialState.lead_conv_ac_op_sel_options,
            [data[row].module]: data[row].module,
          };
        }
        if (
          data[row].module === "Contacts" ||
          data[row].module === "Accounts"
        ) {
          initialState["convert_create_" + data[row].module] = true;
        }
      });
      setInitialValues({ ...initialValues, ...initialState });
      setIsHasError(false);
    }
  }, [isHasError]);
  const onBlur = (e) => {};
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

  const getFormatedValue = (initialValuesArr) => {
    let init = initialValuesArr;
    for (let key in init) {
      if (typeof init[key] === "object" && key !== "line_items") {
        init = { ...init, ...init[key] };
      }
      // if (key.includes('date')) {
      // 	let formatedDate = handleDateTimeChange(init[key]);
      // 	init = { ...init, [key]: formatedDate }
      // }
    }
    setInitialValues(init);
    return init;
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

  const onChange = (field, value) => {
    if (field.type === "newCheckBtn") {
      if (value === true) {
        initialValues["convert_create_" + field.value] = true;
        initialValues["new" + field.value] = true;
        initialValues["lead_conv_ac_op_sel_options"] = {
          ...initialValues["lead_conv_ac_op_sel_options"],
          [field.value]: field.value,
        };
      } else {
        initialValues["new" + field.value] = false;
        delete initialValues["lead_conv_ac_op_sel_options"][field.value];
      }
    }
    if (field?.type === "relate") {
      if (
        field.name === "billing_account" ||
        field.name === "shipping_account"
      ) {
        const tempData = pathOr({}, ["rowData", "attributes"], value);
        const tempAddressData = {
          billing_address_street: pathOr(
            "",
            ["billing_address_street"],
            tempData,
          ),
          billing_address_city: pathOr(
            "",
            ["billing_address_city" || "shipping_address_city"],
            tempData,
          ),
          billing_address_country: pathOr(
            "",
            ["billing_address_country" || "shipping_address_country"],
            tempData,
          ),
          billing_address_postalcode: pathOr(
            "",
            ["billing_address_postalcode" || "shipping_address_postalcode"],
            tempData,
          ),
          billing_address_state: pathOr(
            "",
            ["billing_address_state" || "shipping_address_state"],
            tempData,
          ),
        };

        let tempIntialValues = clone(initialValues);
        tempIntialValues = { ...tempAddressData };

        setInitialValues(tempIntialValues);
        return;
      }

      setInitialValues({
        ...initialValues,
        [field?.name]: { value: value?.value, id: value?.id },
      });
      return;
    } else if (field.type === "parent") {
      if (
        !isEmpty(value) ||
        !(
          isEmpty(value.parent_name) ||
          isNil(value.parent_name) ||
          isEmpty(value.parent_id) ||
          isNil(value.parent_id)
        )
      ) {
        initialValues[field.name] = {
          ["parent_name"]:
            isEmpty(value.parent_name) || isNil(value.parent_name)
              ? ""
              : value.parent_name,
          ["parent_id"]:
            isEmpty(value.parent_id) || isNil(value.parent_id)
              ? ""
              : value.parent_id,
          ["parent_type"]:
            isEmpty(value.parent_type) || isNil(value.parent_type)
              ? ""
              : value.parent_type,
        };
      }
      setInitialValues(initialValues);
      return;
    } else if (field.type === "reminder_time") {
      initialValues[field.name] = { ...value }.remindersData;

      setInitialValues(initialValues);
      return;
    } else if (field.type === "function") {
      const hiddenAndFilterValuesObj =
        removeFieldHiddenValueRepeatCalendar(value);
      initialValues[field.name] = hiddenAndFilterValuesObj.filteredValues;
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
              tempInitialValues["status_id"] = "Active";
              setInitialValues(tempInitialValues);
            })
          : setInitialValues({
              ...initialValues,
              [field.name]: [{ name: null, file_content: "" }],
              ["document_name"]: "" || "",
              ["revision"]: "",
              ["status_id"]: "",
            });
      } else {
        const tempInitialValues = clone(initialValues);
        if (isEmpty(value) || isNil(value)) {
          tempInitialValues[field.name] = [{ name: null, file_content: "" }];
          setInitialValues(tempInitialValues);
        } else {
          getBase64(value).then((data) => {
            tempInitialValues[field.name] = [data];
            setInitialValues(tempInitialValues);
          });
        }

        setInitialValues({ ...tempInitialValues });
      }
      return;
    } else if (field.type === "image") {
      value !== ""
        ? getBase64(value).then((data) => {
            initialValues[field.name] = [data];
            setInitialValues(initialValues);
          })
        : setInitialValues({
            ...initialValues,
            [field.name]: [{ name: null, file_content: "" }],
          });
      return;
    } else if (field.type === "multifile") {
      initialValues[field.name] = [...value];
      setInitialValues({ ...initialValues });
      return;
    } else if (field.type === "address") {
      for (let item in value) {
        initialValues[item] = value[item];
      }
      setInitialValues({ ...initialValues });
      return;
    }
    if (field.type == "name" && module == "Cases") {
      if (value.resolution) {
        initialValues[field.name] = value.value;
        initialValues.resolution = value.resolution;
        setInitialValues({ ...initialValues, initialValues });
        toast(LBL_RESOLUTION_ADDED);
        return;
      }
    }
    if (field.type === "line_item") {
      if (field.value === "") {
        initialValues[field.name] = value;
      }
    }
    if (field.name === "currency_id") {
      lastCurrency.push(value);
      initialValues[field.name] = value;
    }
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
        // initialValues['duration']=duration.duration;
        // initialValues['duration_hours']=duration.duration_hours;
        // initialValues['duration_minutes']=duration.duration_minutes;
        // setInitialValues(initialValues);
        setInitialValues({ ...initialValuesData, ...duration });

        return;
      } else if (field.name === "duration") {
        initialValues[field.name] = value;
        const dateStart = initialValues.date_start || "";
        const newEndDate = dayjs(dateStart, getParseDateTimeFormat)
          .add(value, "s")
          .format(getParseDateTimeFormat);
        initialValues["date_end"] = newEndDate;
        setInitialValues({ ...initialValues });
        return;
      }
    }
    if (
      module === "AOS_Quotes" ||
      module === "AOS_Invoices" ||
      module === "AOS_Contracts"
    ) {
      initialValues[field.name] = value;
      let calResult = calculateTotal(
        initialValues,
        CurrenciesRecords,
        fields,
        lastCurrency,
        field.name,
      );

      setInitialValues({ ...initialValues, ...calResult });
      //setInitialValues(calResult);
      return;
    } else {
      if (field.type === "enum") {
        initialValues[field.name] = value;
        setInitialValues({ ...initialValues });
        return;
      } else {
        initialValues[field.name] = value;
        setInitialValues(initialValues);
      }
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
      field.type === "address" ||
      field.name === "alt_address_street" ||
      field.name === "primary_address_street"
    ) {
      for (let item in value) {
        initialValues[item] = value[item];
      }
      //      initialValues = {...initialValues,...value};
      setInitialValues(initialValues);
      return;
    }
    if (module === "Cases" && returnModule && returnRecord) {
      if (field.name === "state") {
        initialValues[field.name] = value;
        initialValues["status"] = value;
        setInitialValues(initialValues);
        return;
      }
    }
    if (module === "Cases" && field.name === "state") {
      let val = value == "Closed" ? "Closed_Closed" : "";
      val = value == "Open" ? "Open_New" : val;
      initialValues[field.name] = value;
      initialValues["status"] = val;
      setInitialValues(initialValues);
      return;
    }

    initialValues[field.name] = value;
    setInitialValues({ ...initialValues, [field.name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmitting(true);
    let newFieldArr = [];
    let fieldsArr = clone(fields);
    let initialValuesArr = clone(initialValues);
    let availableModules = initialValuesArr.lead_conv_ac_op_sel_options;
    delete initialValuesArr.lead_conv_ac_op_sel_options;
    Object.entries(availableModules).forEach((module, key) => {
      Object.entries(fieldsArr).forEach((field, fieldKey) => {
        if (field[0].startsWith(module[0])) {
          newFieldArr[field[0]] = field[1];
        }
      });
      initialValuesArr["new" + module[0]] =
        initialValuesArr["new" + module[0]] === true ? "on" : "";
      initialValuesArr["convert_create_" + module[0]] =
        initialValuesArr["new" + module[0]] === "on" ? "true" : "";
    });
    if (!initialValuesArr.newContacts) {
      let report_to_name = {};
      report_to_name.value = initialValuesArr["report_to_name"]
        ? initialValuesArr["report_to_name"]
        : null;
      report_to_name.name = "report_to_name";
      report_to_name.required = initialValuesArr["report_to_name"]
        ? "true"
        : "false";
      report_to_name.type = "relate";
      report_to_name.label = "Contacts";
      newFieldArr.report_to_name = report_to_name;
    }
    if (!initialValuesArr.newAccounts) {
      let account_name = {};
      account_name.value = initialValuesArr["account_name"]
        ? initialValuesArr["account_name"]
        : null;
      account_name.name = "account_name";
      account_name.required = initialValuesArr["account_name"]
        ? "true"
        : "false";
      account_name.type = "relate";
      account_name.label = "Accounts";
      newFieldArr.account_name = account_name;
    }

    let validate = validateForm(newFieldArr, initialValuesArr, {
      calendar_format,
      date_reg_format,
      time_reg_format,
      date_reg_positions,
    });
    setErrors(validate.errors);
    if (validate.formIsValid) {
      try {
        setIsLoading(true);
        if (!isLoading) {
          const submitData = {
            data: {
              module: module,
              record: id,
              action: "ConvertLead",
              ...getFormatedValue(initialValuesArr),
            },
          };
          api
            .post(`/V8/layout/setConvertLead/Leads/${id}`, submitData)
            .then(function (res) {
              setIsLoading(false);
              if (res.data.data.status) {
                toast(LBL_RECORD_CREATED);
                history.push(
                  "/app/detailview/" + module + "/" + res.data.data.id,
                );
              } else {
                setFormSubmitting(false);
                setIsHasError(true);
                toast(res.data.data.meta.message);
              }
            });
        }
      } catch (e) {
        setFormSubmitting(false);
        setIsLoading(false);
        toast(SOMETHING_WENT_WRONG);
      }
    } else {
      setFormSubmitting(false);
      toast(LBL_CONVERT_TO_LEAD_FILL_REQUIRED_FIELDS);
    }
  };

  const renderRelateFields = (row) => {
    return (
      <>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="left"
          spacing="2"
        >
          <Grid item sm={4}>
            {row.module === "Contacts" || row.module === "Accounts" ? (
              <Typography variant="subtitle2">
                {row.label}{" "}
                {!initialValues["new" + row.module] &&
                !initialValues["new" + row.module] === true
                  ? `OR Select ${row.module}`
                  : ""}
              </Typography>
            ) : (
              <Typography variant="subtitle2">{row.label}</Typography>
            )}
          </Grid>
          {!initialValues["new" + row.module] &&
          !initialValues["new" + row.module] === true &&
          (row.module === "Contacts" || row.module === "Accounts") ? (
            <Grid item sm={4}>
              <FormInput
                field={getFieldArr(row.module)}
                initialValues={initialValues}
                value={""}
                errors={errors}
                module={row.module}
                small={true}
                onBlur={onBlur}
                onChange={(val) => onChange(getFieldArr(row.module), val)}
                disabled={true}
              />
            </Grid>
          ) : (
            ""
          )}
          <Grid item sm={4}></Grid>
        </Grid>
      </>
    );
  };
  if (isLoading) {
    return <SkeletonShell layout="EditView" />;
  }

  return (
    <div className={classes.root}>
      <form
        onSubmit={handleSubmit}
        disabled={formSubmitting}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <Paper key="editHeader" className={classes.paper}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={2}
            style={{ margin: "-2px" }}
          >
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                size="small"
                color="primary"
                disabled={formSubmitting}
              >
                {LBL_SAVE_BUTTON_TITLE}
              </Button>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={history.goBack}
                className={classes.margin}
              >
                {LBL_CANCEL_BUTTON_TITLE}
              </Button>
            </Grid>
            <Grid item style={{ marginTop: "-9px" }}></Grid>
          </Grid>
        </Paper>

        <Paper className={classes.paperEdit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm container>
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                className={classes.root}
              >
                {data.map((row, key) => (
                  <>
                    <ListItem>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          value={"new" + row.module}
                          checked={
                            initialValues["new" + row.module] &&
                            initialValues["new" + row.module] === true
                              ? true
                              : false
                          }
                          tabIndex={-1}
                          name={"new" + row.module}
                          disableRipple
                          onChange={(e) =>
                            onChange(
                              {
                                type: "newCheckBtn",
                                value: row.module,
                                name: "new" + row.module,
                              },
                              e.target.checked,
                            )
                          }
                        />
                      </ListItemIcon>
                      <ListItemText primary={renderRelateFields(row)} />
                    </ListItem>
                    <ListItem>
                      {initialValues["new" + row.module] &&
                      initialValues["new" + row.module] === true ? (
                        <ControlledAccordions
                          data={[row]}
                          errors={errors}
                          initialValues={initialValues}
                          module={module}
                          headerBackground="true"
                          onChange={onChange}
                          onBlur={onBlur}
                          isExpanded={true}
                          hiddenAll={{ hidden: [], disabled: [] }}
                        />
                      ) : (
                        ""
                      )}
                    </ListItem>
                  </>
                ))}
              </List>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="left"
                spacing="2"
              >
                <Grid item sm={3}>
                  <Typography variant="subtitle2">
                    Move Activities to:
                  </Typography>
                </Grid>

                <Grid item sm={3}>
                  <FormInput
                    field={moreActivityFields}
                    initialValues={initialValues}
                    errors={errors}
                    value={
                      initialValues["lead_conv_ac_op_sel"]
                        ? initialValues["lead_conv_ac_op_sel"]
                        : ""
                    }
                    small={true}
                    onChange={(val) => onChange(moreActivityFields, val)}
                  />
                </Grid>
                <Grid item sm={6}></Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        <Paper key="editHeader" className={classes.paper}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={2}
            style={{ margin: "-2px" }}
          >
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                size="small"
                color="primary"
                disabled={formSubmitting}
              >
                {LBL_SAVE_BUTTON_TITLE}
              </Button>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={history.goBack}
                className={classes.margin}
              >
                {LBL_CANCEL_BUTTON_TITLE}
              </Button>
            </Grid>
            <Grid item style={{ marginTop: "-9px" }}></Grid>
          </Grid>
        </Paper>
      </form>
      {modalVisible && (
        <ConvertSuccessModal
          modalVisible={modalVisible}
          toggleModalVisibility={() => setModalVisible(!modalVisible)}
          data={[]}
          id={id}
          history={history}
        />
      )}
    </div>
  );
};

export default ConvertLeadView;
