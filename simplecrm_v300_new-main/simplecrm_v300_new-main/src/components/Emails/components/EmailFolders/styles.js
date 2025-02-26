import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";


export default makeStyles((theme) => ({
 root:{

 },
 toolbar:{
  "height": "67px",
  "display": "flex",
  "flexDirection": "column",
  "justifyContent": "center",
  "textAlign": "center",
 }
}));


export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiFormControlLabel:{
        label:{
          paddingLeft:5
        }
      },
      MuiSvgIcon:{
        root:{
         width: "0.8em",
         height: "0.8em",
        }
      },
      MuiTreeItem:{
        content:{
          padding: "3px 8px 3px 0px",
        },
        iconContainer:{
          "& svg":{
            "fontSize":"24px",
          }
        }
      },
      MuiTreeView:{
        root:{
          marginTop:"10px",
        }
      },
    },
  });
}
