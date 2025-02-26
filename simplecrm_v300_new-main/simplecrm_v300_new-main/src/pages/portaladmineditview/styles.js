import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  breadCrumb: {
    background: theme.palette.background.paper,
    padding: "10px 10px 0px 10px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    paddingBottom: "14.5px",
    marginLeft: "10px",
  },
  noAccessPage: {
    height: "90vh",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  noAccessText: {
    color: "grey",
  },
}));

export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {},
  });
};
