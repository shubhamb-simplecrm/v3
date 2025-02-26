import React from "react";
// styles
import useStyles, { getMuiTheme } from "./styles";
import ZoomOutMapSharpIcon from "@material-ui/icons/ZoomOutMapSharp";
import {
  useTheme,
  Grid,
  Typography,
  Paper,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";

export default function TotalAdvances() {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Grid container className={classes.root}>
        <Paper
          className={classes.topRow}
          style={{ backgroundColor: "rgb(54, 69, 79)", width: "100%" }}
        >
          <Grid
            container
            direction="row"
            justifyContent="left"
            alignItems="left"
          >
            <Grid item xs={10}>
              <Typography style={{ color: "rgb(253, 218, 13)" }}>
                {"Total Advances"}
              </Typography>
            </Grid>
            <Grid item xs={2} className={classes.iconButton}>
              <ZoomOutMapSharpIcon></ZoomOutMapSharpIcon>
            </Grid>
            <Grid item xs={12}>
              <Typography align="Left">{"LKR 13,058,854"}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </MuiThemeProvider>
  );
}
