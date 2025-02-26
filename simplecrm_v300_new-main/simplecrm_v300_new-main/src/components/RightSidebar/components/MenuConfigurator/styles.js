import { makeStyles } from "@material-ui/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
 
  buttons: {
    color: "#fff",
    textDecoration: "none",
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiDialogContent:{
        root:{
          paddingRight:"0",
          paddingLeft:"0",
        }
      },
      MuiDialogActions:{
        root:{
          justifyContent:"center"
        }
      }
    },
  });
};
