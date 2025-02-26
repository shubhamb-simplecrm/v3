import React, { useState, useEffect } from "react";
// styles
import useStyles, { getMuiTheme } from "./styles";

import {
  useTheme,
  Grid,
  Typography,
  Paper,
  Card,
  CardHeader,
  CardMedia,
  Avatar,
  IconButton,
} from "@material-ui/core";

import MoreVertIcon from "@material-ui/icons/MoreVert";

import { TextField, MenuItem } from "@material-ui/core";

import { Chart, GeoChart, Funnel } from "../../../../components";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { LBL_DASH_PERIOD_DROPDOWN_TITLE, LBL_SALES_DASH_LEADS_CONVERTED, LBL_SALES_DASH_LEADS_GENERATED, LBL_SALES_DASH_LEAD_TREND, LBL_SALES_DASH_LOST_OPPORTUNITIES, LBL_SALES_DASH_MY_TEAM_TARGET, LBL_SALES_DASH_OPEN_LEADS, LBL_SALES_DASH_OPEN_OPPORTUNITIES, LBL_SALES_DASH_OPEN_OPPORTUNITIES_PAST_DUE_DATE, LBL_SALES_DASH_REGION_WISE_CLOSED_WON_OPPORTUNITIES, LBL_SALES_DASH_REVENUE_BY_LEAD_SOURCE, LBL_SALES_DASH_SALES_PIPELINE, LBL_SALES_DASH_TOP_SALES_REPRESENTATIVE, LBL_SALES_DASH_WIN_LOSS_RATE, LBL_SALES_DASH_WON_OPPORTUNITIES } from "../../../../constant";

export default function SalesDashboard({
  data,
  date_time_period,
  setDateTimePeriod,
}) {
  // const [spacing, setSpacing] = React.useState(1);
  const classes = useStyles();
  const theme = useTheme();
  const visibleDashlets = [
    "gauge",
    "stacked",
    "line_chart",
    "grouped",
    "stacked_rotated",
    "line_chart2",
    "funnel",
    "geochart",
  ];
  const customLabels = {
    converted: LBL_SALES_DASH_LEADS_CONVERTED,
    open: LBL_SALES_DASH_OPEN_LEADS,
    total: LBL_SALES_DASH_LEADS_GENERATED,
    closed_won: LBL_SALES_DASH_WON_OPPORTUNITIES,
    closed_lost: LBL_SALES_DASH_LOST_OPPORTUNITIES,
    openAmount: LBL_SALES_DASH_OPEN_OPPORTUNITIES,
    gauge: LBL_SALES_DASH_MY_TEAM_TARGET,
    funnel: `${LBL_SALES_DASH_SALES_PIPELINE} ( IN ${data?.currency_symbols})`,
    stacked: LBL_SALES_DASH_WIN_LOSS_RATE,
    stacked_rotated: LBL_SALES_DASH_TOP_SALES_REPRESENTATIVE,
    grouped: LBL_SALES_DASH_REVENUE_BY_LEAD_SOURCE,
    line_chart: LBL_SALES_DASH_LEAD_TREND,
    line_chart2: LBL_SALES_DASH_OPEN_OPPORTUNITIES_PAST_DUE_DATE,
    geochart: LBL_SALES_DASH_REGION_WISE_CLOSED_WON_OPPORTUNITIES,
  };

  // const handleChange = (event) => {
  //     setSpacing(Number(event.target.value));
  // };
  const displayDashlet = (dashNum, dashKey, content) => {
    switch (dashKey) {
      case "funnel":
      case "gauge":
      case "stacked":
      case "line_chart":
      case "grouped":
      case "stacked_rotated":
      case "line_chart2":
        return (
          <Grid key={dashNum} xs={12} sm={6} item style={{ padding: 5 }}>
            <Card className={classes.DashletRoot}>
              <CardHeader
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                // title="Shrimp and Chorizo Paella"
                subheader={customLabels[dashKey] || dashKey}
                className={classes.dashletHeader}
              />
              {dashKey !== "funnel" ? (
                <Chart name={dashKey} dataJson={content && content} />
              ) : (
                <Funnel
                  width={600}
                  height={200}
                  name={dashKey}
                  dataJson={content && content}
                  currencyCode={data?.currency_code}
                />
              )}
            </Card>
          </Grid>
        );
      case "geochart":
        return (
          <Grid key={dashNum} xs={12} sm={12} item style={{ padding: 5 }}>
            <Card className={classes.DashletRoot}>
              <CardHeader
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                // title="Shrimp and Chorizo Paella"
                subheader={customLabels[dashKey] || dashKey}
              />
              <GeoChart name={dashKey} dataJson={content && content} />
            </Card>
          </Grid>
        );

      case "currency_symbols":
      case "table_year":
      case "date_from":
      case "date_to":
      case "IsPlaceholderAnimation":
      case "IsDisplay":
      case "alert":
      case "date_time_period":
      case "date_time_period_list":
      case "currencySymbofunnell":
        return null;
      default:
        return (
          <Grid key={dashNum} xs={12} sm={6} item style={{ padding: 5 }}>
            <Card className={classes.DashletRoot}>
              <CardHeader
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                // title="Shrimp and Chorizo Paella"
                subheader={customLabels[dashKey] || dashKey}
              />
            </Card>
          </Grid>
        );
    }
  };
  const renderOptions = () => {
    let optionsToRender = [];
    for (let optionKey in data.date_time_period_list) {
      optionsToRender.push(
        <MenuItem key={optionKey} value={optionKey}>
          <span>{data.date_time_period_list[optionKey]}</span>
        </MenuItem>,
      );
    }
    return optionsToRender;
  };
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <Paper className={classes.filterArea}>
              <Grid sm={4} item style={{ padding: 5 }}>
                <TextField
                  id="period"
                  name="period"
                  select
                  label={LBL_DASH_PERIOD_DROPDOWN_TITLE}
                  value={date_time_period ? date_time_period : " "}
                  onChange={(e) => setDateTimePeriod(e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                >
                  {renderOptions()}
                </TextField>
              </Grid>
            </Paper>
          </Grid>
          <Grid container justify="center" alignItems="center">
            {Object.keys(data).map((dashKey, dashNum) =>
              dashNum <= 5 ? (
                <Grid key={dashNum} xs={4} sm={2} item style={{ padding: 5 }}>
                  <Paper className={classes.topRow}>
                    <Typography gutterBottom variant="h3">
                      {dashNum >= 3 ? data["currency_symbols"] : null}
                      {data[dashKey]}
                    </Typography>
                    <Typography gutterBottom variant="body2">
                      {customLabels[dashKey] || dashKey}
                    </Typography>
                  </Paper>
                </Grid>
              ) : null,
            )}

            {visibleDashlets.map((dashKey, dashNum) =>
              displayDashlet(dashNum, dashKey, data[dashKey]),
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </MuiThemeProvider>
  );
}
