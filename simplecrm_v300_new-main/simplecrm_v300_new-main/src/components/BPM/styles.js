import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
export default makeStyles((theme) => ({
  root: {
    width: "100%",
    padding:"15px",
  },
  spinner: {
    marginRight: 5,
    position: "relative",
    color:"black"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  headerBackground: {
    background: "rgba(0, 0, 0, 0.03)",
  
  },
  accordionBox: {
    border: "none",
  },
  detailViewStepper:{
    padding: "15px 15px 15px 35px",
        backgroundColor: "rgb(0 0 0 / 2%)",
        borderRadius: "3px",
        boxShadow: "3px 3px 5px -5px #00000059",
        border: "solid 1px #dddddd5c",
        width: "100%",
  },  
  bpmRecordTitle:{
    width: '100%',
  },
  contentHeight:{
    height: "80vh !important", 
    [theme.breakpoints.down("sm")]: {
        height: "89vh !important",
    },
  }
}));

export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {
      MuiAccordionSummary:{
        content:{
          margin: "0!important",  
          "&.Mui-expanded":{
            margin: "0!important",  
          }
        },
        root:{
          minHeight:"auto!important",
          margin:"16px 0 0",
          "&.Mui-expanded":{
            minHeight:"auto!important",
          }
        }
      },
      MuiAccordionDetails:{
        root:{
          padding:"15px!important"
        },
      },
      MuiPaper:{
        root:{
          marginTop:"0px",
        },
      },
      MuiGrid:{
        root:{
          padding:"0px!important",
        },
        "grid-xs-2":{
          /*maxWidth: "100%",
          flexBasis: "100%",*/      
        },
        "spacing-xs-3":{
          margin:"0px!important",
          paddingTop: "6px!important",
        },
        "spacing-xs-3:last-child":{
          margin:"0px!important",
          paddingTop: "0px!important",
        }
      },
      MuiTypography:{
        "subtitle2":{
          fontWeight:"600!important"
        }
      },
      MuiIconButton:{
        root:{
          padding:"5px 10px 5px 5px"
        }
      },
      MuiStepContent:{
        root:{
          padding: "5px 15px",
          boxShadow: "3px 3px 5px -5px #00000059",
          borderLeft: "none!important",
          marginLeft: "0px!important",
          backgroundColor: "rgb(0 0 0 / 2%)",
          border:"solid 1px #dddddd5c"
        }
      },
      MuiStepConnector:{
        lineVertical:{
          borderLeft:"0px!important"
        },
      },
      ReactRibbons_leftLargeRibbonText_1SAojwHIrk8Rz0e2pG0aF_:{
        fontSize:"0.7em!important"
      },
      MuiListItem:{
        secondaryAction:{
          padding:0
        }

      },
      MuiStepIcon:{
        text:{
          fill:"#fff",
        }

      }
    },
    
    
  })
}