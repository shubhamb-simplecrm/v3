import * as actionTypes from "../actions/actionTypes";
import { api } from "../../common/api-utils";
import { pathOr, clone } from "ramda";
import { toast } from "react-toastify";
import { SOMETHING_WENT_WRONG } from "../../constant";
import { manegeSidebarRecentMenu } from "./layout.actions";

const getError = (res) =>
  pathOr(SOMETHING_WENT_WRONG, ["data", "errors", "detail"], res);

// List View actions

const getConditionOpertorViewRequest = () => ({
  type: actionTypes.DETAIL_VIEW_FILTER_REQUEST,
});

const getDetailViewRequest = () => ({
  type: actionTypes.DETAIL_VIEW_REQUEST,
});
const setReportFilterData = (payload) => ({
  type: actionTypes.SET_REPORT_FILTER_DATA,
  payload,
});

const getDetailGroupViewRequest = (cnt) => ({
  type: actionTypes.DETAIL_GROUP_VIEW_REQUEST,
  cnt,
});

const getConditionOpertorViewSuccess = (payload, tab) => ({
  type: actionTypes.DETAIL_VIEW_FILTER_SUCCESS,
  payload,
  tab,
});

const getReportDetailViewRequest = () => ({
  type: actionTypes.REPORT_DETAIL_VIEW_REQUEST,
});

const getReportDetailViewFilterRequest = () => ({
  type: actionTypes.REPORT_DETAIL_VIEW_FILTER_REQUEST,
});

const getReportsDetailViewFilterSuccess = (payload, tab, cnt) => ({
  type: actionTypes.REPORT_DETAIL_VIEW_FILTER_SUCCESS,
  payload,
  tab,
  cnt,
});
const getReportDetailViewSuccess = (payload, tab) => ({
  type: actionTypes.REPORT_DETAIL_VIEW_SUCCESS,
  payload,
  tab,
});

const getReportDetailViewFailure = (error) => ({
  type: actionTypes.REPORT_DETAIL_VIEW_FAILURE,
  error,
});

const getDetailViewSuccess = (payload, tab) => ({
  type: actionTypes.DETAIL_VIEW_SUCCESS,
  payload,
  tab,
});

const getGroupPagDetailViewSuccess = (payload, tab, cnt) => ({
  type: actionTypes.DETAIL_GROUP_VIEW_SUCCESS,
  payload,
  tab,
  cnt,
});

const getDetailViewFailure = (error) => ({
  type: actionTypes.DETAIL_VIEW_FAILURE,
  error,
});

const getUpdateBPMRequest = () => ({
  type: actionTypes.BPM_UPDATE_REQUEST,
});

const getUpdateBPMSuccess = (payload, tab) => ({
  type: actionTypes.BPM_UPDATE_SUCCESS,
});
const getUpdateBPMFailure = (error) => ({
  type: actionTypes.BPM_UPDATE_FAILURE,
  error,
});

// to get module field type - Ritesh
const getModuleFieldTypeRequest = () => ({
  type: actionTypes.MODULE_FIELD_TYPE_REQUEST,
});
const getModuleFieldTypeSuccess = (payload) => ({
  type: actionTypes.MODULE_FIELD_TYPE_SUCCESS,
  payload,
});
const getModuleFieldTypeFailure = (error) => ({
  type: actionTypes.MODULE_FIELD_TYPE_FAILURE,
  error,
});
// to get module field type - Ritesh

export const getDetailView =
  (module, id, uid = null) =>
  async (dispatch) => {
    try {
      dispatch(getDetailViewRequest());
      const res = await api.get(`/V8/layout/DetailView/${module}/${id}`);
      if (res.ok) {
        dispatch(getDetailViewSuccess(res.data, module));
        const recordName = pathOr(
          "",
          ["data", "data", "templateMeta", "recordInfo", "record_name"],
          res,
        );
        dispatch(manegeSidebarRecentMenu(id, recordName, module));
        return res.data;
      }
      let error = pathOr("", ["data", "errors", "detail"], res);
      console.error(pathOr(res, ["originalError", "message"], res));
      dispatch(getDetailViewFailure(error));
    } catch (e) {
      console.error(e);
      dispatch(getDetailViewFailure(e));
    }
  };

// to get email module detailview - Roshan

