import { makeStyles } from "@material-ui/styles";
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
export default makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
   justifyContent: "right",
   ["@media (max-width: 600px)"]: {
    justifyContent:"left",
    marginLeft:"5px",
  },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  topRow: {
    width: "32%",
    marginTop: "10px",
    marginRight: "10px",
    padding: "15px 0px",
    borderRadius:'5px',
    border: "unset",
    color:'white',
    textAlign:"center",
    display:"block",
    ["@media (max-width: 600px)"]: {
      marginRight: "5px",
      height: "100px", 
  },
  },
  iconButton:{
    textAlign:'Right'
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  
  noData: {
    marginTop: "5px",
    marginLeft:"10px",
    float: "left",
  },
  icon:{
    textAlign:"center",
    width:"30px",
    height:"30px",
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