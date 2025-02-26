import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  alert: { margin: "0px 15px" },
  btnGrid: {
    textAlign: "right",
    padding: "0px 10px 10px 0px",
  },
  summary: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  accordion: {
    paddingTop: "10px",
  },
  accordionDetails: {
    // height:"60vh",
    display: "block",
    hieght: "auto",
  },
  edit: {
    padding: "20px 0px 5px 0px",
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
  // card: {
  //   boxShadow: theme.shadows[1],
  //   marginTop: "20px",
  // },
  cardActions: {
    // textAlign:"right"
    display: "flex",
    justifyContent: "right",
    // alignItems:"flex-end"
  },
  card1: {
    boxShadow: theme.shadows[1],
    margin: "20px 10px 0px 20px",
    height: "auto",
  },
  treeView: {
    backgroundColor: theme.palette.background.paper,
    color: "rgb(0,164,231)",
    // width:"100px",
  },
  tree: {
    padding: "15px 10px",
  },
  ruleGroup: {
    // background: props => props.themeType == "dark" ? "red" : blue
  },
  darkRuleGroup: {
    background: "red",
  },
  errorMessage: { color: "red" },
  fieldset: { border: "none" },
  cardHeading: {
    fontSize: "16px",
    fontWeight: "bold",
    paddingBottom: "20px",
    color: "rgb(111,111,111)",
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiAccordionDetails: {
        root: {
          display: "block",
        },
      },
      MuiCardContent: {
        root: {
          overflow: "scroll",
        },
      },
    },
  });
};
