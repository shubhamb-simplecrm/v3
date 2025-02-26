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
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    marginBottom: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  fieldSpacing: {
    padding: "5px",
    [theme.breakpoints.down("xs")]: {
      overflow: "scroll",
    },
  },
  errorColor: {
    color: "red",
  },
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  text: {
    fontSize: "1rem",
    paddingLeft: "0px !important",
  },
  text2: {
    fontSize: "0.875rem",
    fontWeight: "normal",
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
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    fontSize: "1rem",
    whiteSpace: "normal",
    wordWrap: "break-word",
  },
  textStyle: {
    textDecoration: "none",
    whiteSpace: "normal",
    wordWrap: "break-word",
    overflow: "auto",
  },
  photo: {
    maxWidth: 200,
  },
  statusBg: {
    borderRadius: "2px",
    textTransform: "uppercase",
    fontSize: "10px",
    fontWeight: "600",
    letterSpacing: "1px",
    paddingRight: "12px",
    paddingLeft: "12px",
  },
  fileNameLinkTxt: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    fontSize: "1rem",
    width: "250px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  mobileLayoutSpacing: {
    [theme.breakpoints.down("xs")]: {
      margin: "0px -12px",
    },
  },
  mobileLayoutPadding: {
    [theme.breakpoints.down("xs")]: {
      padding: "0px 4px !important",
    },
  },
  mobileLayoutHide: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  mobileLabelLayoutPadding: {
    [theme.breakpoints.down("md")]: {
      paddingRight: "10px !important",
    },
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiIconButton: {
        root: {
          padding: "0px 12px",
        },
      },
      MuiTypography: {
        subtitle2: {
          color: theme.palette.label.detailView.color + " !important",
        },
      },
    },
  });
};
