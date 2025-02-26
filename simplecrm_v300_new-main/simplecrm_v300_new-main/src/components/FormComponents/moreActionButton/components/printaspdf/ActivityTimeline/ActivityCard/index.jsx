import React from "react";
import useStyles from "./styles";

import { Chip, Paper, Typography } from "@material-ui/core";
import { Timeline, TimelineContent, TimelineDot } from "@material-ui/lab";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import parse from "html-react-parser";
import { FaIcon } from "@/components";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";

const ActivityCard = ({ item }) => {
  const classes = useStyles();
  const { quickCreateModules } = useSelector(
    (state) => state?.layout?.sidebarLinks,
  );
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const isSpecialObject = ["Meetings", "Tasks", "Calls", "Notes"].includes(
    item.object_image,
  );

  const chipClassName = isSpecialObject
    ? classes.specialStatusContainer
    : classes.statusContainer;
  const statusChipLabel = isSpecialObject
    ? null
    : capitalizeFirstLetter(item.email_type);
  const userChipLabel = isSpecialObject
    ? item.assigned_user_name || ""
    : item.reply_to_addr_display || "";

  const userChipName = !userChipLabel
    ? classes.nullUserChip
    : classes.assignedUserContainer;
  const descriptionContent = isSpecialObject
    ? item.description
    : parse(item.description_html);
  return (
    <>
      <Timeline align="alternate" className={classes.mainTimelineContainer}>
        <TimelineContent className={classes.timelineContent}>
          <Paper elevatoin={4} className={classes.activityCardContainer}>
            <Paper elevation={0} className={classes.headerContainer}>
              <TimelineDot className={classes.moduleIconContainer}>
                <FaIcon
                  icon={`fas ${pathOr(
                    "fas fa-cube",
                    [item.object_image, "icon", "icon"],
                    quickCreateModules,
                  )}`}
                  size="1x"
                />
              </TimelineDot>
              <Typography variant="h6" className={classes.subjectContainer}>
                {item.name}
              </Typography>
              <Chip
                className={userChipName}
                avatar={
                  <AccountCircleIcon
                    className={classes.icon}
                    style={{ color: "#0071d2" }}
                  />
                }
                label={userChipLabel}
              />
              <Chip className={chipClassName} label={statusChipLabel} />

              <Chip
                className={classes.dateContainer}
                label={item.date_entered}
              />
            </Paper>
            <Paper className={classes.descriptionContainer}>
              <Typography>{descriptionContent}</Typography>
            </Paper>
          </Paper>
        </TimelineContent>
      </Timeline>
    </>
  );
};

export default ActivityCard;
