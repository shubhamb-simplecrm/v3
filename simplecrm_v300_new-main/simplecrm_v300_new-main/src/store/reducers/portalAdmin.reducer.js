import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  saveConfigureData: false,
  saveDataError: null,
  portalAdminLinksLoading: false,
  portalAdminLinks: [],
  portalAdminLinksFailure: null,
  portalAdminModuleListLoading: false,
  portalAdminFieldViewLoading: false,
  portalAdminEditViewLoading: false,
  portalAdminModuleList: [],
  portalAdminModuleListFailure: null,
  portalAdminFieldList: [],
  portalAdminEditView:[],
  portalAdminEditLayoutLoading: false,
  portalAdminEditLayout: [],
  portalAdminEditLayoutFailure: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.PORTAL_ADMIN_LINKS_REQUEST:
      return { ...state, portalAdminLinksLoading: true };

    case actionTypes.PORTAL_ADMIN_LINKS_SUCCESS:
      return {
        ...state,
        portalAdminLinksFailure: null,
        portalAdminLinksLoading: false,
        portalAdminLinks: action.payload,
      };

    case actionTypes.PORTAL_ADMIN_LINKS_FAILURE:
      return {
        ...state,
        portalAdminLinksLoading: false,
        portalAdminLinksFailure: action.error,
      };
    case actionTypes.PORTAL_ADMIN_MODULE_LIST_REQUEST:
      return { ...state, portalAdminModuleListLoading: true };

    case actionTypes.PORTAL_ADMIN_MODULE_LIST_SUCCESS:
      return {
        ...state,
        portalAdminModuleListLoading: false,
        portalAdminModuleList: action.payload,
      };
    case actionTypes.PORTAL_ADMIN_MODULE_LIST_FAILURE:
      return {
        ...state,
        portalAdminModuleListLoading: false,
        portalAdminModuleListFailure: action.error,
      };

    case actionTypes.PORTAL_ADMIN_FIELD_LIST_REQUEST:
      return { ...state, portalAdminFieldListLoading: true };
  
    case actionTypes.PORTAL_ADMIN_FIELD_LIST_SUCCESS:
      return {
          ...state,
          portalAdminFieldListLoading: false,
          portalAdminFieldList: action.payload,
        };
      case actionTypes.PORTAL_ADMIN_FIELD_LIST_FAILURE:
        return {
          ...state,
          portalAdminFieldListLoading: false,
          portalAdminFieldListFailure: action.error,
        };
        
    case actionTypes.PORTAL_ADMIN_EDIT_VIEW_REQUEST:
      return { ...state, portalAdminEditViewLoading: true };
  
    case actionTypes.PORTAL_ADMIN_EDIT_VIEW_SUCCESS:
      return {
          ...state,
          portalAdminEditViewLoading: false,
          portalAdminEditView: action.payload,
        };
      case actionTypes.PORTAL_ADMIN_EDIT_VIEW_FAILURE:
        return {
          ...state,
          portalAdminEditViewLoading: false,
          portalAdminEditViewFailure: action.error,
        };

    case actionTypes.SAVE_CONFIG_REQUEST:
      return { ...state, saveConfigureData: true };

    case actionTypes.SAVE_CONFIG_SUCCESS:
      return {
        ...state,
        saveConfigureData: false,
      };

    case actionTypes.SAVE_CONFIG_FAILURE:
      return {
        ...state,
        saveConfigureData: false,
        saveDataError: action.error,
      };
      case actionTypes.PORTAL_ADMIN_GET_EDIT_LAYOUT_REQUEST:
        return { ...state, portalAdminEditLayoutLoading: true };

      case actionTypes.PORTAL_ADMIN_GET_EDIT_LAYOUT_SUCCESS:
        return {
          ...state,
          portalAdminEditLayoutFailure: null,
          portalAdminEditLayoutLoading: false,
          portalAdminEditLayout: action.payload,
        };
  
      case actionTypes.PORTAL_ADMIN_GET_EDIT_LAYOUT_FAILURE:
        return {
          ...state,
          portalAdminEditLayoutLoading: false,
          portalAdminEditLayoutFailure: action.error,
        };  
    default:
      return state;
  }
};
