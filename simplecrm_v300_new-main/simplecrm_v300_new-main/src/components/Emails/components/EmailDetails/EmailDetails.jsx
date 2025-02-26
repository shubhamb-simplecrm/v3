import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import {
  Menu,
  MenuItem,
  Avatar,
  Divider,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@material-ui/core";
import MoreIcon from "@material-ui/icons/MoreVert";
import ReplyIcon from "@material-ui/icons/ReplyOutlined";
import ReplyAllIcon from "@material-ui/icons/ReplyAllOutlined";
import { pathOr } from "ramda";
import getInitials from "../../../../common/getInitials";
import { useSelector } from "react-redux";
import { EmailSubpanels } from "../";
import { EmailToolbar } from "../EmailList/components";
import parse from "html-react-parser";
import { Scrollbars } from "react-custom-scrollbars";
import QuickCreate from "@/components/QuickCreate";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: 15,
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: theme.palette.background.default,
  },
  receiver: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    height: 45,
    width: 45,
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  actions: {
    display: "flex",
    alignItems: "baseline",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2, 2),
    backgroundColor: theme.palette.background.paper,
    // minHeight:'75vh',
  },
  subpanel_tabs: {
    position: "absolute",
    // bottom:"0px",
    right: "0px",
    left: "0px",
  },
  message: {
    marginTop: theme.spacing(2),
    "& > p": {
      ...theme.typography.subtitle1,
    },
  },
}));

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

