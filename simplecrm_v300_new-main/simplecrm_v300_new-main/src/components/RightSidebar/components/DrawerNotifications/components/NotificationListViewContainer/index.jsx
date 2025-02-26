import { Box, Typography } from "@material-ui/core";
import React, { useCallback, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import NotificationTile from "../NotificationTile";
import useStyles from "./styles";
import useFetchNotification from "../../../../../../hooks/useFetchNotification";
import SkeletonShell from "../../../../../Skeleton";
import { useDispatch } from "react-redux";
import { clearAllNotifications } from "../../../../../../store/actions/notification.actions";
import NotificationHeader from "../NotificationHeader";
import { isEmpty } from "ramda";

function NotificationListViewContainer(props) {
  const { handleRightSidebarClose } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const {
    isLoading,
    error,
    notificationList,
    hasMore,
    markAsRead,
    setIsNotificationClear,
  } = useFetchNotification(pageNum);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  const clearAllNotificationsList = useCallback(() => {
    dispatch(clearAllNotifications()).then((res) => {
      setIsNotificationClear(true);
      setPageNum(1);
    });
  }, [setPageNum, clearAllNotifications]);

  if (pageNum == 1 && isLoading) {
    <SkeletonShell layout="EditView" />;
  }

  return (
    <>
      <NotificationHeader
        handleRightSidebarClose={handleRightSidebarClose}
        clearAllNotificationsList={clearAllNotificationsList}
        notificationList={notificationList}
      />
      <Scrollbars
        id="scrollableDiv"
        className={classes.heightAdj}
        autoHide={true}
      >
        {notificationList.map((notification, index) => {
          if (notificationList.length === index + 1) {
            return (
              <Box
                boxShadow={0}
                m={1}
                className={classes.notificationMain}
                key={index}
                ref={lastBookElementRef}
              >
                <NotificationTile
                  notification={notification}
                  markAsRead={markAsRead}
                  notificationIndex={index}
                  handleRightSidebarClose={handleRightSidebarClose}
                />
              </Box>
            );
          } else {
            return (
              <Box
                boxShadow={0}
                m={1}
                className={classes.notificationMain}
                key={index}
              >
                <NotificationTile
                  notification={notification}
                  markAsRead={markAsRead}
                  notificationIndex={index}
                  handleRightSidebarClose={handleRightSidebarClose}
                />
              </Box>
            );
          }
        })}
        {isLoading && (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography
              variant="button"
              display="inline"
              align="center"
              gutterBottom
            >
              Loading...
            </Typography>
          </Box>
        )}
        {error && (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography
              variant="button"
              display="inline"
              align="center"
              gutterBottom
            >
              Error...
            </Typography>
          </Box>
        )}
        {!isLoading && !hasMore && isEmpty(notificationList) && (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography
              variant="button"
              display="inline"
              align="center"
              gutterBottom
            >
              No More Records
            </Typography>
          </Box>
        )}
      </Scrollbars>
    </>
  );
}

export default NotificationListViewContainer;
