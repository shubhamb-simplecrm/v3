import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  tileBox: {
   
    border: '1px solid #ccc',
     margin: '5px',
    // borderTop: theme.palette.primary.main + ' solid 3px !important',
    
},
 
  topButtons: {
    margin: theme.spacing(1),
    float:'right',
    color:'white'
  },
  topButtonClose:{
    position:'absolute',
    right: 0,
    top: 0,
    // color:'white'
    padding:"5px !important"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.overlayBg.background,
  },
  header : {
    backgroundColor:"#E5E5E5",
    display: "flex",
    justifyContent: "space-between", 
    [theme.breakpoints.down("sm")] : {
      flexDirection: "column"
    }
  },
  headerButtonsCont: {
    marginTop: 12,
    marginRight: 50,
  },
  content:{
    backgroundColor:"#E5E5E5",
    overflow:"hidden",
    padding: "0px",
    margin:"0px"

  },
  leftCustomerInfo:{
    backgroundColor:"rgb(122,31,127)",
    // height:'100%',
  },
  headingInfo:{
    visibility:"visible",
    margin:" 15px 0px",
    // ["@media (max-width: 600px)"]: {
    //   visibility:"visible",
    // },
  },
  headingInfo1:{
    visibility:"visible",
    ["@media (max-width: 600px)"]: {
      visibility:"hidden",
    },
  },    
  rightSide:{
    backgroundColor:theme.overlayBg.background,
  },
  topRightSide:{
    // height:"170px",
    ["@media (max-width: 600px)"]: {
      // height: "190px",
      },
  },
  pointTiles:{
    ["@media (max-width: 600px)"]: {
      // height: "auto",
    },
  },
  bottomRightSide:{
    backgroundColor:'white',
    // height:"100%",
  },
  eyeIcon:{
    
    cursor:"pointer",
   color: "#0e318f"
  },
  divider:{
    borderTop:"1px solid rgb(0,0,0)",
    borderBottom:"1px solid rgb(0,0,0)",
    fontSize:"12px",
  },
  shopping:{
    backgroundColor:"rgb(58, 77, 247)",
    color:"white",
    borderRadius:"50%"
  },
  relase:{
    backgroundColor:"rgb(255,0,0)",
    color:"white",
    borderRadius:"50%"
  },
  split:{
    backgroundColor:"rgb(0,164,231)",
    color:"white",
    borderRadius:"50%"
  },
 fliter:{
    backgroundColor:"rgb(181,164,247)",
    color:"white",
    borderRadius:"50%"
  },
  tile:{
    paddingLeft:"10px",
    paddingRight:"10px",
    marginBottom:20
  },
  quickCreate:{
    padding:"10px"
  }
 
 
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiTypography:{
        root:{
          fontSize:12
        }
      },
      MuiDialogContent:{
        root:{
          padding:'0px',
        }
      },
      MuiDialogTitle: {
        root: {
          paddingBottom: "0px",
        },
      },
      MuiAlert:{
        message:{
          width:'100%'
        }
      },
      MuiPaper:{
        elevation1:{
          boxShadow:'none !important'
        }
      },
      MuiDialog:{
        paperScrollPaper:{
          // maxHeight:"calc(100% - 30px)"
        }
      }
      
      
    },
  });
}