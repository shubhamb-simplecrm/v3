import { createMuiTheme } from "@material-ui/core/styles";

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {}
  })
}