import React, { useState } from "react";
import { CircularProgress, Grid } from "@material-ui/core";
import EmailFolders from "./EmailFolders";
import EditIcon from "@material-ui/icons/Edit";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import ComposeEmail from "@/components/ComposeEmail";
import useComposeViewData from "@/components/ComposeEmail/hooks/useComposeViewData";
import useStyles from "./styles";

const EmailSidebar = () => {
  const classes = useStyles();
  const isMobileViewCheck = useIsMobileView();
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const { emailLoading, actions } = useComposeViewData((state) => ({
    emailLoading: state.emailLoading,
    actions: state.actions,
  }));

  return (
    <>
      {openEmailDialog ? (
        <ComposeEmail
          handleClose={() => setOpenEmailDialog(false)}
          open={openEmailDialog}
        />
      ) : null}
      <EmailFolders />
      {isMobileViewCheck ? null : (
        <div style={{ padding: "0px 10px 0px 6px" }}>
          <div
            className={classes.composeBtn}
            onClick={() => {
              setOpenEmailDialog(true);
              actions.handleOpenEmailCompose();
            }}
          >
            {emailLoading ? (
              <CircularProgress
                disableShrink
                size={20}
                style={{ marginRight: "10px" }}
              />
            ) : (
              <EditIcon style={{ marginRight: "10px" }} />
            )}
            Write an Email
          </div>
        </div>
      )}
    </>
  );
};

export default EmailSidebar;
