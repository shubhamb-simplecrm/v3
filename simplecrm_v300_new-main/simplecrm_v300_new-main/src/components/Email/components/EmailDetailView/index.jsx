import { useEmailState } from "@/components/Email/useEmailState";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { isEmpty, isNil, pathOr } from "ramda";
import {
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@material-ui/core";
import RedoOutlinedIcon from "@material-ui/icons/RedoOutlined";
import { saveAs } from "file-saver";
import ReplyIcon from "@material-ui/icons/ReplyOutlined";
import ReplyAllIcon from "@material-ui/icons/ReplyAllOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import clsx from "clsx";
import useStyles from "./styles";
import DeleteIcon from "@material-ui/icons/Delete";
import DraftsIcon from "@material-ui/icons/Drafts";
import { Alert, Skeleton } from "@/components";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ForwardIcon from "@material-ui/icons/Forward";
import FileViewerComp from "@/components/FileViewer/FileViewer";
import {
  LBL_DELETE_BUTTON_TITLE,
  LBL_DELETE_EMAIL,
  LBL_DOWNLOAD_INPROGRESS,
  LBL_FORWARD_EMAIL,
  LBL_MARK_AS_UNREAD,
  LBL_PRINT_EMAIL,
  LBL_REPLY,
  LBL_REPLY_ALL,
  LBL_STARRED,
  LBL_UNSTARRED,
  LBL_WARNING_TITLE,
} from "@/constant";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@material-ui/icons/Print";
import ComposeEmail from "@/components/ComposeEmail";
import useComposeViewData from "@/components/ComposeEmail/hooks/useComposeViewData";
import { useParams } from "react-router-dom/cjs/react-router-dom";

const formatEmailAddr = (email = "") => {
  return email.replace(/</g, "(").replace(/>/g, ")");
};

const EmailDetailView = () => {
  const classes = useStyles();
  const isMobileViewCheck = useIsMobileView();
  const { detailLoading, detailData } = useEmailState((state) => ({
    detailData: state.detailData,
    detailLoading: state.detailLoading,
  }));
  const contentRef = React.useRef(null);
  const [printLoading, setPrintLoading] = useState(false);
  const handleOnBeforeGetContent = () => {
    setPrintLoading(true);
  };
  const handleAfterPrint = () => {
    setPrintLoading(false);
  };
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: detailData.name,
    onBeforeGetContent: handleOnBeforeGetContent,
    onAfterPrint: handleAfterPrint,
  });
  if (detailLoading) {
    return <Skeleton layout={"Studio"} />;
  }
  return (
    <div
      className={clsx(classes.emailDetail, {
        [classes.mobileEmailDetail]: isMobileViewCheck,
      })}
    >
      <div
        className={clsx(classes.emailDetailBox, {
          [classes.mobileEmailDetailBox]: isMobileViewCheck,
        })}
      >
        <EmailDetailToolbar
          printLoading={printLoading}
          handlePrint={handlePrint}
        />
        <div ref={contentRef} className={classes.scroll}>
          <EmailDetailHeader />
          <EmailBody />
        </div>
      </div>
    </div>
  );
};

export const EmailDetailHeader = ({ style }) => {
  const classes = useStyles();
  const isMobileViewCheck = useIsMobileView();
  const { detailData, collapseSidebar } = useEmailState((state) => ({
    detailData: state.detailData,
    collapseSidebar: state.collapseSidebar,
  }));
  const fromAddr = pathOr("", ["from_addr_name"], detailData)
    .replace(/</g, "(")
    .replace(/>/g, ")");
  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        direction="row"
        className={clsx(classes.header, {
          [classes.mobileHeader]: isMobileViewCheck,
        })}
        style={style || {}}
      >
        <Grid item xs={12}>
          <p className={classes.subject}>{detailData.name}</p>
          <p className={classes.fromAddr}>
            <b>From:</b> {formatEmailAddr(detailData?.from_addr_name)}
            {" at "}
            {detailData.date_entered}
          </p>
          <EmailInfoFields emails={detailData.to_addrs_names} title={"To:"} />
          <EmailInfoFields emails={detailData.cc_addrs_names} title={"Cc:"} />
          <EmailInfoFields emails={detailData.bcc_addrs_names} title={"Bcc:"} />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
    </>
  );
};

