import { isNil, pathOr } from "ramda";
import { toast } from "react-toastify";
import { api } from "../../common/api-utils";
import { SOMETHING_WENT_WRONG } from "../../constant";
import * as actionTypes from "../actions/actionTypes";
import { notificationUtil } from "../../utils/notification.utils";

const getError = (res) =>
  pathOr(SOMETHING_WENT_WRONG, ["data", "errors", "detail"], res);

const getNotificationsRequest = () => ({
  type: actionTypes.GET_NOTIFICATIONS_REQUEST,
});

export const getNotificationsSuccess = (payload) => ({
  type: actionTypes.GET_NOTIFICATIONS_SUCCESS,
  payload,
});

const getNotificationsFailure = (error) => ({
  type: actionTypes.GET_NOTIFICATIONS_FAILURE,
  error,
});

export const switchNotificationsListener = () => ({
  type: actionTypes.GET_NOTIFICATIONS_FAILURE,
});

export const appendReceiveNotification = (payload) => ({
  type: actionTypes.APPEND_RECEIVE_NOTIFICATION,
  payload,
});

export const getNotifications =
  (page, currentUser = null) =>
  async (dispatch, getStore) => {
    let tab = "Alerts";
    if (isNil(currentUser)) {
      currentUser = pathOr(
        "",
        ["config", "currentUserData", "data", "attributes", "id"],
        getStore(),
      );
    }
    try {
      dispatch(getNotificationsRequest());

      let url = `/V8/module/${tab}?sort=-date_entered&page[size]=10&page[number]=${page}&filter[is_read][eq]=0&filter[assigned_user_id][eq]=${currentUser}`;
      const res = await api.get(url);
      if (res.ok) {
        dispatch(getNotificationsSuccess(res.data, tab));
        return;
      }
      return dispatch(getNotificationsFailure(getError(res)));
    } catch (e) {
      dispatch(getNotificationsFailure(e));
    }
  };

const markNotificationAsReadSuccess = (id) => ({
  type: actionTypes.MARK_NOTIFICATION_READ_SUCCESS,
  id,
});
export const updateNotificationCount = (count) => ({
  type: actionTypes.UPDATE_NOTIFICATION_COUNT,
  payload: count,
});
export const saveNotificationToken = (token) => ({
  type: actionTypes.FCM_NOTIFICATION_TOKEN,
  payload: token,
});

export const markNotificationAsRead = (id) => async (dispatch) => {
  try {
    let res = await api.patch(`/V8/module`, {
      data: {
        type: "Alerts",
        id,
        attributes: {
          is_read: "1",
        },
      },
    });

    if (res.ok) {
      dispatch(markNotificationAsReadSuccess(id));
      return;
    }
  } catch (e) {
  }
};
export const clearAllNotifications = () => async (dispatch) => {
  try {
    let res = await api.post(`/V8/actionbutton/clearNotifcations`, {
      data: {
        type: "Alerts",
      },
    });

    if (res.ok) {
      dispatch(markNotificationAsReadSuccess("all"));
      dispatch(getNotifications(1));
    }
    return res;
  } catch (e) {
  }
};
export const FCMTokenApi = async (token) => {
  try {
    
    var url = notificationUtil.UpdateTokenApi;
    const data = { token: token };
    let res = await api.post("/V8/actionbutton/updateTokenFCM", data);
    if (res.ok) {
    }
    return res;
  } catch (e) {
    toast(SOMETHING_WENT_WRONG);
  }
};

export const getAlertNotifications =
  (page, currentUser = null) =>
  async (dispatch, getStore) => {
    let tab = "Alerts";
    if (isNil(currentUser)) {
      currentUser = pathOr(
        "",
        ["config", "currentUserData", "data", "attributes", "id"],
        getStore(),
      );
    }
    const url = `/V8/module/${tab}?sort=-date_entered&page[size]=10&page[number]=${page}&filter[is_read][eq]=0&filter[assigned_user_id][eq]=${currentUser}`;
    return await api.get(url);
  };
