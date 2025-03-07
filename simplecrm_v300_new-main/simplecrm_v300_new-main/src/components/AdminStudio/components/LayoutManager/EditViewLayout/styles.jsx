import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  //index.js
  grid: { padding: "20px 20px 0px 20px" },
  //view list
  listLabel: { margin: "0px", paddingTop: "10px" },
  viewBox: {
    textAlign: "center",
    border: "1px solid #dedede",
    marginBottom: "10px",
    padding: "15px 15px 10px 15px",
    width: "9vw",
    borderRadius: "4px",
    boxShadow: "rgba(0, 0, 0, 0.02) 0px 6px 14px 0px ",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  block: {
    backgroundColor: "#ffffff",
    color: "#616779",
  },
  highlightedBlock: {
    backgroundColor: "#f5f5f5",
    color: theme.palette.primary.main,
  },
  viewIcon: {
    transform: "scale(2)",
    color: "rgba(56,121,211,0.2)",
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
  fieldListItem: {
    fontSize: "0.85rem",
    border: `0.2px solid ${theme.palette.primary.main}`,
    // color: theme.palette.primary.main,
    color: "rgb(84,98,114)",
    backgroundColor: "#ffffff",
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: "10px",
    height: "35px",
    margin: "0.5rem 0.5rem 0.5rem 0px",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "rgb(245,245,245,0.7)",
    },
  },
  fieldItem: {
    // border: `0.2px solid ${theme.palette.primary.main}`,
    // color: theme.palette.primary.main,
    color: "rgb(84,98,114)",
    // backgroundColor: "#ffffff",
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: "10px",
    height: "45px",
    margin: "0.5rem 0.5rem 0.5rem 0px",
    fontSize: "0.85rem",
  },
  field: {
    border: `0.2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    borderRadius: "3px",
    backgroundColor: "#ffffff",
    padding: "10px ",
    width: "35vw",
    fontSize: "0.75rem",
  },
  closeButton: {
    // position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  addPanel: {
    margin: "0px",
    fontSize: "0.8rem",
    fontWeight: "bolder",
    display: "flex",
    alignItems: "center",
    color: "rgb(117,117,117)",
    cursor: "pointer",
    width: "30%",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  addRow: {
    margin: "0px",
    fontSize: "0.8rem",
    fontWeight: "bolder",
    marginTop: "5px",
    "&:hover": {
      color: theme.palette.primary.main,
    },
    paddingLeft: "10px",
    display: "flex",
    alignItems: "center",
    color: "rgb(117,117,117)",
    cursor: "pointer",
    width: "30%",
  },
}));