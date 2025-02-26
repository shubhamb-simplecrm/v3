import { Grid, Button, Badge, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import useStyles from "./styles";
import {
  LBL_ATTACHMENT_BUTTON_TITLE,
  LBL_CANCEL_BUTTON_TITLE,
  LBL_SAVE_BUTTON_TITLE,
} from "../../../constant";
import AttachmentDialogBox from "./components/AttachmentDialogBox";
import { isNil } from "ramda";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { LAYOUT_VIEW_TYPE } from "../../../common/layout-constants";

const attachmentField = {
  label: "Add Attachments",
  field_key: "documents",
  name: "documents",
  type: "multifile",
  default: "None",
  initial_documents: [],
  value: [],
};

export default function SubmitButton({
  module,
  id,
  returnModule,
  returnRecord,
  formSubmitting = false,
  onChange,
  initialValues,
  view,
  handleCloseQuickCreateDialog,
}) {
  const history = useHistory();
  const classes = useStyles();
  const [attachmentDialogState, setAttachmentDialogState] = useState(false);
  const handleCloseDialog = () => {
    setAttachmentDialogState(false);
  };
  const enableAttachmentButton = useSelector(
    (state) => state?.config?.config?.enable_attachment_button,
  );
  const isAttachmentButtonAllow = enableAttachmentButton?.includes(module);
  const handleChange = (value) => {
    onChange(attachmentField, value);
  };

  return (
    <>
      <div key="editFooter">
        <Grid
          container
          direction="row"
          alignItems="center"
          // spacing={2}
          style={{ justifyContent: "right", padding: "1rem" }}
          wrap="nowrap"
        >
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              size="small"
              color="primary"
              disabled={formSubmitting}
            >
              {
                // On submit button: loader
                formSubmitting ? (
                  <>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={8}>
                        <Typography
                          className={classes.loaderColor}
                          variant="overflow"
                        >
                          Saving...
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        container
                        justifyContent="right"
                        alignItems="center"
                      >
                        <CircularProgress
                          size={16}
                          thickness={5}
                          className={classes.loaderColor}
                          variant="indeterminate"
                        />
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  LBL_SAVE_BUTTON_TITLE
                )
              }
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => {
                let url = id
                  ? `/app/detailview/${module}/${id}`
                  : `/app/${module}`;
                if (history.location.pathname.includes("/createrelateview/")) {
                  url = `/app/detailview/${returnModule}/${returnRecord}`;
                } else if (
                  history.location.pathname.includes("/portalAdminLinks")
                ) {
                  url = `/app/portalAdministrator`;
                } else if (view == LAYOUT_VIEW_TYPE.quickCreateView) {
                  handleCloseQuickCreateDialog();
                  return;
                }
                history.push(url);
              }}
              className={classes.margin}
              disabled={formSubmitting}
            >
              {LBL_CANCEL_BUTTON_TITLE}
            </Button>
          </Grid>
          <Grid item>
            {isAttachmentButtonAllow &&
            view != LAYOUT_VIEW_TYPE.quickCreateView ? (
              <Badge
                // badgeContent={
                //   !isNil(isAttachmentButtonAllow)
                //     ? initialValues[attachmentField?.field_key]?.length
                //     : null
                // }
                color="error"
                sx={{ maxWidth: "max-content" }}
              >
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => {
                    setAttachmentDialogState((v) => !v);
                  }}
                  className={classes.margin}
                  disabled={isNil(attachmentField)}
                >
                  {LBL_ATTACHMENT_BUTTON_TITLE}
                </Button>
              </Badge>
            ) : null}
          </Grid>
        </Grid>
      </div>
      {attachmentDialogState ? (
        <AttachmentDialogBox
          module={module}
          open={attachmentDialogState}
          onClose={handleCloseDialog}
          onChange={handleChange}
          initialValues={initialValues}
          field={attachmentField}
        />
      ) : null}
    </>
  );
}
