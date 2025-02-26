import React, { useState } from "react";
import { Link as MuiLink, Typography } from "@material-ui/core";
import useStyles from "./styles";
import { checkMaskingCondition } from "../../../common/utils";
import { withStyles } from "@material-ui/styles";
import clsx from "clsx";
import useComposeViewData from "@/components/ComposeEmail/hooks/useComposeViewData";
import ComposeEmail from "@/components/ComposeEmail";
const MuiCustomLink = withStyles({
  root: {
    "&[disabled]": {
      cursor: "pointer",
      "&:hover": {
        textDecoration: "none",
      },
    },
  },
})(MuiLink);
const EmailString = ({
  field,
  data,
  parent_name = null,
  parent_id = null,
  parent_type = null,
  fieldConfiguratorData = {},
}) => {
  const classes = useStyles();
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const { actions } = useComposeViewData((state) => ({
    actions: state.actions,
  }));

  const handleEmailPopup = (email) => {
    setOpenEmailDialog(true);
    actions.handleOpenEmailCompose(
      {
        moduleName: parent_type,
        recordId: parent_name,
        recordName: parent_name,
      },
      {
        to_addrs_names: [email],
      },
    );
  };

  const emailList = {
    primary: [],
    optOut: [],
    invalid: [],
    other: [],
  };
  field.value.map((email, key) => {
    const valueData = checkMaskingCondition(
      fieldConfiguratorData,
      { [field.field_key]: email.email },
      "masking",
    );
    if (email.primary) {
      emailList["primary"].push(valueData.email1);
    } else if (email.optOut) {
      emailList["optOut"].push(valueData.email1);
    } else if (email.invalid) {
      emailList["invalid"].push(valueData.email1);
    } else {
      emailList["other"].push(valueData.email1);
    }
  });

  return (
    <>
      {openEmailDialog ? (
        <ComposeEmail
          handleClose={() => setOpenEmailDialog(false)}
          open={openEmailDialog}
        />
      ) : null}

      {Object.entries(emailList).map(([emailType, emailArr]) =>
        emailArr.map((email, index) =>
          emailType == "primary" ||
          emailType == "invalid" ||
          emailType == "other" ? (
            <MuiCustomLink
              className={clsx(
                classes.emailLink,
                emailType == "invalid" && classes.invalidEmailLink,
              )}
              variant="body2"
              onClick={() => handleEmailPopup(email)}
              id={`email-${index}`}
              component="div"
            >
              {`${email}`}
              <span>{emailType != "other" && `(${emailType})`}</span>
            </MuiCustomLink>
          ) : (
            <Typography
              className={clsx(
                emailType == "optOut" && classes.invalidEmailLink,
              )}
            >
              {`${email}`}
              <span>{`(${emailType})`}</span>
            </Typography>
          ),
        ),
      )}
    </>
  );
};
export default EmailString;