export const getEmailsDetailView =
  (
    module,
    id,
    msgno,
    uid,
    crmEmailId = "",
    folder = "INBOX",
    folderFlag = "no",
  ) =>
  async (dispatch) => {
    try {
      dispatch(getDetailViewRequest());
      let crmEmailIdParam = crmEmailId ? `&emailCRMId=${crmEmailId}` : "";
      if (folderFlag == "yes") {
        crmEmailIdParam += `&fetchFolders=yes`;
      }
      const res = await api.get(
        `/V8/emailsetting/emaildetailview?folder_name=${folder}&folder=inbound&inbound_email_record=${id}&uid=${uid}&msgno=${msgno}&data[attributes][]=1&data[type]=InboundEmail${crmEmailIdParam}`,
      );
      if (res.ok) {
        dispatch(getDetailViewSuccess(res.data, module));
        const recordName = pathOr(
          "",
          ["data", "data", "templateMeta", "recordInfo", "record_name"],
          res,
        );
        dispatch(manegeSidebarRecentMenu(id, recordName, module));
        return res;
      }
      dispatch(getDetailViewFailure(res.data.errors.detail));
    } catch (e) {
      dispatch(getDetailViewFailure(e));
    }
  };
export const getReportsDetailView =
  (
    module,
    id,
    pageNo = 1,
    group_val = "",
    pageSize = 20,
    sort = "",
    filter = "",
    cnt = 1,
    isFilter,
  ) =>
  async (dispatch) => {
    try {
      if (group_val.length > 0) {
        dispatch(getDetailGroupViewRequest(cnt));
      } else if (isFilter) {
        dispatch(getReportDetailViewFilterRequest());
      } else {
        dispatch(getDetailViewRequest());
      }

      let url = `/V8/layout/ReportDetailView/${module}/${id}`;

      let offset = pageNo > 0 ? (pageNo - 1) * pageSize : 0;

      let para_data = { offset: "" + offset, group_value: group_val };
      if (filter) {
        para_data.parameter_id = filter.parameter_id;
        para_data.parameter_operator = filter.parameter_operator;
        para_data.parameter_type = filter.parameter_type;
        para_data.parameter_value = filter.parameter_value;
        dispatch(setReportFilterData(para_data));
      }
      para_data = JSON.stringify(para_data);
      const res = await api.post(url, para_data);
      if (res.ok) {
        if (group_val.length > 0) {
          dispatch(getGroupPagDetailViewSuccess(res.data, module, cnt));
        } else {
          if (isFilter) {
            dispatch(getReportsDetailViewFilterSuccess(res.data, module));
          } else {
            dispatch(getDetailViewSuccess(res.data, module));
          }
        }
        const recordName = pathOr(
          "",
          ["data", "data", "templateMeta", "recordInfo", "record_name"],
          res,
        );
        dispatch(manegeSidebarRecentMenu(id, recordName, module));
        return;
      }
      dispatch(getDetailViewFailure(res.data.errors.detail));
    } catch (e) {
      dispatch(getDetailViewFailure(e));
    }
  };

export const getListViewReportData =
  (tab, id, pageNo = 1, pageSize = 20, sort, filterQuery) =>
  async (dispatch) => {
    try {
      let url = `/V8/layout/ReportDetailView/${tab}/${id}`;
      let offset = (pageNo - 1) * pageSize;
      let para_data = `{"offset":"${offset}"}`;

      /*const res = await api.post(
      `/V8/layout/ReportDetailView/${module}/${id}`,
    );*/

      const res = await api.post(url, para_data);

      if (res.ok) {
        dispatch(getDetailViewSuccess(res.data, tab));
        return;
      }
      return dispatch(getDetailViewFailure(getError(res)));
    } catch (e) {
      dispatch(getDetailViewFailure(e));
    }
  };

export const getConditionOpertorView = () => async (dispatch) => {
  try {
    dispatch(getConditionOpertorViewRequest());
    let url1 = `/V8/reportapi/getModuleOperatorField`;
    let url2 = `/V8/reportapi/getFieldTypeOptions`;
    let url3 = `/V8/reportapi/getModuleFieldType`;

    let para_data = `[{
      "aor_module": "Leads",
      "aor_fieldname": "status",
      "aor_value": "Equal_To",
      "rel_field":"",
      "aor_type":"Multi"
    },{
      "aor_module": "Leads",
      "aor_fieldname": "date_entered",
      "aor_value": "Equal_To",
      "rel_field":"",
      "aor_type":"Multi"
    }]`;
    const res = await api.post(url1, para_data);
    if (res.ok) {
      dispatch(getConditionOpertorViewSuccess(res.data, "fields"));
      return;
    }
  } catch (e) {}
};

export const getModuleFieldType =
  (
    rowNum,
    aor_module,
    aor_fieldname,
    aor_newfieldname,
    aor_value,
    aor_type,
    rel_field,
  ) =>
  async (dispatch) => {
    try {
      const postData = {
        aor_module: aor_module,
        aor_fieldname: aor_fieldname,
        aor_newfieldname: aor_newfieldname,
        aor_value: aor_value,
        aor_type: aor_type,
        rel_field: rel_field,
        condition: rowNum,
      };
      const res = await api.post(`/V8/reportapi/getModuleFieldType`, postData);

      if (res.ok) {
        return res;
      }
    } catch (e) {}
  };

