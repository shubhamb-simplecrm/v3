import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  IconButton,
  Chip,
  Paper,
  Tooltip,
  Box,
  Typography,
  Tab,
  Tabs,
  Hidden,
  Grid,
} from "@material-ui/core";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarRateIcon from "@material-ui/icons/StarRate";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import SubPanelListView from "../SubPanel/SubPanelListView";
import useStyles from "./styles";
import { pathOr, clone, isNil, isEmpty } from "ramda";
import AORReportDetail from "../AOR_Reports";
import { addToFavouriteRecord } from "../../store/actions/detail.actions";
import CallIcon from "@material-ui/icons/Call";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import EmailIcon from "@material-ui/icons/Email";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import {
  TabPanel as DetailViewTab,
  ControlledAccordions as DetailViewPanel,
} from "../";
import { MoreActionButton } from "../FormComponents";
import {
  textEllipsis,
  demoInstanceDependencyConfig,
  checkInitGroupValidate,
  truncate,
} from "../../common/utils";
import StatusIndicator from "./components/StatusIndicator";
import {
  LBL_MARK_AS_FAVAOURITE,
  LBL_CREATE_TASK_BUTTON,
  LBL_CREATE_MEETING_BUTTON,
  LBL_CREATE_CALL_BUTTON,
  LBL_CREATE_EMAIL_BUTTON,
  LBL_CREATE_NOTE_BUTTON,
  LBL_SUBPANEL_DETAILVIEW_TITLE,
} from "../../constant";
import { manegeSidebarFavMenuAction } from "../../store/actions/layout.actions";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import useCommonUtils from "@/hooks/useCommonUtils";
import SidePanel from "./components/SidePanel";
import { useLayoutState } from "@/customStrore";
import clsx from "clsx";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const isMobile = useIsMobileView("sm");

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2} style={{ padding: isMobile ? "0px" : "5px 8px 8px" }}>
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
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const handleCheck = (data, val, module = "") => {
  return false;
};

