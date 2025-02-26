import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Skeleton } from "..";
import { Grid, Tab, Tabs, Tooltip } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { isNil, pathOr } from "ramda";
import useStyles from "./styles";
import { textEllipsis } from "../../common/utils";
import { getDashboardTabDataAction } from "../../store/actions/dashboard.actions";
import { DashboardSetting } from "./components/DashboardSetting";
import useCommonUtils from "@/hooks/useCommonUtils";
const DefaultDashboard = React.lazy(
  () => import("./components/DefaultDashboard"),
);
const SalesDashboard = React.lazy(() => import("./components/SalesDashboard"));
const SupportDashboard = React.lazy(
  () => import("./components/SupportDashboard"),
);
function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export const DashboardTabs = (props) => {
  const { currentActiveTabIndex, handleOnTabChange } = props;
  const classes = useStyles();
  const dashboardTabs = useSelector((state) => state?.dashboard?.dashboardTabs);
  const selectedTabData = pathOr(null, [currentActiveTabIndex], dashboardTabs);
  const { isUserHaveCustomerPortalRole } = useCommonUtils();
  const tabsDataItems = useMemo(() => {
    return (
      dashboardTabs &&
      Object.entries(dashboardTabs).map(
        ([currentActiveTabIndex, tab], index) => {
          const tabTitle = pathOr(
            pathOr("Undefined", ["pageTitleLabel"], tab),
            ["pageTitle"],
            tab,
          );
          return (
            <Tab
              key={`${tabTitle}-${currentActiveTabIndex}`}
              label={
                <Tooltip title={tabTitle} arrow placement="top">
                  <div className={classes.tabName}>
                    {textEllipsis(tabTitle, 20)}
                  </div>
                </Tooltip>
              }
              {...a11yProps(currentActiveTabIndex)}
              className={classes.tabButton}
              fullWidth={false}
              style={{ minWidth: 50, padding: 5 }}
            />
          );
        },
      )
    );
  }, [dashboardTabs]);
  return (
    <Grid
      container
      justifyContent="space-between"
      className={classes.tabBackground}
    >
      <Grid item xs={9}>
        <Tabs
          value={currentActiveTabIndex}
          onChange={handleOnTabChange}
          indicatorColor=""
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable"
          classes={{
            flexContainer: classes.tabs,
          }}
        >
          {tabsDataItems}
        </Tabs>
      </Grid>
      {!isUserHaveCustomerPortalRole && (
        <DashboardSetting
          currentActiveTabIndex={currentActiveTabIndex}
          selectedTabData={selectedTabData}
        />
      )}
    </Grid>
  );
};

export const DashboardPanel = memo((props) => {
  const { currentActiveTabIndex } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [dateTimePeriod, setDateTimePeriod] = useState("this_year");
  const dashboardData = useSelector((state) => state?.dashboard?.dashboardData);
  const dashboardLoading = useSelector(
    (state) => state?.dashboard?.dashboardLoading,
  );
  const dashboardError = useSelector(
    (state) => state?.dashboard?.dashboardError,
  );

  const getDashboardData = useCallback(
    (value, datePeriodValue) =>
      dispatch(getDashboardTabDataAction(value, datePeriodValue)),
    [],
  );

  const dashboardPanelItems = useMemo(() => {
    const dashboardPanelData = pathOr(
      {},
      [currentActiveTabIndex],
      dashboardData,
    );
    const dashboardPanelComponent = {
      "Support Dashboard": (
        <SupportDashboard
          data={dashboardPanelData?.defaultDashboardData?.data}
          date_time_period={dateTimePeriod}
          setDateTimePeriod={setDateTimePeriod}
        />
      ),
      "Sales Dashboard": (
        <SalesDashboard
          data={dashboardPanelData?.defaultDashboardData?.data}
          date_time_period={dateTimePeriod}
          setDateTimePeriod={setDateTimePeriod}
        />
      ),
      default: <DefaultDashboard panelData={dashboardPanelData} />,
    };
    let component =
      dashboardPanelComponent[dashboardPanelData?.title] ||
      dashboardPanelComponent["default"];

    return component;
  }, [dashboardData, currentActiveTabIndex, dateTimePeriod]);

  useEffect(() => {
    if (isNil(currentActiveTabIndex)) return;
    getDashboardData(currentActiveTabIndex, dateTimePeriod);
  }, [getDashboardData, currentActiveTabIndex]);

  if (dashboardLoading) {
    return <Skeleton count={7} />;
  }

  if (dashboardError) {
    return <h3>{dashboardError}</h3>;
  }
  return (
    <Grid item className={classes.backgroundDash}>
      {dashboardPanelItems}
    </Grid>
  );
});
