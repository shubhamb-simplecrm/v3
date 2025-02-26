import {
  RIGHT_SIDEBAR_DRAWER_WIDTH,
  MOBILE_RIGHT_SIDEBAR_DRAWER_WIDTH,
} from "@/common/theme-constants";
import { makeStyles } from "@material-ui/core";

function getScreenWidth() {
  return window.innerWidth;
}
const screenWidth = getScreenWidth() - MOBILE_RIGHT_SIDEBAR_DRAWER_WIDTH;
export default makeStyles((theme) => {
  return {
    drawerOpen: {
      width: RIGHT_SIDEBAR_DRAWER_WIDTH,
      flexShrink: 0,
    },
    warning: {
      margin: "5px 2px",
      padding: "5px 10px",
      fontSize: "0.65rem",
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
      zIndex: 997,
      ...theme.mixins.toolbar,
    },
    mobileRightDrawer: {
      width: screenWidth,
      marginRight: MOBILE_RIGHT_SIDEBAR_DRAWER_WIDTH,
    },
    drawerPaperOpen: {
      width: RIGHT_SIDEBAR_DRAWER_WIDTH,
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
    drawerAdj: {
      marginTop: "4rem",
      marginBottom: "2rem",
    },
    filterDrawerRightContainer: {
      // overflowY: "hidden",
      width: RIGHT_SIDEBAR_DRAWER_WIDTH,
      ...theme.mixins.appBar,
      zIndex: "997",
      "& > div": {
        ...theme.mixins.toolbar,
        background: theme.palette.background.default,
        width: RIGHT_SIDEBAR_DRAWER_WIDTH,
      },
    },
    flexRows: {
      padding: "0.2rem",
      marginTop: "0.4rem",
    },
    flexGrid: {
      padding: "1rem",
      overflow: "hidden",
    },
    dirRow: {
      marginTop: "1rem",
    },
    flexDir: {
      display: "flex",
      justifyContent: "center",
    },
    filterBody: {
      marginTop: 10,
      // paddingRight: "0.6rem",
      height: "68vh",
      // overflowY: "scroll"
    },
    scroll: {
      height: "80vh",
      "& > div": {
        paddingRight: "0.6rem",
      },
    },
    backAdj: {
      // ...theme.mixins.toolbar,
      // background: "#f7f7f7"
      // marginTop: 64,
      background: theme.palette.background.default,
    },
    headerTitle: {
      fontWeight: "600",
      color: theme.palette.primary.main,
      cursor: "pointer",
      fontSize: "1.3rem",
      // paddingTop: 10,
    },
    divider: {
      border: "2px solid #dedede",
      marginTop: 10,
      marginBottom: 10,
    },
    cardHeaderRoot: {
      // padding: "10px 20px",
      padding: "10px 10px 0px 15px",
      marginTop: 12,
    },
    cardContentRoot: {
      backgroundColor:
        theme.palette.type == "dark"
          ? theme.palette.background.paper
          : "#f7f7f7",
    },
    root: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      marginBottom: "2.7rem",
      boxShadow: "none",
    },
    grow: {
      flexGrow: 1,
    },
    btnContainer: {
      justifyContent: "flex-end",
    },
    btn: {
      "&:hover": {
        // On hover added same styling on navbar icons - 27/02/2023
        background: theme.palette.primary.main,
        color: "#FFFFFF",
      },
      margin: "0 10px 0 0",
      background: theme.palette.primary.main + "20",
      color: theme.palette.primary.main,
    },
  };
});
