import React, { useEffect, useState, useCallback } from "react";
import { pathOr } from "ramda";
import { fetchToken, onMessageListener } from "../../firebase";
import { toast } from "react-toastify";
import {
  getAlertNotifications,
  updateNotificationCount,
} from "../../store/actions/notification.actions";
import { useSelector, useDispatch } from "react-redux";

export default function FirebaseToast() {
  const dispatch = useDispatch();
  const [isTokenFound, setTokenFound] = useState(false);
  const totalNotificationsCount = useSelector(
    (state) => state?.notification?.totalNotificationsCount,
  );
  const fetchFCMToken = useCallback(() => {
    fetchToken(setTokenFound);
  }, []);

  useEffect(() => {
    if (!isTokenFound) {
      fetchFCMToken();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("focus", () => {
      getNotification(1);
    });

    const handleFocus = () => {};

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const getNotification = (pageNum) => {
    dispatch(getAlertNotifications(pageNum))
      .then((res) => {
        if (res.ok) {
          const totalRecords = pathOr(
            0,
            ["data", "meta", "total-records"],
            res,
          );
          dispatch(updateNotificationCount(totalRecords));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onMessageListener()
    .then((payload) => {
      toast(payload.data.body);
      updateCount();
    })
    .catch((err) => console.log("payload: ", err));

  const updateCount = () => {
    let totalCount = totalNotificationsCount + 1;
    const totalRecords = pathOr(
      totalCount,
      ["data", "meta", "total-records"],
      "",
    );
    dispatch(updateNotificationCount(totalRecords));
  };
  return <div></div>;
}
