import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  phoneLink: {
    color: theme.palette.primary.main,
    textDecoration: "none",
  },
  emailLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    fontSize: "1rem",
    [theme.breakpoints.down("md")]: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      display: "block",
    },
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {},
  });
};
