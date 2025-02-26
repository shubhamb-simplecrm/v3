import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  primaryText: {
    color: theme.palette.primary.main,
    cursor: "pointer",
    fontSize: "0.93rem",
    textDecoration: "none",
    float: "left",
  },
  //ShrinkedList
  list: { padding: "0px", overflowX: "hidden" },
  listAvatar: {
    paddingLeft: "2px",
    paddingBottom: "3px",
    minWidth: "fit-content",
    paddingRight: "10px",
    cursor:"pointer"
  },
  listItem: {
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "rgb(245,245,245,0.7)",
    },
  },
  link: {
    textDecoration: "none",
  },
}));
