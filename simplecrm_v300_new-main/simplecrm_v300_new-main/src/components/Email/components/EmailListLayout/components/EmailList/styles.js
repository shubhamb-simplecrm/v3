import { colors } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  listItem: {
    padding: "0px 8px 0px 0px",
    marginBottom: "7px",
    backgroundColor: "#ffffff",
    borderRadius: "5px",
    marginLeft: "-3px",
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    alignItems: "center",
    "&:hover": {
      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
    },
  },
  avatar: {
    fontSize: "1.3rem",
    width: "38px",
    height: "38px",
    opacity: "0.7",
  },
  noRecords: {
    color: "gray",
    fontWeight: "bold",
    fontSize: "1.1rem",
    padding: "0px 10px",
    margin: "0px",
  },
  listContent: {
    display: "flex",
    direction: "row",
    alignContent: "center",
    alignItems: "center",
  },
  mobileListItem: { padding: "11px 8px" },
  detailListItem: { padding: "8px" },
  selectedListItem: { border: "2px solid #0071D2", boxShadow: "rgba(99, 99, 99, 0.1) 1px 1px 2px 1px" },
  list: { padding: "0px 12px 0px 13px", cursor: "pointer" },
  mobileList: { padding: "0px 8px 0px 15px", cursor: "pointer" },
  actionIcon: {
    cursor: "pointer",
    padding: "3px",
    color: "rgb(117,117,117,0.8)",
  },
  export: {
    marginRight: "5px",
  },
  mail: {
    marginRight: "5px",
  },
  archive: {
    marginRight: "1px",
  },
  delete: {
    padding: "3px",
  },
  starFilledIcon: {
    color: colors.amber[400],
  },
}));
