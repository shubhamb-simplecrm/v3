import React from "react";
import { Box, DialogContentText } from "@material-ui/core";
import CustomDialog from "../SharedComponents/CustomDialog";
import { Button } from "../SharedComponents/Button";
import { LBL_CONFIRM_NO, LBL_CONFIRM_YES } from "@/constant";

const Alert = ({
  title,
  msg,
  agreeText = LBL_CONFIRM_YES,
  disagreeText = LBL_CONFIRM_NO,
  open,
  handleClose,
  onAgree = null,
  onDisagree = null,
  loading = false,
  agreeButtonProps = {},
  disagreeButtonProps = {},
  content,
  showDisagreeButton = true,
}) => {
  return (
    <>
      <CustomDialog
        isDialogOpen={open}
        handleCloseDialog={handleClose}
        title={title}
        maxWidth="sm"
        bodyContent={
          <>
            <DialogContentText id="alert-dialog-description">
              {msg}
              <p>{content}</p>
            </DialogContentText>
          </>
        }
        bottomActionContent={
          <Box
            style={{
              display: "flex",
              justifyContent: "end",
              gap: 10,
              paddingBottom: 10,
              paddingTop: 10,
            }}
          >
            {showDisagreeButton ? (
              <Button
                {...disagreeButtonProps}
                label={disagreeText}
                // startIcon={<SaveIcon />}
                onClick={onDisagree ? onDisagree : handleClose}
                disabled={loading}
              />
            ) : null}
            <Button
              {...agreeButtonProps}
              label={agreeText}
              // startIcon={<CancelIcon />}
              onClick={onAgree}
              disabled={loading}
            />
          </Box>
        }
      />
    </>
  );
};

export default Alert;
