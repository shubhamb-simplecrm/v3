import { makeStyles } from '@material-ui/styles'
import { red } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'
export default makeStyles((theme) => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    // backgroundColor: theme.palette.background.paper,
  },
  listItem:{
    borderLeftStyle:"solid",
    borderLeftWidth:5,
    paddingLeft:5
  },
  inline:{
    fontWeight:"bold",
    color:"black",
    fontSize:10,
  },
  inlineGrey:{
    color:"grey",
    fontSize:10,
    padding:"0px 5px"
  },
  inlineGrey1:{
    color:"grey",
    fontSize:10,
    paddingRight:"5px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap", 
    width: "242px",
    overflow:"hidden",
  },
  eyeIcon:{
    color:"#0e318f"
  },
  block:{
    width:"500px"
  }
  
}))

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
     
      MuiListItem:{
        dense:{
          padding:0
        }
      },
      MuiList:{
        root:{
          paddingTop:"0px!important",
          paddingBottom:"0px!important",
        }
      },
      MuiListItem: {
        gutters: {
          paddingLeft: 10,
          borderBottom: '1px solid #ccc',
        },
        container: {
          borderBottom: '1px solid #ccc',
        },
      },
    },
  })
}
