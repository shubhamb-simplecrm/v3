import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  root:{
    flexGrow: 1,
      width: "100%",
      backgroundColor: theme.palette.background.paper,
  },
  spinner: {
    marginLeft: 15,
    position: "relative",
    top: 4,
  },
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    fontSize:'0.875rem'
  },
}));


export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {
      MuiPaper: {
        root: {
          width: "100%",
          boxShadow: "none",
        },
        elevation4: {
          boxShadow: "none",
        },
      },
      MuiToolbar: {
        root: {
          padding: "0px",
          fontFamily: "Poppins",
          //position:"absolute",
          //bottom:"0px",
        },
      },
      MUIDataTableToolbar: {
        root: {
          position: "absolute",
          bottom: "0px",
        },
      },

      MUIDataTableToolbarSelect: {
        title: {
          display: "none",
          paddingLeft: "10px",
        },
      },

      MuiTableCell: {
        root: {
          fontFamily: "Poppins",
        },
      },
      MUIDataTableBodyCell: {
        root: {
          padding: "4px",
          // eslint-disable-next-line no-useless-computed-key
          ["@media (min-width:959.5px)"]: {
            padding: "4px 4px",
          },
        },
      },
      MUIDataTableHeadCell: {
        root: {
          padding: "8px 8px",
        },
      },
      PrivateSwitchBase: {
        root: {
          padding: "4px 0px 4px 4px",
        },
      },
      MuiIconButton: {
        root: {
          padding: "6px",
        },
      },
    },
  });
}
