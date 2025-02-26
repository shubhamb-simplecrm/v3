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
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {},
  });
};
