import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    
 }));

 export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {
          
    },
  })
}