import * as actionTypes from "../actions/actionTypes";
import { api } from "../../common/api-utils";
import { isEmpty, isNil, pathOr } from "ramda";
import { LAYOUT_VIEW_TYPE } from "../../common/layout-constants";

// Edit View actions
const submitInOutboundEmailRequest = () => ({
  type: actionTypes.EDIT_INOUTBOUNDEMAIL_REQUEST,
});

const submitInOutboundEmailSuccess = (payload, tab) => ({
  type: actionTypes.EDIT_INOUTBOUNDEMAIL_SUCCESS,
  payload,
  tab,
});

const submitInOutboundEmailFailure = (error) => ({
  type: actionTypes.EDIT_INOUTBOUNDEMAIL_FAILURE,
  error,
});

export const deleteEventRecurrences = (id, modulename) => async () => {
  try {
    let res = await api.post(`/V8/deleterecurences/${modulename}/${id}`);
    if (res.ok) {
      return res.data;
    }
  } catch (e) {
    return e;
  }
};

export const submitInOutboundEmail = (data, type) => async (dispatch) => {
  try {
    dispatch(submitInOutboundEmailRequest());
    let res = {};
    data = JSON.stringify(data);
    if (type === "inbound") {
      res = await api.post(`/V8/emailsetting/saveinboundemail`, data);
    } else if (type === "signature") {
      res = await api.post(`/V8/emailsetting/savedefaultsignature`, data);
    } else {
      res = await api.post(`/V8/emailsetting/saveoutboundemailaccount`, data);
    }
    if (res.ok) {
      dispatch(submitInOutboundEmailSuccess(res.data));
      return res.data;
    }
    dispatch(
      submitInOutboundEmailFailure(
        res.data.errors ? res.data.errors.detail : null,
      ),
    );
  } catch (e) {
    dispatch(submitInOutboundEmailFailure(e));
  }
};

export const getEditViewFormDataAction = (
  moduleName,
  viewName,
  recordId = null,
  customArgs = {
    calendarSelectedDate: null,
    calendarViewType: null,
    parentModuleName: null,
    parentReturnId: null,
  },
) => {
  const { requestUrl, requestPayload } = getLayoutRequestURLAndPayloadFormate(
    moduleName,
    viewName,
    recordId,
    customArgs,
  );
  return api.get(requestUrl, requestPayload);
};

const getLayoutRequestURLAndPayloadFormate = (
  moduleName,
  viewName,
  recordID = null,
  customArgs = {
    calendarSelectedDate: null,
    calendarViewType: null,
    parentModuleName: null,
  },
) => {
  let requestPayload = {};
  let requestUrl = "";
  if (!isEmpty(customArgs)) {
    if (customArgs?.calendarSelectedDate)
      requestPayload["selected_calendar_date"] =
        customArgs?.calendarSelectedDate;
    if (customArgs?.calendarViewType)
      requestPayload["calendar_view"] = customArgs?.calendarViewType;
  }
  if (viewName === LAYOUT_VIEW_TYPE.quickCreateView) {
    requestPayload["view"] = "quickCreateView";
  }

  if (viewName === LAYOUT_VIEW_TYPE.convertLeadView) {
    requestUrl = `/V8/layout/ConvertLead/Leads/${recordID}`;
  } else if (viewName === LAYOUT_VIEW_TYPE.createRelateView) {
    if (customArgs?.parentModuleName) {
      requestUrl = `/V8/createlayout/CreateRelateView/${customArgs?.parentModuleName}/${customArgs?.parentReturnId}/${moduleName}`;
    }
  } else if (LAYOUT_VIEW_TYPE.quickCreateView === viewName) {
    requestUrl = `/V8/layout/QuickCreate//${moduleName}/1`;
  } else {
    requestUrl = `/V8/layout/CreateView/${moduleName}/1`;
    if (!isEmpty(recordID) && !isNil(recordID)) {
      if (LAYOUT_VIEW_TYPE.duplicateView === viewName) {
        requestUrl = `/V8/layout/DuplicateView/${moduleName}/${recordID}`;
        // requestUrl = `/V8/layout/EditView/${moduleName}/${recordID}`;
      } else {
        requestUrl = `/V8/layout/EditView/${moduleName}/${recordID}`;
      }
    }
  }
  return { requestUrl, requestPayload };
};

export const createOrEditRecordAction = async (
  payload,
  viewName = "",
  recordId = null,
) => {
  try {
    if (LAYOUT_VIEW_TYPE.duplicateView == viewName) {
      const recordId = pathOr(null, ["data", "id"], payload);
      if (!isNil(recordId)) {
        delete payload.data.id;
      }
    }
    const requestPayload = JSON.stringify(payload);
    let responseObj = {};
    switch (viewName) {
      case LAYOUT_VIEW_TYPE.editView:
        responseObj = await api.patch(`/V8/module`, requestPayload);
        break;
      case LAYOUT_VIEW_TYPE.convertLeadView:
        responseObj = await api.post(
          `/V8/layout/setConvertLead/Leads/${recordId}`,
          requestPayload,
        );
        break;
      case LAYOUT_VIEW_TYPE.createRelateView:
      case LAYOUT_VIEW_TYPE.quickCreateView:
      case LAYOUT_VIEW_TYPE.createView:
      case LAYOUT_VIEW_TYPE.duplicateView:
        responseObj = await api.post(`/V8/module`, requestPayload);
        break;
      default:
        responseObj = {};
        break;
    }
    return responseObj;
  } catch (e) {
    return e;
  }
};

export const getAllOpenAIFieldList =
  (viewName, moduleName, fieldName) => (dispatch) => {
    api.get(`/V8/openAILayout/${viewName}/${moduleName}/1`).then((res) => {
      dispatch({
        type: actionTypes.STORE_ENUM_FIELD_OPTION,
        payload: { [fieldName]: res?.data ? res?.data : [] },
      });
    });
  };
