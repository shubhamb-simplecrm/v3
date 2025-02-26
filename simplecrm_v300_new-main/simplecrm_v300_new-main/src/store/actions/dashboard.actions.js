import * as actionTypes from "./actionTypes";
import { api } from "../../common/api-utils";
import { isNil, pathOr } from "ramda";
import { toast } from "react-toastify";
import {
  LBL_DASHBOARD_RENAME_SUCCESS,
  LBL_DASHLET_ADD_SUCCESS,
  LBL_DASHLET_CONFIGURE_SUCCESS,
  SOMETHING_WENT_WRONG,
} from "../../constant";
import { parserDashboardPositionData } from "../../common/utils";

// Dashboard actions
const getDashboardRequest = () => ({
  type: actionTypes.DASHBOARD_REQUEST,
});

const getDashboardSuccess = (payload) => ({
  type: actionTypes.DASHBOARD_SUCCESS,
  payload,
});

const getDashboardFailure = (payload) => ({
  type: actionTypes.DASHBOARD_FAILURE,
  payload,
});

const removeDashboardData = (payload) => ({
  type: actionTypes.REMOVE_DASHBOARD_DATA,
  payload,
});

const addDashboardTab = (tabIndex, obj) => ({
  type: actionTypes.DASHBOARD_TAB_ADD,
  payload: {
    tabIndex,
    tabObj: obj,
  },
});
const renameDashboardTab = (tabIndex, dashName) => ({
  type: actionTypes.DASHBOARD_TAB_RENAME,
  payload: { tabIndex, dashName },
});

const saveDashLetsChangedPosition = (payload) => ({
  type: actionTypes.SAVE_DASHLET_LAYOUT_CHANGED_POSITION,
  payload,
});

export const setDashboardTabCurrentIndexAction = (payload) => ({
  type: actionTypes.SET_DASHBOARD_TAB_INDEX,
  payload,
});

export const setInitialDashboardTabsAction = (payload) => ({
  type: actionTypes.SET_INITIAL_DASHBOARD_TABS,
  payload,
});

export const setDashboardLayoutEditableAction = (payload) => ({
  type: actionTypes.SET_DASHBOARD_LAYOUT_EDITABLE,
  payload,
});

export const changedDashboardLayoutPositionAction = (payload) => (dispatch) => {
  dispatch({
    type: actionTypes.CHANGED_DASHLET_LAYOUT_DATA,
    payload: parserDashboardPositionData(payload),
  });
};

export const saveDashboardGridLayoutAction =
  (requestPayload) => async (dispatch) => {
    try {
      let url = `/V8/dashboard/saveLayout`;
      const res = await api.post(url, requestPayload);
      if (res.ok) {
        dispatch(saveDashLetsChangedPosition(requestPayload));
      }
      return res;
    } catch (e) {
      return e;
    }
  };

export const getDashboardTabDataAction =
  (tabIndex, date_time_period = null) =>
  async (dispatch) => {
    let requestPayloadObj = {};
    if (date_time_period) {
      requestPayloadObj = {
        "page[number]": 1,
        "filter[date_time_period]": date_time_period,
      };
    }
    try {
      dispatch(getDashboardRequest());
      const res = await api.get(`/V8/dashboard/${tabIndex}`, requestPayloadObj);
      if (res.ok) {
        const payload = pathOr({}, ["data", "data"], res);
        const dashboardType = pathOr("", ["module"], payload);
        if (dashboardType == "HomeApp") {
          const dashLetList = pathOr([], ["dashlets"], payload);
          payload["dashlets"] = parserDashboardPositionData(dashLetList);
        }
        dispatch(getDashboardSuccess(payload));
        return;
      } else {
        const payload = pathOr(null, ["data", "message"], res);
        dispatch(getDashboardFailure(payload));
      }
    } catch (e) {
      dispatch(getDashboardFailure(e));
    }
  };

