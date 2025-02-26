import { makeStyles } from "@material-ui/styles";
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
export default makeStyles((theme) => ({
  
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      
      MuiButton:{
        containedPrimary:{
          color:"#ffffff"
        }
      }
    },
  });
};
