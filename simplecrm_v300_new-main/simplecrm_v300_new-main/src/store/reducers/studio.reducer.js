import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  selectedParameter: null,
  moduleList: {},
  moduleListLoading: true,
  tabViewLoading: true,
  tabViewData: null,
  subpanelViewLoading: true,
  subpanelViewData: null,
  relViewLoading: true,
  relViewData: null,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SELECTED_PARAMETER:
      return {
        ...state,
        selectedParameter: action.payload,
      };
    case actionTypes.RESET_DATA:
      return {
        ...state,
        selectedParameter: null,
      };
    case actionTypes.GET_MODULE_LIST_REQUEST:
      return {
        ...state,
        moduleListLoading: true
      };
    case actionTypes.GET_MODULE_LIST_SUCCESS:
      return {
        ...state,
        moduleList: action.payload.listData,
        moduleListLoading: false
      };
    case actionTypes.GET_TAB_VIEW_REQUEST:
      return {
        ...state,
        tabViewLoading: true
      };
    case actionTypes.GET_TAB_VIEW_SUCCESS:
      //temporary
      return {
        ...state,
        tabViewData: action.payload,
        tabViewLoading: false
      };
    case actionTypes.GET_SUBPANEL_VIEW_SUCCESS:
      //temporary
      return {
        ...state,
        subpanelViewData: action.payload,
        tabViewLoading: false
      };
    case actionTypes.GET_REL_VIEW_SUCCESS:
      //temporary
      return {
        ...state,
        relViewData: action.payload,
        tabViewLoading: false
      };
    case actionTypes.RESET_TAB_VIEW_DATA:
      return {
        ...state,
        // tabViewData: null,
        // tabViewLoading: true
      };
    default:
      return state;
  }
};
