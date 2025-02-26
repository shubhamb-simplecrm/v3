import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import CustomDialog from "../../../SharedComponents/CustomDialog";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_DASHLET_ADD_ACTIVE_TILES,
  LBL_DASHLET_MODULES_TAB_TITLE,
  LBL_DASHLET_SEARCH_FIELD,
  LBL_DASHLET_WEB_TAB_TITLE,
  LBL_SAVE_BUTTON_TITLE,
  SOMETHING_WENT_WRONG,
} from "../../../../constant";
import FormInput from "../../../FormInput";
import { Button } from "../../../SharedComponents/Button";
import CustomCircularProgress from "../../../SharedComponents/CustomCircularProgress";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import useStyles from "./styles";
import {
  AppBar,
  Box,
  Checkbox,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Tab,
  Tabs,
  Tooltip,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import InfoIcon from "@material-ui/icons/Info";
import { useDispatch } from "react-redux";
import {
  addDashLetAction,
  getDashLetOptionListAction,
} from "../../../../store/actions/dashboard.actions";
import { toast } from "react-toastify";
import { isEmpty, isNil, pathOr } from "ramda";
import FaIcon from "../../../FaIcon";
import { isValidURL, truncateString } from "../../../../common/utils";
import { Skeleton } from "../../..";
import { useSelector } from "react-redux";
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
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
const DashboardAddDashLetDialog = (props) => {
  const { dialogOpenStatus, handleCloseDialog, dashboardIndex } = props;
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [webFieldValues, setWebFieldValues] = useState({});
  const [webFieldErrors, setWebFieldErrors] = useState({});
  const [selectedModuleDashLet, setSelectedModuleDashLet] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const activeDashboardTabIndex = useSelector(
    (state) => state.dashboard?.activeDashboardTabIndex,
  );
  const maximumDashletLimit =
    useSelector(
      (state) =>
        state?.dashboard?.dashboardData?.[activeDashboardTabIndex]
          ?.max_dashlets_homepage,
    ) || 20;
  const dashboardData = useSelector((state) => state.dashboard?.dashboardData);
  let isMaximumDashletLimitReached = useMemo(() => {
    if (isNil(activeDashboardTabIndex)) return true;
    const currentDashboardDashLetsList = pathOr(
      {},
      [activeDashboardTabIndex, "dashlets"],
      dashboardData,
    );
    let selectedDashLetsCount = 1;
    if (tabValue === 0 && !isEmpty(selectedModuleDashLet) && !isNil(selectedModuleDashLet)) {
      selectedDashLetsCount = Object.keys(selectedModuleDashLet).length;
    }
    if (typeof currentDashboardDashLetsList == "object") {
      return (
        Object.keys(currentDashboardDashLetsList).length +
          selectedDashLetsCount >
        maximumDashletLimit
      );
    }
    return false;
  }, [activeDashboardTabIndex, dashboardData, selectedModuleDashLet, tabValue]);
  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  const handleWebOnChange = useCallback((fieldName, value) => {
    setWebFieldValues((v) => ({ ...v, [fieldName]: value }));
  }, []);

  const handleOnDashLetAdd = () => {
    const requestPayload = {
      current_tab: dashboardIndex.toString(),
      data: [],
    };
    if (tabValue == 0) {
      const selectModuleArr = [];
      Object.entries(selectedModuleDashLet).forEach(
        ([moduleName, status], i) => {
          if (status)
            selectModuleArr.push({
              dashlet_id: moduleName,
              position: {
                // w: 2,
                // h: 2,
                w: 10,
                h: 10,
                x: 0,
                y: 0,
                i: 0,
                moved: false,
                static: false,
              },
            });
        },
      );
      if (!isEmpty(selectModuleArr)) {
        requestPayload["category"] = "module";
        requestPayload["data"] = selectModuleArr;
        setLoading(true);
        dispatch(addDashLetAction(requestPayload))
          .then((res) => {
            setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
          })
          .finally(() => {
            handleCloseDialog();
          });
      }
    } else if (tabValue == 1) {
      const errorObj = { ...webFieldErrors };
      Object.entries(webFieldValues).forEach(([fieldName, value], i) => {
        if (
          (fieldName == "RSSDashlet" || fieldName == "iFrameDashlet") &&
          !isEmpty(value)
        ) {
          if (!isValidURL(value)) {
            errorObj[fieldName] = "Please enter valid URL.";
          } else {
            if (errorObj[fieldName]) {
              delete errorObj[fieldName];
            }
          }
        }
      });
      setWebFieldErrors(errorObj);
      if (isEmpty(errorObj) && !isEmpty(webFieldValues)) {
        requestPayload["category"] = "web";
        Object.entries(webFieldValues).forEach(([fieldName, value], i) => {
          if (!isEmpty(value.trim()))
            requestPayload["data"].push({
              position: {
                // w: 2,
                // h: 2,
                w: 10,
                h: 10,
                x: 0,
                y: 0,
                i: 0,
                moved: false,
                static: false,
              },
              dashlet_module: value,
              dashlet_id: fieldName,
            });
        });
        setLoading(true);
        dispatch(addDashLetAction(requestPayload))
          .then((res) => {
            setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
          })
          .finally(() => {
            handleCloseDialog();
          });
        handleCloseDialog();
      }
    }
  };
  return (
    <CustomDialog
      isDialogOpen={dialogOpenStatus}
      handleCloseDialog={handleCloseDialog}
      title={LBL_DASHLET_ADD_ACTIVE_TILES}
      maxWidth={"md"}
      fullWidth={true}
      bodyContent={
        <DashboardAddDashLetBody
          selectedModuleDashLet={selectedModuleDashLet}
          setSelectedModuleDashLet={setSelectedModuleDashLet}
          webFieldValues={webFieldValues}
          webFieldErrors={webFieldErrors}
          tabValue={tabValue}
          handleTabChange={handleTabChange}
          handleWebOnChange={handleWebOnChange}
        />
      }
      bottomActionContent={
        <Grid container direction="row" justifyContent="end">
          <Grid item md={12} lg={8}>
            {isMaximumDashletLimitReached ? (
              <Alert severity="warning" icon={<InfoIcon fontSize="inherit" />}>
                {`Maximum Dashlet Limit(${maximumDashletLimit}) Reached`}
              </Alert>
            ) : null}
          </Grid>
          <Grid item className={classes.buttonGroupRoot} lg={4}>
            <Button
              label={loading ? "Saving..." : LBL_SAVE_BUTTON_TITLE}
              startIcon={
                loading ? <CustomCircularProgress size={16} /> : <SaveIcon />
              }
              disabled={loading || isMaximumDashletLimitReached}
              onClick={handleOnDashLetAdd}
            />
            <Button
              label={LBL_CANCEL_BUTTON_TITLE}
              startIcon={<CancelIcon />}
              disabled={loading}
              onClick={handleCloseDialog}
            />
          </Grid>
        </Grid>
      }
    />
  );
};
const DashboardAddDashLetBody = ({
  selectedModuleDashLet,
  setSelectedModuleDashLet,
  webFieldValues,
  webFieldErrors,
  tabValue,
  handleWebOnChange,
  handleTabChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [dashLetData, setDashLetData] = useState({
    moduleData: [],
    webData: [],
  });

  useEffect(() => {
    const getDashLetOptionData = async () => {
      setLoading(true);
      getDashLetOptionListAction()
        .then((res) => {
          if (res.ok) {
            setDashLetData({
              moduleData: Object.values(pathOr({}, ["data", "modules"], res)),
              webData: Object.values(pathOr({}, ["data", "web"], res)),
            });
          } else {
            toast(SOMETHING_WENT_WRONG);
          }
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
        });
    };
    getDashLetOptionData();
  }, []);
  if (loading) return <Skeleton />;
  return (
    <>
      <AppBar position="static" color="default">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            key="Modules"
            label={LBL_DASHLET_MODULES_TAB_TITLE}
            {...a11yProps(0)}
          />
          <Tab key="Web" label={LBL_DASHLET_WEB_TAB_TITLE} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <ModuleTilesTabPanel
        selectedTabValue={tabValue}
        panelData={dashLetData["moduleData"]}
        selectedModuleDashLet={selectedModuleDashLet}
        setSelectedModuleDashLet={setSelectedModuleDashLet}
      />
      <WebTilesTabPanel
        selectedTabValue={tabValue}
        panelData={dashLetData["webData"]}
        webFieldValues={webFieldValues}
        webFieldErrors={webFieldErrors}
        handleWebOnChange={handleWebOnChange}
      />
    </>
  );
};
const ModuleTilesTabPanel = memo(
  ({
    selectedTabValue,
    panelData,
    selectedModuleDashLet,
    setSelectedModuleDashLet,
  }) => {
    const classes = useStyles();
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState(panelData);
    const handleSearch = (value) => {
      setFilteredData((data) =>
        panelData.filter((fData) =>
          fData?.title?.toLowerCase().includes(value.toLowerCase()),
        ),
      );
      setSearchText(value);
    };
    const handleOnSelect = (id, value) => {
      setSelectedModuleDashLet((v) => {
        const tempObj = {};
        v[id] = value;
        Object.entries(v).forEach(([k, v]) => {
          if (v) tempObj[k] = true;
        });
        return tempObj;
      });
    };
    return (
      <TabPanel key="panelModules" value={selectedTabValue} index={0}>
        <FormInput
          field={{
            label: LBL_DASHLET_SEARCH_FIELD,
            field_key: "search_field",
            name: "search_field",
          }}
          value={searchText}
          onChange={handleSearch}
        />
        <Grid container spacing={1}>
          {filteredData.map((v, i) => (
            <Grid
              key={v.id}
              item
              xs={12}
              sm={6}
              md={4}
              className={classes.removeListStyle}
            >
              <ListItem key={v.id}>
                <ListItemText id={i}>
                  <FaIcon
                    icon={`fas ${v.icon ? v.icon : "fas fa-cube"}`}
                    size="1x"
                  />
                  <span className={classes.text}>
                    {truncateString(v.title, 18)}
                  </span>
                </ListItemText>
                <ListItemSecondaryAction>
                  <Checkbox
                    name={v.id}
                    onChange={() =>
                      handleOnSelect(
                        v.id,
                        !pathOr(false, [v.id], selectedModuleDashLet),
                      )
                    }
                    checked={pathOr(false, [v.id], selectedModuleDashLet)}
                    inputProps={{ "aria-labelledby": i }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    );
  },
);
const WebTilesTabPanel = memo((props) => {
  const {
    panelData,
    selectedTabValue,
    webFieldValues,
    webFieldErrors,
    handleWebOnChange,
  } = props;
  return (
    <TabPanel key="panelWeb" value={selectedTabValue} index={1}>
      <List>
        {panelData?.map((v, i) => (
          <>
            <ListItem key={v.id}>
              <FormInput
                field={{
                  label: v.title,
                  field_key: v.id,
                  name: v.id,
                  type: "varchar",
                }}
                errors={webFieldErrors}
                value={webFieldValues[v.id]}
                onChange={(value) => handleWebOnChange(v.id, value)}
              />
            </ListItem>
          </>
        ))}
      </List>
    </TabPanel>
  );
});

export default DashboardAddDashLetDialog;
