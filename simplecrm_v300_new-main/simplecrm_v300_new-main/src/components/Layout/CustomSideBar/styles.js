import { makeStyles } from "@material-ui/core";
import { SIDEBAR_DRAWER_WIDTH } from "../../../common/theme-constants";

export default makeStyles((theme) => ({
  drawer: {
    width: SIDEBAR_DRAWER_WIDTH,
    // flexShrink: 0,
    whiteSpace: "nowrap",
    background: theme.palette.background.sidebar,
    [theme.breakpoints.down("sm")]: {
      width: SIDEBAR_DRAWER_WIDTH+100,
    },
  },
  drawerPaper: {
    whiteSpace: "nowrap",
    borderRight: `2px solid ${theme.palette.background.border}`,
    background: theme.palette.background.sidebar,
    width: SIDEBAR_DRAWER_WIDTH,
    [theme.breakpoints.down("sm")]: {
      width: SIDEBAR_DRAWER_WIDTH+100,
    },
  },
  drawerOpen: {
    width: SIDEBAR_DRAWER_WIDTH,
    background: theme.palette.background.sidebar,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    background: theme.palette.background.sidebar,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // position: "absolute",
    overflowX: "hidden",
    width: theme.spacing(7) + 4,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(7) + 4,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(0, 1),
    background: theme.palette.background.paper,
    ...theme.mixins.toolbar,
  },
}));
