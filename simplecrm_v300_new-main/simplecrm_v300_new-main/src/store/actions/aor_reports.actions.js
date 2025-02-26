import * as actionTypes from "../actions/actionTypes";
import { api } from "../../common/api-utils";
import { pathOr } from "ramda";

const getDetailViewRequest = () => ({
  type: actionTypes.DETAIL_VIEW_REQUEST,
});

const getDetailViewSuccess = (payload, tab) => ({
  type: actionTypes.DETAIL_VIEW_SUCCESS,
  payload,
  tab,
});
const getDetailViewFailure = (error) => ({
  type: actionTypes.DETAIL_VIEW_FAILURE,
  error,
});
export const getDetailView = (module, id) => async (dispatch) => {
  try {
    dispatch(getDetailViewRequest());
    const res = await api.get(`/V8/layout/DetailView/${module}/${id}`);

    if (res.ok) {
      dispatch(getDetailViewSuccess(res.data, module));
      return;
    }
    dispatch(getDetailViewFailure(res.data.errors.detail));
  } catch (e) {
    dispatch(getDetailViewFailure(e));
  }
};

export const exportReport = (data,exportFileFormat) => async (dispatch, getStore) => {
  try {
    let filterData = pathOr({}, ["detail", "reportFilterData"], getStore());
    if (!!exportFileFormat) {
      if (typeof filterData !== "object") {
        filterData = {};
      }
      filterData["exportFileFormat"] = exportFileFormat;
    }
    return await api.post(
      `/V8/layout/ReportExportView/AOR_Reports/${data.report_id}`,
      filterData,
    );
  } catch (e) {
    return e;
  }
};

export const downloadReportPdf = (data) => async (dispatch, getStore) => {
  try {
    let filterData = pathOr({}, ["detail", "reportFilterData"], getStore());
    if (data?.graphsForPDF) {
      filterData = { ...filterData, graphsForPDF: data?.graphsForPDF };
    }
    return await api.post(
      `/V8/layout/ReportPDFView/AOR_Reports/${data.report_id}`,
      filterData,
    );
  } catch (e) {
    return e;
  }
};
