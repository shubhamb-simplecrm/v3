import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { RIGHT_SIDEBAR_DRAWER_WIDTH } from "../../common/theme-constants";

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
    [theme.breakpoints.down("xs")]: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      display: "block",
    },
  },
  layoutMainSection: {
    padding: theme.spacing(1),
    // width: "100%",
    minWidth: 0,
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    // marginTop: "4rem",
    // marginRight: RIGHT_SIDEBAR_DRAWER_WIDTH,
    // marginRight: `cal(100%- ${RIGHT_SIDEBAR_DRAWER_WIDTH}px)`,
    [theme.breakpoints.up("xs")]: {
      marginBottom: theme.spacing(4),
    },
  },
  contentRightShift: {
    marginRight: RIGHT_SIDEBAR_DRAWER_WIDTH,
  },
  brandLogoBar: {
    background: theme.palette.background.paper,
    padding: "0 10px 0px 10px",
  },
  brandLogoTitle: {
    fontWeight: "normal",
    color: theme.palette.primary.main,
    cursor: "pointer",
    fontSize: "1.5rem",
  },
  listDataTable: {
    position: "relative",
    zIndex: "997",
    // padding: 0
    borderCollapse: "seperate",
  },
  fontSizeCstm: {
    fontSize: "0.875rem",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.overlayBg.background,
  },
  statusBg: {
    borderRadius: "2px",
    textTransform: "uppercase",
    fontSize: "10px",
    fontWeight: "600",
    letterSpacing: "1px",
    paddingRight: "12px",
    paddingLeft: "12px",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "-webkit-fill-available",
    },
  },
  [theme.breakpoints.down("md")]: {
    fileCont: {
      display: "inline-grid",
    },
    svgCont: {
      margin: "0.25vh 1vw 0.25vh 1vh !important",
    },
  },
  NameCell: {
    [theme.breakpoints.down("sm")]: {
      display: "block !important",
      position: "absolute",
      borderBottom: "none",
      top: 5,
      left: "7%",
      zIndex: "999",
      width: "85% !important",
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
  listActionBtn: {
    margin: "0px 5px",
    //minWidth: "auto",
    //padding: "6px 8px",
    // "& svg": {
    //   width: "0.8em",
    //   height: "0.8em",
    // },
  },
  actionBtn: {
    width: "120px",
    display: "flex",
    flexDirection: "row",
  },
  photo: {
    maxWidth: 70,
    marginTop: 5,
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,

    overrides: {
      MuiPaper: {
        root: {
          boxShadow: "none !important",
          borderCollapse: "Seperate",
        },
      },
      MUIDataTable: {
        tableroot: {
          borderCollapse: "Seperate",
        },
      },
      responsiveBase: {
        [theme.breakpoints.down("sm")]: {
          background: theme.palette.background.listView,
        },
      },

      MuiTable: {
        root: {
          borderCollapse: "Seperate",
        },
      },
      MuiToolbar: {
        root: {
          padding: "0px",
          fontFamily: "Poppins",
        },
        gutters: {
          paddingRight: "0px !important",
          paddingLeft: "10px !important",
          ["@media (max-width: 599.95px)"]: {
            paddingLeft: "0px",
          },
        },
      },
      MUIDataTableToolbar: {
        paddingLeft: "10px",
        left: {
          display: "none !important",
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
          // background: theme.palette.primary.listview,
          // eslint-disable-next-line no-useless-computed-key
          [theme.breakpoints.down("sm")]: {
            display: "table",
            width: "100% !important",
            border: "none",
          },
        },
      },

      MUIDataTableHeadCell: {
        root: {
          padding: "8px 8px",
        },
        sortActive: {
          "& $sortAction": {
            opacity: 1,
          },
        },
      },
      PrivateSwitchBase: {
        root: {
          padding: "4px 0px 4px 4px",
        },
      },
      MuiPaper: {
        elevation4: {
          boxShadow: "none",
        },
      },
      MuiTableSortLabel: {
        root: {
          marginTop: 5,
        },
      },
      MUIDataTablePagination: {
        tableCellContainer: {
          padding: "0px",
        },
      },
      MuiBadge: {
        badge: {
          right: "50px",
        },
        anchorOriginTopRightRectangle: {
          right: "50px",
        },
      },
      MUIDataTableSelectCell: {
        fixedLeft: {
          position: "relative",
          // background Color: theme.palette.primary.listview,
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:959.95px)"]: {
            borderWidth: theme.brdrWidth,
            borderColor: "#ffffff",
            borderStyle: "solid",
            backgroundColor: theme.palette.primary.listview,
            padding: 5,
            display: "block",
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
          // background: theme.palette.primary.listview,
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:959.95px)"]: {
            "& div": {
              justifyContent: "space-between",
              flexDirection: "row-reverse",
              paddingRight: "15px",
            },
            "& ~ td": {
              display: "none",
              padding: "4px 7px",
              backgroundColor: theme.palette.primary.listview,
            },
            "& div > button": {
              // eslint-disable-next-line no-useless-computed-key
              ["@media (max-width:959.95px)"]: {
                //backgroundColor: "rgba(159, 159, 159, 0.5)",
              },
              "&:hover": {
                // eslint-disable-next-line no-useless-computed-key
                ["@media (max-width:959.95px)"]: {
                  //backgroundColor: "rgba(159, 159, 159, 0.5)",
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

      MUIDataTableBodyCell: {
        root: {
          padding: "0 3px",
          borderCollapse: "initial",
        },
        stackedHeader: {
          [theme.breakpoints.down("sm")]: {
            color: theme.palette.label.listView.color,
            fontSize: "0.875rem !important",
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
      MuiTableRow: {
        root: {
          // "&$selected": {
          //   // backgroundColor: "rgb(245,245,245) !important",
          // },
          "&$hover:hover": { backgroundColor: "rgb(245,245,245)" },
          // eslint-disable-next-line no-useless-computed-key
          [theme.breakpoints.down("sm")]: {
            position: "relative",
            margin: "10px auto 10px auto !important",
            display: "block",
            width: "95% !important",
          },
        },
      },

      MUIDataTableBodyRow: {
        responsiveStacked: {
          border: "none !important",
        },
      },
      MuiCheckbox: {
        root: {
          "& svg": {
            width: "0.8em",
            height: "0.8em",
          },
        },
      },
    },
  });
};
