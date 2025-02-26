import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles(theme => ({
   root: {
    width: "100%",
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
  preFillBtn:{
    margin:"5px 5px 15px 5px"
  },
  btn:{
    color:"#fff"
  }
  
}));


export const getMuiTheme = (theme) =>{
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiDialogContent:{
        root:{
          overflowY:'hidden'
        }
      },
      MuiFormLabel:{
        root:{
          fontSize:"0.875rem"
        }
      },
      
    },
  })};