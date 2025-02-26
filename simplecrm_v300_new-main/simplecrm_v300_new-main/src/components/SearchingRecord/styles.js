import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  notFoundContainer:{
    display:"flex",
    width:"100%"
  },
  iconboxClass:{
    width:"15%",
    "& svg":{
      width:"200px",
      height:"200px",
      color:"#0071d2",
    },
  },
  textboxClass:{
    width:"100%",
    padding:"50px 50px 10px 50px",
    textAlign:"center",
    "& svg":{
      width:"50px",
      height:"50px",
      color:"#ccc",
    },
    "& h1":{
      margin:"0px",
      fontSize: "46px",
      color:"#121a3670",
    },
    "& h2":{
      margin:"0px",
      fontSize: "20px",
      color:"#0071d2",
      fontWeight:"400"
    },
    "& p":{
      fontSize:"14px",
      margin:"8px 0px 5px 0px"
    },
  },
}));
