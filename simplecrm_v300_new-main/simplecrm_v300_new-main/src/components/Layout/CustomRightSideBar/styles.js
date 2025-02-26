import { makeStyles } from "@material-ui/core/styles";
import { RIGHT_SIDEBAR_DRAWER_WIDTH } from "../../../common/theme-constants";
import { MOBILE_RIGHT_SIDEBAR_DRAWER_WIDTH } from "../../../common/theme-constants";

function calculateWidthForMobileViewBody() {
  return window.innerWidth - MOBILE_RIGHT_SIDEBAR_DRAWER_WIDTH;
}
export const useStyles = makeStyles((theme) => ({
  drawerOpen: {
    width: RIGHT_SIDEBAR_DRAWER_WIDTH,
    flexShrink: 0,
  },
  drawerMobileOpen: {
    width: MOBILE_RIGHT_SIDEBAR_DRAWER_WIDTH,
    flexShrink: 0,
  },
  drawerMobileContainer: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerMobileSpacer: {
    marginTop: "1rem",
    ...theme.mixins.toolbar,
    // zIndex: theme.zIndex.drawer + 1,
  },
  drawerClose: {
    width: 0,
    flexShrink: 0,
  },
  drawerMobileClose: {
    width: 0,
    flexShrink: 0,
  },
  drawerPaper: {
    zIndex: 998,
    width: MOBILE_RIGHT_SIDEBAR_DRAWER_WIDTH,
    ...theme.mixins.toolbar,
  },
  mobileRightDrawer: {
    width: calculateWidthForMobileViewBody(),
    marginRight: MOBILE_RIGHT_SIDEBAR_DRAWER_WIDTH,
  },
  drawerPaperOpen: {
    width: RIGHT_SIDEBAR_DRAWER_WIDTH,
  },
  drawerTabOpen: {
    width: "calc(100% - 4rem)",
  },
  drawerMobilePaperOpen: {
    width: MOBILE_RIGHT_SIDEBAR_DRAWER_WIDTH,
  },
  drawerPaperClose: {
    width: 0,
  },
  drawerMobilePaperClose: {
    width: 0,
  },
  appBarSpacer: theme.mixins.toolbar,
}));
