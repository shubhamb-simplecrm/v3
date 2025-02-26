import { colors } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  eyeIcon: {
    cursor: "pointer",
    padding: "2px",
  },
  forwardIcon: {
    cursor: "pointer",
    padding: "2px",
    transform: "rotate(90deg)",
  },
  actionIcon: {
    cursor: "pointer",
    padding: "3px",
    color: "rgb(117,117,117,0.8)",
  },
  printIcon: {
    cursor: "pointer",
    padding: "1px",
    color: "rgb(117,117,117,0.8)",
  },
  icon: {
    cursor: "pointer",
    padding: "1px",
  },
  starFilledIcon: {
    color: colors.amber[400],
  },
  emailBody: {
    padding: "10px 30px 0px 30px",
    overflowX: "scroll",
  },
  scroll: {
    overflow: "scroll",
    height: "92%",
  },
  divider: { margin: "0px 29px" },
  avatar: {
    padding: "5px",
    fontSize: "1.7rem",
    width: "60px",
    height: "60px",
    opacity: "1",
    zIndex: 999,
    margin: "10px 0px",
  },
  date: { fontSize: "0.75rem", color: "#909091" },
  mobileDate: { fontSize: "0.75rem", padding: "10px 0px" },
  toAddr: {
    fontSize: "0.8rem",
    padding: "0px",
    margin: "0px",
    color: "rgb(41,41,41,0.85)",
  },
  mailChip: {
    padding: "1px 7px",
    border: "1px solid #0071d2",
    borderRadius: "15px",
    marginLeft: "5px",
    wordBreak: "break-all",
  },
  menuItem: {
    fontSize: "0.8rem",
    padding: "2px 8px 2px 3px",
    cursor: "context-menu",
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&:focus": {
      backgroundColor: "transparent",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "transparent",
      },
    },
  },
  moreMails: {
    color: theme.palette.primary.main,
    paddingLeft: "6px",
    cursor: "pointer",
  },
  subject: {
    fontSize: "1.4rem",
    fontWeight: "bolder",
    paddingBottom: " 8px ",
    margin: "0px",
  },
  fromAddr: {
    fontSize: "0.8rem",
    padding: "0px 0px 5px 0px",
    margin: "0px",
    color: "rgb(41,41,41,0.85)",
  },
  header: { padding: "25px 0px 25px 30px" },
  mobileHeader: { padding: "15px" },
  emailDetail: {
    height: "83vh",
    padding: "10px 35px 10px 20px",
  },
  mobileEmailDetail: {
    height: "100%",
    padding: "0px",
  },
  emailDetailBox: {
    backgroundColor: "#ffffff98",
    border: "1px solid lightgray",
    borderRadius: "10px",
    height: "100%",
  },
  mobileEmailDetailBox: {
    backgroundColor: "#ffffff98",
    border: "none",
    borderRadius: "0px",
    height: "100%",
  },
  toolbar: { padding: "5px 10px 6px 5px", display: "flex", gap: "5px" },
  infoFields: { paddingBottom: "8px" },
  attachments: {
    padding: "1.5px 10px",
    borderRadius: "20px",
    backgroundColor: "rgb(223,237,249, 1)",
    margin: "5px",
    float: "left",
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    fontSize: "0.75rem",
  },
}));
