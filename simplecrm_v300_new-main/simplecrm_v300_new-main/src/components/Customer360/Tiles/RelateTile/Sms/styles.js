import { makeStyles } from '@material-ui/styles'
import { red } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'
export default makeStyles((theme) => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    // backgroundColor: theme.palette.background.paper,
  },
}))

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
