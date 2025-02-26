import { createTheme } from "@material-ui/core/styles";

export const getMuiTheme = (theme) => {
  return createTheme({
    ...theme,
    overrides: {
      MuiIconButton: {
        root: {
          padding: "0px 12px",
        },
      },
      MuiTypography: {
        subtitle2: {
          color: theme.palette.label.detailView.color + " !important",
        },
      },
    },
  });
};
