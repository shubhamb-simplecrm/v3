import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
  },
  spacer: theme.mixins.toolbar,

  //DefaultModuleView
  icon: {
    transform: "scale(2.8)",
    color: "rgba(56,121,211,0.3)",
  },
  managerBox: {
    textAlign: "center",
    textDecoration: "none",
    borderRadius: "7px",
    height: "200px",
    border: "1px solid rgb(128,128,128 ,0.1)",
    padding: "40px 20px 1px 20px",
    boxShadow: "rgba(0, 0, 0, 0.02) 0px 6px 14px 0px ",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "rgb(245,245,245,0.7)",
    },
  },
  boxHeading: {
    paddingTop: "18px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  boxSubtitle: { paddingTop: "5px", fontSize: "0.8rem" },
  space: { padding: "20px" },

  //tabView
  historyIcon: {
    position: "absolute",
    top: "63px",
    right: "10px",
    cursor: "pointer",
  },

  //DefaultModuleList

  searchArea: {
    padding: "10px",
    position: "sticky",
    top: "0",
    zIndex: "1000",
    background: theme.palette.background.paper,
  },
  moduleListContainer: { display: "flex", flexDirection: "column" },
  moduleList: { margin: "10px 30px" },
  moduleLabelGrid: { padding: "10px 0px" },
  grid: {
    padding: "0px 10px",
    height: "85vh",
    overflow: "scroll",
    margin: "0px",
  },
  title: {
    fontSize: "1rem",
    fontWeight: "bolder",
    color: "#757575",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  link: {
    textDecoration: "none",
  },
  subtitle: { color: "grey", fontSize: "0.75rem" },
  moduleTile: {
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "rgb(245,245,245,0.7)",
    },
  },
  searchBar: {
    padding: "10px",
  },

  //DefaultAddView
  alignCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "68vh",
    textAlign: "center",
  },
  addBox: {
    border: "1px solid rgb(43,137,218, 0.5)",
    padding: "3.5vh 4vh 0vh 4vh",
    borderRadius: "5px",
    textAlign: "center",
    cursor: "pointer",
  },
  addIcon: { transform: "scale(2.5)", color: "rgb(43,137,218, 0.4)" },
  text: { color: "#424242" },
  moduleViewWrapper: {
    display: "flex",
  },
  moduleList: {
    borderRight: "1px solid #dedede",
  },
}));
