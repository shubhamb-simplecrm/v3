import React from "react";
import { Tooltip, Typography } from "@material-ui/core";
import DrawerHeader from "../../../DrawerHeader";

export default function NotificationHeader(props) {
  const { clearAllNotificationsList, notificationList } = props;

  return (
    <DrawerHeader
      title={"Notifications"}
      subheader={
        notificationList.length ? (
          <Tooltip title={"Clear all notifications"}>
            <Typography
              gutterBottom
              variant="caption"
              onClick={clearAllNotificationsList}
              style={{
                cursor: "pointer",
                paddingBottom: "5px",
              }}
            >
              Clear all
            </Typography>
          </Tooltip>
        ) : null
      }
    />
  );
}
