import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  notFoundContainer: {
    display: "flex",
    alignItems:"center",
    width: "100%",
    height:"100%",
    minHeight: "auto",
  },
  notFoundContainerListView: {
    display: "flex",
    alignItems:"center",
    width: "100%",
    height:"69.4vh",
    minHeight: "auto",
    background:"white"
  },
  notFoundContainerStudio: {
    display: "flex",
    alignItems:"center",
    width: "100%",
    height:"69.4vh",
    minHeight: "auto",
    background:"white"
  },
  iconboxClass: {
    width: "15%",
    "& svg": {
      width: "200px",
      height: "200px",
      color: "#B9B9B9",
    },
  },
  textboxClass: {
    width: "100%",
    padding:"20px",
    textAlign: "center",
    "& svg": {
      width: "50px",
      height: "50px",
      color: "#ccc",
    },
    "& h1": {
      margin: "0px",
      fontSize: "46px",
      color: "#121a3670",
    },
    "& h2": {
      margin: "0px",
      fontSize: "23px",
      color: "#9b9b9b",
      fontWeight: 400,
    },
    "& p": {
      fontSize: "16px",
      margin: "8px 0px 5px 0px",
    },
  },
  listViewTextboxClass: {
    width: "100%",
    padding:"20px",
    textAlign: "center",
    "& svg": {
      width: "200px",
      height: "200px",
      color: "#ccc",
    },
    "& p": {
      fontSize: "16px",
      margin: "8px 0px 5px 0px",
    },  
  },
  studioTextboxClass: {
    width: "100%",
    padding:"20px",
    textAlign: "center",
    "& svg": {
      width: "220px",
      height: "220px",
      color: "#ccc",
    },
    "& p": {
      margin: "8px 0px 5px 0px",
      fontSize: "1rem",
      color: "gray",
      width: "100%",
    },  
  },
}));
