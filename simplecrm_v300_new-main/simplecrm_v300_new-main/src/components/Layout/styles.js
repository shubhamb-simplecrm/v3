import { makeStyles } from "@material-ui/core";
import {
  RIGHT_SIDEBAR_DRAWER_WIDTH,
  SIDEBAR_DRAWER_WIDTH,
} from "../../common/theme-constants";
// Added for mobile right side drawer size

export default makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.default,
  },
  appBarSpacer: theme.mixins.toolbar,
  layoutMainSection: {
    padding: theme.spacing(1),
    padding: "0px",
    height:"calc(100% - 0vh)",
    // width: "100%",
    minWidth: 0,
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflow: "auto",
  },
  contentRightShift: {
    marginRight: RIGHT_SIDEBAR_DRAWER_WIDTH,
  },
  container: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      height: `100%`,
    },
  },
  containerFullHeight: {
    height: `100vh`,
  },
  containerHeight: {
    height: `calc(100vh - 6.5rem)`,
  },
  footer: {
    background: "#00022E",
    height: "50px",
    color: "#FC86AA",
  },
  contentLeftShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: SIDEBAR_DRAWER_WIDTH,
    // margin:0
    // marginLeft: `cal(100%- ${RIGHT_SIDEBAR_DRAWER_WIDTH}px)`,
  },
  contentRightShift: {
    marginRight: RIGHT_SIDEBAR_DRAWER_WIDTH,
  },
  contentCopyDisable: {
    userSelect: "none",
  },
}));
