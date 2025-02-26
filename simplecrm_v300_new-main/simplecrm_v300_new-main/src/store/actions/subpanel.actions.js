import { api } from "../../common/api-utils";

export const getSubpanelListViewData = async (
  module,
  subpanel,
  subpanel_module,
  id,
  pageSize = 10,
  pageNo,
  name,
  order,
) => {
  try {
    if (pageNo) {
      let filter =
        "?subpanel=" +
        subpanel.toLowerCase() +
        "&subpanel_module=" +
        subpanel_module;
      filter = `${filter}&page[size]=${pageSize}&page[number]=${pageNo}`;
      if (name) {
        filter = `${filter}&subpanel_sort=${name}`;
      }
      if (order) {
        filter = `${filter}&subpanel_sort_order=${order.toUpperCase()}`;
      }
      return await api.get(`/V8/layout/Subpanel/${module}/${id}${filter}`);
    }
  } catch (ex) {
    return ex;
  }
};

export const deleteRelationship = async (
  module,
  id,
  relationshipName,
  relateId,
  rel,
) => {
  try {
    return await api.delete(
      `/V8/module/${module}/${id}/relationships/${rel}/${relateId}`,
    );
  } catch (ex) {
    console.log(ex);
    return ex;
  }
};
export const closeActivity = async (submitData) => {
  try {
    return await api.patch(`/V8/module`, submitData);
  } catch (ex) {
    return ex;
  }
};
export const createRecordRelationshipAction = async (tab, id, param) => {
  try {
    let res = {};
    res = await api.post(`/V8/module/${tab}/${id}/relationships`, param);
    if (res.ok) {
      return res.data;
    }
  } catch (e) {
    return e;
  }
};

export const getSubpanelRecordDetailView = async (module, id) => {
  try {
    return await api.get(`/V8/layout/DetailView/${module}/${id}`);
  } catch (e) {
    return e;
  }
};
