import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { PropTypes } from "prop-types";
import { Skeleton } from "@/components";

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
  const { children, classes, onClose, isLoading, ...other } = props;
  if (isLoading) return null;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="subtitle1">{children}</Typography>
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
    padding: theme.spacing(1),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomDialog(props) {
  const {
    isDialogOpen,
    handleCloseDialog,
    bodyContent,
    bottomActionContent,
    title,
    fullScreen = false,
    fullWidth = true,
    maxWidth = "md",
    isLoading = false,
    className = null,
    style,
    height,
    backdropClickPreventClose = false,
    titleStyle = {},
    minHeight = 150,
  } = props;
  const handleOnClose = (event, reason) => {
    if (!!backdropClickPreventClose && reason && reason === "backdropClick")
      return;
    if (typeof handleCloseDialog === "function") handleCloseDialog();
  };

  return (
    <Dialog
      className={className}
      onClose={handleOnClose}
      aria-labelledby="customized-dialog-title"
      open={isDialogOpen}
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      PaperProps={{
        style: {
          overflowY: "hidden",
          minHeight: minHeight,
          height: height,
        },
      }}
      disableBackdropClick="true"
    >
      {title && (
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleCloseDialog}
          isLoading={isLoading}
          style={titleStyle}
        >
          {title}
        </DialogTitle>
      )}
      <DialogContent style={style}>
        {isLoading ? <Skeleton /> : bodyContent}
      </DialogContent>
      {bottomActionContent && !isLoading && (
        <DialogActions>{bottomActionContent}</DialogActions>
      )}
    </Dialog>
  );
}
CustomDialog.propTypes = {
  isDialogOpen: PropTypes.bool,
  handleCloseDialog: PropTypes.func,
  title: PropTypes.string,
  fullScreen: PropTypes.bool,
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.string,
  bodyContent: PropTypes.element,
  bottomActionContent: PropTypes.element,
};
