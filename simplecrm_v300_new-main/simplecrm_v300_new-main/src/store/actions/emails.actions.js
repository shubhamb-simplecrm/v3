import * as actionTypes from "../actions/actionTypes";
import { api } from "../../common/api-utils";



const getEmailCreateViewRequest = () => ({
  type: actionTypes.EMAIL_CREATE_VIEW_REQUEST,
});

const getEmailCreateViewSuccess = (payload, tab) => ({
  type: actionTypes.EMAIL_CREATE_VIEW_SUCCESS,
  payload,
  tab
});
const getEmailCreateViewFailure = (error) => ({
  type: actionTypes.EMAIL_CREATE_VIEW_FAILURE,
  error,
});

export const getEmailCreateView = (payload) => async (dispatch) => {
  try {
    dispatch(getEmailCreateViewRequest());
    const res = await api.get(
      `/V8/layout/ComposeView/Emails/1`,
      payload
    );

    if (res.ok) {
      dispatch(getEmailCreateViewSuccess(res.data, "Emails"));
      return res.data;
    }
    dispatch(getEmailCreateViewFailure(res.data.errors.detail));
  } catch (e) {
    dispatch(getEmailCreateViewFailure(e));
  }
};

export const emailAsPdf = (data) => async (dispatch) => {
  let param = {
    extraTask: data.extraTask,
    templateId: data.templateId
  }

  try {
    dispatch(getEmailCreateViewRequest());
    const res = await api.post(`/V8/layout/QuotesInvoicePDFView/${data.module}/${data.report_id}`, param);

    if (res.ok) {
      dispatch(getEmailCreateViewSuccess(res.data, "Emails"));
      return res.data;
    }
    dispatch(getEmailCreateViewFailure(res.data.errors.detail));
  } catch (e) {
    dispatch(getEmailCreateViewFailure(e));
  }
}


const submitEmailCreateViewRequest = () => ({
  type: actionTypes.SUBMIT_EMAIL_CREATE_VIEW_REQUEST
});

const submitEmailCreateViewSuccess = (payload) => ({
  type: actionTypes.SUBMIT_EMAIL_CREATE_VIEW_SUCCESS,
  payload,
});

const submitEmailCreateViewFailure = (error) => ({
  type: actionTypes.SUBMIT_EMAIL_CREATE_VIEW_FAILURE,
  error
});
export const submitEmailCreateView = (data, id) => async (dispatch) => {
  try {
    dispatch(submitEmailCreateViewRequest());
    let res = {};
    res = await api.post(`V8/actionbutton/SendEmail/Emails/1`, data)
    if (res.ok) {
      dispatch(submitEmailCreateViewSuccess(res));
      return res;
    }
    dispatch(submitEmailCreateViewFailure(res.data.errors ? res.data.errors.detail : null));
  } catch (ex) {
    return ex;
  }
};
export const exportReport = async (data) => {
  try {
    return await api.post(`/V8/layout/ReportExportView/AOR_Reports/${data.report_id}`);
  } catch (e) {
    return e;
  }
}

export const downloadReportPdf = async (data) => {
  try {
    return await api.post(`/V8/layout/ReportPDFView/AOR_Reports/${data.report_id}`);
  } catch (e) {
    return e;
  }
}

const getEmailTestRequest = () => ({
  type: actionTypes.EMAIL_TEST_REQUEST,
});

const getEmailTestSuccess = (payload, tab) => ({
  type: actionTypes.EMAIL_TEST_SUCCESS,
  payload,
  tab
});
const getEmailTestFailure = (error) => ({
  type: actionTypes.EMAIL_TEST_FAILURE,
  error,
});



export const testEmailSettings = (apiType,data) => async (dispatch) => {
  try {
    dispatch(getEmailTestRequest());
    let payload = {
      "data": {
          "type": "InboundEmail",
          "attributes": data
      }
    };
    const res = await api.post(`/V8/emailsetting/${apiType}`,payload);
    if (res.ok) {
      dispatch(getEmailTestSuccess(res.data, "Emails"));
      return res;
    }
    dispatch(getEmailTestFailure(res.data.errors.detail));
  } catch (e) {
    dispatch(getEmailTestFailure(e));
  }
};

export const saveEmailSettings = (data) => async (dispatch) => {
  try {
    dispatch(getEmailTestRequest());
    let payload = {
      "data": {
          "type": "InboundEmail",
          "attributes": data
      }
    };
    const res = await api.post(
      `/V8/emailsetting/saveinboundemail`,payload
    );

    if (res.ok) {
      dispatch(getEmailTestSuccess(res.data, "Emails"));
      return res;
    }
    dispatch(getEmailTestFailure(res.data.errors.detail));
  } catch (e) {
    dispatch(getEmailTestFailure(e));
  }
};

export const getEmailImportView = () => async (dispatch) => {
	try {
		let res = {};
		
		res = await api.get(`/V8/layout/ImportEmailView/Emails/1`);
		if (res.ok) {
			return res.data;
		}
	} catch (e) {
		return e;
	}
};

export const submitImportView = (data) => async (dispatch) => {
  try {
		let res = {};
		data = JSON.stringify(data);
    res = await api.post(`/V8/emailsetting/importemail`, data);
	  if (res.ok) {
			return res.data;
		}
	} catch (e) {
		return e;
	}
};

export const markEmails = async (data) => {
  try {
		let res = {};
		data = JSON.stringify(data);
    return await api.post(`/V8/emailsetting/markemails`, data);
	} catch (e) {
		return e;
	}
};
