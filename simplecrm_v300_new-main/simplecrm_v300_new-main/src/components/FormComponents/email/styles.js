import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";


export default makeStyles((theme) => ({
  emailField:{
    marginBottom:10
  },
  adornment: {
    padding: 0,
    margin: 0,
    cursor: "pointer",
  }
}));


export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiInputAdornment: {
        positionStart: {
            color:"#ccc",
            padding: 0,
            margin: 0,
            cursor: "pointer",
        },
      },
      MuiRadio: {
       root: {
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:959.95px)"]: {
            padding: "3px 9px",
          }
        }
      },
      MuiListItem: {
        dense: {
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:959.95px)"]: {
            padding: "0px 16px",
          }
          
        }
      } 
    },
  });
}
