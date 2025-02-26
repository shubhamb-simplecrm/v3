import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  dashLetCardRoot: {
    height: "100%",
    borderRadius: 7,
    boxShadow: "none",
  },
  dashLetCardContentRoot: {
    [theme.breakpoints.down("sm")]: {
      backgroundColor: theme.dashletHeader.background,
    },
    boxShadow: "none",
    padding: "0px",
    height: "100%",
    overflow: "auto",
    "&:last-child": {
      paddingBottom: 60,
    },
  },
  curPointMobileLayout: {
    padding: "10px 5px",
    [theme.breakpoints.down("xs")]: {
      cursor: "pointer",
    },
  },
  iconBtn: {
    background: theme.palette.primary.main + "20",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "2rem",
    height: "2rem",
    width: "2rem",
  },
  dashLetHeaderTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    "& a": {
      color: theme.palette.primary.main,
      textDecoration: "none",
    },
  },
  dashLetHeader: {
    backgroundColor: theme.dashletHeader.background,
    color: theme.palette.primary.main,
    padding: "0.5rem",
    // borderBottom: theme.palette.text.primary + ' groove 0.1px'
    " & svg": {
      width: "0.8em",
      height: "0.8em",
    },
  },
}));
