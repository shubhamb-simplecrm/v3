import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import React from "react";
import { LBL_ATTACHMENT_BUTTON_TITLE } from "../../../../../constant";
import FormInput from "../../../../FormInput";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";
import { pathOr } from "ramda";
function AttachmentDialogBox(props) {
  const { module, onClose, field, onChange, open, initialValues } = props;
  const classes = useStyles();
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        style: {
          minHeight: "80vh",
          maxHeight: "80vh",
          minWidth: "80%",
        },
      }}
    >
      <DialogTitle id="simple-dialog-title">
        {LBL_ATTACHMENT_BUTTON_TITLE}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          className={classes.closeButton}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormInput
          field={field}
          module={module}
          onChange={onChange}
          value={pathOr([], [field.field_key], initialValues)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AttachmentDialogBox;
