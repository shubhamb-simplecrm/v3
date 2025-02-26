import { isEmpty, pathOr } from "ramda";
import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  dashboardLoading: false,
  dashboardError: null,
  dashboardTabs: {},
  dashboardData: {},
  activeDashboardTabIndex: 0,
  isDashboardLayoutEditable: false,
  changedDashLetLayout: [],
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  let tabIndex = null;
  let prevDashLetList = null;
  switch (type) {
    case actionTypes.DASHBOARD_REQUEST:
      return { ...state, dashboardLoading: true, dashboardError: null };
    case actionTypes.DASHBOARD_FAILURE:
      return {
        ...state,
        dashboardLoading: false,
        dashboardError: payload,
      };
    case actionTypes.DASHBOARD_SUCCESS:
      if (payload.hasOwnProperty("current_tab")) {
        state.dashboardData[payload.current_tab] = payload;
      }
      return {
        ...state,
        dashboardLoading: false,
        dashboardError: null,
        dashboardData: {
          ...state.dashboardData,
        },
        isDashboardLayoutEditable: false,
      };
    case actionTypes.DASHBOARD_FAILURE:
      return {
        ...state,
        dashboardLoading: false,
        dashboardError: payload,
      };
    case actionTypes.DASHBOARD_TAB_ADD:
      return {
        ...state,
        dashboardTabs: {
          ...state.dashboardTabs,
          [payload.tabIndex]: payload.tabObj,
        },
      };

    case actionTypes.SET_INITIAL_DASHBOARD_TABS:
      return {
        ...state,
        dashboardTabs: { ...payload },
        activeDashboardTabIndex: isEmpty(payload)
          ? 0
          : state?.activeDashboardTabIndex ?? 0,
      };

    case actionTypes.DASHBOARD_TAB_RENAME:
      if (state.dashboardTabs.hasOwnProperty(payload.tabIndex)) {
        state.dashboardTabs[payload.tabIndex]["pageTitle"] = payload.dashName;
      }

      return {
        ...state,
        dashboardTabs: {
          ...state.dashboardTabs,
        },
      };
    case actionTypes.REMOVE_DASHBOARD_DATA:
      if (state.dashboardData.hasOwnProperty(payload)) {
        delete state.dashboardData[payload];
        if (!isEmpty(state.dashboardData)) {
          const tempDashboardData = {};
          Object.entries(state.dashboardData)?.forEach(
            ([key, value], index) => {
              tempDashboardData[index] = value;
            },
          );
          state.dashboardData = tempDashboardData;
        }
      }
      if (state.dashboardTabs.hasOwnProperty(payload)) {
        delete state.dashboardTabs[payload];
        if (!isEmpty(state.dashboardTabs)) {
          const tempDashboardTabs = {};
          Object.entries(state.dashboardTabs)?.forEach(
            ([key, value], index) => {
              tempDashboardTabs[index] = value;
            },
          );
          state.dashboardTabs = tempDashboardTabs;
        }
      }

      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
        },
        dashboardTabs: {
          ...state.dashboardTabs,
        },
        activeDashboardTabIndex: isEmpty(state.dashboardTabs) ? null : 0,
      };
    case actionTypes.SET_DASHBOARD_LAYOUT_EDITABLE:
      return {
        ...state,
        isDashboardLayoutEditable: payload,
      };
    case actionTypes.SET_DASHBOARD_TAB_INDEX:
      return {
        ...state,
        activeDashboardTabIndex: payload,
        changedDashLetLayout: [],
        dashboardData: {},
      };
    case actionTypes.CHANGED_DASHLET_LAYOUT_DATA:
      return {
        ...state,
        changedDashLetLayout: [...payload],
      };
    case actionTypes.SAVE_DASHLET_LAYOUT_CHANGED_POSITION:
      tabIndex = pathOr(0, ["current_tab"], payload);
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          [tabIndex]: {
            ...state.dashboardData[tabIndex],
            dashlets: pathOr([], ["layout"], payload),
          },
        },
        changedDashLetLayout: [],
        isDashboardLayoutEditable: false,
      };

    case actionTypes.ADD_DASHLET_DATA:
      prevDashLetList = pathOr(
        [],
        ["dashboardData", payload.tabIndex, ["dashlets"]],
        state,
      );
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          [payload.tabIndex]: {
            ...state["dashboardData"][payload.tabIndex],
            dashlets: [...payload.dashLetList, ...prevDashLetList],
          },
        },
      };
    case actionTypes.REMOVE_DASHLET_DATA:
      tabIndex = pathOr("", ["current_tab"], payload);
      let dashLetId = pathOr("", ["dashlet_id"], payload);
      let dashLetList = pathOr(
        [],
        ["dashboardData", tabIndex, "dashlets"],
        state,
      );
      if (Array.isArray(dashLetList)) {
        dashLetList = dashLetList.filter((v) => v.id != dashLetId);
      }
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          [tabIndex]: {
            ...state["dashboardData"][tabIndex],
            dashlets: dashLetList,
          },
        },
      };

    default:
      return state;
  }
};
