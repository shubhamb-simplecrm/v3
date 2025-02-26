import * as actionTypes from "../actions/actionTypes";
import { api, auth } from "../../common/api-utils";
import { dissoc, isEmpty, isNil, pathOr } from "ramda";
import { toast } from "react-toastify";
import { LBL_COLUMNS_UPDATED, SOMETHING_WENT_WRONG } from "../../constant";
import LocalStorageUtils from "../../common/local-storage-utils";

const getError = (res) =>
  pathOr(SOMETHING_WENT_WRONG, ["data", "errors", "detail"], res);

// List View actions
const getListViewRequest = () => ({
  type: actionTypes.LIST_VIEW_REQUEST,
});

const getGlobalSearchRequest = () => ({
  type: actionTypes.LIST_GLOBAL_SEARCH_REQUEST,
});

export const getGlobalSearchSuccess = (payload) => ({
  type: actionTypes.LIST_GLOBAL_SEARCH_SUCCESS,
  payload,
});

const getListViewSuccess = (payload, tab) => ({
  type: actionTypes.LIST_VIEW_SUCCESS,
  payload,
  tab,
});

const getListViewFailure = (error) => ({
  type: actionTypes.LIST_VIEW_FAILURE,
  error,
});

const getSuggestionRequest = () => ({
  type: actionTypes.SUGGESTION_REQUEST,
});

export const getSugesstionSuccess = (payload) => ({
  type: actionTypes.SUGGESTION_SUCCESS,
  payload,
});

const getSugesstionError = (error) => ({
  type: actionTypes.SUGGESTION_FAILURE,
  error,
});

