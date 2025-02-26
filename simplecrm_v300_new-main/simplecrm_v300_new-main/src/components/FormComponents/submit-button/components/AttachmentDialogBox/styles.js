import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing.unit / 2,
    top: theme.spacing.unit / 2,
    color: theme.palette.grey[500],
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
  });
};
