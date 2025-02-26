import { makeStyles } from "@material-ui/styles";
import {  colors} from '@material-ui/core';
import { createMuiTheme } from "@material-ui/core/styles";


export default makeStyles(theme => ({
  showButtons:{
    color:'white',
    textDecoration:'none'
  }
}))

export const getMuiTheme = (selectedTheme) => {
    return createMuiTheme({
      ...selectedTheme,
      overrides: {
        MuiCardContent:{
          root:{
            // padding: selectedTheme.palette.primary.main + ' solid 3px',
            },
        },
        MuiDialog:{
          paper:{
            borderTop: selectedTheme.palette.primary.main + ' solid 3px',
            },
        },
   
      },
  
    })
  }


  