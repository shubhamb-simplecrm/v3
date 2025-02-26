import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles(theme => ({
  root: {
    flexGrow: 1,    
  },
  topBorderDialog:{
    borderTop: theme.palette.primary.main + ' solid 3px',
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',

  },
  paperEdit: {
    padding: theme.spacing(2),
    margin: 'auto',
    paddingTop: 0,



    // marginTop: theme.spacing(1),
  },
  margin: {
    marginLeft: theme.spacing(1),
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
  errorColor: {
    color: 'red'
  },


}));

export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {
      MuiDialog:{
        paper:{
          borderTop: selectedTheme.palette.primary.main + ' solid 3px',
          },
      },
      MuiButton:{
        containedPrimary:{
          color:"#ffffff",
        }
      }
    },

  })
}