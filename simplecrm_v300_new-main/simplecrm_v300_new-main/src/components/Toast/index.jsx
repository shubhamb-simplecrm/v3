import React from "react";
import { Snackbar } from "@material-ui/core";

const Toast = ({ msg, showToast, onClose }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={showToast}
      autoHideDuration={6000}
      message={msg}
      onClose={onClose}
    />
  );
};

export default Toast;
