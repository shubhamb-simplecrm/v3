import { makeStyles } from "@material-ui/core";
import { Title } from "@material-ui/icons";

export default makeStyles((theme) => ({
  searchBar: {
    height: "41px !important",
    width: "100%",
    // color:theme.palette.primary.main
    // ForwardRef: {
    searchIconButton: {
      color: "blue",
    },
    borderRadius: "20px",
    // },
  },
  title: {
    backgroundColor: "#DEE7F690",
    padding: "10px 20px",
    borderRadius: "5px 5px 0px 0px",
    color: theme.palette.primary.main,
    fontSize: "1rem",
  },
  closeBtn: { position: "absolute", top: "0px", right: "0px" },
  content: { padding: "30px 20px 20px 20px" },
  actions: { padding: "10px 20px", backgroundColor: "#DEE7F690" },
  searchBarBorder: {
    border: "1px solid rgb(125,182,230)",
    borderRadius: "4px",
  },
  searchIcon: {
    color: theme.palette.primary.main,
  },
  dialog: {
    borderRadius: "10px",
  },
}));
