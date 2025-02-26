import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  buttonGroupRoot: {
    display: "flex",
    justifyContent: "end",
    gap: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  warning: {
    margin: "5px 10px",
    padding: "5px 10px",
    fontSize: "0.65rem",
    float: "left",
  },
  addDashboardImage: {
    height: 150,
    border: "1px solid #ccc",
  },
  addDashboardContainer: {
    display: "flex",
    gap: 10,
    justifyContent: "space-evenly",
  },
  dashboardSettingPopover: {
    fontSize: "0.875rem",
  },
  removeListStyle: {
    listStyleType: "none", // Remove the bullet marker
  },
  btn: {
    color: theme.palette.icon.color,
  },
  text: {
    padding: "0px 10px",
  },
  dashboardLayoutIcon: {
    height: 25,
    margin: "auto 5px",
    // padiing: "10px 10px",
  },
}));