export const EmailBody = () => {
  const classes = useStyles();
  const { detailData } = useEmailState((state) => ({
    detailData: state.detailData,
  }));
  const [previewFile, setPreviewFile] = useState({
    open: false,
    filename: "",
    filepath: "",
  });
  const handleShowPreviewFile = (fname, url) => {
    let arr = fname.split(".");
    let ext = arr[arr.length - 1].toUpperCase();
    setPreviewFile({
      open: true,
      filename: fname,
      filepath: url,
      filetype: ext,
    });
  };

  const handleDownload = (fname, url) => {
    saveAs(url, fname);
    toast(LBL_DOWNLOAD_INPROGRESS);
  };

  return (
    <>
      {previewFile.open ? (
        <FileViewerComp
          previewFile={previewFile}
          setPreviewFile={setPreviewFile}
        />
      ) : null}
      <div className={classes.emailBody}>
        <div
          dangerouslySetInnerHTML={{
            __html: pathOr(
              pathOr("", ["description"], detailData),
              ["description_html"],
              detailData,
            ),
          }}
        />
        {detailData?.attachments
          ? detailData.attachments.map((doc) => {
              return (
                <div key={doc.filename} className={classes.attachments}>
                  {doc.filename}
                  <ForwardIcon
                    color="action"
                    className={classes.forwardIcon}
                    onClick={() => handleDownload(doc.filename, doc.view)}
                  />
                  <VisibilityIcon
                    className={classes.eyeIcon}
                    color="action"
                    onClick={() =>
                      handleShowPreviewFile(doc.filename, doc.link)
                    }
                  />
                </div>
              );
            })
          : null}
      </div>
    </>
  );
};

