import { Link } from "@material-ui/core";
import React, { useState } from "react";
import useStyles from "./../styles";
import { pathOr } from "ramda";
import ComposeEmail from "@/components/ComposeEmail";
import useComposeViewData from "@/components/ComposeEmail/hooks/useComposeViewData";

export const EmailLabel = (props) => {
  const classes = useStyles();
  const { viewName, formData, fieldValue, moduleName, customArgs } = props;
  const { tableMeta, ACLAccessObj } = customArgs;

  const { actions } = useComposeViewData((state) => ({
    emailLoading: state.emailLoading,
    actions: state.actions,
  }));

  const [emailDialogStatus, setEmailDialogStatus] = useState(false);
  const recordId = pathOr(
    "",
    [pathOr("", ["rowIndex"], tableMeta), "id"],
    formData,
  );
  const name = pathOr(
    "",
    [pathOr("", ["rowIndex"], tableMeta), "attributes", "name"],
    formData,
  );
  const handleOnClick = () => {
    setEmailDialogStatus(true);
    actions.handleOpenEmailCompose(
      {
        moduleName: moduleName,
        recordId: recordId,
      },
      {
        to_addrs_names: [fieldValue],
        parent_name: {
          parent_name: name,
          parent_type: moduleName,
          parent_id: recordId,
        },
      },
    );
  };
  return (
    <>
      <Link
        className={classes.emailLink}
        component="button"
        variant="body2"
        onClick={handleOnClick}
      >
        {fieldValue}
      </Link>
      {!!emailDialogStatus ? (
        <ComposeEmail
          handleClose={() => setEmailDialogStatus(false)}
          open={emailDialogStatus}
        />
      ) : null}
    </>
  );
};
