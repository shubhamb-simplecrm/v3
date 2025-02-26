

import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";


export default makeStyles((theme) => ({

    root: {
        flexGrow: 1,
        width: '100%',
        // backgroundColor: theme.palette.background.paper,
        overflow:'hidden',
      
      },
      RightBadge:{
         padding:'1px',
      },
      badgeColor:{
          color:'white'
      },
      activityTab:{
          // marginTop:'10px',
          // position:'initial !important',
          // borderBottom:'unset'

      },
      tabpanelBox:{
          padding:'5px',
      },
      rightBarHeader:{
        borderBottom:'1px solid #ccc'
      },
      flexContainer:{
        borderBottom:'unset !important'
      }
    }));


    export const getMuiTheme = (selectedTheme) => {
        return createMuiTheme({
          ...selectedTheme,
          overrides: {
            MuiTabs:{
              root:{
                scroller:{
                flexContainer:{
                  borderBottom:'unset !important'
                }
              }
                  },
            },
            // MuiTab:{
            //     root:{
            //      marginBottom:'3px'
                 
            //       },
            //   },
          },
      
        })
      }