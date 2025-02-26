import { fade } from "@material-ui/core/styles/colorManipulator";
import { createMuiTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  root: {},
  brandLogoTitle: {
    fontWeight: "normal",
    color: theme.palette.primary.main,
    cursor: "pointer",
    fontSize: "1.5rem",
  },
  recordGroup: {
    fontSize: "12px",
    color: theme.palette.primary.main,
  },
  buttonGroupCss: {
    "&:hover, &:active": {
      backgroundColor: "none",
      boxShadow: "none",
    },
  },
  mobileLayoutCreateBtn: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginBottom: "5px",
    },
  },
  selectedButtonCss: {
    backgroundColor: fade(theme.palette.primary.main, 0.08),
    boxShadow: "none",
  },
  dateFontMobileLayout: {
    fontSize: "16px",
    fontWeight: "500",
    color: theme.palette.primary.main,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1rem",

      margin: 0,
    },
  },
}));

export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {
      MuiCardContent: {
        root: {
          // padding: selectedTheme.palette.primary.main + ' solid 3px',
        },
      },
    },
  });
};
