import * as actionTypes from "../actions/actionTypes";
import { api } from "../../common/api-utils";
import { pathOr } from "ramda";

// Sidebar links/data actions
const getSidebarLinksRequest = () => ({
  type: actionTypes.SIDEBAR_LINKS_REQUEST,
});

const getSidebarLinksSuccess = (payload) => ({
  type: actionTypes.SIDEBAR_LINKS_SUCCESS,
  payload,
});

const getSidebarLinksFailure = (error) => ({
  type: actionTypes.SIDEBAR_LINKS_FAILURE,
  error,
});
export const getSidebarLinks = () => async (dispatch) => {
  try {
    dispatch(getSidebarLinksRequest());
    const res = await api.get("/V8/navigation");
    if (res.ok) {
      dispatch(getSidebarLinksSuccess(res.data.data));
      return;
    }
    dispatch(getSidebarLinksFailure(res.data.message));
  } catch (e) {
    dispatch(getSidebarLinksFailure(e));
  }
};

export const manegeSidebarFavMenuAction =
  (id, name, module, isAdd) => async (dispatch, getStore) => {
    const store = getStore();
    let favRecordList = pathOr(
      [],
      ["layout", "sidebarLinks", "attributes", module, "FavoriteRecords"],
      store,
    );
    if (Array.isArray(favRecordList)) {
      if (isAdd) {
        favRecordList = [
          {
            id,
            type: module,
            attributes: { name: name },
          },
          ...favRecordList,
        ];
      } else {
        favRecordList = favRecordList.filter((record) => record.id != id);
      }
      dispatch({
        type: actionTypes.MANAGE_SIDEBAR_FAV_STATE,
        payload: {
          module,
          favRecordList,
        },
      });
    }
  };
export const manegeSidebarRecentMenu =
  (id, name, module) => async (dispatch, getStore) => {
    const store = getStore();
    let recentRecordList = pathOr(
      [],
      ["layout", "sidebarLinks", "attributes", module, "RecentViews"],
      store,
    );
    recentRecordList = {
      [id]: {
        item_id: id,
        id: "",
        item_summary: name,
        module_name: module,
        monitor_id: "",
        date_modified: "",
      },
      ...recentRecordList,
    };
    let tempRecentRecordList = Object.fromEntries(
      Object.entries(recentRecordList).slice(0, 5),
    );

    dispatch({
      type: actionTypes.MANAGE_SIDEBAR_RECENT_STATE,
      payload: {
        module,
        recentRecordList: tempRecentRecordList,
      },
    });
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
