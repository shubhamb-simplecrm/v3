import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  defaultContainer: {
    height: "83vh",
    width: "100%",
    overflow: "scroll",
  },
  tabContainer: {
    display: "flex",
    gap: "10",
    width: "100%",
    overflowY: "scroll",
  },
  //index.js
  grid: { padding: "8px 8px 0px 8px" },
  grid1: { padding: "10px 10px 0px 5px" },
  grid2: { padding: "20px 10px 0px 5px" },
  //view list
  listLabel: { margin: "0px", paddingTop: "10px" },
  viewBox: {
    textAlign: "center",
    border: "1px solid #dedede",
    marginBottom: "10px",
    padding: "25px 15px 10px 15px",
    // width: "9vw",
    borderRadius: "4px",
    boxShadow: "rgba(0, 0, 0, 0.02) 0px 6px 14px 0px ",
    overflow: "scroll",
    hieght: "100%",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  tabViewBox: {
    textAlign: "center",
    border: "1px solid #dedede",
    padding: "25px 15px 10px 15px",
    borderRadius: "4px",
    boxShadow: "rgba(0, 0, 0, 0.02) 0px 6px 14px 0px ",
    width: "30rem",
    margin: "5px",
  },
  block: {
    backgroundColor: "#ffffff",
    color: "#424242",
  },
  highlightedBlock: {
    backgroundColor: "#f5f5f5",
    color: theme.palette.primary.main,
  },
  viewIcon: {
    transform: "scale(2)",
    color: "rgba(56,121,211,0.3)",
  },
  //column chooser classes
  item: {
    padding: "0.6rem",
    fontSize: "0.85rem",
    border: `0.2px solid ${theme.palette.primary.main}`,
    // color: theme.palette.primary.main,
    color: "rgb(84,98,114)",
    borderRadius: "5px",
    // border: "1px solid #dedede",
    marginBottom: "0.5rem",
    // backgroundColor: "rgb(247,247,247,0.65)",
  },
  itemDisabled: {
    padding: "0.5rem",
    fontSize: "0.9rem",
    border: `1px solid grey`,
    color: "grey",
    borderRadius: "2px",
    marginBottom: "0.5rem",
  },
  columnHeading: {
    paddingBottom: "0.8rem",
    fontSize: "0.95rem",
    color: "rgb(84,98,114)",
    // color: theme.palette.primary.main,
  },
  columnTab: {
    border: "1px solid #dedede",
    borderRadius: "5px",
    padding: "1rem",
    width: "50%",
  },
  column: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    height: "71.5vh",
  },

  //edit view layout
  availableFieldsColumn: {
    border: "1px solid #dedede",
    borderRadius: "5px",
    padding: "1.2rem 1rem",
    width: "30%",
  },
  layoutColumn: {
    border: "1px solid #dedede",
    borderRadius: "5px",
    padding: "1rem",
    width: "70%",
  },
  fieldItem: {
    padding: "0.3rem",
    fontSize: "0.85rem",
    border: `0.2px solid ${theme.palette.primary.main}`,
    // color: theme.palette.primary.main,
    color: "rgb(84,98,114)",
    borderRadius: "3px",
    // border: "1px solid #dedede",
    marginBottom: "0.5rem",
    // backgroundColor: "rgb(247,247,247,0.65)",
  },
  heading: {
    margin: "0px",
    paddingBottom: "10px",
    color: "grey",
    fontSize: "0.9rem",
  },
  noDataText: {
    color: "gray",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: "50vh",
  },
  //popuplayout
  divider: { borderRight: "2px solid #dedede", paddingBottom: "0px" },
  mobileView: {
    height: "50vh",
  },
  mainContainer: {
    height: "68vh",
    overflow: "scroll",
    padding: "0px 5px 0px 8px",
  },
}));