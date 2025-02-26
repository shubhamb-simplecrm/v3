import { makeStyles } from "@material-ui/styles";
export default makeStyles((theme) => ({
  root: {
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
  tabName: {
    whiteSpace: "nowrap",
    overflow: "visible",
    textOverflow: "ellipsis",
    fontWeight: "normal",
  },
  tabButton: {
    color: theme.palette.text.primary,
  },
  backgroundDash: {
    backgroundColor: "#DEDEDE",
    // Added for empty dashboard height adjustment
    // minHeight: "82vh",
    minHeight: "100%",
    // height: "100vh",
  },
  ".MuiTab .flexContainer": {
    boarder: "none",
    // "& .flexContainer": {
    // },
  },
  tabBackground: {
    background: theme.palette.background.paper,
    border: "none",
  },
  tabs: {
    border: "none",
  }
}));
