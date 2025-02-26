import React from "react";
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { useTheme, Button, Dialog, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import { getMuiTheme } from "./styles";
import parse from "html-react-parser";
import { Scrollbars } from "react-custom-scrollbars";
import {
  LBL_BPM_LOG_TITLE,
  LBL_CLOSE_BUTTON_TITLE,
} from "../../../../constant";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function Log({
  open,
  handleClose,
  data,
  fullWidth = true,
  maxWidth = "sm",
}) {
  const theme = useTheme();
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {LBL_BPM_LOG_TITLE}
        </DialogTitle>

        <DialogContent dividers>
          <Scrollbars autoHide style={{ height: "60vh" }}>
            <Timeline>
              {Object.values(data).map((log, index) => (
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="primary" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>{parse(log)}</TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Scrollbars>
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            {LBL_CLOSE_BUTTON_TITLE}
          </Button>
        </DialogActions>
      </Dialog>
    </MuiThemeProvider>
  );
}
