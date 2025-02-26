import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  columnBox: {
    backgroundColor: "#ffffff",
    border: "1px solid rgb(0,117,211)",
    borderRadius: "5px",
    marginBottom: "10px",
    padding: "5px 10px",
    fontSize: "0.9rem",
  },
  optionRow: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
  },
  optionKey: {
    color: "gray",
    float: "left",
    paddingRight: "7px",
  },
  optionLabel: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "75%",
  },
  blank: { color: "gray" },
  optionActions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  icon: {
    padding: "2px",
    color: "#9B9B9B",
    cursor: "pointer",
  },
  deleteIconButton: {
    margin: "0px",
    padding: "0px",
    cursor: "pointer",
  },
  deleteIconDisabled: { color: "#BDBDBD" },
  deleteIcon: { padding: "2px", color: "#9B9B9B" },
}));
