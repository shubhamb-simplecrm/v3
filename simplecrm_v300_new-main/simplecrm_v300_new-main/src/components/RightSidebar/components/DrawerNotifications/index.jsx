import React from "react";
import { memo } from "react";
import NotificationListViewContainer from "./components/NotificationListViewContainer";
function DrawerNotifications(props) {
  const { handleCloseRightSideBar } = props;

  return (
    <>
      <NotificationListViewContainer handleRightSidebarClose={handleCloseRightSideBar} />
    </>
  );
}

export default memo(DrawerNotifications);
