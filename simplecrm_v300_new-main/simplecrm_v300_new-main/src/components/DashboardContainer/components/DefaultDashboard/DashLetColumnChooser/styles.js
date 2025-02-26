import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: "50%",
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflowY: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  listHeader: {
    textAlign: "center",
  },
  left: {
    [theme.breakpoints.up("xs")]: {
      display: "inline-block",
    },
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  right: {
    [theme.breakpoints.up("xs")]: {
      display: "inline-block",
    },
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  up: {
    [theme.breakpoints.up("xs")]: {
      display: "none",
    },
    [theme.breakpoints.down("xs")]: {
      display: "inline-block",
    },
  },
  down: {
    [theme.breakpoints.up("xs")]: {
      display: "none",
    },
    [theme.breakpoints.down("xs")]: {
      display: "inline-block",
    },
  },
}));

export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {
      MuiListItem: {
        root: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
      MuiListItemIcon: {
        root: {
          minWidth: 0,
        },
      },
      MuiTypography: {
        body1: {
          fontSize: "0.875rem",
        },
      },
      MuiFormLabel: {
        root: {
          fontSize: "0.875rem",
        },
      },
      PrivateSwitchBase: {
        root: {
          padding: 5,
        },
      },
      MuiPaper: {
        root: {
          // border:"1px solid #ebeaea"
        },
        elevation1: { boxShadow: "none" },
      },
    },
  });
};
