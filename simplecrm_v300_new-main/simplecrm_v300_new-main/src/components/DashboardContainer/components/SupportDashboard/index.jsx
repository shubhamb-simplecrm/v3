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
import { LBL_DASH_PERIOD_DROPDOWN_TITLE, LBL_SUPP_DASH_ACTIVITIES_BY_STATUS, LBL_SUPP_DASH_AVG_FIRST_CLOSURE_TIME, LBL_SUPP_DASH_AVG_FIRST_TIME_RESPONSE, LBL_SUPP_DASH_AVG_SENTIMENT_SCORE, LBL_SUPP_DASH_CLOSED_TICKETS, LBL_SUPP_DASH_CSAT_BY_TICKET_TYPE, LBL_SUPP_DASH_ESCALATED_TICKETS, LBL_SUPP_DASH_NEW_TICKETS, LBL_SUPP_DASH_OPEN_TICKETS, LBL_SUPP_DASH_SLA_BREACHED_STEPS, LBL_SUPP_DASH_SLA_BREACHED_TICKETS, LBL_SUPP_DASH_TICKETS_BY_SOURCE, LBL_SUPP_DASH_TICKETS_BY_TYPE_BY_PRIORITY } from "../../../../constant";

export default function SupportDashboard({
  data,
  date_time_period,
  setDateTimePeriod,
}) {
  // const [spacing, setSpacing] = React.useState(1);
  const classes = useStyles();
  const theme = useTheme();
  var topRow = {
    ticket_new_count: LBL_SUPP_DASH_NEW_TICKETS,
    ticket_closed_count: LBL_SUPP_DASH_CLOSED_TICKETS,
    ticket_open_count: LBL_SUPP_DASH_OPEN_TICKETS,
    escalated_tickets_per: LBL_SUPP_DASH_ESCALATED_TICKETS,
    avg_1st_res_time_hr: LBL_SUPP_DASH_AVG_FIRST_TIME_RESPONSE,
    avg_1st_res_time_day: LBL_SUPP_DASH_AVG_FIRST_CLOSURE_TIME,
  };

  const customLabels = {
    SLA_BREACHED_TICKETS: LBL_SUPP_DASH_SLA_BREACHED_TICKETS,
    SLA_BREACHED_TASKS: LBL_SUPP_DASH_SLA_BREACHED_STEPS,
    CSAT_BY_TICKET_TYPE: LBL_SUPP_DASH_CSAT_BY_TICKET_TYPE,
    ACTIVITY_BY_STATUS: LBL_SUPP_DASH_ACTIVITIES_BY_STATUS,
    AVERAGE_SENTIMENT_SCORE: LBL_SUPP_DASH_AVG_SENTIMENT_SCORE,
    TICKETS_BY_TYPE_BY_PRIORITY: LBL_SUPP_DASH_TICKETS_BY_TYPE_BY_PRIORITY,
    TICKETS_BY_SOURCE: LBL_SUPP_DASH_TICKETS_BY_SOURCE,
  };

  // const handleChange = (event) => {
  //     setSpacing(Number(event.target.value));
  // };
  const displayDashlet = (dashNum, dashKey, content) => {
    switch (dashKey) {
      case "SLA_BREACHED_TICKETS":
      case "SLA_BREACHED_TASKS":
      case "CSAT_BY_TICKET_TYPE":
      case "ACTIVITY_BY_STATUS":
      case "TICKETS_BY_TYPE_BY_PRIORITY":
      case "AVERAGE_SENTIMENT_SCORE":
      case "TICKETS_BY_SOURCE":
        return (
          <Grid key={dashNum} sm={6} item style={{ padding: 5 }}>
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
              <Chart name={dashKey} dataJson={content} />
            </Card>
          </Grid>
        );
      case "table_year":
      case "date_from":
      case "date_to":
      case "IsPlaceholderAnimation":
      case "IsDisplay":
      case "alert":
      case "date_time_period":
      case "date_time_period_list":
        return null;
      default:
        return (
          <Grid key={dashNum} sm={6} item style={{ padding: 5 }}>
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
          <Grid container direction="row" justify="center" alignItems="center">
            {Object.keys(topRow).map((dashKey, dashNum) => (
              <Grid key={dashNum} xs={4} sm={2} item style={{ padding: 5 }}>
                <Paper className={classes.topRow}>
                  <Typography gutterBottom variant="h3">
                    {data[dashKey]}
                  </Typography>
                  <Typography gutterBottom variant="body2">
                    {topRow[dashKey] || dashKey}
                  </Typography>
                </Paper>
              </Grid>
            ))}

            {Object.keys(customLabels).map((dashKey, dashNum) => {
              if (data[dashKey]) {
                return displayDashlet(dashNum, dashKey, data[dashKey]);
              }
            })}
          </Grid>
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </MuiThemeProvider>
  );
}
