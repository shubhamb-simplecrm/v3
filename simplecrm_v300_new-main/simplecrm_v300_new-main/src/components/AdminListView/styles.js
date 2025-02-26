import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  brandLogoBar: {
    background: theme.palette.background.paper,
    padding: "10px 10px 0px 10px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    paddingBottom: "14.5px"
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
  }

}));

export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {
    },
  });
};
