import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import themes from "../../../themes";

export default makeStyles((theme) => ({
  paper: {
    margin: "3% auto",
    width: "90%",
    height: "90%",
    backgroundColor: theme.palette.background.paper,
    // border: "1px solid #fff",
    borderRadius: "3px",
    boxShadow: theme.shadows[5],
    outline: 0,
    borderTop: theme.palette.primary.main + ' solid 3px',

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
    padding: "0.5rem 0.8rem",
    //borderRadius: "0.2rem", 
    margin: "1rem 0",
    border: "1px solid #d6d5d5"

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
    marginRight : 4,

  },
  titleHeadWrapper: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.8rem 1.2rem",
    position: "sticky",
    top: 0,
    backgroundColor: theme.palette.background.paper,
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
    color: theme.palette.primary.main,
    fontSize: "0.875rem",
    [theme.breakpoints.down("xs")]: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      display: "block",
    },
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
  NameCell: {
    [theme.breakpoints.down("sm")] : {  
      display: "block !important",
      position: "absolute",
      borderBottom: "none",
      top: 4,
      left: "1%",
      zIndex: "999",
      width: "90% !important",
      padding: "2px 10px",
      "& > div": {
          width: "100%",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
          padding: "0px 4px"
        },
      "& > div:nth-of-type(1)": {
           display: "none !important",
       },
    }  
  }, 
  nestedTableRow:{
    backgroundColor:"#cccccc29"
  },
  text:{
    whiteSpace: "break-spaces"
  },
}));


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
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:959.95px)"]: {
            padding: "0px 0px 0px 4px"
          }
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
        elevation1: {
          boxShadow: "none"
        },
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
      MUIDataTableSelectCell: {
        fixedLeft: {
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:959.95px)"]: {
            borderWidth: theme.brdrWidth,
            borderColor: "#ffffff",
            borderStyle: "solid",
            backgroundColor: theme.palette.primary.listview,
            //padding: theme.padng, 
            padding: "5px 0px", 
            display: "block",
            width:"100%",
          },
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:1099.95px)"]: { 
            position: "relative",
          }
        },
        fixedHeader: {
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:1099.95px)"]: {
            position: "relative", 
          }
        },
        root: {
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:959.95px)"]: {
            "& div": {
              justifyContent: "space-between",
              flexDirection: "row-reverse",
              paddingRight: "15px",
              width: "100%",
            },
            "& ~ td": {
              display: "none",
              padding: "0px 13px",
            },
            // "& + td": {
            //   display: "block",
            //   position: "absolute",
            //   borderBottom: "none",
            //   //top: theme.tdTop,
            //   top: 8,
            //   left: "7%",
            //   zIndex: 999,
            //   width: "80% !important",
            //   padding: "2px 10px",
            // },
            // "& + td > div": {
            //   width: "100%",
            //   textOverflow: "ellipsis",
            //   overflow: "hidden",
            //   whiteSpace: "nowrap",
            //   padding: "0px 4px"
            // },
            // "& + td > div:nth-of-type(1)": {
            //   display: "none",
            // },
            "& div > button": {
              // eslint-disable-next-line no-useless-computed-key
              ["@media (max-width:959.95px)"]: {
                backgroundColor: "rgba(159, 159, 159, 0.5)",
              },
              "&:hover": {
                // eslint-disable-next-line no-useless-computed-key
                ["@media (max-width:959.95px)"]: {
                  backgroundColor: "rgba(159, 159, 159, 0.5)",
                },
              },
            },
          },
        },
        icon: {
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:959.95px)"]: {
            transform: "rotate(90deg)",
          },
        },
        // expanded: {
        //   // eslint-disable-next-line no-useless-computed-key
        //   ["@media (max-width:959.95px)"]: {
        //     transform: "rotate(-90deg)",
        //   },
        // },
      },
      MuiTableRow: {
        root: {
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:959.95px)"]: {
            position: "relative",
            //boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            margin: "10px auto 10px auto !important",
            border: "1px solid rgba(217, 217, 217, 1) !important",
            display: "block",
            width: "98% !important",
          },
        },
      },
    },
  });
}
