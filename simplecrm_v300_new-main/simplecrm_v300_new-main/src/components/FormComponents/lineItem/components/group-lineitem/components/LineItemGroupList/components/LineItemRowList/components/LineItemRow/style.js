import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  lineItemBox:{
    //boxShadow: "rgb(0 0 0 / 5%) 0px 0px 0px 1px",
    boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
padding: 15,
marginBottom: 15
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
  collapseBox: {
    width: '100%'
  },
  collapseCardContent: {
    padding: 0
  }

}));


export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiInput: {
        root: {
          paddingTop: '8px !important',
          [theme.breakpoints.down("sm")]: {
            paddingTop: '7px !important',
            marginTop: '14px !important',
          },
        }
      },
      MuiInputBase: {
        root: {
          fontSize: '12px'
        }
      },
      MuiInputLabel: {
        root: {
          fontSize: '14px',
          marginBottom: '5px'
        }
      },
    },
  })
};