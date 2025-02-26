import { makeStyles } from "@material-ui/styles";
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
export default makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
   justifyContent: "right",
   padding:"0px 14px",
   
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  topRow: {
    height: "30px",
    width: "100px",
    marginTop: "10px",
    marginRight: "10px",
    padding: 5,
    // wordBreak: 'break-word',
    borderRadius:'5px',
    border: "unset",
    // borderLeft: "3px solid "+theme.palette.primary.main,
    color:'white',
    // backgroundColor: "rgb(54, 69, 79)"
  },
  cross: {
    height: "30px",
    width: "30px",
    marginTop: "10px",
    marginRight: "10px",
    // padding: "5px",
    borderRadius:'5px',
    border: "unset",
    color:'white',
    // paddingRight: "5px"
  },
  iconButton:{
    textAlign:'Right'
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  text:{
    paddingLeft:"13px",
    paddingRight:"13px",
    //fontSize:"10px",
    // ["@media (max-width: 600px)"]: {
    //   visibility:"hidden",
    // },
  },
  heading:{
    color: "rgb(0,0,0)", paddingTop:"15px", fontSize:"15px", fontWeight:"bold", paddingLeft:"20px",["@media (max-width: 600px)"]: {
      paddingLeft:"0px",
      },
  },
  btn:{
    color:"white",
    backgroundColor:"rgb(0,164,231)",
    marginTop:"15px",
    marginRight:"3px",
    paddingLeft:"18px",
    color:'white',
    textDecoration:'none',
     ["@media (max-width: 600px)"]: {
      width:"100px",
      paddingLeft:"1px",
    },
    hover:"none",
  },
  // btn1:{
  //   color:"white",
  //   backgroundColor:"rgb(0,164,231)",
  //   marginTop:"15px",
  //   marginRight:"3px",
  //   paddingLeft:"18px",
  //   visibility:"hidden",
  //    ["@media (max-width: 600px)"]: {
  //     visibility:"visible",
  //   },
  // },
  closeIcon:{
    marginTop:"15px",
    padding:"5px 7px 0px 7px",
    color:"white",
    borderRadius:"3px",
    backgroundColor:"rgb(0,164,231)",
    cursor:"pointer"
  },
  buttons:{
      // position:"relative",
      // left:"580px"
      // textAlign:"right"
      justifyContent:"end",
  },

}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
    MuiPaper:{
      elevation1:{
        boxShadow:'none'
      },
      rounded:{
        borderRadius:0
      }
    },
    MuiSvgIcon:{
      root:{
        width: "0.8em",
        height: "0.8em"
      }
    },
    MuiTypography:{
      body1:{
        fontSize:"0.875rem"
      },
      body2:{
        fontSize:"0.675rem"
      }

    }
      
    },
  });
}