export const removeDashboardTabAction = (tabIndex) => async (dispatch) => {
  try {
    let url = `/V8/dashboard/${tabIndex}`;
    const res = await api.delete(url);
    if (res.ok) {
      dispatch(removeDashboardData(tabIndex));
      return res;
    }
  } catch (e) {}
};

export const renameDashboardTabAction =
  (tabIndex, payload) => async (dispatch) => {
    try {
      let url = `/V8/dashboard/rename/${tabIndex}`;
      const res = await api.post(url, payload);
      if (res.ok) {
        toast(res.ok ? LBL_DASHBOARD_RENAME_SUCCESS : SOMETHING_WENT_WRONG);
        dispatch(renameDashboardTab(tabIndex, payload.dashName));
        return res;
      } else {
        let error = pathOr(null, ["data", "errors", "detail"], res);
        if (error) {
          toast(error);
        }
      }
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
      return e;
    }
  };

export const addDashboardTabAction = (newDashName) => async (dispatch) => {
  let requestPayload = {
    dashName: newDashName,
  };
  try {
    let res = await api.post(`/V8/dashboard/add`, requestPayload);
    if (res.ok) {
      const newDashboardIndex = pathOr(
        0,
        ["data", "data", "data", "current_tab"],
        res,
      );
      dispatch(
        addDashboardTab(newDashboardIndex, {
          index: newDashboardIndex,
          pageTitle: newDashName,
        }),
      );
      dispatch(setDashboardTabCurrentIndexAction(newDashboardIndex));
    }
    return res;
  } catch (e) {
    toast(SOMETHING_WENT_WRONG);
  }
};

// DashLet Actions
const removeDashLetData = (payload) => ({
  type: actionTypes.REMOVE_DASHLET_DATA,
  payload,
});

const addDashLetData = (tabIndex, dashLetList) => ({
  type: actionTypes.ADD_DASHLET_DATA,
  payload: { tabIndex, dashLetList },
});

export const addDashLetAction = (requestPayload) => async (dispatch) => {
  try {
    let res = await api.post(`/V8/dashlet/add`, JSON.stringify(requestPayload));
    if (res.ok) {
      const responseAddedDashLets = pathOr([], ["data", "data"], res);
      const parseAddedDashLetsPosition = parserDashboardPositionData(
        responseAddedDashLets,
      );
      const tabIndex = pathOr("", ["current_tab"], requestPayload);
      dispatch(addDashLetData(tabIndex, parseAddedDashLetsPosition));
      if (res.data.meta) {
        toast(res.data.meta.message);
      } else if (res.error) {
        toast(res.message);
      } else {
        // setAddedDashlet(res.data);
        toast(LBL_DASHLET_ADD_SUCCESS);
      }
    }
    return res;
  } catch (e) {
    toast(SOMETHING_WENT_WRONG);
  }
};

export const removeDashLetAction = (params) => async (dispatch) => {
  let url = `/V8/dashlet/delete`;
  const res = await api.delete(url, params);
  if (res.ok) {
    dispatch(removeDashLetData(params));
  }
  return res;
};

export const editDashLetAction =
  (payload, dashboardIndex, callback) => async (dispatch) => {
    try {
      const res = await api.post(`/V8/dashlet/configure`, payload);
      if (res.ok) {
        toast(LBL_DASHLET_CONFIGURE_SUCCESS);
      } else {
        toast(SOMETHING_WENT_WRONG);
      }
      callback(res);
    } catch (e) {
      callback(e);
      toast(SOMETHING_WENT_WRONG);
    }
  };

export const getDashLetDataAction = (tab, dashletId, requestPayload = {}) => {
  return api.get(`/V8/dashlet/${tab}/${dashletId}`, requestPayload);
};

export const getDashLetOptionListAction = () => {
  return api.get("/V8/dashlet/dialog");
};

export const getDashLetEditDialogDataAction = (requestPayload) => {
  return api.get("/V8/dashlet/edit", requestPayload);
};
