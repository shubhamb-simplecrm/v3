import * as actionTypes from "../actions/actionTypes";
import { pathOr } from "ramda";
import EnvUtils from "../../common/env-utils";
const INITIAL_STATE = {
  baseUrl: EnvUtils.getValue("REACT_APP_BASE_URL"),
  validToken: EnvUtils.getValue("VALID_TOKEN_URL"),
  globalSearch: "",
  config: null,
  configLoading: false,
  configError: null,
  currentUserData: null,
  currentUserLoading: false,
  currentUserError: null,
  themeConfig: {
    currentTheme: "simpleX",
  },
  userPreference: {},
  loading: false,
  error: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.GET_METACONFIG_FAILURE:
      return { ...state, configLoading: false, configError: action.error };
    case actionTypes.GET_METACONFIG_REQUEST:
      return { ...state, configLoading: true };
    case actionTypes.GET_METACONFIG_SUCCESS:
      return {
        ...state,
        configLoading: false,
        config: action.payload,
        configError: null,
      };
    case actionTypes.GET_CONFIG_FAILURE:
      return { ...state, loading: false, error: action.error };
    case actionTypes.GET_CONFIG_REQUEST:
      return { ...state, loading: true, error: null };
    case actionTypes.GET_CONFIG_SUCCESS:
      const configData = pathOr({}, ["payload", "config"], action);
      const userData = pathOr({}, ["payload", "current_user"], action);
      const userPrefData = pathOr(
        {},
        ["payload", "user_preferences", "data"],
        action,
      );
      return {
        ...state,
        loading: false,
        config: configData,
        currentUserData: userData,
        userPreference: userPrefData,
        error: null,
      };

    case actionTypes.GET_CURRENTUSER_FAILURE:
      return {
        ...state,
        currentUserLoading: false,
        currentUserError: action.error,
      };

    case actionTypes.GET_CURRENTUSER_REQUEST:
      return { ...state, currentUserLoading: true };

    case actionTypes.GET_CURRENTUSER_SUCCESS:
      return {
        ...state,
        currentUserLoading: false,
        currentUserData: action.payload,
        currentUserError: null,
      };

    case actionTypes.TOGGLE_THEME:
      return {
        ...state,
        themeConfig: { currentTheme: action.payload },
        config: { ...state.config, V3SelectedTheme: action.payload },
      };

    case actionTypes.USER_PREFERENCE_SUCCESS:
      let calendar_format = "";
      let time_reg_format = "([0-9]{1,2}):([0-9]{1,2})";
      let date_reg_format = "([0-9]{1,2})/([0-9]{1,2})/([0-9]{4})";
      let date_reg_positions = { m: 1, d: 2, Y: 3 };

      window.calendar_format = pathOr(
        calendar_format,
        ["attributes", "global", "calendar_format"],
        action.payload,
      );
      window.date_reg_format = pathOr(
        date_reg_format,
        ["attributes", "global", "date_reg_format"],
        action.payload,
      );
      window.time_reg_format = pathOr(
        time_reg_format,
        ["attributes", "global", "time_reg_format"],
        action.payload,
      );
      window.date_reg_positions = pathOr(
        date_reg_positions,
        ["attributes", "global", "date_reg_positions"],
        action.payload,
      );

      return {
        ...state,
        userPreference: {
          ...state.userPreference,
          ...action.payload,
        },
      };
    case actionTypes.UPDATE_BASE_URL:
      return { ...state, baseUrl: action.baseUrl };

    case actionTypes.TOGGLE_SIDEBAR_MENU:
      return { ...state, isSidebarOpened: !state.isSidebarOpened };
    default:
      return state;
  }
};
