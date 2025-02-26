import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  Grid,
  Button,
  Tab,
  Box,
  Typography,
  Tabs,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardActions,
} from "@material-ui/core";
import { FormInput, Skeleton } from "../../..";
import useStyles from "./styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { clone, isEmpty, isNil, pathOr } from "ramda";
import { formatQuery, QueryBuilder } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import AlertDialog from "../../../Alert";
import "./styles.css";
import {
  combinatorsList,
  operatorsList,
  customTypes,
  reminderTimeField,
  parentField,
  tabpanels,
  excludeFields,
} from "./metaData";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_DELETE_BUTTON_TITLE,
  LBL_DELETE_MSG,
  LBL_FC_ACCORDION_TITLE,
  LBL_FC_HIDE_QUERY,
  LBL_FC_JSON_QUERY,
  LBL_FC_LOGIC_LABEL,
  LBL_FC_RESET_CONTENT_MSG,
  LBL_FC_RESET_MSG,
  LBL_FC_SAVE_MSG,
  LBL_FC_TAB_NOT_ALLOWED,
  LBL_FC_TAB_SWITCH_MSG,
  LBL_FC_VIEW_QUERY,
  LBL_NOT_APPLICABLE_MSG,
  LBL_OKAY,
  LBL_RESET_BUTTON_LABEL,
  LBL_SAVE_BUTTON_TITLE,
  LBL_SAVE_INPROGRESS,
  LBL_WARNING_TITLE,
} from "@/constant";
import { QueryBuilderDnD } from "@react-querybuilder/dnd";
import * as ReactDnD from "react-dnd";
import * as ReactDndHtml5Backend from "react-dnd-html5-backend";
import { Alert } from "@material-ui/lab";

const validator = (r) => !!r.value;
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
const mountedStyle = { animation: "inAnimation 250ms ease-in" };
const unmountedStyle = {
  animation: "outAnimation 270ms ease-out",
  animationFillMode: "forwards",
};

