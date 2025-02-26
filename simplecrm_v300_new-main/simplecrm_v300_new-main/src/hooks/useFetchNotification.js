import { useState, useEffect } from "react";
import { pathOr } from "ramda";
import { useDispatch, useSelector } from "react-redux";
import {
  getAlertNotifications,
  markNotificationAsRead,
  updateNotificationCount,
} from "../store/actions/notification.actions";

function useFetchNotification(pageNum) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isNotificationClear, setIsNotificationClear] = useState(false);
  const dispatch = useDispatch();
  const totalNotificationsCount = useSelector(
    (state) => state?.notification?.totalNotificationsCount,
  );
  useEffect(() => {
    setNotificationList([]);
  }, []);

  useEffect(() => {
    getNotification(pageNum);
  }, [pageNum, totalNotificationsCount]);

  useEffect(() => {
    if (isNotificationClear) {
      getNotification(1);
      setIsNotificationClear((v) => !v);
    }
  }, [isNotificationClear]);

  const getNotification = (pageNum) => {
    setIsLoading(true);
    setError(false);
    dispatch(getAlertNotifications(pageNum))
      .then((res) => {
        if (res.ok) {
          const data = pathOr([], ["data", "data"], res);
          const totalRecords = pathOr(
            0,
            ["data", "meta", "total-records"],
            res,
          );
          const isLastPage = pathOr(true, ["data", "meta", "last_page"], res);
          if (pageNum == 1 && data.length == 0) {
            setNotificationList([]);
          } else if (pageNum == 1) {
            setNotificationList(data);
          } else {
            setNotificationList((prev) => [...prev, ...data]);
          }
          setHasMore(!isLastPage);
          dispatch(updateNotificationCount(totalRecords));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
      });
  };
  const markAsRead = (id) => {
    if (notificationList.length == 1 && notificationList[0].id == id) {
      setNotificationList([]);
    } else {
      setNotificationList((v) => v.filter((f) => f.id != id));
    }
    dispatch(markNotificationAsRead(id));
  };
  return {
    isLoading,
    error,
    notificationList,
    hasMore,
    markAsRead,
    isNotificationClear,
    setNotificationList,
    setIsNotificationClear,
  };
}
export default useFetchNotification;
