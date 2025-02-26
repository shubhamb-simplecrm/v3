import React, { useState } from "react";
import EmailSidebar from "./components/EmailSidebar";
import { CircularProgress, Grid, Tooltip } from "@material-ui/core";
import EmailListLayout from "./components/EmailListLayout";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import { useEmailState } from "./useEmailState";
import useStyles from "./styles";
import clsx from "clsx";
import AddIcon from "@material-ui/icons/Add";
import EmailDetailView from "./components/EmailDetailView";
import EmailNoRecords from "./EmailNoRecords";
import { LBL_EMAIL_NO_FOLDERS } from "@/constant";
import { isEmpty, isNil } from "ramda";
import useComposeViewData from "../ComposeEmail/hooks/useComposeViewData";
import ComposeEmail from "../ComposeEmail";

const Email = () => {
  const classes = useStyles();
  const isMobileViewCheck = useIsMobileView("md");
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const { collapseSidebar, isDetailViewOpen, folderData, emailAction } =
    useEmailState((state) => ({
      collapseSidebar: state.collapseSidebar,
      isDetailViewOpen: state.isDetailViewOpen,
      folderData: state.folderData,
      emailAction: state.actions,
    }));
  const { emailLoading, actions } = useComposeViewData((state) => ({
    actions: state.actions,
    emailLoading: state.emailLoading,
  }));

  if (isEmpty(folderData) || isNil(folderData)) {
    return <EmailNoRecords message={LBL_EMAIL_NO_FOLDERS} />;
  }
  return (
    <>
      {openEmailDialog ? (
        <ComposeEmail
          handleClose={() => setOpenEmailDialog(false)}
          open={openEmailDialog}
        />
      ) : null}
      <Grid container direction="row" className={classes.emailContainer}>
        {collapseSidebar ? (
          !isMobileViewCheck && (
            <Grid item style={{ width: "2.5%", padding: "20px 0px 0px 10px " }}>
              <ArrowForwardIosIcon
                color="primary"
                className={classes.expandIcon}
                onClick={() => emailAction.toggleSideBar()}
              />
            </Grid>
          )
        ) : (
          <Grid
            item
            className={clsx(classes.sidebar, {
              [classes.mobileSidebar]: isMobileViewCheck,
            })}
          >
            <EmailSidebar />
          </Grid>
        )}

        {collapseSidebar || !isMobileViewCheck ? (
          <Grid
            item
            className={clsx(classes.emailList, {
              [classes.collapseEmailList]: collapseSidebar,
              [classes.collapseEmailDetail]:
                collapseSidebar && isDetailViewOpen,
              [classes.emailListDetail]: isDetailViewOpen,
              [classes.mobileEmailList]: isMobileViewCheck,
              [classes.mobileDetailList]: isMobileViewCheck && isDetailViewOpen,
            })}
          >
            <EmailListLayout />
          </Grid>
        ) : null}
        {(collapseSidebar || !isMobileViewCheck) && isDetailViewOpen ? (
          <Grid
            item
            className={clsx(classes.emailDetail, {
              [classes.emailDetailCollapse]: collapseSidebar,
              [classes.mobileEmailDetail]: isMobileViewCheck,
            })}
          >
            <EmailDetailView />
          </Grid>
        ) : null}

        {isMobileViewCheck ? (
          <Tooltip title={"Compose Email"}>
            <span className={classes.floatingBtn}>
              {emailLoading ? (
                <CircularProgress disableShrink size={20} />
              ) : (
                <AddIcon
                  color="primary"
                  className={classes.addIcon}
                  onClick={() => {
                    setOpenEmailDialog(true);
                    actions.handleOpenEmailCompose();
                  }}
                />
              )}
            </span>
          </Tooltip>
        ) : null}
      </Grid>
    </>
  );
};

export default Email;