const FieldListEditView = ({
  moduleFields,
  initialValues,
  handleSubmit,
  handleFieldChange,
  formLoading,
  query,
  setQuery,
  value,
  initialQuery,
  setValue,
  editLayout,
  loading,
  errors,
  validateForm,
}) => {
  const history = useHistory();
  const classes = useStyles();
  const { section, module, id } = useParams();
  const currentTheme = useSelector((state) =>
    pathOr("", ["config", "V3SelectedTheme"], state.config),
  );
  const [openSaveAlert, setOpenSaveAlert] = useState(false);
  const [notApplicableAlert, setNotApplicableAlert] = useState(false);
  const [saveAlert, setSaveAlert] = useState(false);
  const [resetAlert, setResetAlert] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [layout, setLayout] = useState(editLayout[tabValue] || []);
  const [showQuery, setShowQuery] = useState(false);
  const fieldType = pathOr("", [id, "type"], moduleFields);
  const isConfigured =
    initialValues?.is_configured || excludeFields[value].includes(fieldType);
  let [moduleFieldsObj, setModuleFieldsObj] = useState({});

  const handleMaskingFieldsVisibility = () => {
    let tempLayout = clone(editLayout[value]);
    editLayout[value].map((item, index) => {
      item.map((row, rowIndex) => {
        if (
          initialValues["masked_pattern"] != "start" &&
          initialValues["masked_pattern"] != "end" &&
          row["field_key"] === "masked_count"
        ) {
          tempLayout[index].splice(1, 1);
        }
        if (
          initialValues["masked_pattern"] != "middle" &&
          (row["field_key"] === "masked_startCount" ||
            row["field_key"] === "masked_endCount")
        ) {
          tempLayout.splice(index, 1);
        }
      });
    });
    setLayout(tempLayout);
  };
  const handleOnSubmitForm = (e, isDelete = false) => {
    setSaveAlert(false);
    setOpenSaveAlert(false);
    setDeleteAlert(false);
    validateForm(query, isDelete);
    if (isEmpty(errors)) {
      handleSubmit(e, isDelete);
      setValue(tabValue);
    }
  };
  const handleOnChangeTab = (event, newValue) => {
    if (!excludeFields[newValue].includes(fieldType)) {
      setTabValue(newValue);
      setOpenSaveAlert(true);
    } else {
      setNotApplicableAlert(true);
      setOpenSaveAlert(false);
    }
  };
  const handleClose = () => {
    setSaveAlert(false);
    setResetAlert(false);
    setDeleteAlert(false);
  };
  const handleCloseTab = () => {
    setOpenSaveAlert(false);
    setValue(tabValue);
  };
  const handleResetForm = () => {
    setResetAlert(false);
    setDeleteAlert(false);
    setShowQuery(false);
    editLayout[value].map((tab) => {
      tab.map((row, rowIndex) => {
        if (row["field_key"] != "roles" && row["field_key"] != "views") {
          initialValues[row["field_key"]] = [];
        }
      });
    });
    let defaultQuery = {
      combinator: "and",
      rules: [],
    };
    initialValues["query"] = defaultQuery;
    setQuery(defaultQuery);
  };
  const addFieldsInDuplicateConfig = () => {
    let fieldOptions = {};
    Object.values(moduleFields).map((item) => {
      fieldOptions[item.name] = item.label;
    });
    editLayout[value].map((item) => {
      item.map((row) => {
        if (row.field_key === "duplicate_config") {
          row["options"] = fieldOptions;
        }
      });
    });
    setLayout(editLayout[value]);
  };
  const setQueryBuilder = () => {
    let tempModuleFields = clone(moduleFields);
    delete tempModuleFields[id];

    Object.keys(tempModuleFields).map((fieldName) => {
      if (tempModuleFields[fieldName]["type"] === "parent") {
        Object.entries(parentField).map((item) => {
          tempModuleFields[item[0]] = item[1];
        });
      } else if (tempModuleFields[fieldName]["type"] === "reminder_time") {
        delete tempModuleFields["reminder_time"];
        Object.entries(reminderTimeField).map((item) => {
          tempModuleFields[item[0]] = item[1];
        });
      }
      const fieldType = tempModuleFields[fieldName]?.type;
      switch (fieldType) {
        case "enum":
        case "multienum":
        case "bool":
        case "radioenum":
        case "dynamicenum":
        case "parent":
        case "reminder_time":
          tempModuleFields[fieldName]["valueEditorType"] =
            customTypes[fieldType];
          let getOptions = [];
          let optionList = pathOr({}, [fieldName, "options"], tempModuleFields);
          if (!isEmpty(optionList)) {
            Object.keys(optionList).map((rowKey) => {
              getOptions.push({ name: rowKey, label: optionList[rowKey] });
            });
          }
          if (
            tempModuleFields[fieldName].type != "bool" &&
            getOptions.length > 0
          ) {
            if (getOptions[0].name != "") {
              getOptions.unshift({ name: "", label: "" });
            }
          }
          tempModuleFields[fieldName]["values"] = getOptions;
          if (tempModuleFields[fieldName].type === "bool") {
            tempModuleFields[fieldName]["defaultValue"] = false;
          } else if (tempModuleFields[fieldName].type === "reminder_time") {
            tempModuleFields[fieldName]["defaultValue"] = "";
          } else {
            tempModuleFields[fieldName]["defaultValue"] =
              tempModuleFields[fieldName]["value"];
          }
          if (
            fieldType === "bool" ||
            fieldType === "radioenum" ||
            fieldType === "multienum" ||
            fieldType === "parent" ||
            fieldType === "reminder_time"
          ) {
            tempModuleFields[fieldName]["operators"] = [
              { name: "=", label: "Equals" },
            ];
          }
          if (fieldType === "enum" || fieldType === "dynamicenum") {
            tempModuleFields[fieldName]["operators"] = [
              { name: "anyoneof", label: "Any One Of" },
              { name: "null", label: "Null" },
              { name: "notNull", label: "Not Null" },
            ];
          }
          break;
        case "text":
          tempModuleFields[fieldName]["valueEditorType"] =
            customTypes[fieldType];
          break;
        case "date":
          tempModuleFields[fieldName]["inputType"] = "date";
          break;
        case "datetime":
        case "datetimecombo":
          tempModuleFields[fieldName]["inputType"] = "datetime-local";
          break;
        case "phone":
        case "currency":
          tempModuleFields[fieldName]["inputType"] = "number";
          tempModuleFields[fieldName]["validator"] = validator;
        case "decimal":
        case "float":
        case "int":
          tempModuleFields[fieldName]["inputType"] = "number";
          tempModuleFields[fieldName]["validator"] = validator;
          tempModuleFields[fieldName]["operators"] = [
            { name: "=", label: "Equals" },
            { name: "notEquals", label: "Not Equals" },
            { name: "null", label: "Null" },
            { name: "notNull", label: "Not Null" },
            { name: "<", label: "<" },
            { name: ">", label: ">" },
            { name: "<=", label: "<=" },
            { name: ">=", label: ">=" },
          ];
          break;
        case "relate":
          tempModuleFields[fieldName]["operators"] = [
            { name: "=", label: "Equals" },
            { name: "notEquals", label: "Not Equals" },
            { name: "null", label: "Null" },
            { name: "notNull", label: "Not Null" },
          ];
          break;
        default:
          break;
      }
      delete tempModuleFields[fieldName]["options"];
    });
    setModuleFieldsObj({ ...tempModuleFields });
  };

  const renderTabContent = useCallback(
    (tab) => {
      return (
        <fieldset disabled={isConfigured} className={classes.fieldset}>
          {isConfigured ? (
            <Alert severity="error" className={classes.alert}>
              {initialValues?.message}
            </Alert>
          ) : null}
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="body1" className={classes.cardHeading}>
                {tab.content}
              </Typography>
              {layout.map((row) => (
                <Grid container spacing={3}>
                  {row.map((field) => (
                    <Grid item xs={12} sm={row.length === 2 ? 6 : 12}>
                      <FormInput
                        variant="outlined"
                        className={classes.textArea}
                        field={{
                          ...field,
                          value: initialValues[field.name],
                        }}
                        value={initialValues[field.name]}
                        label={field}
                        onBlur={onBlur}
                        color="primary"
                        disabled={isConfigured}
                        errors={errors}
                        onChange={(val) => handleFieldChange(field, val)}
                        isSearchEnumDisabled={true}
                      />
                    </Grid>
                  ))}
                </Grid>
              ))}
              {value != 4 && value != 5 ? (
                <Grid>
                  <Typography variant="subtitle2" className={classes.edit}>
                    {LBL_FC_LOGIC_LABEL}
                  </Typography>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => setShowQuery(!showQuery)}
                    style={{ paddingBottom: "10px" }}
                  >
                    {showQuery ? LBL_FC_HIDE_QUERY : LBL_FC_VIEW_QUERY}
                  </Button>
                  <Grid container>
                    <Grid item md={4}>
                      {showQuery ? (
                        <Grid
                          item
                          className="transitionDiv"
                          style={showQuery ? mountedStyle : unmountedStyle}
                        >
                          <h3 style={{ color: "#389926" }}>
                            {LBL_FC_JSON_QUERY}
                          </h3>
                          <Box style={{ overflow: "auto" }}>
                            <pre>{formatQuery(query, "json")}</pre>
                          </Box>
                        </Grid>
                      ) : null}
                    </Grid>
                    <Grid item md={showQuery ? 8 : 12}>
                      <Typography
                        className={
                          currentTheme === "dark" ? "box-dark" : "box-light"
                        }
                      >
                        {!isEmpty(errors?.query) || !isNil(errors?.query) ? (
                          <Typography
                            className={
                              currentTheme === "dark" ? "box-dark" : "box-light"
                            }
                            variant="subtitle2"
                            color="error"
                          >
                            {errors?.query}
                          </Typography>
                        ) : null}
                        <QueryBuilderDnD
                          dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}
                        >
                          <QueryBuilder
                            fields={moduleFieldsObj}
                            query={query}
                            onQueryChange={(q) => {
                              setQuery(q);
                            }}
                            operators={operatorsList}
                            combinators={combinatorsList}
                            controlClassnames={{
                              queryBuilder: "queryBuilder-branches",
                            }}
                          />
                        </QueryBuilderDnD>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => setDeleteAlert(true)}
                disabled={formLoading || isConfigured}
              >
                {LBL_DELETE_BUTTON_TITLE}
              </Button>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => setResetAlert(true)}
                disabled={formLoading || isConfigured}
              >
                {LBL_RESET_BUTTON_LABEL}
              </Button>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => setSaveAlert(true)}
                disabled={formLoading || isConfigured}
              >
                {formLoading ? LBL_SAVE_INPROGRESS : LBL_SAVE_BUTTON_TITLE}
              </Button>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() =>
                  history.push(
                    `/app/portalAdministrator/` + section + `/` + module,
                  )
                }
                disabled={formLoading || isConfigured}
              >
                {LBL_CANCEL_BUTTON_TITLE}
              </Button>
            </CardActions>
          </Card>
        </fieldset>
      );
    },
    [layout, showQuery, query, errors, formLoading, moduleFieldsObj],
  );

  const onBlur = () => {};

  useEffect(() => {
    addFieldsInDuplicateConfig();
    setQueryBuilder();
  }, [editLayout]);

  useEffect(() => {
    if (isConfigured) {
      if (excludeFields[value].includes(fieldType))
        initialValues["message"] = `${LBL_FC_TAB_NOT_ALLOWED}${fieldType}`;
    } else {
      initialValues["message"] = "";
    }
    if (value == 4) {
      handleMaskingFieldsVisibility();
    }
    setShowQuery(false);
  }, [initialValues, value]);

  return (
    <>
      <AlertDialog
        msg={LBL_FC_TAB_SWITCH_MSG}
        title={LBL_WARNING_TITLE}
        onAgree={handleOnSubmitForm}
        handleClose={() => {
          setOpenSaveAlert(false);
        }}
        open={openSaveAlert}
        onDisagree={handleCloseTab}
      />
      <AlertDialog
        msg={LBL_FC_SAVE_MSG}
        title={LBL_WARNING_TITLE}
        onAgree={handleOnSubmitForm}
        handleClose={handleClose}
        open={saveAlert}
      />
      <AlertDialog
        msg={LBL_NOT_APPLICABLE_MSG}
        title={LBL_WARNING_TITLE}
        agreeText={LBL_OKAY}
        onAgree={() => setNotApplicableAlert(false)}
        handleClose={() => setNotApplicableAlert(false)}
        open={notApplicableAlert}
        showDisagreeButton={false}
      />
      <AlertDialog
        msg={LBL_FC_RESET_MSG}
        title={LBL_WARNING_TITLE}
        content={value == 4 || value == 5 ? "" : LBL_FC_RESET_CONTENT_MSG}
        onAgree={handleResetForm}
        handleClose={handleClose}
        open={resetAlert}
      />
      <AlertDialog
        msg={LBL_DELETE_MSG}
        title={LBL_WARNING_TITLE}
        onAgree={(e) => {
          handleOnSubmitForm(e, true);
        }}
        handleClose={handleClose}
        open={deleteAlert}
      />

      <div className={classes.root}>
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={value}
          onChange={handleOnChangeTab}
          aria-label="scrollable"
        >
          {tabpanels.map((tab) => (
            <Tab
              className={classes.tabButton}
              key={tab.key}
              {...a11yProps(tab.key)}
              label={
                <Tooltip title={tab.label} arrow placement="top">
                  <div className={classes.tabName}>{tab.label}</div>
                </Tooltip>
              }
            />
          ))}
        </Tabs>
        {loading ? (
          <Skeleton />
        ) : (
          tabpanels.map((tab) => (
            <TabPanel
              value={value}
              index={tab.key}
              className={classes.accordion}
            >
              <Accordion expanded={true}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className={classes.summary}
                >
                  <Typography>{LBL_FC_ACCORDION_TITLE}</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  {renderTabContent(tab)}
                </AccordionDetails>
              </Accordion>
            </TabPanel>
          ))
        )}
      </div>
    </>
  );
};

export default FieldListEditView;
