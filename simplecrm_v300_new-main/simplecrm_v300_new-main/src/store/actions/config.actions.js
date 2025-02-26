import * as actionTypes from "../actions/actionTypes";
import { api } from "../../common/api-utils";
import { useAuthState } from "@/customStrore";
import { pathOr } from "ramda";
import { setInitialDashboardTabsAction } from "./dashboard.actions";
import {
  getAlertNotifications,
  updateNotificationCount,
} from "./notification.actions";
import { decryptAES } from "@/common/encryption-utils";
import EnvUtils from "@/common/env-utils";
const ERROR_MESSAGE_STATUS_500 = "Please contact administrator.";

export const click2Call = async (request) => {
  let data = null;
  try {
    const res = await api.post(`/V8/cti/click2Call`, JSON.stringify(request));
    if (res && res.ok) {
      return res;
    }
  } catch (e) {
    console.log(e);
  }
  return data;
};
const getCTISession = async () => {
  let data = null;
  const res = await api.post(
    `/V8/cti/createSession`,
    JSON.stringify({ agent_username: "ag01" }),
  );
  if (res && res.ok) {
    let data = res.data.data.data;
  }
  return data;
};

const toggleTheme = (theme) => ({
  type: actionTypes.TOGGLE_THEME,
  payload: theme,
});

// Current User actions
const getCurrentUserRequest = () => ({
  type: actionTypes.GET_CURRENTUSER_REQUEST,
});

const getCurrentUserSuccess = (payload) => ({
  type: actionTypes.GET_CURRENTUSER_SUCCESS,
  payload,
});

const getCurrentUserFailure = (error) => ({
  type: actionTypes.GET_CURRENTUSER_FAILURE,
  error,
});
export const getCurrentUser = () => async (dispatch, getStore) => {
  try {
    dispatch(getCurrentUserRequest());
    const res = await api.get(`/V8/current-user`);

    if (res.ok) {
      dispatch(getCurrentUserSuccess(res.data));
      return;
    } else if (res.status != 200) {
      const store = getStore();
      const isAuthenticated = pathOr(false, ["auth", "isAuthenticated"], store);
      if (isAuthenticated) {
        setTimeout(() => {
          useAuthState.getState().authActions.resetAuthState();
        }, 10000);
        let errorMessage = pathOr(
          ERROR_MESSAGE_STATUS_500,
          ["data", "errors", "detail"],
          res,
        );
        dispatch(getCurrentUserFailure(errorMessage));
      }
    }
  } catch (ex) {
    dispatch(getCurrentUserFailure(ex));
  }
};

//User preference data actions

const getUserPreferenceSuccess = (payload) => ({
  type: actionTypes.USER_PREFERENCE_SUCCESS,
  payload,
});

export const getUserPreference = () => async (dispatch) => {
  try {
    const res = await api.get("/V8/user-preferences");
    if (res.ok) {
      let dashboardTabsList = pathOr(
        [],
        ["data", "data", "attributes", "HomeApp", "pages"],
        res,
      );
      if (Array.isArray(dashboardTabsList)) {
        const dashboardTabsObj = {};
        dashboardTabsList.forEach((e, i) => {
          dashboardTabsObj[i] = {
            index: i,
            pageTitle: e?.pageTitle,
          };
        });
        dispatch(setInitialDashboardTabsAction(dashboardTabsObj));
      }
      return res.data;
      // dispatch(getUserPreferenceSuccess(res.data.data));
      return;
    }
  } catch (e) {
    return e;
  }
};

export const updateBaseUrl = (baseUrl) => ({
  type: actionTypes.UPDATE_BASE_URL,
  baseUrl,
});

export const changeTheme = (theme) => async (dispatch) => {
  try {
    dispatch(toggleTheme(theme));
    const res = await api.get("/V8/meta/set_config/" + theme);
    if (res.ok) {
      dispatch(toggleTheme(theme));
      return;
    }
  } catch (e) {
    console.log(e);
  }
};

export const toggleSidebarMenu = (open) => ({
  type: actionTypes.TOGGLE_SIDEBAR_MENU,
  open,
});

export const saveMenuConfigurator = async (request) => {
  try {
    let req = { disp_menu: request };
    return await api.post(`V8/meta/set_user_preference/menuconf`, req);
  } catch (e) {
    console.log(e);
  }
};

const getConfigRequest = () => ({
  type: actionTypes.GET_CONFIG_REQUEST,
});

const getConfigSuccess = (payload) => ({
  type: actionTypes.GET_CONFIG_SUCCESS,
  payload,
});

const getConfigFailure = (error) => ({
  type: actionTypes.GET_CONFIG_FAILURE,
  error,
});

export const getConfigData = () => async (dispatch, getStore) => {
  try {
    dispatch(getConfigRequest());
    let res = await api.get(`/V8/meta/config`);
    if (res.ok) {
      const encryptedData = pathOr({}, ["data"], res);
      const aesKey = EnvUtils.getValue("REACT_APP_AES_KEY");
      res.data = JSON.parse(decryptAES(aesKey, encryptedData));
      const currentUser = pathOr(
        "",
        ["data", "current_user", "data", "attributes"],
        res,
      );
      const currentUserId = pathOr(
        "",
        ["data", "current_user", "data", "attributes", "id"],
        res,
      );
      dispatch(getConfigSuccess(res.data));
      if (!!currentUserId) {
        useAuthState.getState().authActions.setUserDetail(currentUser);
        dispatch(getAlertNotifications(1, currentUserId)).then((res) => {
          if (res.ok) {
            const totalRecords = pathOr(
              0,
              ["data", "meta", "total-records"],
              res,
            );
            dispatch(updateNotificationCount(totalRecords));
          }
        });
      }
      return;
    } else if (res.status != 200) {
      const store = getStore();
      const isAuthenticated = pathOr(false, ["auth", "isAuthenticated"], store);
      if (isAuthenticated) {
        setTimeout(() => {
          useAuthState.getState().authActions.resetAuthState();
        }, 10000);
        let errorMessage = pathOr(
          ERROR_MESSAGE_STATUS_500,
          ["data", "errors", "detail"],
          res,
        );
        dispatch(getConfigFailure(errorMessage));
      }
    }
  } catch (ex) {
    dispatch(getConfigFailure(ex));
  }
};
