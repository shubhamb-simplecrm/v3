import { makeStyles } from "@material-ui/styles";
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
export default makeStyles(theme => ({
  inline: {
    display: 'inline',
    wordBreak: 'break-word',
    fontSize:"1rem"
  },
  label: {
    fontWeight:400,
    fontSize:"0.875rem"
  },
  previewButton:{
    float:'right',
    color:theme.palette.primary.main,
  }
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      
      MuiList:{
        root:{
          paddingTop:"0px!important",
          paddingBottom:"0px!important",
        }
      },
      MuiListItem: {
        root: {
          paddingTop: '0px',
          paddingBottom: '0px'
        },
        gutters:{
          paddingLeft:'10px',
          paddingRight:'10px'
        },


      }, MuiList: {
        padding: {
          paddingTop: '0px',
          paddingBottom: '0px'
        }
      }

    },
  });
}