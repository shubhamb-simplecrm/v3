import { api } from "../../common/api-utils";
import { toast } from "react-toastify";
import { SOMETHING_WENT_WRONG } from "../../constant";
export const c360SaveNotes = async (data, module) => {
  let reqData = JSON.stringify(data);
  try {
    let res = await api.post(`/V8/module`, reqData);
    if (res.ok) {
      return res;
    } else {
      res.ok = false;
      return false;
    }
  } catch (e) {
    toast(SOMETHING_WENT_WRONG);
  }
};

export const c360ListNotes = async (data, pageNo, pageSize) => {
  let resData = [];
  try {
    let res = await api.get(
      `/V8/layout/ListView/Notes/1?sort=-date_entered&page[number]=${pageNo}&page[size]=${pageSize}&filter[parent_type][eq]=${
        data?.type == "Account" ? "Accounts" : data?.type
      }&filter[parent_id][eq]=${data?.id}&filter[disableSaveSearch][eq]=1`,
    );
    if (res && res?.ok && res.data) {
      resData = res.data;
    }
    return resData;
  } catch (e) {
    toast(SOMETHING_WENT_WRONG);
  }
};

export const c360TilesData = async (id) => {
  let payload = {
    data: {
      account_id: id,
    },
  };
  try {
    let res = await api.post(`/V8/customer360/getcount`, payload);
    if (res.ok) {
      return res;
    }
  } catch (e) {
    toast(SOMETHING_WENT_WRONG);
  }
};
