import React from "react";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";
import { Paper } from "@material-ui/core";
import { ErrorBoundary, AdminEditView } from "../../components";
import useStyles from "./styles";
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation";
import { LBL_ACCESS_DENIED, LBL_ACCESS_DENIED_MSG } from "@/constant";

const PortalAdminEditView = () => {
  const classes = useStyles();
  let isAdmin = pathOr(
    false,
    ["currentUserData", "data", "attributes", "is_admin"],
    useSelector((state) => state.config),
  );

  if (!isAdmin) {
    return (
      <div className={classes.noAccessPage}>
        <h3 className={classes.noAccessText}>{LBL_ACCESS_DENIED}</h3>
        <h6 className={classes.noAccessText}>{LBL_ACCESS_DENIED_MSG}</h6>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Paper style={{ height: "fit-content", overflow: "scroll" }}>
        <BreadCrumbNavigation />
        <AdminEditView />
      </Paper>
    </ErrorBoundary>
  );
};

export default PortalAdminEditView;
