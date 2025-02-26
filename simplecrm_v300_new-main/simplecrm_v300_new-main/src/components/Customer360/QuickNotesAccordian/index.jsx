import React, { useState } from "react";
import useStyles, { getMuiTheme } from "./styles";
import {
  useTheme,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Grid,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CreateForm from "./CreateForm";
import ListNotes from "./ListNotes";
import NoteIcon from "@material-ui/icons/Note";

export default function QuickNotesAccordion({ data }) {
  const classes = useStyles();
  const theme = useTheme();
  const [newNote, setNewNote] = useState([]);
  const [updateListView, setUpdateListView] = useState(false);

  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <div className={classes.root}>
        <React.Fragment>
          <Accordion className={classes.accordionBox}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={"quick-note-panel"}
              id={"quick-note-panel"}
            >
              <Avatar
                className={classes.icon}
                style={{ backgroundColor: "rgb(148,210,189)" }}
              >
                <NoteIcon />
              </Avatar>
              <Typography weight="light" variant="subtitle2">
                {"Quick Notes"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.mobileLayoutAccoDetails}>
              <Grid container spacing={2}>
                <Grid item md={6} sm={6} xs={12}>
                  <ListNotes
                    recordData={data}
                    newNote={newNote}
                    setUpdateListView={setUpdateListView}
                  />
                </Grid>

                <Grid item md={6} sm={6} xs={12}>
                  <CreateForm
                    data={data}
                    setNewNote={setNewNote}
                    setUpdateListView={setUpdateListView}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </React.Fragment>
      </div>
    </MuiThemeProvider>
  );
}
