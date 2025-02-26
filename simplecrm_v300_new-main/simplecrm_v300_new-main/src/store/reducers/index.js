import { combineReducers } from "redux";
import dashboard from "./dashboard.reducer";
import modules from "./module.reducer";
import calendar from "./calendar.reducer";
import config from "./config.reducer";
import edit from "./edit.reducer";
import detail from "./detail.reducer";
import emails from "./emails.reducer";
import layout from "./layout.reducer";
import notification from "./notification.reducer";
import portalAdmin from "./portalAdmin.reducer";
import sidebar from "./sidebar.reducer";
import studio from "./studio.reducer";
import listview from "./listview.reducer";

const appReducer = combineReducers({
  dashboard,
  modules,
  config,
  edit,
  detail,
  emails,
  calendar,
  layout,
  notification,
  portalAdmin,
  sidebar,
  studio,
  listview
});

export default (state, action) => {
  if (action.type === "RESET_STORE") {
    state = undefined;
  }

  return appReducer(state, action);
};
