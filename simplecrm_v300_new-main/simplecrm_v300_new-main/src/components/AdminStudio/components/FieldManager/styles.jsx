import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  root: {},
  divider: { borderRight: "1px solid #dedede" },
  spaceAround: { padding: "20px 20px 0px 20px" },
  actionButtions: {
    padding: "10px 10px 0px 10px",
    backgroundColor: "#ffffff",
    zIndex: 999,
  },
  borderBox: {
    margin: "0px",
    borderRadius: "5px",
    boxShadow: "1px solid black",
    border: "1px solid #dedede",
    // boxShadow:
    //   "rgba(0, 0, 0, 0.01) 0px 6px 14px 0px, rgba(0, 0, 0, 0.03) 0px 0px 0px 1px",
  },
  btn: {
    padding: "10px 0px",
  },
  heading: {
    margin: "0px",
    fontWeight: "bolder",
    color: "#737272",
    padding: "8px",
    borderBottom: "1.5px solid #dedede",
    backgroundColor: "rgb(247,247,247,0.9)",
  },
  scroll: {
    padding: "15px 10px 10px 15px ",
    overflow: "scroll",
    height: "65vh",
  },
  subText: { fontSize: "0.93rem", color: "grey" },

  // EditOptionview
  outerGrid: { padding: "10px 10px 0px 10px", height: "69vh" },
  name: { padding: "0px 10px 0px 0px", fontSize: "0.9rem" },
  optionGrid: { padding: "20px 0px 20px 3px" },
  sort: { paddingRight: "23px" },
  optionList: { padding: "0px 5px" },
  sortIcon: { padding: "2px", cursor: "pointer" },
  optionBox: {
    backgroundColor: "rgb(245,245,245)",
    borderRadius: "5px",
    padding: "10px",
    overflow: "scroll",
  },
  nameField: { paddingBottom: "10px", width: "85%" },
  optionListTitle: {
    margin: "0px",
    paddingBottom: "5px",
    fontSize: "0.9rem",
  },
  blank: { color: "gray" },
  infoIcon: { padding: "2px" },
  infoContainer:{display: "flex", alignItems: "center", gap: "10px"},
  infoText: {wordWrap: "break-word", lineHeight: 1.1},
  bottomActions: { width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "10px 15px 10px 10px" }
}));
