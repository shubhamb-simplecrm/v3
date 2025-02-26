import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import themes from "../../../../themes";

export default makeStyles((theme) => ({
  paper: {
    margin: "5% auto",
    width: "40%",
    height: "60%",
    backgroundColor: theme.palette.background.paper,
    // border: "1px solid #fff",
    borderRadius: "3px",
    boxShadow: theme.shadows[5],
    outline: 0,
    
  },
  sectionsWrappers: {
    padding: theme.spacing(1),
  },
  closeIcon: {
    color: theme.palette.text.primary,
    cursor: "pointer"
  },
  perSectionWrapper: {
    //backgroundColor: theme.palette.background.default, 
    padding: "1rem 0.8rem", 
    //borderRadius: "0.2rem", 
    margin: "1rem 0",
    border:"1px solid #d6d5d5"

  },
  sectionTitle: {
    paddingBottom: "0.9rem", 
    marginTop: "0px", 
    color: theme.palette.text.primary
  },
  fieldsGrid: {
    marginTop: theme.spacing(2),
  },
  modal: {
    outline: "none",
  },
  buttonsWrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),

  },
  titleHeadWrapper: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.8rem 1.2rem",
    position: "sticky",
    top: 0,
    backgroundColor: theme.palette.background.default,
    zIndex: 101,
  },
  progressWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  adornment: {
    padding: 0,
    margin: 0,
    cursor: "pointer",
  },
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main
  },
  btn:{
    margin:"5px"
  },
  card:{
    borderTop:'4px solid '+theme.palette.primary.light
  },
  avatar:{
    backgroundColor:theme.palette.primary.light
  }

}));


export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiCard:{
        root:{
          borderTop:'4px solid '+theme.palette.primary.main
        }
      },
      MuiToolbar: {
        root: {
          padding: "0px",
          fontFamily: "Poppins"
        },
      },
      MUIDataTableToolbar: {
        paddingLeft: '10px'
      },
      MUIDataTableToolbarSelect: {

        title: {
          display: 'none',
          paddingLeft: '10px'
        }
      },
      MuiTableCell: {
        root: {
          fontFamily: "Poppins"
        }
      },
      MUIDataTableBodyCell: {
        root: {
          padding: "4px",
          // eslint-disable-next-line no-useless-computed-key
          ["@media (min-width:959.5px)"]: {
            padding: "2px 4px",
          },
        },
      },
      MUIDataTableHeadCell: {
        root: {
          padding: "0px 8px",
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
      MuiDialog:{
        paper:{
          overflowY:"hidden"
        }
      },
      MuiPaper:{
        elevation4:{
          boxShadow:"none"
        }
      },
      MuiTypography:{
        subtitle1:{
          fontSize: "1rem",
          fontFamily: "Poppins",
          fontWeight: "400",
          lineHeight: "1.75"
        }
      }
    },
  });
}
  