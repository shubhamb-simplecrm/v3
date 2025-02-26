import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles(theme => ({
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
      }
    },
  })};