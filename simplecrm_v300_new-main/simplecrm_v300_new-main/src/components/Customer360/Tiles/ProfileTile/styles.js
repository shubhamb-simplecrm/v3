import { makeStyles } from "@material-ui/styles";
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
export default makeStyles(theme => ({
  inline: {
    display: 'inline',
    wordBreak:'break-word'
  },
  label:{
fontWeight:400,
fontSize:"0.875rem"
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    
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
      MuiCardContent: {
        root: {
          padding: '0px'
        },

      },
      MuiCardHeader: {
        root: {
          borderBottom: '1px solid #ccc',
          padding:'5px 10px'

       
        }
      },
      MuiCard: {
        root: {
          height: '100%'
        }
      },
      MuiListItem:{
        gutters:{
          paddingLeft:'10px',
          paddingRight:'10px'
        }
      }

    },
  });
}