export const getListView =
  (
    tab,
    pageNo = 1,
    pageSize = 20,
    sort = "",
    filterQuery = {},
    folder_id = "",
  ) =>
  async (dispatch) => {
    try {
      dispatch(getListViewRequest());
      pageNo = pageNo + 1;
      let offset = "";
      let url = `/V8/layout/ListView/${tab}/1`;
      let queryParams = {
        "page[number]": pageNo,
        "page[size]": pageSize,
      };
      if (tab === "Emails") {
        offset = (pageNo - 1) * 20;
        queryParams["Emails2_EMAIL_offset"] = offset;
      }

      let CTI_mobile = LocalStorageUtils.getValueByKey("CTI_mobile");
      if (CTI_mobile) {
        queryParams["filter[phone][lke]"] = CTI_mobile;
        LocalStorageUtils.clearValueByKey("CTI_mobile");
      }
      if (folder_id && tab === "Emails") {
        queryParams["folders_id"] = folder_id;
      }
      if (!isEmpty(filterQuery)) {
        if (typeof filterQuery == "object") {
          queryParams = { ...queryParams, ...filterQuery };
        } else {
          const result = {};
          const params = new URLSearchParams(filterQuery);
          for (const [key, value] of params) {
            result[key] = value;
          }
          queryParams = { ...queryParams, ...result };
        }
      }
      if (sort) {
        const is_saved_search = parseInt(
          pathOr(0, ["is_saved_search"], queryParams),
        );
        // condition for when sorting apply from list view that time save filter related params need to remove from payload
        if (is_saved_search) {
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
        res.data.data.templateMeta.where = filterQuery;
        res.data.data.templateMeta.sort = sortField;
        res.data.data.templateMeta.sortOrder = sortOrder;
        res.data.data.templateMeta.page = pageNo;
        res.data.data.templateMeta.pageSize = pageSize;
        res.data.data.templateMeta.offset = offset;
        dispatch(getListViewSuccess(res.data, tab));
        if (folder_id) {
          return res;
        }
        return res.data;
      }
      return dispatch(getListViewFailure(getError(res)));
    } catch (e) {
      dispatch(getListViewFailure(e));
    }
  };

export const getGlobalSearch =
  (
    query_string,
    offset = "0",
    module_offset = "",
    config = {
      unified_search_modules_display: {},
    },
  ) =>
  async (dispatch) => {
    try {
      if (!query_string) return;
      let search_modules = Object.keys(
        config?.unified_search_modules_display,
      ).filter(
        (item, index) =>
          config?.unified_search_modules_display[item].visible === true,
      );
      let params = {};
      dispatch(getGlobalSearchRequest());
      if (config?.defaultSearchEngine === "ElasticSearchEngine") {
        params = {
          "search-query-string": query_string.toString(),
          "search-query-size": "50",
          "search-query-from": offset.toString(),
          "search-engine": "ElasticSearchEngine",
          action: "BasicSearchEngine",
        };
      } else {
        params = {
          query_string: query_string.toString(),
          showGSDiv: "yes",
          skip_modules: "",
          search_modules: search_modules.toString() || "",
          action: "UnifiedSearch",
          advanced: "true",
          offset: offset.toString(),
        };
        if (module_offset) {
          params.module_offset = module_offset;
        }
      }
      let url = `/V8/meta/globalsearch`;

      const res = await api.post(url, params);
      if (res.ok) {
        dispatch(getGlobalSearchSuccess(res.data));
        return res;
      } else {
        toast(getError(res));
        dispatch(getListViewFailure(getError(res)));
      }
    } catch (e) {
      toast(e);
      dispatch(getListViewFailure(e));
    }
  };

export const getSuggestion = (query_string) => async (dispatch) => {
  try {
    dispatch(getSuggestionRequest());
    let url = `/V8/layout/ListView/AOK_KnowledgeBase/1?page[number]=1&page[size]=5&sort=-date_entered&filter[status][multi]=published_public`;
    url = `${url}&filter[name][lke]=${query_string}`;
    const res = await api.get(url);
    if (res.ok) {
      dispatch(getSugesstionSuccess(res.data));
      return res;
    } else {
      dispatch(getSugesstionError(getError(res)));
    }
  } catch (e) {
    dispatch(getSugesstionError(e));
  }
};
export const getListViewActivities =
  (
    layout = null,
    tab = null,
    pageNo = 1,
    pageSize = 20,
    record = null,
    isFuture = 0,
    sort = "",
    filterQuery,
  ) =>
  async (dispatch) => {
    try {
      let offset = "";

      if (layout === "ActivityView") {
        let url = `/V8/layout/${layout}`;
        if (tab) {
          url = `${url}/${tab}`;
        } else {
          url = `${url}/All/1`;
        }
        if (record) {
          url = `${url}/${record}`;
        }
        url = `${url}?page[number]=${pageNo}&page[size]=${pageSize}&isFuture=${isFuture}`;
        const res = await api.get(url);
        if (res.ok) {
          return res.data;
        }
        return getError(res);
      } else {
        if (tab === "Emails") {
          offset = `&Emails2_EMAIL_offset=${pageNo * 20}`;
        }
        pageNo = pageNo + 1;
        let url =
          `/V8/layout/ListView/${tab}/1?page[number]=${pageNo}&page[size]=${pageSize}` +
          offset;
        if (sort) {
          url = `${url}&sort=${sort}`;
        }
        if (filterQuery) {
          url = `${url}&${filterQuery}`;
        }
        const res = await api.get(url);
        if (res.ok) {
          return res.data;
        }
        return getError(res);
      }
    } catch (e) {
      return e;
    }
  };

export const getActivityFeeds = (pageNo, activityType = 0, pageSize = 20) => {
  const requestPayload = {
    offset: pageNo,
    limit: pageSize,
    myActivity: activityType,
  };
  return api.get(`/V8/ActivityStream`, requestPayload);
};

export const deleteActivityFeed = async (id) => {
  try {
    let payload = {
      reply_id: id,
    };
    return await api.delete(`V8/ActivityStream`, payload);
  } catch (ex) {
    return ex;
  }
};

export const updateReply = async (message, activity_id) => {
  try {
    let reqData = {
      data: {
        activity_id: activity_id,
        text: message,
      },
    };
    return await api.post(`V8/ActivityStream`, reqData);
  } catch (ex) {
    return ex;
  }
};

export const getPDFTemplates = (tab, relModule) => async (dispatch) => {
  try {
    let url = `/V8/layout/Popup/${tab}/getTemplates/1?filter[type][eq]=${relModule}`;
    const res = await api.get(url);
    if (res.ok) {
      return res.data;
    }
  } catch (e) {
    return e;
  }
};

export const deleteRecordFromModule = async (module, id) => {
  try {
    return await api.delete(`/V8/module/${module}/${id}`);
  } catch (ex) {
    return ex;
  }
};

export const convertToInvoice = async (module, id) => {
  try {
    return await api.get(`/V8/actionbutton/ConvertToInvoice/${module}/${id}`);
  } catch (ex) {
    return ex;
  }
};

const getFilterConfigRequest = () => ({
  type: actionTypes.FILTER_CONFIG_REQUEST,
});

const getFilterConfigSuccess = (payload, module) => ({
  type: actionTypes.FILTER_CONFIG_SUCCESS,
  payload,
  module,
});

const getFilterConfigFailure = (error) => ({
  type: actionTypes.FILTER_CONFIG_FAILURE,
  error,
});

export const getFilterConfig = (module) => async (dispatch) => {
  try {
    dispatch(getFilterConfigRequest());
    const res = await api.get(`/V8/layout/Search/${module}/1`);
    if (res.ok) {
      dispatch(getFilterConfigSuccess(res.data, module));
      return;
    }
    return dispatch(getFilterConfigFailure(getError(res)));
  } catch (e) {
    dispatch(getFilterConfigFailure(e));
  }
};
export const getFilterOpenDrawer = () => ({
  type: actionTypes.FILTER_OPEN_REQUEST,
});
export const getFilterCloseDrawer = () => ({
  type: actionTypes.FILTER_CLOSE_REQUEST,
});
export const getFilterOpen = () => {
  return (dispatch) => dispatch(getFilterOpenDrawer());
};
export const getFilterClose = () => {
  return (dispatch) => dispatch(getFilterCloseDrawer());
};
export const getFilterConfig1 = (module, id) => async (dispatch) => {
  try {
    dispatch(getFilterConfigRequest());
    const res = await api.get(
      `/V8/layout/Search/${module}/1?saved_search_id=${id}`,
    );

    if (res.ok) {
      dispatch(getFilterConfigSuccess(res.data, module));
      return;
    }
    return dispatch(getFilterConfigFailure(getError(res)));
  } catch (e) {
    dispatch(getFilterConfigFailure(e));
  }
};

export const getFilteredResults = (module, query) => async (dispatch) => {
  try {
    dispatch(getListViewRequest());
    const res = await api.get(`/V8/layout/ListView/${module}/1?${query}`);
    if (res.ok) {
      dispatch(getListViewSuccess(res, module));
      return;
    }
    return dispatch(getListViewFailure(getError(res)));
  } catch (e) {
    dispatch(getListViewFailure(e));
  }
};
export const getColumnChooserFields = async (module) => {
  try {
    return await api.get(`/V8/layout/ColumnChooser/${module}/1`);
  } catch (e) {
    return e;
  }
};

// APIs related to relate field
export const getRelateFieldData = async (
  module,
  pageSize = 20,
  pageNo = 1,
  sort,
  query,
  reportsTo = null, 
) => {
  try {
    let queryParams = {
      "page[size]": pageSize,
      "page[number]": pageNo,
    };
    let url = `/V8/layout/Popup/${module}/1`;
    if (!isEmpty(sort)) {
      queryParams["sort"] = sort;
    }
    if (!isEmpty(query)) {
      if (typeof query == "object") {
        queryParams = { ...queryParams, ...query };
      } else {
        const result = {};
        const params = new URLSearchParams(query);
        for (const [key, value] of params) {
          result[key] = value;
        }
        queryParams = { ...queryParams, ...result };
      }
    }
    if (!isEmpty(reportsTo) && !isNil(reportsTo)) {
      queryParams["filter[reports_to_id][]"] = reportsTo;
    }
    return await api.get(url, queryParams);
  } catch (ex) {
    return ex;
  }
};

export const relateFieldSearch = async (module, query) => {
  try {
    return await api.get(
      `/V8/layout/Popup/${module}/1?page[size]=20&page[number]=1&${query}`,
    );
  } catch (ex) {
    return ex;
  }
};
export const relatePopupCreateSubmit = async (data) => {
  try {
    data = JSON.stringify(data);
    return await api.post(`/V8/module`, data);
  } catch (ex) {
    return ex;
  }
};

export const setSelectedModule = (selectedTab) => ({
  type: actionTypes.SET_SELECTED_MODULE,
  payload: selectedTab,
});

export const resetModulesData = () => ({
  type: actionTypes.RESET_STORE,
});

export const massUpdate = async (data) => {
  try {
    return await api.patch(`/V8/layout/MassUpdate`, data);
  } catch (e) {
    return e;
  }
};

export const getMassUpdateForm = async (module) => {
  try {
    return await api.get(`/V8/layout/MassUpdate/${module}/1`);
  } catch (e) {
    return e;
  }
};

export const updateChoosedColumns =
  (module, displayColumns, hideColumns) => async (dispatch, getStore) => {
    try {
      const res = await api.patch("/V8/layout/updateColumnChooser", {
        action: "updateColumnChooser",
        data: {
          type: module,
          displayColumns: displayColumns,
          hideTabs: hideColumns,
        },
      });
      if (res.ok) {
        toast(LBL_COLUMNS_UPDATED);
        dispatch(getColumnChooserFields(module));
      }
    } catch (e) {
      // toast(SOMETHING_WENT_WRONG);
    }
  };

//get Audit view poup data
export const getAuditViewData = async (
  module,
  id,
  pageSize = 20,
  pageNo = 1,
  sort,
) => {
  try {
    let url = `/V8/layout/AuditView/${module}/${id}?page[size]=${pageSize}&page[number]=${pageNo}`;
    if (sort) {
      url = `${url}&sort=${sort}`;
    }
    return await api.get(url);
  } catch (ex) {
    return ex;
  }
};

//get In/Outbound Emails
export const getInboundOutboundEmails = async (dispatch) => {
  try {
    let url = `/V8/emailsetting/listuseremailaccount?data[type]=InboundEmail`;
    return await api.get(url);
  } catch (ex) {
    return ex;
  }
};

//get Edit In/Outbound Emails
export const getEditInboundOutboundEmail = async (type, id) => {
  let editType = type === "inbound" ? "InboundEmail" : "Outboundmail";
  let params = {
    data: {
      type: editType,
      emailAccountId: id,
    },
  };
  try {
    let url = `/V8/emailsetting/editinboundemail`;
    return await api.post(url, params);
  } catch (ex) {
    return ex;
  }
};

//Delete  In/Outbound Emails
export const deleteInboundOutboundEmail = async (type, id) => {
  let url = null;
  let params = {};
  if (type === "inbound" || type === "outbound") {
    let editType =
      type === "inbound" ? "InboundEmail" : "OutboundEmailAccounts";
    url = `/V8/module/${editType}/${id}`;
  } else {
    params = {
      record_id: id,
      delete: true,
    };
    url = `/V8/emailsetting/savedefaultsignature`;
  }
  if (url) {
    try {
      if (type === "signature") {
        return await api.post(url, params);
      } else {
        return await api.delete(url, params);
      }
    } catch (ex) {
      return ex;
    }
  }
};

//get News Feeds
export const getNewsFeeds =
  (searchText, start, location) => async (dispatch) => {
    try {
      let params = {
        q: encodeURI(searchText),
        tbm: "nws",
        location: encodeURI(location),
        start: start,
      };
      let url = `/V8/actionbutton/serpapi`;

      const res = await api.post(url, params);
      if (res.ok) {
        return res.data;
      }
      return getError(res);
    } catch (e) {
      return e;
    }
  };

//get 360 Data
export const get360Data =
  (module, id, mobileNo = null) =>
  async (dispatch) => {
    try {
      let params = {
        module: module,
        crm_id: id,
      };
      if (mobileNo) {
        params = { ...params, ["mobile"]: mobileNo };
      }
      let url = `/V8/customer360`;

      const res = await api.post(url, params);
      if (res.ok) {
        return res.data;
      }
      return getError(res);
    } catch (e) {
      return e;
    }
  };

//get 360 Data
export const get360PaginationData =
  (module, id, related_module, page) => async (dispatch) => {
    try {
      let params = {
        module: module,
        crm_id: id,
        related_module: related_module,
        page: page,
      };
      let url = `/V8/c360pagination`;

      const res = await api.post(url, params);
      if (res.ok) {
        return res.data;
      }
      return getError(res);
    } catch (e) {
      return e;
    }
  };

export const importRecords = async (data) => {
  try {
    return await api.post(`/V8/actionbutton/importfile`, data);
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const importRecordsRevert = async (data) => {
  try {
    return await api.post(`/V8/actionbutton/importundo`, data);
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const getMergeData = async (data) => {
  try {
    return await api.post(`/V8/actionbutton/merge`, data);
  } catch (e) {
    return e;
  }
};

export const setIsClearBasicSearchDate = (payload) => ({
  type: actionTypes.SET_CLEAR_BASIC_SEARCH_DATA,
  payload,
});

export const setIsFilterByBasicSearch = (payload) => ({
  type: actionTypes.SET_IS_FILTER_BY_BASIC_SEARCH,
  payload,
});
export const saveFilterData1 =
  (is_saved_search, saved_search_name, query, selectedModule) =>
  async (dispatch) => {
    try {
      let url = `V8/layout/ListView/${selectedModule}/1?page[number]=1&page[size]=20&${query}&is_saved_search=${is_saved_search}&saved_search_name=${saved_search_name}
    `;
      const res = await api.post(url);
      if (res.ok) {
        return res.data;
      }
      return getError(res);
    } catch (e) {
      return e;
    }
  };
export const saveFilterData2 =
  (is_saved_search, query, selectedModule, saveFilterid) =>
  async (dispatch) => {
    try {
      let url = `V8/layout/ListView/${selectedModule}/1?page[number]=1&page[size]=20&${query}&is_saved_search=${is_saved_search}&saved_search_id=${saveFilterid}`;
      const res = await api.get(url);
      if (res.ok) {
        return res.data;
      }
      return getError(res);
    } catch (e) {
      return e;
    }
  };

export const getModuleRecords = async (
  module,
  query,
  id,
  pageNumber,
  subpanel = "accounts_prod_product_purchased_1",
  subpanel_module = "Prod_Product_Purchased",
) => {
  try {
    return await api.get(
      `/V8/layout/Subpanel/${module}/${id}?subpanel=${subpanel}&subpanel_module=${subpanel_module}&page[size]=5&page[number]=${pageNumber}&${query}`,
    );
  } catch (ex) {
    return ex;
  }
};

export const relateTicketSearch = async (module, query, id, pageNumber) => {
  try {
    return await api.get(
      `/V8/layout/Popup/Cases/1?page[size]=5&page[number]=${pageNumber}`,
    );
  } catch (ex) {
    return ex;
  }
};

export const getListViewWithId = async (module, record_id = null) => {
  try {
    let url = `/V8/layout/Popup/${module}/1`;
    let queryParams = {
      "page[number]": 1,
      "page[size]": 1,
      "filter[id][eq]": record_id,
      sort: "-date_entered",
    };
    return await api.get(url, queryParams);
  } catch (e) {
    console.log(e);
  }
};
export const setFilterOpenState = async (tab, flag) => {
  let url = `/V8/layout/ListView/${tab}/1`;
  let queryParams = {
    isListViewFilterOpen: flag ? "on" : "off",
    "page[number]": 1,
    "page[size]": 1,
  };
  return await api.get(url, queryParams);
};

export const setMicrosoft365Token = async (payload) => {
  let url = `/V8/microsoftCalender/getToken`;
  return await api.post(url, payload);
};
