import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  emailContainer: {
    height: "100%",
    overflowX: "hidden",
  },
  sidebar: { width: "18%" },
  mobileSidebar: { width: "100%" },
  expandIcon: { cursor: "pointer" },
  emailList: {
    backgroundColor: "rgb(231,237,246, 0.5)",
    borderRadius: "5px 0px 0px 5px ",
    width: "82%",
    margin: "8px 0px",
  },
  emailDetail: {
    backgroundColor: "rgb(231,237,246, 0.5)",
    width: "57%",
    margin: "8px 0px",
  },
  emailDetailCollapse: {
    width: "72.5%",
  },
  mobileEmailDetail: {
    width: "100%",
  },
  emailListDetail: {
    backgroundColor: "rgb(231,237,246, 0.5)",
    width: "25%",
    margin: "8px 0px",
  },
  collapseEmailList: {
    width: "97.5%",
  },
  collapseEmailDetail: {
    width: "25%",
  },
  mobileEmailList: {
    borderRadius: "0px",
    width: "100%",
    margin: "0px",
  },
  mobileDetailList: {
    display: "none",
  },
  floatingBtn: {
    borderRadius: "25px",
    backgroundColor: "#ffffff",
    padding: "10px 10px 5px 10px",
    zIndex: 9999999,
    position: "fixed",
    bottom: "70px",
    right: "30px",
    margin: "0px",
    border: "1px solid lightgray",
    boxShadow: "#80808020 0px 3px 5px 0px ",
  },
  addIcon: { transform: "scale(1.5)" },
  //EmailNoRecords
  noRecords: {
    color: "gray",
    fontWeight: "bold",
    fontSize: "1.1rem",
    padding: "0px 10px",
    margin: "0px",
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingTop: "70px",
  },
  message: {
    color: "gray",
    fontSize: "1.1rem",
    padding: "0px 15px",
    padding: "0px 15px",
    margin: "0px",
  },
  mobileMessage: {
    padding: "0px 15px 20px 15px",
  },
}));
