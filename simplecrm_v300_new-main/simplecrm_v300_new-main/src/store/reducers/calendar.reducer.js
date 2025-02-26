import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  CalendarListViewTabData: {},
  CalendarListViewLoading: false,
  CalendarListViewError: null,

};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // List view data reducer cases
    case actionTypes.CALENDAR_LIST_VIEW_REQUEST:
      return { ...state, CalendarListViewLoading: true };

    case actionTypes.CALENDAR_LIST_VIEW_SUCCESS:
      return {
        ...state,
        CalendarListViewError: null,
        CalendarListViewLoading: false,
        CalendarListViewTabData: {
          ...state.CalendarListViewTabData,
          [action.tab]: action.payload,
        },
      };

    case actionTypes.CALENDAR_LIST_VIEW_FAILURE:
      return {
        ...state,
        CalendarListViewLoading: false,
        CalendarListViewError: action.error,
      };
      default:
        return state;

    }
}