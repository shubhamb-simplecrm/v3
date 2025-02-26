import React from 'react';
// styles
import useStyles, { getMuiTheme } from "./styles";
import { useTheme,Grid, Typography, Paper, Button } from '@material-ui/core';
import ZoomOutMapSharpIcon from '@material-ui/icons/ZoomOutMapSharp';
import { MuiThemeProvider } from "@material-ui/core/styles";
export default function Profit() {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <MuiThemeProvider theme={getMuiTheme(theme)}>
            <Grid container className={classes.root}>
                <Grid item xs={12} sm={12}>
                    <Grid container justify="center" alignItems="center" >
                        <Paper className={classes.topRow}>
                            <Grid container direction="row" justifyContent="left" alignItems="left">
                                <Grid item xs={10}>
                                    <Typography style={{color : "rgb(253, 218, 13)"}}>
                                        {"Profitability"} 
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} className={classes.iconButton}>
                                    <ZoomOutMapSharpIcon></ZoomOutMapSharpIcon>
                                </Grid>
                               
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6">
                                        {"LKR 13,058,854"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} className={classes.textRight}>
                                <Button variant="contained" size="small" color="primary" className={classes.npaBtn}>
                                    {"NPA"}
                                </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </MuiThemeProvider>
    );
}
