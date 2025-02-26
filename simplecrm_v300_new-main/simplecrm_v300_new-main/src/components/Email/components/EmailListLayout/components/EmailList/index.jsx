import React, { useCallback, useState } from "react";
import { useEmailState } from "@/components/Email/useEmailState";
import { isEmpty, isNil, pathOr } from "ramda";
import clsx from "clsx";
import DeleteIcon from "@material-ui/icons/Delete";
import MailIcon from "@material-ui/icons/Mail";
import useStyles from "./styles";
import "./styles.css";
import { Avatar, Checkbox, IconButton, Tooltip, Grid } from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { stringToColor, truncate } from "@/common/utils";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import DraftsIcon from "@material-ui/icons/Drafts";
import { getFirstAlphabet, getFromName } from "@/components/Email/email-utils";
import EmailNoRecords from "@/components/Email/EmailNoRecords";
import {
  LBL_DELETE_EMAIL,
  LBL_NO_RECORD,
  LBL_STARRED,
  LBL_UNSTARRED,
  LBL_WARNING_TITLE,
} from "@/constant";
import { Alert } from "@/components";

const EmailList = () => {
  const classes = useStyles();
  const isMobileView = useIsMobileView();
  const { listData, selectedRowsList, isDetailViewOpen, listViewLoading } =
    useEmailState((state) => ({
      listData: state.listData,
      selectedRowsList: state.selectedRowsList,
      isDetailViewOpen: state.isDetailViewOpen,
      listViewLoading: state.listViewLoading,
    }));

  const renderList = useCallback(() => {
    return listData.map((email, index) => {
      return (
        <div
          className={clsx(classes.list, {
            [classes.mobileList]: isMobileView || isDetailViewOpen,
          })}
        >
          <EmailListItem email={email} index={index} />
        </div>
      );
    });
  }, [listData, selectedRowsList]);
  if ((isEmpty(listData) || isNil(listData)) && !listViewLoading) {
    return <EmailNoRecords message={LBL_NO_RECORD} />;
  }
  return (
    <div
      style={{ maxHeight: isMobileView ? "90vh" : "70vh", overflow: "scroll" }}
    >
      {renderList()}
    </div>
  );
};

export default EmailList;

