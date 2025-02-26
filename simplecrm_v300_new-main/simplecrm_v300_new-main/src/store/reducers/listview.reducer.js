import * as actionTypes from "../actions/actionTypes";
import { pathOr } from "ramda";
import LocalStorageUtils from "../../common/local-storage-utils";

const INITIAL_STATE = {
  listViewTabData: {},
  listViewLoading: false,
  listViewError: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.LIST_VIEW_ON_REQUEST:
      return { ...state, listViewLoading: true, listViewError: null };

    case actionTypes.LIST_VIEW_ON_SUCCESS:
      return {
        ...state,
        listViewError: null,
        listViewLoading: false,
        listViewTabData: {
          ...state.listViewTabData,
          [action.tab]: action.payload,
        },
      };

    case actionTypes.LIST_VIEW_ON_FAILURE:
      return {
        ...state,
        listViewLoading: false,
        listViewError: action.error,
      };

    default:
      return state;
  }
};
