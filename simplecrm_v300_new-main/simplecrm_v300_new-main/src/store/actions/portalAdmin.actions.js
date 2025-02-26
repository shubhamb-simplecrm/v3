import * as actionTypes from "../actions/actionTypes";
import { api } from "../../common/api-utils";
import { isNil, pathOr } from "ramda";
import { toast } from "react-toastify";
import { SOMETHING_WENT_WRONG } from "../../constant";

const getError = (res) =>
  pathOr(SOMETHING_WENT_WRONG, ["data", "errors", "detail"], res);

//save configuration data
const configureDataRequest = () => ({
  type: actionTypes.SAVE_CONFIG_REQUEST,
});

const configureDataSuccess = (payload) => ({
  type: actionTypes.SAVE_CONFIG_SUCCESS,
  payload,
});

const configureDataFailure = (error) => ({
  type: actionTypes.SAVE_CONFIG_FAILURE,
  error,
});

export const saveConfigureData = (params) => async (dispatch) => {
  try {
    dispatch(configureDataRequest());
    let url = `/V8/portalAdmin/fieldConfigurator`;
    let res = await api.post(url, params);
    if (res.ok) {
      dispatch(configureDataSuccess(res.data));
      return res.data;
    }
    return dispatch(configureDataFailure(getError(res)));
  } catch (e) {
    dispatch(configureDataFailure(e));
    toast(SOMETHING_WENT_WRONG);
  }
};

export const setPortalAdminPreferenceData = (params) => async (dispatch) => {
  try {
    let url = `/V8/portalAdmin/setPortalAdminPreference`;
    let res = await api.post(url, params);
    if (res.ok) {
      return res.data;
    }
  } catch (e) {
    toast(SOMETHING_WENT_WRONG);
  }
};
export const getCategoryContents = (category) => async (dispatch) => {
  try {
    let url = `/V8/portalAdmin/getCategoryContents?category=` + category;
    let res = await api.get(url);
    if (res.ok) {
      return res.data;
    }
  } catch (e) {
    toast(SOMETHING_WENT_WRONG);
  }
};

const portalAdminLinksRequest = () => ({
  type: actionTypes.PORTAL_ADMIN_LINKS_REQUEST,
});

const portalAdminLinksSuccess = (payload) => ({
  type: actionTypes.PORTAL_ADMIN_LINKS_SUCCESS,
  payload,
});

const portalAdminLinksFailure = (error) => ({
  type: actionTypes.PORTAL_ADMIN_LINKS_FAILURE,
  error,
});

export const portalAdminLinks = () => async (dispatch) => {
  try {
    dispatch(portalAdminLinksRequest());
    let url = `/V8/portalAdmin/getPortalAdminLinks`;
    let res = await api.post(url);
    if (res.ok) {
      dispatch(portalAdminLinksSuccess(res.data));
      return res.data;
    }
    return dispatch(portalAdminLinksFailure(getError(res)));
  } catch (e) {
    dispatch(portalAdminLinksFailure(e));
    toast(SOMETHING_WENT_WRONG);
  }
};

const getEditLayoutRequest = () => ({
  type: actionTypes.PORTAL_ADMIN_GET_EDIT_LAYOUT_REQUEST,
});

const getEditLayoutSuccess = (payload) => ({
  type: actionTypes.PORTAL_ADMIN_GET_EDIT_LAYOUT_SUCCESS,
  payload,
});

const getEditLayoutFailure = (error) => ({
  type: actionTypes.PORTAL_ADMIN_GET_EDIT_LAYOUT_FAILURE,
  error,
});

export const getEditLayout = (params) => async (dispatch) => {
  try {
    dispatch(getEditLayoutRequest());

    let url = `/V8/portalAdmin/getEditLayout`;
    let res = await api.post(url, JSON.stringify(params));
    if (res.ok) {
      dispatch(getEditLayoutSuccess(res.data));
      return res.data;
    }
    return dispatch(getEditLayoutFailure(getError(res)));
  } catch (e) {
    dispatch(getEditLayoutFailure(e));
    toast(SOMETHING_WENT_WRONG);
  }
};

const portalAdminModuleListRequest = () => ({
  type: actionTypes.PORTAL_ADMIN_MODULE_LIST_REQUEST,
});

const portalAdminModuleListSuccess = (payload) => ({
  type: actionTypes.PORTAL_ADMIN_MODULE_LIST_SUCCESS,
  payload,
});

const portalAdminModuleListFailure = (error) => ({
  type: actionTypes.PORTAL_ADMIN_MODULE_LIST_FAILURE,
  error,
});

export const getPortalAdminModuleList =
  (section, module) => async (dispatch) => {
    const params = {
      data: {
        category: section,
        module,
      },
    };
    try {
      dispatch(portalAdminModuleListRequest());
      let url = `/V8/portalAdmin/ListView`;
      let res = await api.post(url, params);
      if (res.ok) {
        dispatch(portalAdminModuleListSuccess(res.data));
        return res.data;
      }
      return dispatch(portalAdminModuleListFailure(getError(res)));
    } catch (e) {
      dispatch(portalAdminModuleListFailure(e));
      toast(SOMETHING_WENT_WRONG);
    }
  };

const portalAdminFieldListRequest = () => ({
  type: actionTypes.PORTAL_ADMIN_FIELD_LIST_REQUEST,
});

const portalAdminFieldListSuccess = (payload) => ({
  type: actionTypes.PORTAL_ADMIN_FIELD_LIST_SUCCESS,
  payload,
});

const portalAdminFieldListFailure = (error) => ({
  type: actionTypes.PORTAL_ADMIN_FIELD_LIST_FAILURE,
  error,
});

export const getPortalAdminFieldList =
  (module, view = "FieldConfigurator") =>
  async (dispatch) => {
    const params = {
      data: {
        category: {
          view: view,
          module: module,
        },
      },
    };
    if (!isNil(module)) params["data"]["category"]["module"] = module;
    try {
      dispatch(portalAdminFieldListRequest());

      let url = `/V8/portalAdmin/ListView`;
      let res = await api.post(url, params);
      if (res.ok) {
        dispatch(portalAdminFieldListSuccess(res.data));
        return res.data;
      }
      return dispatch(portalAdminFieldListFailure(getError(res)));
    } catch (e) {
      dispatch(portalAdminFieldListFailure(e));
      toast(SOMETHING_WENT_WRONG);
    }
  };
