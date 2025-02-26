import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  noAccessPage: {
    height: "90vh",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  noAccessText: {
    color: "grey",
  },
  brandLogoTitle: {
    fontWeight: "normal",
    color: theme.palette.primary.main,
    cursor: "pointer",
    fontSize: "1.5rem",
  },
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    fontSize: "1rem",
    [theme.breakpoints.down("xs")]: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      display: "block",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: theme.overlayBg.background,
    },
  },
}));

export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {},
  });
};
