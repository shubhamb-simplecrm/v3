import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2, 0, 5, 2),
    margin: "auto",
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2, 0.5),
    },
    border:"none",
  },
  loaderColor: {
    color: theme.palette.primary.main,
  },
  margin: {
    marginLeft: theme.spacing(1),
  },
  padding:{
    padding:"0px",
    border:"none"
  }
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {},
  });
};