export const EmailDetailToolbar = ({
  printLoading = false,
  handlePrint,
  showCompactMenu = false,
  parentData = {},
}) => {
  const { module } = useParams();
  const classes = useStyles();
  const isMobileViewCheck = useIsMobileView();
  const { detailData, selectedFolderId, pageNo, actions } = useEmailState(
    (state) => ({
      detailData: state.detailData,
      selectedFolderId: state.selectedFolderId,
      pageNo: state.pageNo,
      actions: state.actions,
      emailLoading: state.emailLoading,
    }),
  );
  const { composeActions, emailLoading } = useComposeViewData((state) => ({
    emailLoading: state.emailLoading,
    composeActions: state.actions,
  }));
  const [isFavorite, setIsFavorite] = useState(detailData?.flagged);
  const [openDeleteAlert, setOpenAlert] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);

  const toggleAction = (type) => {
    if (type === "flagged" || type === "unflagged") {
      actions.onChangeEmailStatus("flagged", detailData?.uid);
    }
    if (type === "unread") {
      actions.onChangeEmailStatus("seen", detailData?.uid);
      actions.onEmailAction(type, detailData?.uid).then(() => {
        actions.getListViewData(selectedFolderId, pageNo);
      });
      return;
    }
    if (type === "delete") {
      actions.getListViewData(selectedFolderId, pageNo);
      actions.toggleEmailDetail();
    }
    actions.onEmailAction(type, detailData?.uid);
  };

  const handleComposeEmailPopup = (type) => {
    setOpenEmailDialog(true);
    composeActions.handleOpenEmailCompose(
      { moduleName: "Emails", recordId: detailData?.crmId, actionType: type },
      {
        ...detailData,
        parent_name: {
          parent_type: module,
          parent_id: parentData?.recordId,
          parent_name: parentData?.recordName,
        },
      },
      type,
    );
  };
  return (
    <>
      <Alert
        msg={LBL_DELETE_EMAIL}
        title={LBL_WARNING_TITLE}
        onAgree={() => {
          toggleAction("delete");
          setOpenAlert(!openDeleteAlert);
        }}
        handleClose={() => setOpenAlert(!openDeleteAlert)}
        open={openDeleteAlert}
        onDisagree={() => setOpenAlert(!openDeleteAlert)}
      />
      {openEmailDialog ? (
        <ComposeEmail
          handleClose={() => setOpenEmailDialog(false)}
          open={openEmailDialog}
        />
      ) : null}
      <div className={classes.toolbar}>
        {showCompactMenu ? null : (
          <IconButton size="small" onClick={() => actions.toggleEmailDetail()}>
            <ArrowBackIcon color="action" className={classes.icon} />
          </IconButton>
        )}
        {showCompactMenu ? null : (
          <Tooltip title={isFavorite ? LBL_STARRED : LBL_UNSTARRED}>
            <IconButton size="small">
              {isFavorite ? (
                <StarIcon
                  onClick={() => {
                    toggleAction("unflagged");
                    setIsFavorite(!isFavorite);
                  }}
                  className={clsx(classes.icon, classes.starFilledIcon)}
                />
              ) : (
                <StarBorderIcon
                  className={classes.icon}
                  onClick={() => {
                    toggleAction("flagged");
                    setIsFavorite(!isFavorite);
                  }}
                />
              )}
            </IconButton>
          </Tooltip>
        )}
        {showCompactMenu ? null : (
          <Tooltip title={LBL_MARK_AS_UNREAD}>
            <IconButton
              size="small"
              onClick={() => {
                toggleAction("unread");
                actions.toggleEmailDetail();
              }}
            >
              <DraftsIcon className={clsx(classes.actionIcon)} />
            </IconButton>
          </Tooltip>
        )}
        {/* <Tooltip title={LBL_DELETE_BUTTON_TITLE}>
          <IconButton
            size="small"
            onClick={() => setOpenAlert(!openDeleteAlert)}
          >
            <DeleteIcon className={classes.actionIcon} />
          </IconButton>
        </Tooltip> */}
        {isMobileViewCheck ? null : (
          <Tooltip title={LBL_PRINT_EMAIL}>
            <IconButton size="small" onClick={() => handlePrint()}>
              {printLoading ? (
                <CircularProgress size={16} />
              ) : (
                <PrintIcon className={classes.actionIcon} />
              )}
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={LBL_REPLY}>
          <IconButton
            size="small"
            onClick={() => handleComposeEmailPopup("reply")}
          >
            <ReplyIcon className={classes.actionIcon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={LBL_REPLY_ALL}>
          <IconButton
            size="small"
            onClick={() => handleComposeEmailPopup("replyAll")}
          >
            <ReplyAllIcon className={classes.actionIcon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={LBL_FORWARD_EMAIL}>
          <IconButton
            size="small"
            onClick={() => handleComposeEmailPopup("forward")}
          >
            <RedoOutlinedIcon className={classes.actionIcon} />
          </IconButton>
        </Tooltip>
      </div>
      <Divider />
    </>
  );
};
export const EmailInfoFields = ({ emails, title }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (isEmpty(emails) || isEmpty(emails?.[0]) || isNil(emails?.[0])) return;
  return (
    <div className={classes.infoFields}>
      <Menu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        elevation={2}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {emails.map((emailAddr) => {
          return !isEmpty(emailAddr) ? (
            <MenuItem
              id={emailAddr}
              key={emailAddr}
              className={classes.menuItem}
            >
              <span className={classes.mailChip}>
                {formatEmailAddr(emailAddr)}
              </span>
            </MenuItem>
          ) : null;
        })}
      </Menu>
      {emails?.length > 1 ? (
        <span className={classes.toAddr}>
          <b>{title}</b>
          <span className={classes.mailChip}>{formatEmailAddr(emails[0])}</span>
          <span className={classes.moreMails} onClick={handleClick}>
            + {emails.length - 1} more
          </span>
        </span>
      ) : isEmpty(emails?.[0]) ? null : (
        <span className={classes.toAddr}>
          <b>{title}</b>
          <span className={classes.mailChip}>{formatEmailAddr(emails[0])}</span>
        </span>
      )}
    </div>
  );
};

export default EmailDetailView;
