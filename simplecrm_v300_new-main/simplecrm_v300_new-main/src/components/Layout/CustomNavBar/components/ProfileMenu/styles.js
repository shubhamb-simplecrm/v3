import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  profileMenuIconSize: {
    padding: 0,
    [theme.breakpoints.down("xs")]: {
      width: 45,
      height: 45,
    },
    "& svg": {
      margin: 0,
    },
    // width: 30,
    // height: 30
  },
  subMenuRoot: {
    color: "#121a36",
    boxShadow: "0px 0px 3px 0.5px rgba(0,0,0,0.25)",
  },
  listItemStyle: {
    color: "#121a36",
  },
  linkIcon: {
    minWidth: "25px",
    color: theme.palette.icon.color,
  },
  fullName: {
    paddingTop: "8px",
    cursor: "pointer",
    color: theme.palette.primary.main,
    textDecoration: "none",
  },
  email: { color: "grey", fontSize: "0.8rem" },
  userDetails: {
    display: "flex",
    justifyContent: "center",
    padding: "15px",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
  },
  btnGrid: { padding: "5px 15px 15px 15px" },
  btn: {
    display: "flex",
    alignItems: "center",
    background: theme.palette.primary.main + "20",
    color: theme.palette.primary.main,
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "0.8rem",
    "&:hover": {
      background: theme.palette.primary.main + "30",
    },
  },
}));
