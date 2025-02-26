import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  statusBg: {
    borderRadius: '2px',
    textTransform: 'uppercase',
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: '1px',
    paddingRight: '12px',
    paddingLeft: '12px'

},
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {},
  });
};
