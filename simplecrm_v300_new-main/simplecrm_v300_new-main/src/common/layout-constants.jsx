import {
  LBL_GLOBAL_SEARCH_TITLE,
  LBL_ACTIVITIES_TITLE,
  LBL_NEWS_FEED_TITLE,
  LBL_BPM_TITLE,
  LBL_NOTIFICATIONS_TITLE,
  LBL_ACTIVITIES_STREAM_TITLE,
  LBL_GLOBAL_SMART_SEARCH_TITLE,
  LBL_SALES_COACH,
  LBL_PROFILE_LABEL_TITLE,
  LBL_MOBILE_DRAWER_OPENER,
  LBL_QUICK_CREATE_BUTTON_TITLE,
} from "../constant";
import SearchIcon from "@material-ui/icons/Search";
import RssFeedIcon from "@material-ui/icons/RssFeed";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";
import { NotificationsNone as NotificationsIcon } from "@material-ui/icons";
import TuneIcon from "@material-ui/icons/Tune";
import FaIcon from "../components/FaIcon";
import { isEmpty, isNil, pathOr } from "ramda";

export const getNavbarIcon = (label) => {
  const NAVBAR_ICON_LIST = {
    bpm_option: <AccountTreeIcon style={{ color: "#fab007" }} />,
    profile_option: null,
    notification_option: <NotificationsIcon />,
    sales_coach_option: (
      <FaIcon icon={`fa-solid fa-lightbulb`} size="1x" color="#fab007" />
    ),
    global_search_option: <SearchIcon />,
    smart_search_option: <LocalLibraryIcon />,
    activities_option: <LocalActivityIcon />,
    activity_stream_option: <AssignmentTurnedInIcon />,
    news_feeds_option: <RssFeedIcon />,
    mobile_open_drawer_option: <TuneIcon />,
    mobile_quick_create_option: <TuneIcon />,
  };
  return NAVBAR_ICON_LIST[label] || null;
};

export const isOptionAllow = (option = {}, metaObj = {}) => {
  let flag = false;
  if (isNil(option) || isNil(metaObj)) return false;
  if (!isEmpty(option?.allowModules) && !isEmpty(option?.allowViews)) {
    if (
      option?.allowModules?.includes("all") ||
      option?.allowModules?.includes(metaObj?.currentModule)
    ) {
      if (
        option?.allowViews?.includes("all") ||
        option?.allowViews?.includes(metaObj?.currentView)
      ) {
        flag = true;
      }
    }
  }
  return flag;
};

export const LAYOUT_VIEW_TYPE = Object.freeze({
  createView: "createview",
  createRelateView: "createrelateview",
  editView: "editview",
  detailView: "detailview",
  convertLeadView: "convertlead",
  duplicateView: "duplicateview",
  calendarView: "calendarView",
  quickCreateView: "quickCreateView",
  searchLayoutView: "searchLayoutView",
  listView: "listView",
});
