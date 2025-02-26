import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  paper: { background: theme.palette.background.paper },
  grid: {
    padding: "0px 10px",
    height: "78vh",
    overflow: "scroll",
    margin: "0px",
  },
  title: {
    fontSize: "0.8rem",
    fontWeight: "bolder",
    // color: "#757575",
    color: "grey",
    // color: theme.palette.primary.main,

    backgroundColor: "rgb(240,237,249,0.2)",
    // border: `1px solid ${theme.palette.primary.main}`,
    border: "1px solid rgb(240,237,249)",
    padding: "8px 10px",
    borderRadius: "5px",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  subtitle: { color: "grey", fontSize: "0.75rem" },
  moduleTile: {
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "rgb(245,245,245,0.7)",
    },
  },
  searchBar: {
    display: "flex",
    justifyContent: "flex-end",
    width: "250px",
    padding: "10px 13px 10px 10px",
  },
  margin: { margin: "0px" },
  titleField: { padding: " 0px 10px" },
  header: { paddingBottom: " 10px" },
  heading: { color: theme.palette.primary.main, fontWeight: "bolder" },
  border: { borderRight: "1px solid #dedede", paddingLeft: "5px" },
  editLayout: { padding: "15px 20px 0px 20px" },
  noDataText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "grey",
    height: "50vh",
  },
  exit: {
    padding: "10px",
    display: "flex",
    gap: "10px",
    alignItems: "start",
  },
}));
