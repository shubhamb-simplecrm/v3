import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
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
  heightAdj: {
    height: "76vh !important",
    [theme.breakpoints.down("sm")]: {
      height: "84vh !important",
    },
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
  notificationMain: {
    flexGrow: 1,
    boxShadow:
      "0px 2px 2px -2px rgb(0 0 0 / 20%), 0px 1px 2px 0px rgb(0 0 0 / 14%), 0px 1px 4px 0px rgb(0 0 0 / 12%) !important",
    transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  // drawer: {
  //   width: drawerWidth,
  //   flexShrink: 0,
  //   whiteSpace: "nowrap",
  // },
  // notificationContainer: {
  //     display: "flex",
  //     width: "400px",
  //     alignItems: "self-start",
  // },
  notificationContainer: {
    color: "#121a36",
    padding: "6px",
    borderRadius: "4px",
    alignItems: "flex-start",
    width: "100%",
    borderRight: "7px solid",
  },
  notificationContainerSub: {
    display: "flex",
  },
  verticalBorder: {
    height: 60,
    marginRight: 10,
  },

  redColor: {
    color: "#f0a92e",
  },
  blueColor: {
    color: "rgba(26,62,191,0.84)",
  },
  redBRColor: {
    borderRight: "3px solid #f0a92e",
  },
  blueBRColor: {
    borderRight: "rgba(26,62,191,0.84)",
  },

  icon: {
    padding: 3,
    borderWidth: 1,
    margin: "8px 14px 0px 8px",
    borderRadius: "50%",
    color: "#ffffff",
    width: 36,
    height: 36,
  },
  iconFont: {
    fontSize: "23px",
    marginTop: "3px",
    marginLeft: "3px",
  },
  // cancelIcon: {
  //     position: "absolute",
  //     top: 0,
  //     right: 6,
  //     fontSize: "1.1rem",
  // },
  cancelIcon: {
    top: "25px",
    right: "30px",
    position: "absolute",
    fontSize: "1.1rem",
    color: "#0071d2",
  },
  notificationTitle: {
    margin: 0,
    whiteSpace: "normal",
    fontSize: 15,
    fontWeight: 600,
    textDecoration: "none",
    letterSpacing: 1,
    lineHeight: 1.66,
    color: theme.palette.primary.main,
  },
  notificationDesc: {
    margin: 0,
    whiteSpace: "normal",
    color: theme.palette.primary.main,
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: 1.5,
  },
  notificationSubCont: {
    flexDirection: "column",
    flexGrow: 1,
    display: "flex",
    marginTop: 4,
  },
  notificationFooterCont: {
    padding: "3px 0px 0px 8px",
    minHeight: 48,
    display: "flex",
    flexDirection: "column",
  },
  notificationFooter: {
    display: "flex",
    flexGrow: 1,
    marginTop: "auto",
  },
  notificationFooterTitle: {
    padding: 0,
    margin: 0,
    fontSize: "14px",
    flexGrow: 1,
    lineHeight: 1,
    color: theme.palette.primary.main,
  },
  notificationFooterButton: {
    fontSize: 10,
    alignSelf: "flex-end",
    borderRadius: 3,
    textTransform: "uppercase",
    fontWeight: 600,
    letterSpacing: 1,
  },
  time: {
    fontSize: 11,
    padding: 0,
    margin: 0,
    color: theme.palette.text.secondary,
  },
  drawerOpenRightBar: {
    width: drawerWidth,
    marginRight: 60,
    // overflow:"hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down("sm")]: {
      width: drawerWidth,
      marginRight: 60,
    },
    [theme.breakpoints.down("xs")]: {
      width: "35%",
      marginRight: 60,
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
      width: 60,
    },
    paddingLeft: 2,
  },
  noHover: {
    "&:hover, &:focus": {
      backgroundColor: "transparent",
    },
  },
  setHeight: {
    height: "90vh",
  },
  rightDiv: {
    display: "flex",
    alignItems: "flex-end",
  },
  text: {
    marginRight: 7,
    cursor: "pointer",
  },
  clearBtn: {
    fontSize: "0.75rem",
    padding: "inherit",
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
  });
};
