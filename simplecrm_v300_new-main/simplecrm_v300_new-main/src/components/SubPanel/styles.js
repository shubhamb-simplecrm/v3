import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  spinner: {
    marginLeft: 15,
    position: "relative",
    top: 4,
  },
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    fontSize: "0.875rem",
  },
  optionWrapper: {
    display: "flow-root",
    padding: "4px 5px",
    margin: "0 2px",
    alignItems: "center",
    "&:hover": {
      cursor: "pointer",
      color: theme.palette.secondary.dark,
    },
  },
  btnAdj: {
    margin: "0 0.2rem 0 1rem",
    [theme.breakpoints.down("md")]: {
      margin: "0 !important",
    },
  },
  floatCstm: {
    float: "right",
    display: "flex",
  },
  floatcenter: {
    textAlign: "Center",
  },
  cstmCssbtn: {
    flex: "0 0 auto !important",
    color: "none",
    padding: "6px !important",
    fontSize: "0.875rem !important",
    borderRadius: "0% !important",
  },
  notFoundContainer: {
    display: "flex",
    width: "100%",
  },
  iconboxClass: {
    width: "50%",
    "& svg": {
      width: "90%",
      height: "90%",
      color: "#0071d2",
    },
  },
  textboxClass: {
    width: "50%",
    padding: "80px",
    "& h1": {
      margin: "0px",
      fontSize: "46px",
      color: "#121a3670",
    },
    "& h2": {
      margin: "0px",
      fontSize: "36px",
      color: "#0071d2",
    },
    "& p": {
      fontSize: "16px",
    },
  },
  rightBtn: {
    display: "flex",
    flexDirection: "row",
    width: "120px",
    justifyContent: "flex-end",
    "& svg": {
      width: "20px",
      height: "20px",
    },
    [theme.breakpoints.down("xs")]: {
      justifyContent: "flex-start",
    },
  },
  headRightBtn: {
    padding: "5px 18px",
  },
  statusBg: {
    borderRadius: "2px",
    textTransform: "uppercase",
    fontSize: "10px",
    fontWeight: "600",
    letterSpacing: "1px",
    paddingRight: "12px",
    paddingLeft: "12px",
  },
  nestedTableRow: {
    backgroundColor: "#cccccc29",
  },
  text: {
    whiteSpace: "break-spaces",
  },
  emailUnread: {
    fontWeight: "600",
  },
  mobileLayoutCreateBtn: {
    [theme.breakpoints.down("sm")]: {
      width: "inherit",
      marginBottom: "5px",
    },
  },
  mobileLayoutFileView: {
    [theme.breakpoints.down("xs")]: {
      margin: "-6px 12px -6px 0px !important",
    },
  },
  mobileLayoutFileHide: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  NameCell: {
    [theme.breakpoints.down("sm")]: {
      display: "block !important",
      position: "absolute",
      borderBottom: "none",
      top: "0.45vh",
      left: "1%",
      zIndex: "999",
      width: "90% !important",
      padding: "2px 10px",
      "& > div": {
        width: "100%",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        padding: "0px 4px",
      },
      "& > div:nth-of-type(1)": {
        display: "none !important",
      },
    },
  },
  listModuleIcon: {
    marginRight: 5,
  },
  scroll: {
    overflow: "scroll",
    height: "92%",
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiToolbar: {
        root: {
          padding: 0,
          // eslint-disable-next-line no-useless-computed-key
          // ["@media (max-width:959.95px)"]: {
          //   display:'none !important'
          // }
        },
        gutters: {
          padding: 0,
          ["@media (min-width: 600px)"]: {
            padding: 0,
          },
        },
        regular: {
          border: "none!important",
          minHeight: "100%",
          ["@media (min-width: 600px)"]: {
            minHeight: "100%",
          },
        },
      },

      MUIDataTableBody: {
        emptyTitle: {
          fontSize: "0.875rem",
        },
      },
      MUIDataTableHeadCell: {
        root: {
          padding: "5px 18px",
        },
        fixedHeader: {
          //backgroundColor:"#f6f6f6",
        },
      },

      MuiTypography: {
        body1: {
          fontSize: "0.875rem",
        },
      },
      MuiTablePagination: {
        toolbar: {
          minHeight: "100%",
        },
      },
      MUIDataTablePagination: {
        tableCellContainer: {
          border: "none",
          padding: "0px",
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
          marginLeft: "5px",
        },
      },
      MuiPaper: {
        root: {
          boxShadow: "none",
        },
        elevation1: {
          boxShadow: "none",
        },
        elevation4: {
          boxShadow: "none",
          border: "#cccccc43 solid thin",
          //borderTop: "none",
        },
        rounded: {
          borderRadius: 0,
        },
      },
      MuiTabScrollButton: {
        root: {
          Mui: {
            disabled: {
              opacity: 1,
            },
          },
        },
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
            padding: 5,
            display: "block",
            width: "100%",
          },
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:1099.95px)"]: {
            position: "relative",
          },
        },
        fixedHeader: {
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:1099.95px)"]: {
            position: "relative",
          },
        },
        root: {
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:959.95px)"]: {
            "& div": {
              justifyContent: "flex-start",
              flexDirection: "row-reverse",
              paddingRight: "15px",
              width: "100%",
            },
            "& ~ td": {
              display: "none",
              padding: "4px 7px",
              backgroundColor: theme.palette.primary.listview,
            },
            "& div > button": {
              // eslint-disable-next-line no-useless-computed-key
              ["@media (max-width:959.95px)"]: {
                // backgroundColor: "rgba(159, 159, 159, 0.5)",
              },
              "&:hover": {
                // eslint-disable-next-line no-useless-computed-key
                ["@media (max-width:959.95px)"]: {
                  // backgroundColor: "rgba(159, 159, 159, 0.5)",
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
      },

      MuiTableCell: {
        root: {
          fontFamily: "Poppins",
          fontSize: "0.875rem",
          [theme.breakpoints.down("sm")]: {
            display: "table",
            width: "100% !important",
            border: "none",
          },
        },
      },
      MUIDataTableBodyCell: {
        root: {
          padding: "0px 4px",
        },
        stackedHeader: {
          [theme.breakpoints.down("sm")]: {
            color: theme.palette.label.listView.color,
            fontSize: "0.875rem !important",
          },
        },
      },
      MuiTableRow: {
        root: {
          [theme.breakpoints.down("sm")]: {
            backgroundColor: theme.palette.primary.listview,
            hover: {
              "&:hover": {
                backgroundColor: theme.palette.primary.listview,
              },
            },
            position: "relative",
            margin: "10px auto 10px auto !important",
            display: "block",
            width: "95% !important",
          },
        },
      },
      MUIDataTable: {
        responsiveBase: {
          [theme.breakpoints.down("sm")]: {
            background: theme.palette.background.listView,
          },
        },
      },
      MUIDataTableBodyRow: {
        responsiveStacked: {
          border: "none !important",
        },
      },
    },
  });
};
