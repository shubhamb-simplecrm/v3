import * as actionTypes from "../actions/actionTypes";
import { api, auth } from "../../common/api-utils";
import { dissoc, isEmpty, isNil, pathOr } from "ramda";
import LocalStorageUtils from "../../common/local-storage-utils";

const getListViewOnRequest = () => ({
  type: actionTypes.LIST_VIEW_ON_REQUEST,
});

const getListViewOnSuccess = (payload, tab) => ({
  type: actionTypes.LIST_VIEW_ON_SUCCESS,
  payload,
  tab,
});

const getListViewOnFailure = (error) => ({
  type: actionTypes.LIST_VIEW_ON_FAILURE,
  error,
});

export const getListViewDataAction =
  (
    moduleName,
    pageNo = 1,
    pageSize = 20,
    filterOption = {},
    sortOption = null,
    folderId = null,
  ) =>
  async (dispatch) => {
    try {
      dispatch(getListViewOnRequest());
      let queryParams = {
        page: {
          number: pageNo,
          size: pageSize,
        },
      };
      let offset = "";
      let url = `/V8/layout/ListView/${moduleName}/1`;
      if (moduleName == "Emails") {
        offset = pageNo * 20;
        queryParams["Emails2_EMAIL_offset"] = offset;
        if (!isNil(folderId) && !isEmpty(folderId)) {
          queryParams["folders_id"] = folderId;
        }
      }
      let CTIMobile = LocalStorageUtils.getValueByKey("CTI_mobile");
      if (!isNil(CTIMobile) && !isEmpty(CTIMobile)) {
        queryParams["filter[phone][lke]"] = CTIMobile;
        LocalStorageUtils.clearValueByKey("CTI_mobile");
      }
      if (!isNil(filterOption) && !isEmpty(filterOption)) {
        if (typeof filterOption == "object") {
          queryParams = { ...queryParams, ...filterOption };
        } else {
          const result = {};
          const params = new URLSearchParams(filterOption);
          for (const [key, value] of params) {
            result[key] = value;
          }
          queryParams = { ...queryParams, ...result };
        }
      }

      if (!isNil(sortOption) && !isEmpty(sortOption)) {
        const isSavedSearch = parseInt(
          pathOr(0, ["is_saved_search"], queryParams),
        );
        // condition for when sorting apply from list view that time save filter related params need to remove from payload
        if (isSavedSearch) {
          queryParams = dissoc("filter[reset][eq]", queryParams);
          queryParams = dissoc("filter[save_filter][eq]", queryParams);
          queryParams = dissoc("saved_search_name", queryParams);
        }

        queryParams["sort"] = sort;
        if (sort.startsWith("-")) {
          queryParams["filter[sort_column][eq]"] = sort.substring(1);
          queryParams["filter[sort_order][eq]"] = "desc";
        } else {
          queryParams["filter[sort_column][eq]"] = sort;
          queryParams["filter[sort_order][eq]"] = "asc";
        }
      }
      const res = await api.get(url, queryParams);
      if (res.ok) {
        let sortOrder = "";
        let sortField = sort
          ? sort
          : pathOr(
              "",
              ["UserPreference", "sortOrder"],
              res.data.data.templateMeta,
            );
        if (sortField && sortField.startsWith("-")) {
          sortOrder = "desc";
          sortField = sortField.slice(1);
        } else {
          sortOrder = "asc";
        }
        res.data.data.templateMeta.where = filterOption;
        res.data.data.templateMeta.sort = sortField;
        res.data.data.templateMeta.sortOrder = sortOrder;
        res.data.data.templateMeta.page = pageNo;
        res.data.data.templateMeta.pageSize = pageSize;
        res.data.data.templateMeta.offset = offset;
        dispatch(getListViewOnSuccess(res.data, moduleName));
        if (folderId) {
          return res;
        }
        return res.data;
      }
      dispatch(getListViewOnFailure(""));
      //   return dispatch(getListViewOnFailure(getError(res)));
    } catch (e) {
      dispatch(getListViewOnFailure(e));
    }
  };

export const getMassUpdateForm = (module, payload = {}) => {
  return api.get(`/V8/layout/MassUpdate/${module}/1`, payload);
};

export const massUpdateActionRecords = async (payload) => {
  return await api.patch(`/V8/bulkActions/massUpdate`, payload);
};
export const massDeleteActionRecords = async (payload) => {
  return await api.delete(`/V8/bulkActions/massDelete`, payload);
};
export const massExportActionRecords = (payload) => {
  return api.post(`/V8/bulkActions/massExport`, payload);
};
export const massAddToTargetListActionRecords = async (payload) => {
  return await api.post(`/V8/bulkActions/massAddToTargetList`, payload);
};

export const getFilterFormData = async (module) => {
  return await api.get(`/V8/layout/Search/${module}/1`);
};

export const getColumnChooserFieldsData = async (module) => {
  return await api.get(`/V8/layout/ColumnChooser/${module}/1`);
};

export const updateChooserColumnsData = async (payload) => {
  return await api.patch("/V8/layout/updateColumnChooser", {
    action: "updateColumnChooser",
    data: payload,
  });
};

export const deleteRecordFromModule = async (module, id) => {
  return await api.delete(`/V8/module/${module}/${id}`);
};

export const setFilterOpenState = async (tab, flag) => {
  let url = `/V8/layout/ListView/${tab}/1`;
  let queryParams = {
    isListViewFilterOpen: flag ? 1 : 0,
    "page[number]": 1,
    "page[size]": 1,
  };
  return await api.get(url, queryParams);
};

export const getExportLayout = async (module) => {
  let url = `/V8/moreActions`;
  let queryParams = {
    action: "export",
    actionModuleType: module,
  };
  return await api.get(url, queryParams);
};
