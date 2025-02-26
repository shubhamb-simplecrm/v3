import React from "react";
import {
    useTheme,
    List,
    ListItem,
    ListItemText,
    Grid,
} from "@material-ui/core";
import useStyles, { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Scrollbars from "react-custom-scrollbars";
export default function AISuggestions() {
    let data = ["Might be interested to purchase 'Complete laptop protection '"]
    const classes = useStyles();
    const currentTheme = useTheme();
    return (
        <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
            <Scrollbars autoHide={false} style={{ height: "28vh" }}>
                <List dense className={classes.root}>
                    {data.map((item, index) => {
                        return <ListItem
                            key={`records-${index}`}
                        >
                            <ListItemText
                                id={`checkbox-list-secondary-label-${index}`}
                                primary={
                                    <React.Fragment>
                                        <Grid container xs={12} md={12}>
                                            <Grid item className={classes.inline}>
                                                {item}
                                            </Grid>
                                        </Grid>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    })}
                </List>
            </Scrollbars>
        </MuiThemeProvider>
    );
}
