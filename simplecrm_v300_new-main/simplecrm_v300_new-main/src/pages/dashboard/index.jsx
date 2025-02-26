import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DashboardPanel,
  DashboardTabs,
} from "../../components/DashboardContainer";
import { setDashboardTabCurrentIndexAction } from "../../store/actions/dashboard.actions";
import { Grid, MuiThemeProvider } from "@material-ui/core";
import { getUserPreference } from "../../store/actions/config.actions";
import { Skeleton } from "../../components";
import { getMuiTheme } from "./styles";
import { useTheme } from "@material-ui/styles";
import { pathOr } from "ramda";

export default function Dashboard() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const dashboardTabIndex = useSelector(
    (state) => state?.dashboard?.activeDashboardTabIndex,
  );

  const handleOnTabChange = useCallback(
    (event, value) => {
      if (value !== dashboardTabIndex)
        dispatch(setDashboardTabCurrentIndexAction(value));
    },
    [dispatch, setDashboardTabCurrentIndexAction, dashboardTabIndex],
  );

  useEffect(() => {
    setLoading(true);
    dispatch(getUserPreference())
      .then((res) => {
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <Skeleton />;
  }

  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Grid container direction="column">
        <DashboardTabs
          currentActiveTabIndex={dashboardTabIndex}
          handleOnTabChange={handleOnTabChange}
        />
        <DashboardPanel currentActiveTabIndex={dashboardTabIndex} />
      </Grid>
    </MuiThemeProvider>
  );
}
