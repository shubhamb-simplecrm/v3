import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  searchBar: {
    height: "31px !important",
    width: "100%",
    marginLeft: "-5px",
    // color:theme.palette.primary.main
    // ForwardRef: {
    searchIconButton: {
      color: "blue",
    },
    // },
  },
  searchBarBorder: {
    border: "1px solid rgb(125,182,230)",
    borderRadius: "4px",
  },
  searchIcon: {
    color: theme.palette.primary.main,
  },
}));
