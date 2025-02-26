import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";


export default makeStyles((theme) => ({
  sectionsWrappers: {
    padding: theme.spacing(1)
  },
  perSectionWrapper: {
    
    //backgroundColor: theme.palette.background.default, 
    padding: "0.5rem 0.8rem",
    //borderRadius: "0.2rem", 
    border: "1px solid #d6d5d5"
  },
  perSecWrapCont: {
    padding: "3px 6px",
    margin: "5px",
  },


  fieldsGrid: {
    marginTop: theme.spacing(2),
  },

  buttonsWrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
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
    color: theme.palette.primary.main,
  },
  btn: {
    margin: "5px",
  },
  cstmBtn: {
    color:"white !important",
    margin: "5px",
  },
  mobileLayoutButton : {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginBottom: "5px",
    },
  },
  sectionTitle: {
    paddingBottom: "0.9rem",
    marginTop: "0px",
    color: theme.palette.text.primary
  },
}));

/*

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiToolbar: {
        root: {
          padding: "0px",
        },
      },
      MUIDataTableBodyCell: {
        root: {
          padding: "6px",
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
      MuiTableSortLabel:{
        root:{
          marginTop:5
        }
      }
    },
  });
}

*/


export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      // MuiBackdrop:{
      //   root:{
      //       backgroundColor: "rgba(0, 0, 0, 0.1)"
      //   }
      // },
      MuiBackdrop:{
        root:{
          backgroundColor: "rgba(0, 0, 0, 0.1)"
        }
      },
      MuiToolbar: {
        root: {
          padding: "0px",
          fontFamily: "Poppins",
        },
        gutters:{
          paddingLeft:'0px'
        }
      },
      MUIDataTableToolbar: {
        left:{
          display:'none'
        },
        paddingLeft: '10px'
      },
      MUIDataTableToolbarSelect: {
        root: {
          justifyContent: 'unset',
          backgroundColor: 'transparent',
          boxShadow:"none",
        },
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
          padding: "8px",
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
      MuiDialog: {
        paper: {
          overflowY: "hidden"
        }
      },
      MuiPaper: {
        elevation4: {
          boxShadow: "none"
        },
        elevation24:{
          boxShadow:"0px 11px 15px -7px rgb(0 0 0 / 0%), 0px 24px 38px 3px rgb(0 0 0 / 0%), 0px 9px 46px 8px rgb(0 0 0 / 0%)"
        }
      },
      MuiTypography: {
        subtitle1: {
          fontSize: "1rem",
          fontFamily: "Poppins",
          fontWeight: "400",
          lineHeight: "1.75"
        }
      },
      MuiTableSortLabel: {
        root: {
          marginTop: 5
        }
      },
      MuiBox: {
        root: {
          display: "flex",
        }
      }
    },
  });
}


