import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  content: {
    fontSize: "0.9rem",
    fontWeight: "400",
    wordWrap: "break-word",
    "& div": {
      width: "auto",
    },
    padding: "0px",
  },
  link: {
    textDecoration: "none",
    color: theme.palette.activityStream.link,
    fontSize: "0.875rem",
  },
  activityTime: {
    fontSize: "0.75rem",
    fontWeight: "400",
    paddingBottom: "5px",
  },
  icon1: {
    color: theme.palette.icon.defaultColor,
    padding: "0px 5px 0px 0px",
  },
  paper: {
    padding: "10px",
    maxWidth: "34ch",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "27ch",
      minWidth: "27ch",
    },
  },
  icon: {
    padding: "0px",
    color: theme.palette.icon.defaultColor,
  },
  timelineFlex: { flex: 0, padding: 0 },
}));
