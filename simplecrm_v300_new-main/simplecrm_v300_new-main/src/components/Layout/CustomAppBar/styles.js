import { makeStyles } from "@material-ui/core";
import {
  RIGHT_SIDEBAR_DRAWER_WIDTH,
  SIDEBAR_DRAWER_WIDTH,
} from "../../../common/theme-constants";
export default makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 2,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    borderBottom: `2px solid ${theme.palette.background.border}`,
  },
  appBarShiftRight: {
    marginLeft: SIDEBAR_DRAWER_WIDTH,
    width: `calc(100% - ${SIDEBAR_DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarShiftLeft: {
    width: `calc(100% - ${RIGHT_SIDEBAR_DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: RIGHT_SIDEBAR_DRAWER_WIDTH,
  },
  menuButton: {
    // borderRight: "2px solid #dedede",
    borderRight: `2px solid ${theme.palette.background.border}`,
    paddingRight: 6,
  },
  hide: {
    display: "none",
  },
  appBarTitle: {
    // display: "none",
    fontWeight: "600",
    color: theme.palette.primary.main,
    cursor: "pointer",
    fontSize: "1.5rem",
    marginLeft: "1.0rem",
    textDecoration: "none",
    // [theme.breakpoints.up("sm")]: {
    //   display: "block",
    // },
  },
  appBarSpacer: theme.mixins.toolbar,
  grow: {
    flexGrow: 1,
  },
  customToolBarStyle: {
    paddingRight: 16,
  },
  customToolBar: {
    paddingLeft: 16,
  },
}));
