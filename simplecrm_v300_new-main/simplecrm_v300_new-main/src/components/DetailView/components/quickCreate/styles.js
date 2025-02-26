import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles(theme => ({
  // root: {
  //   flexGrow: 1,    
  // },
  topBorderDialog:{
    borderTop: theme.palette.primary.main + ' solid 3px',
  },
  dialogTitle: {
    //padding: theme.spacing(2),
    margin: 'auto',

  },
  paperEdit: {
    padding: theme.spacing(2),
    margin: 'auto',
    paddingTop: 0,



    // marginTop: theme.spacing(1),
  },
  margin: {
    marginLeft: theme.spacing(1),
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
  errorColor: {
    color: 'red'
  },
  mobileLayoutFormHt : {
    [theme.breakpoints.down("xs")] : {
      height: "100%",
    },
  },
  mobileLayoutMaxHt : {
    
    [theme.breakpoints.down("xs")] : {
      maxHeight: "100% !important",
    },
    "& > div" : {
      [theme.breakpoints.down("xs")] : {
        maxHeight: "100% !important",
      },
    }
  },
}));

export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {
      MuiDialog:{
        paper:{
          borderTop: selectedTheme.palette.primary.main + ' solid 3px',
          overflowY: "hidden",
          },
      },
      MuiDialogContent:{
        root:{
          padding:0
        }
      },
      MuiButton:{
        containedPrimary:{
          color:"#ffffff",
        }
      },
      MuiPaper:{
        elevation1:{
          boxShadow:'none'
        }
      },
      MuiAccordion: {
        root: {
          "&$expanded": {
            border: "1px solid #cccccc",
          }
        },
        rounded: {
          "&:first-child": {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
          },
          "&$expanded": {
            border: "1px solid #cccccc43"
          },
        }
      },
      MuiAccordionSummary: {
        root: {
          "&$expanded": {
            margin: "0 !important",
            minHeight: "100% !important",
          },
          "&$selected": {
            color: "#536dfe",
          },
        },
        content: {
          "&$expanded": {
            margin: "0 !important",
            minHeight: "100% !important",
          },
        }
      },
      MuiDialogTitle:{
        root:{
          paddingTop:"5px !important"
        }
      }
    },

  })
}