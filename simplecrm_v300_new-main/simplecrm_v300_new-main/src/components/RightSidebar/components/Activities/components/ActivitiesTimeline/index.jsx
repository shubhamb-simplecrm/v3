import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import useStyles from "./styles";
import { getMuiTheme } from "./styles";
import { Chip, useTheme } from "@material-ui/core";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import EditIcon from "@material-ui/icons/Edit";
import TimelineDot from "@material-ui/lab/TimelineDot";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InfiniteScroll from "react-infinite-scroll-component";
import { Scrollbars } from "react-custom-scrollbars";
import { Link } from "react-router-dom";
import { textEllipsis } from "../../../../../../common/utils";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import SkeletonShell from "../../../../../Skeleton";
import { pathOr } from "ramda";
import { LBL_ACTIVITY_TODAY, LBL_LOADING } from "../../../../../../constant";
export default function ActivitiesTimeline({
  data,
  hasMoreDown,
  hasMoreUp,
  loading,
  tabIcon,
  fetchMoreData,
  module,
  futureLoading,
  setIsFuture,
  page,
  pageUp,
  isFuture,
  setData,
}) {
  const history = useHistory();
  const classes = useStyles();
  const currentTheme = useTheme();

  const getStatusColor = (statusText, status_bgcolor) => {
    let statusStyle = {};
    if (statusText === "sent") {
      status_bgcolor = "green";
    } else if (statusText === "received") {
      status_bgcolor = "blue";
    } else if (statusText === "read") {
      status_bgcolor = "red";
    } else if (statusText === "unread") {
      status_bgcolor = "orange";
    }
    if (currentTheme.palette.type === "dark") {
      statusStyle = {
        color: status_bgcolor,
        fontWeight: "bolder",
        background: "transparent",
        border: "1px solid",
      };
    } else {
      statusStyle = {
        color: status_bgcolor,
        background: status_bgcolor + "20",
        border: "none",
      };
    }
    return statusText && status_bgcolor ? (
      <Chip
        size="small"
        className={classes.statusBg}
        style={statusStyle}
        label={statusText}
      />
    ) : (
      statusText
    );
  };
  const scrollToMiddle = () => {
    let isTodayRow = data.findIndex((item) => item.isNow === true) - 3;
    if (isTodayRow < 1) {
      isTodayRow = Math.floor(data.length / 2) - 3;
    }
    const timeline1 = document.getElementById("timeline" + isTodayRow);

    if (timeline1 && page === 1 && pageUp === 1) {
      document.getElementById("timeline" + isTodayRow).scrollIntoView();
    } else if (timeline1 && isFuture && pageUp > 0) {
      if (document.getElementById("timeline" + 8)) {
        document.getElementById("timeline" + 8).scrollIntoView();
      }
    }
  };

  useEffect(scrollToMiddle, [data]);

  const trackScrolling = (event) => {
    const target = event.target;
    const bottom =
      parseInt(target.scrollHeight) - Math.abs(parseInt(target.scrollTop)) ===
        parseInt(target.clientHeight) ||
      parseInt(target.scrollHeight) - Math.abs(parseInt(target.scrollTop)) ===
        parseInt(target.clientHeight) + 1;
    if (bottom) {
      if (!futureLoading && hasMoreDown && !loading) {
        fetchMoreData(0);
      }
    } else if (
      Math.abs(parseInt(target.scrollTop)) === 0 &&
      !loading &&
      !futureLoading &&
      hasMoreUp
    ) {
      fetchMoreData(1);
    }
  };

  const getStatusClass = (status, record_type, today_record) => {
    let tplanned = ["Planned", "Not Started", "In Progress"];
    if (today_record) {
      if (tplanned.some((item) => status === item)) {
        return classes.todaysOpenActivity;
      }
    } else if (record_type === 0) {
      if (tplanned.some((item) => status === item)) {
        return classes.daangerActivity;
      }
    } else if (record_type === 1) {
      return classes.futureActivities;
    }
    let theld = ["Completed", "Held"];
    if (theld.some((item) => status === item)) {
      return classes.completedActivity;
    }
  };
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <Scrollbars
        onScroll={trackScrolling}
        id="scrollableDivRight"
        autoHide={true}
        className={classes.contentHeight}
      >
        <InfiniteScroll
          dataLength={data.length}
          next={fetchMoreData}
          hasMore={hasMoreDown !== 0 ? true : false}
          loader={<h4 style={{ textAlign: "center" }}>{LBL_LOADING}</h4>}
          scrollableTarget="scrollableDivRight"
        >
          <Timeline
            style={{
              minHeight:
                module &&
                module !== "Calls" &&
                module !== "Meetings" &&
                module !== "Tasks" &&
                module !== "Notes" &&
                module !== "Emails"
                  ? "85vh"
                  : "92vh",
            }}
          >
            {futureLoading ? (
              <>
                <h4 style={{ textAlign: "center" }}>Loading...</h4>{" "}
              </>
            ) : null}
            {loading && page === 1 ? (
              <SkeletonShell layout="rightBarActivity" length={10} />
            ) : null}
            {!loading &&
            !futureLoading &&
            hasMoreDown === 0 &&
            data.length === 0 ? (
              <p style={{ textAlign: "center" }}>
                <b>No Records!</b>
              </p>
            ) : null}
            {data.map((activity, index) => (
              <>
                {activity.isNow ? (
                  <Typography
                    style={{
                      borderBottom: "2px solid red",
                      textAlign: "center",
                    }}
                    variant="caption"
                    display="block"
                    color="textSecondary"
                  >
                    <i>{LBL_ACTIVITY_TODAY}</i>
                  </Typography>
                ) : (
                  <TimelineItem key={index} id={"timeline" + index}>
                    <TimelineSeparator>
                      <TimelineDot
                        color="primary"
                        className={classes.TimeLineDot}
                      >
                        {tabIcon[activity.module_dir]}
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper
                        elevation={3}
                        className={
                          activity.isToday
                            ? getStatusClass(
                                activity.status,
                                activity.record_type,
                                activity.isToday,
                              )
                            : getStatusClass(
                                activity.status,
                                activity.record_type,
                                activity.isToday,
                              )
                        }
                      >
                        <Grid
                          container
                          direction="row"
                          justify="space-between"
                          alignItems="flex-start"
                        >
                          <Grid item>
                            <Typography
                              variant="caption"
                              display="block"
                              color="secondary"
                              className={classes.linkDate}
                            >
                              {activity.date_start_select || ""} -{" "}
                              {activity.date_due || ""}
                            </Typography>
                          </Grid>
                          <Grid item>
                            {pathOr(0, ["ACLAccess", "edit"], activity) &&
                            activity.module_dir !== "Emails" ? (
                              <IconButton
                                className={classes.editButton}
                                aria-label="edit"
                                size="small"
                                onClick={() =>
                                  history.push(
                                    `/app/editview/${activity.module_dir}/${activity.id}`,
                                  )
                                }
                                color="primary"
                              >
                                <EditIcon fontSize="inherit" />
                              </IconButton>
                            ) : (
                              ""
                            )}
                          </Grid>
                        </Grid>
                        <Typography variant="subtitle2">
                          {pathOr(0, ["ACLAccess", "view"], activity) ? (
                            <Link
                              to={`/app/detailview/${activity.module_dir}/${activity.id}`}
                              className={classes.link}
                              variant="body2"
                              title={activity.name}
                            >
                              {activity.name
                                ? textEllipsis(activity.name, 35)
                                : ""}
                            </Link>
                          ) : (
                            activity.name
                          )}
                        </Typography>
                        <Grid
                          container
                          direction="row"
                          justify="space-between"
                          alignItems="flex-start"
                        >
                          <Grid item>
                            <Typography variant="caption" display="block">
                              <Link
                                to={`/app/detailview/${activity.parent_type}/${activity.parent_id}`}
                                className={classes.subLink}
                                variant="body2"
                                title={activity.parent_name}
                              >
                                {activity.parent_name
                                  ? textEllipsis(activity.parent_name, 28)
                                  : ""}
                              </Link>
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="caption" display="block">
                              {getStatusColor(
                                activity.status,
                                activity.status_bgcolor,
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                )}
              </>
            ))}
          </Timeline>
        </InfiniteScroll>
      </Scrollbars>
    </MuiThemeProvider>
  );
}
