import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  fileNameLinkTxt:{
    textDecoration: "none",
    color: theme.palette.primary.main, 
    fontSize: '1rem',
    width: '250px',whiteSpace:'nowrap',overflow: 'hidden',textOverflow:'ellipsis'
  }
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {},
  });
};
