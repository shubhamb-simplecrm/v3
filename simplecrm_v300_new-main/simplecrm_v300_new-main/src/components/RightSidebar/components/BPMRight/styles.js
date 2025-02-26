import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    searchFieldDiv:{
      margin:"20px 0 0 0"  
    },
    searchField:{
        paddingLeft:15
    },
    tabPanel:{
        backgroundColor:"#cccccc26"
    },
    drawerHeaderClose: {
        float: 'right'
    },
    headingText:{
        color:theme.palette.primary.main,
        fontSize: "1.5rem",
        padding: "10px 15px",
        borderBottom: "#ccc solid 1px",
    }
}));

export const getMuiTheme = (theme) =>{
  return createMuiTheme({
    ...theme,
    overrides: {
       
        MuiBadge:{
            colorPrimary:{
                color:"#fff"
            }
        },
        MuiTab:{
            root:{
               padding:"0 18px",
               // eslint-disable-next-line no-useless-computed-key
               ["@media (min-width:600px)"]:{
                   minWidth:"auto"
               }
            }
        },
        MuiPaper:{
            elevation4:{
                boxShadow:'none'
            }
        },
        MuiInput:{
            underline:{
                "&:before,&:hover,&:focus,&:after,&:hover&:not(Mui-disabled)&:before":{
                    borderBottom:'none'
                }
            }
        },      
    },
  })};