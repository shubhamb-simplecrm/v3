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
      MuiList:{
        padding:{
          padding:"8px",
        }
      },
      MuiTypography:{
        body1:{
          fontSize: "12px",
          color: "#fff",
          lineHeight: "20px"
        }
      },
      MuiListItem: {
        container:{
          display: "flex",
          background: "#44546A",
          marginBottom: "8px",
          borderRadius: "8px",
        },
        root:{
          background: "#44546A",
          borderRadius: "8px",
          flexDirection: "column",
          textAlign: "left",
          alignItems: "flex-start",
        },
        gutters: {
          paddingLeft: 10,
        },
      },
      MuiSvgIcon:{
          root:{
              color:"#b2b2b2"
          }
      },
      MuiListItemText:{
        root:{
          margin:"0px!important"
        }
      },
      MuiSwitch:{
        thumb:{
          color:"#FFFFFF"
        }
      },
      MuiButton:{
        contained:{
          background:"#0e318f!important",
          color:"#FFF!important",
        },
        containedSizeSmall:{
          padding: "4px 10px",
          fontSize: "10px",
          minWidth: "auto"
        }
      },
    },
  })
}
