import { makeStyles } from "@material-ui/styles";
// import { fade } from "@material-ui/core/styles/colorManipulator";

const drawerWidth = 400;

export default makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  drawerHeaderClose: {
    float: "right",
  },
  contentRightBar: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShiftRightBar: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  // drawer: {
  //   width: drawerWidth,
  //   flexShrink: 0,
  //   whiteSpace: "nowrap",
  // },
  drawerOpenRightBar: {
    width: drawerWidth,
    marginRight: 60,
    overflow: "hidden !important",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down("sm")]: {
      width: 400,
      marginRight: 60,
    },
    [theme.breakpoints.down("xs")]: {
      width: '-webkit-fill-available; width: -moz-available',
      marginRight: 45,
    },
  },
  drawerCloseRightBar: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 4,
    [theme.breakpoints.down("xs")]: {
      width: "auto",
    },
    paddingLeft: 2,
  },
}));
