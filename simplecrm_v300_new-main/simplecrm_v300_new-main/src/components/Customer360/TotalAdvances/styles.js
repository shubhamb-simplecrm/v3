import { makeStyles } from "@material-ui/styles";
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
export default makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  topRow: {
    height: "64px",
    
    padding: 10,
    wordBreak: 'break-word',
    borderRadius:'10px',
    border: "unset",
    // borderLeft: "3px solid "+theme.palette.primary.main,
    color:'white',
    backgroundColor: "rgb(54, 69, 79)"
  },
  iconButton:{
    textAlign:'Right'
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  }

}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
    MuiPaper:{
      elevation1:{
        boxShadow:'none'
      },
      rounded:{
        borderRadius:0
      }
    },
    MuiSvgIcon:{
      root:{
        width: "0.8em",
        height: "0.8em"
      }
    },
    MuiTypography:{
      body1:{
        fontSize:"0.875rem"
      },
      body2:{
        fontSize:"0.675rem"
      }

    }
      
    },
  });
}