export const EmailListItem = ({ email, index }) => {
  const classes = useStyles();
  const isMobileViewCheck = useIsMobileView("md");
  const subject = truncate(pathOr("", ["subject"], email), 80);
  const dateRecieved = pathOr("", ["date"], email);
  const uid = pathOr("", ["uid"], email);
  const emailAddressInfo = getFromName(
    pathOr("", ["email_address_info"], email),
  );
  const {
    listData,
    selectedRowsList,
    actions,
    isDetailViewOpen,
    detailViewEmailUID,
    selectedFolderName,
  } = useEmailState((state) => ({
    listData: state.listData,
    selectedRowsList: state.selectedRowsList,
    actions: state.actions,
    isDetailViewOpen: state.isDetailViewOpen,
    detailViewEmailUID: state.detailViewEmailUID,
    selectedFolderName: state.selectedFolderName,
  }));

  const isRead = pathOr(false, ["seen"], email);
  const isFavorite = pathOr(false, ["flagged"], email);

  var regex = /: (.+)/;
  var emailAdr = regex.exec(emailAddressInfo);

  const toggleAction = (event, type) => {
    event.stopPropagation();
    if (type === "flagged" || type === "unflagged") {
      actions.onChangeEmailStatus("flagged", uid, !isFavorite);
    } else if (type === "read" || type === "unread") {
      actions.onChangeEmailStatus("seen", uid, !isRead);
    }
    actions.onEmailAction(type, email?.uid);
  };

  const renderListItems = useCallback(
    (email) => {
      return (
        <Grid
          container
          direction="row"
          alignContent="center"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid
            item
            lg={isDetailViewOpen ? 9 : 3}
            xs={8}
            className={classes.listContent}
          >
            {isMobileViewCheck || isDetailViewOpen ? null : (
              <Checkbox
                color="primary"
                size="small"
                checked={selectedRowsList[email?.uid] ?? false}
                onClick={(e) => {
                  e.stopPropagation();
                  actions.onRowSelectionChange(email?.uid);
                }}
              />
            )}
            {isMobileViewCheck || isDetailViewOpen ? null : (
              <div style={{ paddingRight: "20px" }}>
                <Tooltip title={isFavorite ? LBL_STARRED : LBL_UNSTARRED}>
                  <IconButton size="small">
                    {isFavorite ? (
                      <StarIcon
                        style={{ padding: "2px" }}
                        onClick={(e) => toggleAction(e, "unflagged")}
                        className={clsx(
                          classes.starIcon,
                          classes.starFilledIcon,
                        )}
                      />
                    ) : (
                      <StarBorderIcon
                        style={{ padding: "2px" }}
                        className={classes.starIcon}
                        onClick={(e) => toggleAction(e, "flagged")}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              </div>
            )}
            {isMobileViewCheck || isDetailViewOpen ? null : (
              <Avatar
                src={emailAddressInfo}
                style={{
                  padding: "5px",
                  fontSize: "1rem",
                  width: "28px",
                  height: "28px",
                  backgroundColor: stringToColor(emailAddressInfo),
                  // opacity: "0.7",
                }}
              >
                {getFirstAlphabet(emailAdr?.[1] ?? emailAddressInfo)}
              </Avatar>
            )}
            <Tooltip
              title={emailAddressInfo}
              disableHoverListener={
                emailAddressInfo.length < isDetailViewOpen ? 25 : 18
              }
            >
              <div
                style={{
                  paddingLeft:
                    isDetailViewOpen || isMobileViewCheck ? "0px" : "10px",
                  paddingRight: "20px",
                  fontWeight: isRead ? "normal" : "bold",
                  wordWrap: "break-word",
                  wordBreak: "break-all",
                }}
              >
                {truncate(emailAddressInfo, isDetailViewOpen ? 25 : 18)}
              </div>
            </Tooltip>
          </Grid>
          {isMobileViewCheck || isDetailViewOpen ? (
            <Grid
              item
              xs={3}
              style={{
                fontSize:
                  isMobileViewCheck || isDetailViewOpen ? "0.7rem" : "0.65rem",
                textAlign: "right",
                fontWeight: isRead ? "normal" : "bolder",
                wordWrap: "break-word",
              }}
            >
              <span>{dateRecieved}</span>
            </Grid>
          ) : null}
          <Grid
            item
            lg={isDetailViewOpen ? 12 : 7}
            xs={12}
            md={10}
            style={{
              fontWeight: isRead ? "normal" : "bolder",
              fontSize:
                isMobileViewCheck || isDetailViewOpen ? "0.8rem" : "0.875rem",
              padding:
                isMobileViewCheck || isDetailViewOpen
                  ? "2px 10px 0px 0px"
                  : "0px 0xp 0px 10px",
              wordWrap: "break-word",
              wordBreak: "break-all",
            }}
          >
            {subject}
          </Grid>

          {isMobileViewCheck || isDetailViewOpen ? null : (
            <Grid
              item
              style={{
                fontSize: "0.75rem",
                width: "10%",
                textAlign: "right",
                fontWeight: isRead ? "normal" : "bolder",
              }}
              md={2}
            >
              <span
                className="dateTime"
                style={{ fontWeight: isRead ? "normal" : "bolder" }}
              >
                {dateRecieved}
              </span>
              {selectedFolderName.toLowerCase().includes("inbox") ? (
                <EmailActions toggleAction={toggleAction} isRead={isRead} />
              ) : null}
            </Grid>
          )}
        </Grid>
      );
    },
    [email, isFavorite, isRead, selectedRowsList, listData, isDetailViewOpen],
  );
  return (
    <>
      <span
        className={clsx("listItem", classes.listItem, {
          [classes.mobileListItem]: isMobileViewCheck,
          [classes.detailListItem]: isDetailViewOpen,
          [classes.selectedListItem]:
            email?.uid == detailViewEmailUID && isDetailViewOpen,
        })}
        onClick={() => {
          actions.getEmailDetailData(
            email.uid,
            email.msgno,
            email.seen,
            email.flagged,
          );
        }}
      >
        {isMobileViewCheck || isDetailViewOpen ? (
          <Avatar
            src={emailAddressInfo}
            style={{
              backgroundColor: stringToColor(emailAddressInfo),
            }}
            className={classes.avatar}
          >
            {getFirstAlphabet(emailAdr?.[1] ?? emailAddressInfo)}
          </Avatar>
        ) : null}
        {renderListItems(email)}
      </span>
    </>
  );
};

export const EmailActions = ({ toggleAction, isRead }) => {
  const classes = useStyles();
  const [openDeleteAlert, setOpenAlert] = useState(false);
  const actionList = {
    // export: "Export",
    mail: `Mark as ${isRead ? "Unread" : "Read"}`,
    // delete: "Delete",
  };

  const ActionIcon = new Map(
    Object.entries({
      mail: isRead ? MailIcon : DraftsIcon,
      // delete: DeleteIcon,
    }),
  );

  const onActionClick = (e, type) => {
    if (type == "mail") {
      toggleAction(e, isRead ? "unread" : "read");
    } else if (type == "delete") {
      e.stopPropagation();
      setOpenAlert(!openDeleteAlert);
    } else {
      toggleAction(e, type);
    }
  };

  const handleCloseAlert = (e) => {
    e.stopPropagation();
    setOpenAlert(!openDeleteAlert);
  };
  const renderActionIcon = (action, label) => {
    let Icon = ActionIcon.get(action);
    return (
      <Tooltip title={label}>
        <Icon
          className={clsx(classes.actionIcon, classes[action])}
          onClick={(e) => onActionClick(e, action)}
        />
      </Tooltip>
    );
  };
  return (
    <span className="icon">
      <Alert
        msg={LBL_DELETE_EMAIL}
        title={LBL_WARNING_TITLE}
        onAgree={(e) => {
          toggleAction(e, "delete");
          setOpenAlert(!openDeleteAlert);
        }}
        handleClose={(e) => handleCloseAlert(e)}
        open={openDeleteAlert}
        onDisagree={(e) => handleCloseAlert(e)}
      />
      {Object.entries(actionList).map(([action, label]) => {
        return renderActionIcon(action, label);
      })}
    </span>
  );
};
