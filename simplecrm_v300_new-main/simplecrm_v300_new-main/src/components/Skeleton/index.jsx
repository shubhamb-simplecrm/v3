import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TimelineDot from "@material-ui/lab/TimelineDot";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(20),
    },
    margin: "0",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%, -50%)",
  },
  horizontalCenter: {
    //width: '100%',
    "& > * + *": {
      marginTop: theme.spacing(20),
    },
    margin: "0",
    right: "35%",
    left: "35%",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%, -50%)",
  },
  activityStream: {
    //width: '100%',
    "& > * + *": {
      marginTop: theme.spacing(20),
    },
    margin: "0",
    right: "35%",
    left: "35%",
    position: "absolute",
    top: "40%",
    transform: "translateY(-50%, -50%)",
  },
  horizontalCenterSubpanel: {
    padding: "10%",
    margin: "0 auto",
    width: "50%",
    //transform: 'translateY(-50%, -50%)',
    //position: 'absolute',
  },
  horizontalCenterStudio: {
    padding: "10%",
    margin: "0 auto",
    width: "50%",
    position: "relative",
    top: "30%",
  },
  bluredStudio: {
    padding: "1%",
    margin: "0 auto",
    // opacity: 0.25,
    lineHeight: 1,
  },
}));

const SkeletonShell = (props) => {
  const theme = useTheme();
  const classes = useStyles();

  switch (props.layout) {
    case "login":
      const loginSkeleton = (
        <div style={{ height: "330px", lineHeight: 3, textAlign: "center" }}>
          <Skeleton circle={true} width={130} height={130} />
          <Skeleton count={2} height={20} width={300} />
        </div>
      );
      return theme.palette.type === "dark" ? (
        <SkeletonTheme
          color={theme.palette.divider}
          highlightColor={theme.palette.divider}
        >
          {loginSkeleton}
        </SkeletonTheme>
      ) : (
        loginSkeleton
      );
    case "forgot":
      const forgotSkeleton = (
        <div style={{ height: "330px", lineHeight: 3, textAlign: "center" }}>
          <Skeleton count={2} height={20} width={300} />
        </div>
      );
      return theme.palette.type === "dark" ? (
        <SkeletonTheme
          color={theme.palette.divider}
          highlightColor={theme.palette.divider}
        >
          {forgotSkeleton}
        </SkeletonTheme>
      ) : (
        forgotSkeleton
      );
    case "sidebar":
      return theme.palette.type === "dark" ? (
        <SkeletonTheme
          color={theme.palette.divider}
          highlightColor={theme.palette.divider}
        >
          <div className={classes.root}>
            <LinearProgress />
          </div>
        </SkeletonTheme>
      ) : (
        <div className={classes.root}>
          <LinearProgress />
        </div>
      );
    case "activityStream":
      return theme.palette.type === "dark" ? (
        <SkeletonTheme
          color={theme.palette.divider}
          highlightColor={theme.palette.divider}
        >
          <div className={classes.activityStream}>
            <LinearProgress />
          </div>
        </SkeletonTheme>
      ) : (
        <div className={classes.activityStream}>
          <LinearProgress />
        </div>
      );
    case "dashlet":
    case "DetailView":
    case "dashletEdit":
    case "EditView":
      return theme.palette.type === "dark" ? (
        <SkeletonTheme
          color={theme.palette.divider}
          highlightColor={theme.palette.divider}
        >
          <div className={classes.horizontalCenter}>
            <LinearProgress />
          </div>
        </SkeletonTheme>
      ) : (
        <div className={classes.horizontalCenter}>
          <LinearProgress />
        </div>
      );
    case "Subpanel":
      return theme.palette.type === "dark" ? (
        <SkeletonTheme
          color={theme.palette.divider}
          highlightColor={theme.palette.divider}
        >
          <div className={classes.horizontalCenterSubpanel}>
            <LinearProgress />
          </div>
        </SkeletonTheme>
      ) : (
        <div className={classes.horizontalCenterSubpanel}>
          <LinearProgress />
        </div>
      );
      break;
    case "Studio":
      return theme.palette.type === "dark" ? (
        <SkeletonTheme
          color={theme.palette.divider}
          highlightColor={theme.palette.divider}
        >
          <div className={classes.horizontalCenterStudio}>
            <LinearProgress />
          </div>
        </SkeletonTheme>
      ) : (
        <div className={classes.horizontalCenterStudio}>
          <LinearProgress />
        </div>
      );
      break;
    case "StudioFields":
      return theme.palette.type === "dark" ? (
        <SkeletonTheme
          color={theme.palette.divider}
          highlightColor={theme.palette.divider}
        >
          <div className={classes.bluredStudio}>
            <Skeleton animation="wave" height={props.height} />
          </div>
        </SkeletonTheme>
      ) : (
        <div className={classes.bluredStudio}>
          <Skeleton animation="wave" color="primary" height={props.height} />
        </div>
      );
      break;
    case "rightBarActivity":
      let content = [];
      for (let i = 0; i < props.length; i++) {
        content.push(
          <TimelineItem key={"futureLoading" + i} id={"timeline" + i}>
            <TimelineSeparator>
              <TimelineDot>
                <Skeleton
                  animation="wave"
                  variant="circle"
                  width={20}
                  height={20}
                />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3}>
                <Typography component="div" key="body1" variant="body1">
                  <Skeleton />
                </Typography>
                <Typography component="div" key="h3" variant="h3">
                  <Skeleton />
                </Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>,
        );
      }
      return content;
    default:
      return theme.palette.type === "dark" ? (
        <SkeletonTheme
          color={theme.palette.divider}
          highlightColor={theme.palette.divider}
        >
          <div className={classes.horizontalCenter}>
            <LinearProgress />
          </div>
        </SkeletonTheme>
      ) : (
        <div className={classes.horizontalCenter}>
          <LinearProgress />
        </div>
      );
  }
};

export default SkeletonShell;
