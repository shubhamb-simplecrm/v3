import React from "react";
import { useTheme, Grid, Paper, Typography } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import FindInPageIcon from "@material-ui/icons/FindInPage";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
// styles
import useStyles, { getMuiTheme } from "./styles";
import { SOMETHING_WENT_WRONG } from "../../../../constant";
import clsx from "clsx";

export default function Error({
  title = SOMETHING_WENT_WRONG,
  type = "error",
}) {
  var classes = useStyles();
  const theme = useTheme();
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Grid container className={classes.container}>
        <Paper classes={{ root: classes.paperRoot }}>
          {type === "error" ? (
            <ErrorOutlineIcon
              className={clsx(classes.textRow, classes.errorCode)}
            />
          ) : (
            ""
          )}
          {type === "warning" ? (
            <FindInPageIcon
              className={clsx(classes.textRow, classes.errorCode)}
            />
          ) : (
            ""
          )}
          {type === "loading" ? (
            <HourglassEmptyIcon
              className={clsx(classes.textRow, classes.errorCode)}
            />
          ) : (
            ""
          )}
          <Typography
            variant="h6"
            color="text"
            colorBrightness="secondary"
            className={clsx(classes.textRow, classes.safetyText)}
          >
            {title}
          </Typography>
        </Paper>
      </Grid>
    </MuiThemeProvider>
  );
}