export const printAsPdf = (data) => async (dispatch) => {
  let param = {
    extraTask: data.extraTask,
    templateId: data.templateId,
  };

  try {
    return await api.post(
      `/V8/layout/QuotesInvoicePDFView/${data.module}/${data.report_id}`,
      param,
    );
  } catch (e) {
    return e;
  }
};
export const emailCustomerReview = (module, id) => async (dispatch) => {
  let payload = {
    data: {
      type: module,
      id: id,
      attributes: {
        stage: "Delivered",
        approval_status: "Pending_Approval",
      },
    },
  };
  payload = JSON.stringify(payload);
  try {
    let res = await api.patch(`/V8/module`, payload);
    if (res.ok) {
      try {
        dispatch(getDetailViewRequest());
        const res = await api.get(`/V8/layout/DetailView/${module}/${id}`);
        if (res.ok) {
          dispatch(getDetailViewSuccess(res.data, module));
          return res.data;
        }
        dispatch(getDetailViewFailure(res.data.errors.detail));
      } catch (e) {
        dispatch(getDetailViewFailure(e));
      }
    }
  } catch (e) {
    return e;
  }
};

export const updateBpmStep =
  (
    stepid,
    condition_task_id,
    sla_m_d_id,
    sla_m_d_task_con_id,
    moduleName,
    moduleId,
    sla_wf_id,
    module,
    oldData,
  ) =>
  async (dispatch) => {
    try {
      dispatch(getUpdateBPMRequest());

      let url = `/V8/bpm/updatestep`;
      let para_data = `{"stepid":"${stepid}","condition_task_id":"${condition_task_id}","sla_m_d_id":"${sla_m_d_id}","sla_m_d_task_con_id":"${sla_m_d_task_con_id}","module_name":"${moduleName}","module_id":"${moduleId}","sla_wf_id":"${sla_wf_id}"}`;

      const res = await api.post(url, para_data);

      if (res.ok) {
        oldData[module].data.templateMeta.bpm = clone(
          res.data && res.data.data ? res.data.data : [],
        );
        dispatch(getUpdateBPMSuccess(oldData[module], module));
        dispatch(getDetailView(moduleName, moduleId));
        toast(pathOr(SOMETHING_WENT_WRONG, ["data", "data", "message"], res));
      } else {
        dispatch(getUpdateBPMFailure(SOMETHING_WENT_WRONG));
        toast(SOMETHING_WENT_WRONG);
      }
    } catch (e) {
      dispatch(getUpdateBPMFailure(e));
    }
  };

export const getHirePurchaseDetailView = (data) => async (dispatch) => {
  let companyName = data?.company_c;
  let companyName1 = companyName.substr(0, 3);
  function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return "" + y + "/" + (m <= 9 ? "0" + m : m) + "/" + (d <= 9 ? "0" + d : d);
  }
  let date1 = dateToYMD(new Date(2017, 10, 5));
  let query = `company=${companyName1}&account_no=${data?.hire_sale_account_number_c}&date=${date1}`;
  try {
    dispatch(getDetailViewRequest());
    const res = await api.get(`/V8/HPAccountDetails?${query}`);
    if (res.ok) {
      dispatch(getDetailViewSuccess(res.data, module));
      return res.data;
    }
    dispatch(getDetailViewFailure(res.data.errors.detail));
  } catch (e) {
    dispatch(getDetailViewFailure(e));
  }
};

export const getC360ProfileDetailView = async (module, id) => {
  let data = [];
  try {
    const res = await api.get(`/V8/layout/DetailView/${module}/${id}`);
    if (res.ok) {
      data = res.data;
    }
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const getOpportunitySummaryData = async (module, id) => {
  let data = null;
  try {
    const res = await api.get(`/V8/layout/chatgpt/${module}/${id}`);
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const addToFavouriteRecord = async (recordId, module, is_favs) => {
  try {
    if (is_favs) {
      return await api.post(`/V8/addToFavorites/${module}/${recordId}`, {
        action: "remove",
      });
    } else {
      return await api.post(`/V8/addToFavorites/${module}/${recordId}`, {
        action: "add",
      });
    }
  } catch (e) {
    toast(SOMETHING_WENT_WRONG);
  }
};

export const getDetailViewData = (module, id) => {
  return api.get(`/V8/layout/DetailView/${module}/${id}`);
};
