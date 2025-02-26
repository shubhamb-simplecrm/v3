import * as actionTypes from "../actions/actionTypes";
import { pathOr } from "ramda";
import LocalStorageUtils from "../../common/local-storage-utils";

const INITIAL_STATE = {
  filterConfig: {},
  filterConfigLoading: false,
  filterConfigError: null,

  listViewTabData: {},
  listViewLoading: false,
  listViewError: null,

  globalSearchTabData: {},
  selectedModule: null,

  suggestionData: {},
  suggestionLoading: false,
  suggestionError: null,
  isClearBasicSearchData: false,
  isFilterByBasicSearch: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // List view data reducer cases
    case actionTypes.LIST_VIEW_REQUEST:
      return { ...state, listViewLoading: true, listViewError: null };

    case actionTypes.LIST_GLOBAL_SEARCH_REQUEST:
      return { ...state, globalSearchLoading: true };

    case actionTypes.LIST_GLOBAL_SEARCH_SUCCESS:
      return {
        ...state,
        listViewError: null,
        globalSearchLoading: false,
        globalSearchTabData: {
          ...state.globalSearchTabData,
          ["globalSearch"]: action.payload,
        },
      };

    case actionTypes.LIST_VIEW_SUCCESS:
      const folderData = pathOr(
        "",
        ["data", "templateMeta", "folder_details"],
        action.payload,
      );
      const selectedFolder = pathOr(
        "",
        ["data", "templateMeta", "selected_folder"],
        action.payload,
      );
      LocalStorageUtils.setValue("folderData", JSON.stringify(folderData));
      LocalStorageUtils.setValue(
        "selectedFolder",
        JSON.stringify(selectedFolder),
      );
      return {
        ...state,
        listViewError: null,
        listViewLoading: false,
        globalSearchLoading: false,
        listViewTabData: {
          ...state.listViewTabData,
          [action.tab]: action.payload,
        },
      };

    case actionTypes.LIST_VIEW_FAILURE:
      return {
        ...state,
        listViewLoading: false,
        globalSearchLoading: false,
        listViewError: action.error,
      };

    case actionTypes.SET_SELECTED_MODULE:
      return {
        ...state,
        selectedModule: action.payload,
      };

    case actionTypes.FILTER_CONFIG_REQUEST:
      return { ...state, filterConfigLoading: true };

    case actionTypes.FILTER_CONFIG_SUCCESS:
      return {
        ...state,
        filterConfig: {
          ...state.filterConfig,
          [action.module]: action.payload.data,
        },
        filterConfigError: null,
        filterConfigLoading: false,
      };
    case actionTypes.FILTER_OPEN_REQUEST:
      return {
        ...state,
        filterOpenRequest: true,
      };
    case actionTypes.FILTER_CLOSE_REQUEST:
      return {
        ...state,
        filterOpenRequest: false,
      };
    case actionTypes.FILTER_CONFIG_FAILURE:
      return {
        ...state,
        filterConfigError: action.error,
        filterConfigLoading: false,
      };

    case actionTypes.GET_COLUMNSCHOOSER_FIELDS_REQUEST:
      return { ...state, columnsChooserFieldsLoading: true };

    case actionTypes.GET_COLUMNSCHOOSER_FIELDS_SUCCESS:
      return {
        ...state,
        columnsChooserFields: {
          ...state.columnsChooserFields,
          [action.module]: action.payload.data,
        },
        columnsChooserFieldsLoading: false,
        columnsChooserFieldsError: null,
      };

    case actionTypes.GET_COLUMNSCHOOSER_FIELDS_FAILURE:
      return {
        ...state,
        columnsChooserFieldsLoading: action.error,
        columnsChooserFieldsError: false,
      };

    case actionTypes.SUGGESTION_REQUEST:
      return { ...state, suggestionLoading: true, suggestionError: null };

    case actionTypes.SUGGESTION_SUCCESS:
      return {
        ...state,
        suggestionData: {
          ...state.suggestionData,
          ["suggestion_data"]: action.payload,
        },
        suggestionLoading: false,
        suggestionError: null,
      };
    case actionTypes.SUGGESTION_FAILURE:
      return {
        ...state,
        suggestionError: action.error,
        suggestionLoading: false,
      };
    case actionTypes.SET_CLEAR_BASIC_SEARCH_DATA:
      return {
        ...state,
        isClearBasicSearchData: action.payload,
      };
    case actionTypes.SET_IS_FILTER_BY_BASIC_SEARCH: {
      return {
        ...state,
        isFilterByBasicSearch: action.payload,
      };
    }
    default:
      return state;
  }
};