const EmailDetails = (props) => {
  const {
    email,
    onEmailClose,
    className,
    handleComposeEmailPopup,
    emailCreateViewLoading,
    setIsSubpanelUpdated,
    setValue,
    value,
    onBack,
    selectedEmail,
    setSelectedEmail,
    setEmailSettingModal,
    meta,
    listViewWhere,
    page,
    sortBy,
    sortOrder,
    lastListViewSort,
    rowsPerPage,
    changePageOrSort,
    selectedFolder,
    ...rest
  } = props;

  const classes = useStyles();
  const size = useWindowSize();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openQuickCreateDialog, setOpenQuickCreateDialog] = useState(false);
  const [whichQuickCreate, setWhichQuickCreate] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { currentUserData } = useSelector((state) => state.config);

  const handleOpenQuickCreateDialog = (actionName) => {
    handleClose();
    if (actionName !== "Emails") {
      setOpenQuickCreateDialog(!openQuickCreateDialog);
      setWhichQuickCreate(actionName);
    } else {
      handleComposeEmailPopup("forward", email.data);
    }
    let assigned_user_name = {
      id: pathOr("", ["data", "attributes", "id"], currentUserData),
      value: pathOr("", ["data", "attributes", "full_name"], currentUserData),
    };
    switch (actionName) {
      case "Bugs":
        setInitialData({
          name: email.data.name,
          priority: "Urgent",
          type: "Defect",
          status: "New",
          assigned_user_name,
        });
        break;
      case "Cases":
        setInitialData({
          name: email.data.name,
          priority: "High",
          type: "Minor_Defect",
          state: "Open",
          status: "New",
          assigned_user_name,
        });
        break;
      case "Contacts":
        setInitialData({
          description: email.data.name,
          email1: [
            {
              deleted: false,
              email: email.data.from_addr_name,
              invalid: false,
              optOut: false,
              primary: true,
            },
          ],
          assigned_user_name,
        });
        break;
      case "Leads":
        setInitialData({
          description: email.data.name,
          type: "Hot",
          email1: [
            {
              deleted: false,
              email: email.data.from_addr_name,
              invalid: false,
              optOut: false,
              primary: true,
            },
          ],
          assigned_user_name,
        });
        break;
      case "Opportunities":
        setInitialData({
          name: email.data.name,
          sales_stage: "Prospecting",
          probability: 10,
          assigned_user_name,
        });
        break;
      default:
        break;
    }
  };
  const handleCloseDialog = useCallback(() => {
    setOpenQuickCreateDialog(false);
  }, []);
  const handleOnRecordSuccess = useCallback(() => {
    setOpenQuickCreateDialog();
    setIsSubpanelUpdated(true);
  }, []);

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <EmailToolbar
        onBack={onEmailClose}
        view="DetailView"
        selectedEmail={selectedEmail}
        setSelectedEmail={setSelectedEmail}
        setEmailSettingModal={setEmailSettingModal}
        meta={meta}
        listViewWhere={listViewWhere}
        page={page}
        sortBy={sortBy}
        sortOrder={sortOrder}
        lastListViewSort={lastListViewSort}
        rowsPerPage={rowsPerPage}
        changePageOrSort={changePageOrSort}
      />
      <Divider />
      <Scrollbars autoHide style={{ height: "120vh" }}>
        <div style={{ height: size.height }}>
          <div className={classes.header}>
            <div className={classes.receiver}>
              <Avatar
                className={classes.avatar}
                src={email.data.from_addr_name}
              >
                {getInitials(email.data.from_addr_name)}
              </Avatar>
              <div>
                <Typography display="inline" variant="h5">
                  {email.data.name || ""}
                </Typography>{" "}
                <Typography variant="caption" display="block">
                  From:{" "}
                  <Link
                    style={{ cursor: "pointer" }}
                    color="inherit"
                    onClick={() => handleComposeEmailPopup("reply", email.data)}
                  >
                    {email.data.from_addr_name}
                  </Link>
                </Typography>
                <Typography variant="caption" display="block">
                  To:{" "}
                  {email.data.to_addrs_names &&
                    email.data.to_addrs_names.map((em, k) => (
                      <>
                        <Link color="inherit">{em}</Link>
                        {k > 0 && k < email.data.to_addrs_names.lenght
                          ? ","
                          : ""}
                      </>
                    ))}
                </Typography>
                <Typography variant="caption" display="block">
                  {email.data.date_entered || ""}
                </Typography>
              </div>
            </div>
            <div className={classes.actions}>
              <Tooltip title="Reply">
                <IconButton
                  className={classes.moreButton}
                  size="small"
                  onClick={() => handleComposeEmailPopup("reply", email.data)}
                >
                  <ReplyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reply all">
                <IconButton
                  className={classes.moreButton}
                  size="small"
                  onClick={() =>
                    handleComposeEmailPopup("replyAll", email.data)
                  }
                >
                  <ReplyAllIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="More options">
                <IconButton
                  className={classes.moreButton}
                  size="small"
                  onClick={handleClick}
                >
                  <MoreIcon />
                </IconButton>
              </Tooltip>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleComposeEmailPopup("forward", email.data);
                  }}
                >
                  Forward
                </MenuItem>
                {email.data && email.data.id ? (
                  <>
                    <MenuItem
                      onClick={() => handleOpenQuickCreateDialog("Bugs")}
                    >
                      Create Bug
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleOpenQuickCreateDialog("Cases")}
                    >
                      Create Case
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleOpenQuickCreateDialog("Contacts")}
                    >
                      Create Contact
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleOpenQuickCreateDialog("Leads")}
                    >
                      Create Lead
                    </MenuItem>
                    <MenuItem
                      onClick={() =>
                        handleOpenQuickCreateDialog("Opportunities")
                      }
                    >
                      Create Opportunity
                    </MenuItem>
                  </>
                ) : null}
              </Menu>
            </div>
          </div>
          <Divider />
          <Divider />
          <div className={classes.content}>
            <Scrollbars style={{ height: "63vh" }}>
              {parse(email.data.description_html || "")}
            </Scrollbars>
          </div>
          <Divider />
          <div className={classes.subpanel_tabs}>
            {email.subpanels && email.subpanels.subpanel_tabs ? (
              <EmailSubpanels
                subpanels={email.subpanels}
                record={email.data.id}
                onBack={onEmailClose}
                setIsSubpanelUpdated={setIsSubpanelUpdated}
                setValue={setValue}
                value={value}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </Scrollbars>
      {openQuickCreateDialog && (
        <QuickCreate
          open={openQuickCreateDialog}
          onCancelClick={handleCloseDialog}
          onRecordSuccess={handleOnRecordSuccess}
          moduleName={whichQuickCreate}
          parentData={{
            parent_name: email.data.parent_name,
            parent_id: email.data.parent_id,
            parent_type: email.data.parent_type,
          }}
        />
      )}
    </div>
  );
};

EmailDetails.propTypes = {
  className: PropTypes.string,
  email: PropTypes.object.isRequired,
  onEmailClose: PropTypes.func,
};

export default EmailDetails;
