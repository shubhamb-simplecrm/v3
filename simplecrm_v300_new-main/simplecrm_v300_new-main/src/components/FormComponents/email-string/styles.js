import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  emailLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    fontSize: "1rem",
    cursor: "pointer",
    wordWrap: "break-word",
    overflowX: "scroll",
    width: "100%",
  },
  invalidEmailLink: {
    color: theme.palette.secondary,
    textDecoration: "line-through",
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {},
  });
};
