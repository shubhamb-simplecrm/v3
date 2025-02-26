import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  container: {
    display: "flex",
    paddingTop: 10,
    color: theme.palette.secondary.main,
    justifyContent: "flex-end",
    [theme.breakpoints.down("xs")]: {
      // margin: "0 10px",
      justifyContent: "flex-start",
    },
  },
  optionWrapper: {
    display: "flex",
    padding: "0px 10px",
    margin: "0px",
    alignItems: "center",
    "& svg": {
      width: "20px",
      height: "20px",
      marginRight: "5px",
      marginLeft: "5px",
    },
    "&:hover": {
      cursor: "pointer",
      color: theme.palette.secondary.dark,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0px 5px",
      height: "40px",
      margin: "0 5px",
      fontSize: 0,
      background: theme.palette.primary.main + "20",
      color: theme.palette.primary.main,
      borderRadius: 5,
      //border: "1px solid #d9d9d9"
    },
  },
  optionWrapperAdd: {
    display: "flex",
    height: "40px",
    padding: "0px 10px",
    margin: "0px",
    alignItems: "center",

    "& svg": {
      width: "20px",
      height: "20px",
      marginRight: "5px",
      marginLeft: "5px",
    },
    [theme.breakpoints.up("sm")]: {
      "&:hover": {
        cursor: "pointer",
        color: theme.palette.secondary.dark,
      },
    },
    [theme.breakpoints.down("xs")]: {
      padding: "10px 5px",
      margin: "0 5px",
      fontSize: 0,
      background: theme.palette.primary.main + "20",
      color: theme.palette.primary.main,
      borderRadius: 5,
      "&:hover": {
        cursor: "pointer",
        background: theme.palette.primary.main + "20",
      },
    },
  },
  selectedIcon: {
    //Changes as per New mockup changes 27/02/2023
    background: theme.palette.primary.main,
    color: "#FFFFFF",
  },
  btnSpacing1: {
    margin: "0 10px 0 10px",
  },
  btnSpacing: {
    margin: "0 10px 0 0",
  },
  optionWrapperButton: {
    display: "flex",
    paddingRight: "15px",
    // color: "white",
    // backgroundColor: theme.palette.secondary.dark,
    //borderRadius: "10px",
    //height: "30px",
    //margin: "0px",
    alignItems: "center",

    "& svg": {
      width: "20px",
      height: "20px",
      //marginRight: "5px",
      marginLeft: "5px",
    },

    [theme.breakpoints.down("xs")]: {
      padding: "10px 5px",
      margin: "0 5px",
      fontSize: 0,
      background: theme.palette.primary.main,
      color: theme.palette.primary.main,
      //borderRadius: 5,
      //border: "1px solid #d9d9d9"
    },
  },
  fieldSpacing: {
    padding: "5px",
    [theme.breakpoints.down("xs")]: {
      overflow: "scroll",
    },
  },
  buttonGroupRoot: {
    display: "flex",
    justifyContent: "end",
    gap: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  optionWrapperList: {
    display: "flex",
    // padding: "0px 10px",
    margin: "0px",
    alignItems: "center",

    "& svg": {
      width: "25px",
      height: "20px",
      marginRight: "5px",
      // marginLeft:"5px",
    },
    "&:hover": {
      cursor: "pointer",
      color: theme.palette.secondary.dark,
    },
    [theme.breakpoints.down("xs")]: {
      // padding: "5px 5px",
      height: "40px",
      // margin: "0 5px",
      fontSize: 0,
      background: theme.palette.primary.main + "20",
      color: theme.palette.primary.main,
      borderRadius: 5,
      //border: "1px solid #d9d9d9"
    },
    flexRows: {
      padding: "0.2rem",
      marginTop: "0.4rem",
    },
    divider: {
      border: "2px solid #dedede",
      marginTop: 10,
      marginBottom: 10,
    },
    warning: {
      margin: "5px 2px",
      padding: "5px 10px",
      fontSize: "0.65rem",
    },
  },

  selectAllBtn: {
    [theme.breakpoints.down("xs")]: {
      position: "absolute",
      right: "3%",
    },
  },
  selectedFilters: {
    display: "flex",
    justifyContent: "flex-start",
    marginRight: "5px",
    marginTop: "5px",
    WebkitUserModify: "read-plaintext-only",
    flexWrap: "wrap",
    fontWeight: 300,

    "& > div": {
      marginRight: 2,
      margin: 2,
      height: "auto !important",

      "& span": {
        fontSize: "0.875rem",
        padding: "5px 10px",
        height: "auto !important",
        fontWeight: "400",
      },
    },
  },
  chipAdjust: {
    padding: "4px",
    margin: 0,
    marginRight: "4px",
  },
  customChip: {
    padding: "4px",
    margin: 0,
    marginRight: "6px",
    // Added to show fixed width of filter items with text overlay 17/03/2023
    "& span": {
      minWidth: "4rem",
      maxWidth: "10rem",
    },
  },
  alignMiddle: {
    display: "flex",
    alignItems: "center",
  },
  filterAdjust: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    // background: `${theme.palette.background.linkActiveBg} !important`,
    // `${theme.palette.primary.main+20} !important`,
    color: `${theme.palette.primary.main} !important`,
    // border: `1px solid ${theme.palette.primary.main}`
  },

  search: {
    [theme.breakpoints.down("xs")]: {
      padding: 5,
    },
  },
  popoverMenuStyle: {
    fontSize: "0.875rem",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    //padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: theme.spacing(1),
    transition: theme.transitions.create("width"),
    // width: "100%",
  },
  inputPadding: {
    padding: "6px 9px",
  },
  importChildContainer: {
    margin: 10,
  },
  //column chooser classes
  item: {
    padding: "0.5rem",
    fontSize: "0.9rem",
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    borderRadius: "2px",
    marginBottom: "0.5rem",
  },
  itemDisabled: {
    padding: "0.5rem",
    fontSize: "0.9rem",
    border: `1px solid grey`,
    color: "grey",
    borderRadius: "2px",
    marginBottom: "0.5rem",
  },
  columnHeading: { paddingBottom: "0.8rem", fontSize: "1rem" },
  columnTab: {
    border: "1px solid grey",
    padding: "1.5rem 1rem",
    width: "50%",
    // overflow: "scroll",
    // height: "100%",
  },
  column: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    height: "100%",
    overflow: "hidden",
  },
  optionBorder: {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    // border: `2px solid ${theme.palette.primary.main}`,
  },
  listItem: {
    minWidth: 50,
    maxWidth: 200,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  listItemText: {
    whiteSpace: "normal",
    wordBreak: "break-all",
  },
}));

export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {
      MuiTooltip: {
        popper: {
          top: "-20px",
        },
        tooltipPlacementBottom: {
          margin: 0,
          // eslint-disable-next-line no-useless-computed-key
          ["@media (min-width:600px)"]: {
            margin: 0,
          },
        },
      },
      MuiIconButton: {
        root: {
          padding: "0px",
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
      },
      MuiChip: {
        root: {
          height: "auto !important",
          marginBottom: "5px",
        },
      },
      MuiToolbar: {
        display: "none !important",
        flex: "none",
      },
      MUIDataTableToolbar: {
        left: {
          display: "none !important",
          flex: "none !important",
        },
      },
    },
  });
};
