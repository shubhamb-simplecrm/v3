import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  root: {
   // maxWidth: 345,
  },
  
}));

export const getMuiTheme = (theme) =>{
  return createMuiTheme({
    ...theme,
    overrides: {
        
        
    },
  })};