import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridGap: theme.spacing(3),
  },
  root: {
    minWidth: 275,
  },
  headerBackground: {
    background: "rgba(0, 0, 0, 0.03)",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    marginBottom: theme.spacing(1),
  },
  mobileLayoutHide: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  fieldSpacing: {
    padding: "5px",
    [theme.breakpoints.down("xs")]: {
      overflow: "scroll",
    },
  },
  mobileLayoutFullWidth: {
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  marginBottom: {
    [theme.breakpoints.down("xs")]: {
      marginBottom: 10,
    },
  },
  grandTotalRoot: {
    //boxShadow: "rgb(0 0 0 / 5%) 0px 0px 0px 1px",
    // boxShadow:
    //   "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
    // padding: 15,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    [theme.breakpoints.down("xs")]: {
      alignItems: "stretch",
    },
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  collapseBox: {
    width: "100%",
  },
  collapseCardContent: {
    padding: 0,
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {},
  });
};
