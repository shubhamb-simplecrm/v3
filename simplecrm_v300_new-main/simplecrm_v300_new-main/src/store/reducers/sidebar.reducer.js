import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  isOpenSidebarStatus: false, 
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    
    // List view data reducer cases
    case actionTypes.SAVE_SIDEBAR_OPEN_STATUS:
      return {
        ...state,
        isOpenSidebarStatus: action.payload===undefined
          ? !state.isOpenSidebarStatus
          : action.payload,
      };
    // Sidebar links reducer cases
   
    default:
      return state;
  }
};
