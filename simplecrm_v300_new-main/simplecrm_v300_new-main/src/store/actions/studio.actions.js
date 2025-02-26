import * as actionTypes from "../actions/actionTypes";
import { api } from "../../common/api-utils";
import { isEmpty, pathOr } from "ramda";
import { toast } from "react-toastify";
import { SOMETHING_WENT_WRONG } from "../../constant";

const getError = (res) =>
  pathOr(SOMETHING_WENT_WRONG, ["data", "errors", "detail"], res);

// Studio Actions
export const setSelectedParameter = (param) => ({
  type: actionTypes.SELECTED_PARAMETER,
  payload: param,
});
export const resetParameters = () => ({
  type: actionTypes.RESET_DATA,
});
const getModuleListRequest = () => ({
  type: actionTypes.GET_MODULE_LIST_REQUEST,
});

const getModuleListSuccess = (payload) => ({
  type: actionTypes.GET_MODULE_LIST_SUCCESS,
  payload,
});

const getModuleListFailure = (error) => ({
  type: actionTypes.GET_MODULE_LIST_FAILURE,
  error,
});

export const resetTabViewData = () => ({
  type: actionTypes.RESET_TAB_VIEW_DATA,
});

export const getModuleList = () => async (dispatch) => {
  try {
    dispatch(getModuleListRequest());

    let url = `/V8/studio/getModuleList`;
    let res = await api.get(url);
    if (res.ok) {
      dispatch(getModuleListSuccess(res.data.data));
      // return res.data;
    }
    return dispatch(getModuleListFailure(getError(res)));
  } catch (e) {
    dispatch(getModuleListFailure(e));
    toast(SOMETHING_WENT_WRONG);
  }
};
const getTabViewRequest = () => ({
  type: actionTypes.GET_TAB_VIEW_REQUEST,
});

const getTabViewSuccess = (payload) => ({
  type: actionTypes.GET_TAB_VIEW_SUCCESS,
  payload,
});

const getSubpanelViewSuccess = (payload) => ({
  type: actionTypes.GET_SUBPANEL_VIEW_SUCCESS,
  payload,
});

const getRelViewSuccess = (payload) => ({
  type: actionTypes.GET_REL_VIEW_SUCCESS,
  payload,
});

const getTabViewFailure = (error) => ({
  type: actionTypes.GET_TAB_VIEW_FAILURE,
  error,
});

export const getTabView = (module, manager) => async (dispatch) => {
  try {
    dispatch(getTabViewRequest());
    let url = "";
    let params = {};
    if (manager === "fieldManager") {
      url = `/V8/studio/getModuleFields?module=${module}`;
    } else if (manager === "relationshipManager") {
      url = `/V8/studio/getRelationships?module=${module}`;
    } else if (manager === "layoutManager") {
      dispatch(getTabViewSuccess());
      return;
    } else if (manager === "subpanelManager") {
      url = `/V8/studio/getSubpanels?module=${module}`;
      params = { view: "subpanels" };
    } else {
      return;
    }
    let res = await api.get(url, params);
    if (res.ok) {
      if (manager === "subpanelManager") {
        dispatch(getSubpanelViewSuccess(res.data.data));
      } else if (manager === "relationshipManager") {
        dispatch(getRelViewSuccess(res.data.data));
      } else {
        dispatch(getTabViewSuccess(res.data.data));
      }
    }
    return dispatch(getModuleListFailure(getError(res)));
  } catch (e) {
    dispatch(getTabViewFailure(e));
    toast(SOMETHING_WENT_WRONG);
  }
};

export const getFieldData = (params) => async () => {
  try {
    let url = `/V8/studio/getModuleField`;
    let res = await api.get(url, params);
    if (res.ok) {
      return res;
    }
  } catch (e) {
    toast(SOMETHING_WENT_WRONG);
  }
};

export const getRelationshipData = (params) => async () => {
  try {
    let url = `/V8/studio/getRelationship`;
    let res = await api.get(url, params);
    if (res.ok) {
      return res;
    }
  } catch (e) {
    toast(SOMETHING_WENT_WRONG);
  }
};

export const getLayoutData = (params) => async () => {
  try {
    let url = `/V8/studio/getLayout`;
    let res = await api.get(url, params);
    if (res.ok) {
      let customResponse = [];
      const createResponse = (data) => {
        let customResponse = {
          columnData: {},
          columnLabel: {},
        };

        Object.entries(data).map(([key, value]) => {
          customResponse["columnData"][`${key}Columns`] = {};
          customResponse["columnLabel"][`${key}Columns`] = data[key]["label"];
          let columnFields = pathOr([], ["fields"], value);
          if (!isEmpty(columnFields)) {
            value.fields.map((field) => {
              customResponse["columnData"][`${key}Columns`][field.name] =
                field.label;
            });
          }
        });
        return customResponse;
      };
      if (params.view === "popupView" || params.view === "dashletView") {
        const listLayout = createResponse(res.data.data.listLayout);
        const searchLayout = createResponse(res.data.data.searchLayout);
        res["data"]["data"] = {
          listLayout: listLayout,
          searchLayout: searchLayout,
        };
      } else if (params.view == "editView" || params.view == "detailView") {
        // res["data"]["data"] = res;
      } else if (params.view != "editView" || params.view != "detailView") {
        customResponse = createResponse(res.data.data);
        res["data"]["data"] = customResponse;
      }
      return res;
    }
  } catch (e) {
    toast(SOMETHING_WENT_WRONG);
  }
};
