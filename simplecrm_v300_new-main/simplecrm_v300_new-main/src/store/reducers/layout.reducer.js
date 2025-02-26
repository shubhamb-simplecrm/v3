import { isNil, pathOr } from "ramda";
import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  sidebarLoading: false,
  sidebarError: null,
  sidebarLinks: [],
  isOpenRightSidebarStatus: false,
  moduleList: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // List view data reducer cases

    // Sidebar links reducer cases
    case actionTypes.SIDEBAR_LINKS_REQUEST:
      return { ...state, sidebarLoading: true };

    case actionTypes.SIDEBAR_LINKS_SUCCESS:
      const moduleListArr = {};
      const modulesObj = pathOr({}, ["payload", "attributes"], action);
      const otherModulesObj = pathOr({}, ["payload", "otherModules"], action);
      const allModulesObj = { ...modulesObj, ...otherModulesObj };
      Object.entries(allModulesObj).map(([key, obj]) => {
        moduleListArr[key] = obj?.label;
      });
      return {
        ...state,
        sidebarLoading: false,
        sidebarLinks: action.payload,
        moduleList: moduleListArr,
      };

    case actionTypes.SIDEBAR_LINKS_FAILURE:
      return {
        ...state,
        sidebarLoading: false,
        sidebarError: action.error,
      };
    case actionTypes.MANAGE_SIDEBAR_FAV_STATE:
      return {
        ...state,
        sidebarLinks: {
          ...state.sidebarLinks,
          attributes: {
            ...state.sidebarLinks.attributes,
            [action.payload.module]: {
              ...state.sidebarLinks?.attributes?.[action.payload.module],
              FavoriteRecords: isNil(action.payload.favRecordList)
                ? []
                : action.payload.favRecordList,
            },
          },
        },
      };
    case actionTypes.MANAGE_SIDEBAR_RECENT_STATE:
      if (
        typeof state["sidebarLinks"]["attributes"][action.payload.module] ==
        "object"
      ) {
        state["sidebarLinks"]["attributes"][action.payload.module] = {
          ...state["sidebarLinks"]["attributes"][action.payload.module],
          RecentViews: action?.payload?.recentRecordList || {},
        };
      }

      return {
        ...state,
      };
    default:
      return state;
  }
};
