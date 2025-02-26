import { pathOr } from "ramda";
import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  notifications: [],
  notificationsMeta: [],
  notificationsLoading: false,
  notificationsError: null,
  totalNotificationsCount: 0,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.GET_NOTIFICATIONS_REQUEST:
      return { ...state, notificationsLoading: true, notificationsError: null };

    case actionTypes.GET_NOTIFICATIONS_SUCCESS:
      const totalRecords = pathOr(0, ["meta", "total-records"], action.payload);
      return {
        ...state,
        notifications: action.payload.data,
        notificationsMeta: action.payload.meta,
        notificationsLoading: false,
        notificationsError: null,
        totalNotificationsCount: totalRecords
      };

    case actionTypes.GET_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        notificationsLoading: false,
        notificationsError: action.error,
      };

    case actionTypes.MARK_NOTIFICATION_READ_SUCCESS:
      let filterNotifications = [];
      if (action.id && action.id != "all") {
        filterNotifications = state.notifications.filter(
          (notification) => notification.id !== action.id,
        );
      } else if (action.id != "all") {
        filterNotifications = [];
      }
      return {
        ...state,
        notifications: filterNotifications,
        notificationsLoading: false,
      };
    case actionTypes.APPEND_RECEIVE_NOTIFICATION:
      return {
        ...state,
        notifications: [...action.payload.data, ...state.notifications],
        notificationsMeta: action.payload.meta,
        notificationsLoading: false,
        notificationsError: null,
      };
    case actionTypes.UPDATE_NOTIFICATION_COUNT:
      return {
        ...state,
        totalNotificationsCount: action.payload,
      };
    case actionTypes.FCM_NOTIFICATION_TOKEN:
      return {
        ...state,
        notificationToken: action.payload,
      };
    default:
      return state;
  }
};
