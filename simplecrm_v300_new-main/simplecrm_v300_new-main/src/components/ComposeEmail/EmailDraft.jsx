import React, { useCallback, useState } from "react";
import useComposeViewData from "@/components/ComposeEmail/hooks/useComposeViewData";
import CloseIcon from "@material-ui/icons/Close";
import { Divider, Tooltip } from "@material-ui/core";
import { truncate } from "@/common/utils";
import useStyles from "./styles";
import ComposeEmail from ".";

const EmailDraft = () => {
  const classes = useStyles();
  const { draftEmails, actions, emailLoading } = useComposeViewData(
    (state) => ({
      draftEmails: state.draftEmails,
      actions: state.actions,
      emailLoading: state.emailLoading,
    }),
  );
  const [openEmailDialog, setOpenEmailDialog] = useState({
    open: false,
    selectedIndex: null,
  });

  const renderDraftMails = useCallback(() => {
    return (
      <div className={classes.emailDraft}>
        {openEmailDialog.open ? (
          <ComposeEmail
            handleClose={(type = "") => {
              if (type != "draft") {
                actions.deleteDraft(openEmailDialog.selectedIndex);
              }
              setOpenEmailDialog({ ...openEmailDialog, open: false });
            }}
            open={openEmailDialog.open}
          />
        ) : null}
        {draftEmails.map((email, index) => {
          return (
            <div className={classes.emailDraftCard}>
              <Tooltip title={email.name}>
                <p
                  onClick={() => {
                    actions.openDraft(index);
                    setOpenEmailDialog({ open: true, selectedIndex: index });
                  }}
                >
                  {truncate(email.name, 10)}
                  {" (draft)"}
                </p>
              </Tooltip>
              <Divider orientation="vertical" flexItem />
              <CloseIcon
                className={classes.smallIcon}
                onClick={() => actions.deleteDraft(index)}
              />
            </div>
          );
        })}
      </div>
    );
  }, [draftEmails, openEmailDialog]);

  return renderDraftMails();
};

export default EmailDraft;
