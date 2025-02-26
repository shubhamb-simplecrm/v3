import { makeStyles } from "@material-ui/styles";
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
export default makeStyles(theme => ({
  root: {
    // margin:"15px"
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
    backgroundColor: red[500],
    width:30,
    height:30
  },
  pagination:{
    marginTop:"8px",
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
        '&:last-child':{
          paddingBottom:0
        }
      },
      MuiCardHeader: {
        root: {
          borderBottom: '1px solid #ccc',
          padding: '5px 10px'
        },
        title:{
          fontWeight:600,
          color:"rgb(29,174,239)",
          fontSize:"1rem"
        }
      },
      MuiCard: {
        root: {
          height: '100%'
        }
      },
      MuiPaper:{
        elevation1:{
          boxShadow:'none'
        }
      }
    },
  });
}