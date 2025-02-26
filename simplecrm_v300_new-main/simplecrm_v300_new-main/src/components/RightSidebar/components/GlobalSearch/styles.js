import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    searchFieldDiv:{
      margin:"20px 0 0 0"  
    },
    searchField:{
        paddingLeft:15,
        zIndex: theme.zIndex.drawer+1
    },
    tabPanel:{
        backgroundColor:"#cccccc26"
    },
    drawerHeaderClose: {
        float: 'right'
    },
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
        MuiTabs: {
          scrollButtons: {
            color: "black",
          },
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
        MuiButtonGroup:{
            groupedTextHorizontal:{
                "&:not(:last-child)":{
                    borderRight:'none'
                }

            },
            grouped:{
                minWidth:"33%"
            }

        }      
    },
  })};