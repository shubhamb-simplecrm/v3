import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => {
  return {
    root: {
      flexGrow: 1,
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
    paper: {
      // padding: theme.spacing(2),
      margin: "auto",
    },
    paperEdit: {
      padding: theme.spacing(2),
      margin: "auto",
      marginTop: theme.spacing(1),
    },
    margin: {
      marginLeft: theme.spacing(1),
    },
    marginTop: {
      marginTop: theme.spacing(1),
    },
    errorColor: {
      color: "red",
    }, 
    tabButton: {
      //background: theme.palette.divider,
      //borderRadius: "4px",
      //margin: "5px",
      color: theme.palette.text.primary,
      // fontWeight: "bold"
    },
    cstmAction:{
      marginTop:"5px !important",
      marginRight:"-3px !important",
    },
    cstmEditbtn:{
      minWidth:"40px !important",
      margin:"1px",
      padding: "5px 10px",
    },
    tabName: {
      whiteSpace: `nowrap`,
      overflow: `hidden`,
      textOverflow: `ellipsis`,
      fontWeight:"normal"
    },

    breadCrumbWrapper: {
      display: "flex", 
      justifyContent: "space-between", 
      marginBottom: "10px"
    },
    editBtnDet:{
      padding: "4px 20px",
    },
    headerCstm:{
      marginLeft: "0px",
    },
    breadCrumbItem : {
      fontWeight: 'normal', 
      color: theme.palette.primary.main,
      cursor: 'pointer'
    },
    favCustom : {
      display: 'flex',
    },
    isNone: {
      display: 'none',
    },
    favBtn:{
      padding:0
    },
    speedDial: {
      position: 'fixed',
      '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
          bottom: theme.spacing(2),
          right: theme.spacing(8),
          [theme.breakpoints.down("xs")] : {
            right: theme.spacing(4),
          },          
      },
      '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
          top: theme.spacing(3),
          left: theme.spacing(3),
      },
    },
    stepsRed:{
      color: "#121a36",
      backgroundColor: "#D9586A",
      '&::after':{
        content: `''`,
        borderLeftColor:"#D9586A !important",
      }
    },
    stepsBlue:{
      color: "#fff",
      backgroundColor: "#2767A8",
      '&::after':{
        content: `''`,
        borderLeftColor:"#2767A8 !important",
      }
    },
    stepsGreen:{
      color: "#fff",
      backgroundColor: "#5cb85c",
      '&::after':{
        content: `''`,
        borderLeftColor:"#5cb85c !important",
      }
    },
    stepsNone:{
      color: "#121a36",
      backgroundColor: "#92979f",
      '&::after':{
        content: `''`,
        borderLeftColor:"#92979f !important",
      }
    },
    step:{
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    
    },
    steps:{
      
      fontSize: "14px",
      textAlign: "center",
      margin: "5px 3px",
      padding: "5px 5px 5px 25px",
      width: "auto",
      float: "left",
      position: "relative",
      '&:first-child::before':{
        border : "none",
      },
      '&:last-child::after':{
       // border : "none",
      },
      '&::before':{
        content: `''`,
        position: "absolute",
        top: "0",
        // right: "-16px",
        width: "0",
        height: "0",
        borderTop: "18px solid transparent",
        borderBottom: "13px solid transparent",
        // zIndex: "1",
        transition: "border-color 0.2s ease",
        right: "auto",
        left: "0",
        borderLeft: "17px solid "+theme.palette.primary.listview,
        zIndex: "0",
      },
      '&::after':{
        content: `''`,
        position: "absolute",
        top: "0",
        right: "-16px",
        width: "0",
        height: "0",
        borderTop: "18px solid transparent",
        borderBottom: "12px solid transparent",
        borderLeft: "16px solid",
        zIndex: "1",
        transition: "border-color 0.2s ease"
      }
    }
  }
});
export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {
      MuiStepLabel:{
        label:{
          color:"#fff !important",
        },
        active:{
          color:"#fff !important"
        }
      },
      MuiStepper:{
        root:{
          padding:"0px 25px 0px 10px",
          flexWrap:"wrap"
        }
      }
    }
  })
}