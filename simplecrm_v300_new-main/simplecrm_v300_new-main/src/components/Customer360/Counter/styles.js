import { makeStyles } from "@material-ui/styles";
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
export default makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  // paper: {
  //   padding: theme.spacing(2),
  //   textAlign: 'center',
  //   color: theme.palette.text.secondary,
  // },
  topRow: {
    minHeight: 105,
    textAlign: 'center',
    padding: 10,
    wordBreak: 'break-word',
    borderRadius:'10px',
    border: "unset",
    // borderLeft: "3px solid "+theme.palette.primary.main,
    color:'white',
  },



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