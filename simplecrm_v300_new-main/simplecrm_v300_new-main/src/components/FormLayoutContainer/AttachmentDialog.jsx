import React from "react";
import useStyles from "./styles";
import {
  LBL_ATTACHMENT_BUTTON_TITLE,
  LBL_CANCEL_BUTTON_TITLE,
} from "@/constant";
import { Button } from "@/components/SharedComponents/Button";
import CustomDialog from "@/components/SharedComponents/CustomDialog";
import { Box } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import { attachmentField } from "./editview-constant";
import CustomFormInput from "@/components/CustomFormInput";
import EditViewFormInput from "./EditViewFormInput";
export const AttachmentDialog = (props) => {
  const { onClose, open, ...rest } = props;
  const classes = useStyles();
  return (
    <>
      <CustomDialog
        isDialogOpen={open}
        handleCloseDialog={onClose}
        title={LBL_ATTACHMENT_BUTTON_TITLE}
        maxWidth={"md"}
        fullWidth={true}
        bodyContent={
          <EditViewFormInput {...rest} fieldMetaObj={attachmentField} />
        }
        bottomActionContent={
          <Box className={classes.buttonGroupRoot}>
            <Button
              label={LBL_CANCEL_BUTTON_TITLE}
              startIcon={<CancelIcon />}
              onClick={onClose}
            />
          </Box>
        }
      />
    </>
  );
};