export default function DetailView({
  data,
  subpanels,
  module,
  recordId,
  recordInfo,
  is_fav,
  actionButtons,
  setIsSubpanelUpdated,
  value,
  setValue,
  calenderView = false,
}) {
  const isMobile = useIsMobileView("md");
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isSubPanelCountEnable } = useCommonUtils();
  let fieldConfiguratorData = pathOr(
    [],
    [
      "data",
      "templateMeta",
      "FieldConfiguration",
      "data",
      "JSONeditor",
      "dynamicLogic",
      "fields",
    ],
    data,
  );
  let dataLabelValues = pathOr(
    [],
    [
      "data",
      "templateMeta",
      "data",
      "subpanel_tabs",
      "0",
      "listview",
      "datalabels",
    ],
    data,
  );

  const activitiesTabList = subpanels.reduce((pV, cV) => {
    if (cV.module_name === "Activities" || cV.module_name == "History"|| cV.module_name == "SimilarTickets") {
      pV[cV.module_name] = cV;
    }
    return pV;
  }, {});

  const filteredSubpanels = subpanels
    .filter((subpanel) =>
      subpanel.module_name === "Activities" || subpanel.module_name == "History"|| subpanel.module_name == "SimilarTickets"
        ? isMobile
        : true,
    )
    .filter((i) => !isEmpty(i));
  const truncateLength = isMobile
    ? 20
    : new String(recordInfo.record_name || "").length;

  let [initialValues, setInitialValues] = useState({});
  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({});
  const config = useSelector((state) => state.config?.config);
  const reportData = clone(data);
  data = pathOr([], ["data", "templateMeta", "data"], data);
  const statusBarData = pathOr(
    [],
    ["data", "templateMeta", "recordInfo", "statusBar"],
    reportData,
  );
  const statusBackground = pathOr([], ["fields_background", module], config);
  let option = statusBarData.options
    ? Object.keys(statusBarData.options).find(
        (key) => statusBarData.options[key] === statusBarData.value,
      )
    : "";
  const optionBgColor = `${pathOr(
    "",
    ["status", option, "background_color"],
    statusBackground,
  )}`;
  var isTab = handleCheck(data, "tab", module);
  const [isRecordFav, setIsRecordFav] = useState(Boolean(parseInt(is_fav)));
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
  const [panelFieldData, setPanelFieldData] = useState({});

  useEffect(() => {
    setErrors({});
  }, [module]);

  const onChangeValidationCheck = (
    fields,
    initialValues,
    fieldConfigurator,
    status,
    errors,
    typeList,
    allFields,
  ) => {
    const getValidation = checkInitGroupValidate(
      fields,
      initialValues,
      fieldConfigurator,
      status,
      errors,
      typeList,
      allFields,
    );
    return pathOr(errors, ["errors"], getValidation);
  };

  const getInitialValues = (fieldData, initialValuesData) => {
    fieldData.map((row) => {
      row.map((item) => {
        item.map((field) => {
          if (field.type === "enum" || field.type === "dynamicenum") {
            const fieldOptions = pathOr([], ["options"], field);
            const fieldValue = field?.value;
            let fieldFilteredBackEndValue = null;
            const fieldOptionsValueArr = Object.entries(fieldOptions);
            let isDuplicateExist = false;
            let valueExistCount = 0;
            fieldOptionsValueArr.map((option) => {
              if (option[1] == fieldValue)
                valueExistCount = valueExistCount + 1;
            });
            if (valueExistCount > 1) isDuplicateExist = true;
            if (isDuplicateExist && field.parentenum) {
              const parentFieldOptions = fields[field?.parentenum].options;
              const parentFieldValue = fields[field?.parentenum].value;
              const duplicateOptionsObj = {};
              fieldOptionsValueArr.map((fOption) => {
                const fKey = fOption[0];
                const fValue = fOption[1];
                if (fValue == fieldValue) {
                  duplicateOptionsObj[fKey] = fValue;
                }
              });
              Object.entries(duplicateOptionsObj).map((dOptions) => {
                const dKey = dOptions[0];
                const dValue = dOptions[1];
                Object.entries(parentFieldOptions).map((pOption) => {
                  const pKey = pOption[0];
                  const pValue = pOption[1];
                  if (dKey.startsWith(pKey) && pValue == parentFieldValue) {
                    fieldFilteredBackEndValue = dKey;
                  }
                });
              });
            } else {
              Object.keys(fieldOptions).map((item) => {
                if (fieldOptions[item] === fieldValue) {
                  fieldFilteredBackEndValue = item;
                }
              });
            }
            return (
              field.name
                ? (initialValuesData[field.name] = field.value
                    ? fieldFilteredBackEndValue
                    : "")
                : null,
              field.name ? (fields[field.name] = field) : null
            );
          } else {
            return (
              field.name
                ? (initialValuesData[field.name] = field.value
                    ? field.value
                    : "")
                : null,
              field.name ? (fields[field.name] = field) : null
            );
          }
        });
      });
    });
  };
  useEffect(() => {
    let initialState = [];
    let fieldState = [];
    let initialValuesData = [];
    let dummyInitialData = [];
    let panelData = [];
    Object.keys(data).map((row) => {
      dummyInitialData.push(data[row].attributes);
      setValues(data[row].attributes, initialState, data[row].key, panelData);
      data[row].panels &&
        data[row].panels.map((panelRow) => {
          dummyInitialData.push(panelRow.attributes);
          setValues(
            panelRow.attributes,
            initialState,
            data[row].key,
            panelData,
          );
        });
    });
    getInitialValues(dummyInitialData, initialValuesData);
    initialValues = initialValuesData;
    const getNewErrors = onChangeValidationCheck(
      fields,
      initialValues,
      fieldConfiguratorData,
      true,
      errors,
      ["visible"],
      fields,
    );
    setErrors({ ...errors, ...getNewErrors });
    setPanelFieldData(panelData);
  }, [data]);

  const setValues = (attributes, initialState, panelKey, panelData) => {
    attributes.map((rowField) => {
      rowField.map((field) => {
        if (panelData.hasOwnProperty(panelKey)) {
          panelData[panelKey].push(field.name);
        } else {
          panelData[panelKey] = [field.name];
        }
        if (field.type === "enum" || field.type === "dynamicenum") {
          let getOption = "";
          if (!isNil(field.options)) {
            getOption = Object.keys(field.options)[
              Object.values(field.options).indexOf(field.value)
            ];
          }
          setDependencyHidden(field, getOption);
        } else {
          setDependencyHidden(field, field.value);
        }
        demoInstanceDependencyConfig(
          "onChange",
          null,
          null,
          null,
          field,
          field.value,
          module,
          "detailview",
          setHiddenAll,
        );
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
            let array3 = [...hiddenAlways, ...hiddField];

            array3 = array3.filter((item, index) => {
              return array3.indexOf(item) == index;
            });
            setHiddenAll({ ...hiddenAll, ["hidden"]: array3 });
          } else {
            setHiddenAll({ ...hiddenAll, ["hidden"]: hiddenAlways });
          }
        }
      }
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const addToFav = async (recordId, module, isFav) => {
    const res = await addToFavouriteRecord(recordId, module, isFav);
    if (res.ok) {
      setIsRecordFav((v) => !v);
      dispatch(
        manegeSidebarFavMenuAction(
          recordId,
          recordInfo.record_name,
          module,
          !isFav,
        ),
      );
      toast(res.data.data.message);
      return;
    }
  };

  const DashboardActions = [];

  filteredSubpanels.forEach((item) => {
    if (["History", "Activities"].includes(item.module_name)) {
      item.top_buttons.map((actBtn) => {
        if (actBtn.widget_class === "SubPanelTopCreateTaskButton") {
          DashboardActions.push({
            icon: <FormatListBulletedIcon />,
            name: "Tasks",
            label: LBL_CREATE_TASK_BUTTON,
          });
        } else if (actBtn.widget_class === "SubPanelTopScheduleMeetingButton") {
          DashboardActions.push({
            icon: <PeopleAltIcon />,
            name: "Meetings",
            label: LBL_CREATE_MEETING_BUTTON,
          });
        } else if (actBtn.widget_class === "SubPanelTopScheduleCallButton") {
          DashboardActions.push({
            icon: <CallIcon />,
            name: "Calls",
            label: LBL_CREATE_CALL_BUTTON,
          });
        } else if (actBtn.widget_class === "SubPanelTopComposeEmailButton") {
          DashboardActions.push({
            icon: <EmailIcon />,
            name: "Emails",
            label: LBL_CREATE_EMAIL_BUTTON,
          });
        } else if (actBtn.widget_class === "SubPanelTopCreateNoteButton") {
          DashboardActions.push({
            icon: <NoteAddIcon />,
            name: "Notes",
            label: LBL_CREATE_NOTE_BUTTON,
          });
        }
      });
    }
  });

  const renderCalendarDetailView = () => {
    return (
      <DetailViewPanel
        data={data}
        fieldConfiguratorData={fieldConfiguratorData}
        module={module}
        view="detailview"
        headerBackground="true"
        recordName={recordInfo.record_name || ""}
        recordId={recordId}
        recordInfo={recordInfo}
        hiddenAll={hiddenAll}
        errors={errors}
      />
    );
  };
  const isStatusBarActive =
    statusBarData.field_key &&
    Array.isArray(statusBarData.options) &&
    !isEmpty(statusBarData.options);
  const renderDetailView = () => {
    const classes = useStyles();
    const { rightSidebarDrawerState } = useLayoutState((state) => ({
      rightSidebarDrawerState: state.rightSidebarState?.drawerState,
    }));
    return (
      !(isMobile && rightSidebarDrawerState) && (
        <div
          style={{
            height: isStatusBarActive
              ? "calc(100% - 5.3vh)"
              : "calc(100% - 0vh)",
          }}
        >
          <Grid container lg={12} md={12} sm={12} xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Card className={classes.root}>
                <CardHeader
                  classes={{ action: classes.cstmAction }}
                  className={classes.headerCstm}
                  action={
                    <>
                      <Tooltip
                        title={LBL_MARK_AS_FAVAOURITE}
                        arrow
                        placement="bottom"
                      >
                        <IconButton
                          className={classes.favBtn}
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                          onClick={() =>
                            addToFav(recordId, module, isRecordFav)
                          }
                        >
                          {isRecordFav ? (
                            <StarRateIcon fontSize="large" />
                          ) : (
                            <StarBorderIcon fontSize="large" />
                          )}
                        </IconButton>
                      </Tooltip>

                      <MoreActionButton
                        actionButtons={actionButtons}
                        label="Action"
                        module={module}
                        view="detailview"
                        record={recordId}
                        recordName={recordInfo.record_name || ""}
                      />
                    </>
                  }
                  title={truncate(recordInfo.record_name || "", truncateLength)}
                />
              </Card>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Hidden xsDown={true}>
                {statusBarData.field_key &&
                Array.isArray(statusBarData.options) ? (
                  <StatusIndicator
                    statusBarData={statusBarData}
                    module={module}
                    optionBgColor={optionBgColor}
                  />
                ) : (
                  ""
                )}
              </Hidden>
            </Grid>
          </Grid>
          <Grid
            container
            lg={12}
            md={12}
            sm={12}
            xs={12}
            style={{
              height: "calc(100% - 10vh)",
            }}
          >
            <Grid
              item
              lg={
                isEmpty(activitiesTabList) || isNil(activitiesTabList)
                  ? 12
                  : rightSidebarDrawerState
                    ? 7
                    : 8
              }
              md={12}
              sm={12}
              xs={12}
              className={classes.detailViewGrid}
            >
              <Tabs
                variant="scrollable"
                scrollButtons="auto"
                value={value}
                onChange={handleChange}
                aria-label="scrollable"
              >
                <Tab
                  label={
                    <Tooltip
                      title={LBL_SUBPANEL_DETAILVIEW_TITLE}
                      arrow
                      placement="top"
                    >
                      <div className={classes.tabName}>
                        {LBL_SUBPANEL_DETAILVIEW_TITLE}
                      </div>
                    </Tooltip>
                  }
                  key={0}
                  style={{ textAlign: "left" }}
                  className={classes.tabButton}
                />
                {filteredSubpanels.map((tab, key) => (
                  <Tab
                    className={classes.tabButton}
                    label={
                      <Tooltip title={tab.title} arrow placement="top">
                        <div className={classes.tabName} id={tab?.rel_module}>
                          {textEllipsis(tab.title, 15)}
                          {!["History", "Activities","SimilarTickets"].includes(
                            tab.module_name,
                          ) && isSubPanelCountEnable ? (
                            <Chip
                              size="small"
                              label={tab?.data_count}
                              className={classes.countChip}
                            />
                          ) : null}
                        </div>
                      </Tooltip>
                    }
                    key={key + 1}
                    {...a11yProps(key + 1)}
                  />
                ))}
              </Tabs>
              <TabPanel
                value={value}
                index={0}
                key={0}
                style={{
                  height: "calc(100% - 7vh)",
                  overflow: "scroll",
                }}
              >
                <Paper className={classes.paper}>
                  {isTab ? (
                    <DetailViewTab
                      data={data}
                      module={module}
                      view="detailview"
                      hiddenAll={hiddenAll}
                      recordInfo={recordInfo}
                      fieldConfiguratorData={fieldConfiguratorData}
                    />
                  ) : (
                    <DetailViewPanel
                      data={data}
                      module={module}
                      view="detailview"
                      headerBackground="true"
                      recordName={recordInfo.record_name || ""}
                      recordId={recordId}
                      hiddenAll={hiddenAll}
                      errors={errors}
                      fieldConfiguratorData={fieldConfiguratorData}
                      recordInfo={recordInfo}
                    />
                  )}

                  {module === "AOR_Reports" ? (
                    <AORReportDetail data={reportData} />
                  ) : (
                    ""
                  )}
                </Paper>
              </TabPanel>
              <TabPanel value={value} index={1} key={1}></TabPanel>
              {filteredSubpanels.map((tab, num) => (
                <TabPanel
                  value={value}
                  index={num + 1}
                  key={num + 1}
                  style={{
                    overflowY: "scroll",
                    height:
                      tab.module_name == "History" ||
                      tab.module_name == "Activities"||
                      tab.module_name == "SimilarTickets"
                        ? "calc(100% - 7vh)"
                        : "",
                  }}
                >
                  {(isMobile && tab.module_name == "History") ||
                  tab.module_name == "Activities" || tab.module_name == "SimilarTickets"? (
                    <SidePanel
                      module={module}
                      recordId={recordId}
                      recordName={recordInfo?.record_name}
                      activitiesTabList={{ [tab.module_name]: tab }}
                      isSubpanelActive={true}
                      setIsSubpanelUpdated={setIsSubpanelUpdated}
                      recordInfo={recordInfo}
                      data={data}
                    />
                  ) : (
                    <>
                      <SubPanelListView
                        module={module}
                        subpanel={tab?.rel_module}
                        subpanel_module={tab?.module_name}
                        title={tab.title}
                        record={recordId}
                        recordName={recordInfo?.record_name || ""}
                        setIsSubpanelUpdated={setIsSubpanelUpdated}
                        value={value}
                        setValue={setValue}
                        relationShipName={tab?.rel_name}
                        relationShipModule={tab?.rel_module}
                        fieldConfiguratorData={fieldConfiguratorData}
                        isStatusBarActive={isStatusBarActive}
                        
                      />
                    </>
                  )}
                </TabPanel>
              ))}
            </Grid>
            {!isEmpty(activitiesTabList) && (
              <Grid
                item
                lg={rightSidebarDrawerState ? 5 : 4}
                md={5}
                className={clsx(classes.sidePanelGrid, {
                  [classes.sidePanelGridMobile]: isMobile,
                })}
              >
                <SidePanel
                  module={module}
                  recordId={recordId}
                  recordName={recordInfo?.record_name}
                  activitiesTabList={activitiesTabList}
                  isSubpanelActive={false}
                  setIsSubpanelUpdated={setIsSubpanelUpdated}
                  recordInfo={recordInfo}
                  data={data}
                />
              </Grid>
            )}
          </Grid>
        </div>
      )
    );
  };
  return <>{calenderView ? renderCalendarDetailView() : renderDetailView()}</>;
}