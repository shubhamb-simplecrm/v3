import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  fileName: {
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  removeBtn: {
    display: "flex",
    justifyContent: "flex-end",
    cursor: "pointer",
    color: "blue",
    marginRight: "0.4rem",
  },
  errorFile:{
    color: "red",
    borderColor:"red"
  },
  error: {
    display: "flex",
    justifyContent: "flex-start",
    color: "red",
    marginLeft: "0.4rem",
    fontSize:'0.75rem'
  },
}));
