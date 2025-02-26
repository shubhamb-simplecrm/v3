import React from "react";

import useStyles from "./styles";
import NoRecordIcon from "./NoRecordIcon";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import {
  LBL_CHOOSE_REPORT,
  LBL_NO_DATA,
  LBL_NO_RECORDS_FOUND,
  LBL_NO_RECORDS_FOUND_MESSAGE,
  LBL_WANT_TO_CREATE_OR_SELECT_RECORD,
  MODULE_NOT_FOUND_MESSAGE,
} from "../../constant";

const NoRecord = (view, module = "", subpanel_module = "") => {
  const classes = useStyles();
  if (view.view === "subpanel") {
    return (
      <div className={classes.notFoundContainer}>
        <div className={classes.textboxClass}>
          <ErrorOutlineIcon />
          <h2>{LBL_NO_RECORDS_FOUND}</h2>
          {subpanel_module &&
          ["Activities", "History", "SecurityGroups"].includes(
            subpanel_module,
          ) ? (
            <p>{LBL_WANT_TO_CREATE_OR_SELECT_RECORD}?</p>
          ) : null}
        </div>
      </div>
    );
  } else if (view.view === "dashlet_report") {
    return (
      <div className={classes.notFoundContainer}>
        <div className={classes.textboxClass} style={{ padding: "0px" }}>
          <h2>{LBL_CHOOSE_REPORT}</h2>
        </div>
      </div>
    );
  } else if (view.view === "dashlet_no_data") {
    return (
      <div className={classes.notFoundContainer}>
        <div className={classes.textboxClass} style={{ padding: "0px" }}>
          <h2>{LBL_NO_DATA}</h2>
        </div>
      </div>
    );
  } else if (view.view === "studio") {
    return (
      <div className={classes.notFoundContainerStudio}>
        <div className={classes.studioTextboxClass} style={{ padding: "0px" }}>
          <NoRecordIcon />
          <p className={classes.noModuleMesasage}>{MODULE_NOT_FOUND_MESSAGE}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className={classes.notFoundContainerListView}>
        <div className={classes.listViewTextboxClass}>
          <NoRecordIcon />
          <p>
            No data available in this module, or no results match your search
            criteria.
          </p>
        </div>
      </div>
    );
  }
};

export default NoRecord;
