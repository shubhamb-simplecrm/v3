import React from 'react';
// styles
import useStyles, { getMuiTheme } from "./styles";
import { useTheme, Grid, Typography, Paper } from '@material-ui/core';
import { MuiThemeProvider } from "@material-ui/core/styles";
import { FaIcon } from '../../';
import {textEllipsis}  from '../../../common/utils';
import {pathOr} from "ramda";

export default function Counter({ counterData }) {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <MuiThemeProvider theme={getMuiTheme(theme)}>
            <Grid container className={classes.root}>
                <Grid item xs={12}>

                    <Grid container justify="center" alignItems="center" >

                        {counterData.map((row, rowNum) =>
                            <Grid key={rowNum} sm={3} item style={{ padding: 5 }} >
                                <Paper className={classes.topRow} style={{ background: row.color }}>
                                    <Grid container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="left"
                                    >
                                        <Grid item xs={4} style={{ margin: 'auto' }}>
                                            <Typography variant="button" display="block" >

                                                <FaIcon icon={`fas ${row.icon_detail.faicon ? row.icon_detail.faicon : "fa-cube"}`} size="3x" />
                                            </Typography>

                                        </Grid>
                                        <Grid item xs={8}>

                                            <Typography variant="h5">
                                                {row.total_count}

                                            </Typography>
                                            <Typography variant="h6" title={row.label}>

                                                {textEllipsis(row.label,13)}

                                            </Typography>
                                            <Typography variant="overline" display="block" >
                                                <strong>{((pathOr("Filter Count",["filter","value"],row).length>0 &&  Array.isArray(pathOr("Filter Count",["filter","value"],row)))?pathOr("Filter Count",["filter","value"],row).join(", "):pathOr("Filter Count",["filter","value"],row))}: {row.filter_count}</strong>
                                            </Typography>

                                        </Grid>
                                    </Grid>

                                </Paper>

                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </MuiThemeProvider>
    );
}
