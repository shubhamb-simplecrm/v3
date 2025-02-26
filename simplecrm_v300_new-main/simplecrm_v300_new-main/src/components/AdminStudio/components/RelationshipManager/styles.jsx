import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  scroll: {
    maxHeight: "78vh",
    overflow: "scroll",
    marginTop: "0px",
  },
  outerGrid: { margin: "0px", padding: "0px" },
  border: {
    borderRight: "1px solid #dedede",
    padding: "10px 7px 0px 10px",
    margin: "0px",
    height: "86vh",
  },
  addButton: { width: "100%", marginBottom: "5px" },
  listBox: {
    border: "1px solid #dedede",
    borderRadius: "5px",
    padding: "8px",
    width: "100%",
    // height: "12.5vh",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgb(245,245,245,0.6)",
    },
  },
  highlightedlistBox: {
    backgroundColor: "rgb(245,245,245,0.6)",
  },
  actionButtons: { padding: "10px 23px 5px 10px" },
  label: { fontSize: "0.93rem", color: "grey" },
  title: {
    color: "rgb(125,125,125)",
    fontWeight: "bolder",
  },
  heading: {
    color: "#737272",
    padding: "5px 0px 11px 10px",
    borderBottom: "1.5px solid #dedede",
    backgroundColor: "#f8f8f8",
    borderRadius: "5px 0px 5px 0px",
  },
  topFields: { padding: "15px 10px 0px 10px " },
  bottomFields: { paddingLeft: "10px" },
  spacing: { paddingBottom: "10px" },
  leftBorder: {
    borderLeft: "1px solid #dedede",
  },
  upperLabel: {
    fontSize: "0.93rem",
    fontWeight: "bolder",
    color: "grey",
  },
  relationshipType: {
    margin: "0px",
    fontSize: "0.55rem",
    textAlign: "center",
    lineHeight: 1.1,
    wordWrap: "break-word",
    color: "grey",
    position: "relative",
    top: "17px",
    backgroundColor: "#ffffff",
    zIndex: 999,
  },
  icon: {
    paddingBottom: "5px",
    color: "rgba(56,121,211,0.3)",
    fontSize: "0.7rem",
  },
  arrowIcon: {
    transform: "rotate(90deg) translateY(-100%) scale(2.3)",
    position: "relative",
    right: "23px",
    color: "rgba(127,184,232, 0.5)",
  },
  roundedIcon: {
    transform: "scale(2)",
    color: "rgba(127,184,232, 0.5)",
  },
  font: { fontSize: "0.8rem" },
  topField: { paddingBottom: "0px" },
  field: { paddingRight: "23px" },
  moduleName: { fontSize: "0.8rem" },
}));
