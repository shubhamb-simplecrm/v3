import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main, 
    fontSize: '1rem'
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {},
  });
};
