import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({  
  MuiListItemIcon:{
    root:{
      minWidth:40
    }  
  },
  moreActionBtn:{
    color:theme.appbar.text,
  },
  moreActionCaretBtn:{
    color:theme.appbar.text,
    minWidth:25,
    padding:0
  },
  mobileLayoutHeight : {
    [theme.breakpoints.down("xs")] : {
      minHeight : "30px !important",
    }
  },
  listItem:{
    fontSize:"0.8rem"
  }
}));

export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {
      MuiListItemIcon:{
        root:{
          minWidth:40
        }  
      },
      MuiMenuItem:{
        root:{
          paddingBottom:4,
          paddingTop:4,
        }
      },
      MuiListItemText:{
        root:{
          fontSize:"0.800rem",
          marginTop:0,
          marginBottom:0
        }
      },
    },
  })
}

