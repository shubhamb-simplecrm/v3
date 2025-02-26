import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  comment: {
    color:theme.palette.activityStream.comment.color,
    wordWrap: "break-word",
    width: "90%",
    fontSize: "0.8rem",
    margin: "5px 0px",
    padding:"0px"
  },
  commentTime: { fontSize: "0.67rem" },
  deleteIcon: {
    right: "0px",
    color: theme.palette.icon.defaultColor
  },
  tile1:{
    marginBottom: "3px",
    marginTop: "0px",
    backgroundColor:theme.palette.activityStream.comment.background1,
    color: "black",
    padding: "5px 15px 0px 15px"
  },
  tile2:{
    marginBottom: "3px",
    marginTop: "0px",
    backgroundColor:theme.palette.activityStream.comment.background2,
    color: "black",
    padding: "5px 15px 0px 15px"
  },
  username:{
    float: "left",
    fontWeight: "bold",
    fontSize: "0.85rem",
    color:theme.palette.activityStream.comment.username,
  },
}));