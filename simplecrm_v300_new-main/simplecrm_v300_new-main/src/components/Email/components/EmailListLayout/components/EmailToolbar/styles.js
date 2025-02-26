import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  searchBar: {
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #dedede",
    display: "flex",
    justifyContent: "space-between",
    padding: "3px 10px 3px 8px ",
    alignContent: "center",
    alignItems: "center",
    gap: "10px",
    height: "41px",
    backgroundColor: "#ffffff",
    margin: "0px",
  },
  searchIcon: { cursor: "pointer" },
  emailSearch: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    gap: "5px",
    padding: "10px 10px 0px 10px",
  },
  searchInput: { width: "100%", height: "33px" },
  icon: { padding: "1px", cursor: "pointer" },
  smallIcon: { padding: "1.5px" },
  clearIcon: { padding: "2px", marginLeft:"5px" },
  menuList: { fontSize: "0.9rem" },
  fieldset: {
    border: "none",
    padding: "4.9px 10.5px 8.75px 8.75px",
  },
  mobileLoading: {
    margin: "0px 10px" ,
  },
  topbar: {
    padding: "4px 4px 3px 0px",
  },
  mobileTopbar: {
    padding: "4px 2px 4.5px 10px",
  },
  noDataLoading: {
    margin:"10px"
  }
}));
