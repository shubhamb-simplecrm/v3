import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  //column chooser classes
  margin: { margin: "0px" },
  titleField: { padding: " 0px 10px" },
  header: { paddingBottom: " 10px" },
  border: { borderRight: "1px solid #dedede" },
  editLayout: { padding: "15px 20px 0px 20px" },
  noDataText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "grey",
    height: "50vh",
  },
  heading: {
    margin: "0px",
    paddingBottom: "15px",
    color: "grey",
    fontSize: "0.9rem",
  },
}));
