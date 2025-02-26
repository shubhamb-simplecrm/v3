import { makeStyles } from '@material-ui/styles'
import { red } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'
export default makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  listItem: {
    borderBottom: '1px solid #ccc',
  },
  nestedListItem: {
    borderBottom: '1px solid #eeeded !important',
    padding: '5px 0px 0px 15px !important',
  },
  label: {
    color: '#828282',
    fontSize: '0.875rem !important',
  },
  value: {
    fontSize: '1rem !important',
  },
}))

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiListItem: {
        gutters: {
          paddingLeft: 10,
        },
      },
      MuiList:{
        root:{
          paddingTop:"0px!important",
          paddingBottom:"0px!important",
        }
      },
      MuiSvgIcon:{
          root:{
              color:"#b2b2b2"
          }

      }
    },
  })
}
