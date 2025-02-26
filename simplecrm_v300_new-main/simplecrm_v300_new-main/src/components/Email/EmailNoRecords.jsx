import React from "react";
import backgroundImage from "../../assets/email-bg.svg";
import { LBL_EMAIL_NO_RECORD_TITLE, LBL_NO_RECORD } from "@/constant";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import useStyles from "./styles";
import clsx from "clsx";

const EmailNoRecords = ({ message = LBL_NO_RECORD }) => {
  const isMobileView = useIsMobileView();
  const classes = useStyles();
  return (
    <div className={classes.paper}>
      <span className={classes.noRecords}>{LBL_EMAIL_NO_RECORD_TITLE}</span>
      <span
        className={clsx(classes.message, {
          [classes.mobileMessage]: isMobileView,
        })}
      >
        {message}
      </span>

      <img
        src={backgroundImage}
        alt="Girl in a jacket"
        width={isMobileView ? "100%" : "38%"}
        height={isMobileView ? "100%" : "38%"}
      />
    </div>
  );
};

export default EmailNoRecords;
