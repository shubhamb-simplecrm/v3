import { FaIcon } from "@/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  Avatar,
  Card,
  Chip,
  ClickAwayListener,
  Fade,
  IconButton,
  List,
  ListItem,
  Paper,
  Tooltip,
  Popper,
  Typography,
} from "@material-ui/core";
import { useTheme, withStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { stringToColor, truncate } from "../../../../../../common/utils";
import CallReceivedIcon from "@material-ui/icons/CallReceived";
import CallMadeIcon from "@material-ui/icons/CallMade";
import React, { memo, useState } from "react";
import useStyles from "./styles";
import "./styles.js";
import { isEmpty, isNil, pathOr } from "ramda";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ReplyIcon from "@material-ui/icons/Reply";
import ReplyAllIcon from "@material-ui/icons/ReplyAll";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useModuleViewDetail } from "@/hooks/useModuleViewDetail";
import { Alert } from "@/components";
import { toast } from "react-toastify";
import {
  deleteRelationship,
  closeActivity,
} from "../../../../../../store/actions/subpanel.actions";
import CloseIcon from "@material-ui/icons/Close";
import {
  LBL_CLOSE_CONFIRM_MESSAGE,
  LBL_CLOSED,
  LBL_DELETE_RELATIONSHIP_CONFIRM_MESSAGE,
  LBL_DELETE_RELATIONSHIP_CONFIRM_TITLE,
  LBL_WARNING_TITLE,
  SOMETHING_WENT_WRONG,
} from "@/constant";
import ComposeEmail from "@/components/ComposeEmail";
import useComposeViewData from "@/components/ComposeEmail/hooks/useComposeViewData";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import useCommonUtils from "@/hooks/useCommonUtils";
import { useSelector } from "react-redux";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import { LBL_NO_VIEW_ACCESS } from "@/constant/language/en_us";
import parse from "html-react-parser";
import clsx from "clsx";

const getChipStyle = (currentTheme, chipBgColor) => {
  if (currentTheme.palette.type === "dark") {
    return {
      color: chipBgColor,
      fontWeight: "bolder",
      background: "transparent",
      border: "1px solid",
    };
  }
  return {
    color: chipBgColor,
    background: `${chipBgColor}20`,
    border: "none",
  };
};

const StyledChip = withStyles({
  root: {
    maxWidth: "100%",
    display: "flex",
    alignSelf: "end",
  },
  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
})(Chip);

const statusField = "status";
const SidePanelCard = ({
  item,
  onTabRefresh,
  tabValue,
  setIsSubpanelUpdated,
  recordName,
  recordId,
  handleOpenDetailViewDialog,
  renderEmailDetailViewDialog,
}) => {
  console.log(item.title);
  const [expandActivity, setExpandActivity] = useState(false);
  const classes = useStyles();
  const currentTheme = useTheme();
  const IsMobile = useIsMobileView("xs");
  const detailViewAccess = item?.ACLAccess?.view;
  const [isReadMore, setIsReadMore] = useState(false);
  const words = item.description?.split(" ") || [];
  const displayedText = isReadMore
    ? words.join(" ")
    : words.slice(0, 50).join(" ");

  const toggleExpand = () => {
    setIsReadMore((prev) => !prev);
  };

  const { quickCreateModules } = useSelector(
    (state) => state?.layout?.sidebarLinks,
  );
  const toggleExpandActivity = () => {
    setExpandActivity(!expandActivity);
  };
  const { getStatusFieldBackgroundColor } = useCommonUtils();
  const optionsBgColor = getStatusFieldBackgroundColor(
    item.recordModule,
    statusField,
  );
  const chipBgColor = pathOr(
    pathOr("", ["default", "background_color"], optionsBgColor),
    [item.status, "background_color"],
    optionsBgColor,
  );
  const chipStyle = getChipStyle(currentTheme, chipBgColor);
  function isEmail() {
    return item.recordModule === "Emails";
  }
  function isOutBound() {
    return item.status.charAt(0) === "O";
  }

  return (
    <>
      <Card className={classes.mainCard} id="activity-container-card">
        <div className={classes.titleWrapper}>
          <div className={classes.iconContainer}>
            <span
              className={classes.iconBadge}
              onClick={() =>
                isEmail()
                  ? renderEmailDetailViewDialog(item.record_id)
                  : handleOpenDetailViewDialog(
                      item.record_id,
                      item.recordModule,
                    )
              }
            >
              {isEmail() ? (
                isOutBound() ? (
                  <div className={classes.outBadge}>
                    <CallMadeIcon
                      style={{
                        width: "0.6rem",
                        height: "0.6rem",
                        color: "#ED0A0A",
                      }}
                    />
                  </div>
                ) : (
                  <div className={classes.inBadge}>
                    <CallReceivedIcon
                      style={{
                        width: "0.6rem",
                        height: "0.6rem",
                        color: "#0B6E25",
                      }}
                    />
                  </div>
                )
              ) : null}
              <FaIcon
                className={classes.barIcon}
                id="activity-icon"
                icon={`fas ${pathOr(
                  "fas fa-cube",
                  [item.recordModule, "icon", "icon"],
                  quickCreateModules,
                )}`}
                size="1x"
              />
            </span>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <div
                  onClick={() =>
                    item.ACLAccess.view
                      ? isEmail()
                        ? renderEmailDetailViewDialog(item.record_id)
                        : handleOpenDetailViewDialog(
                            item.record_id,
                            item.recordModule,
                          )
                      : toast(LBL_NO_VIEW_ACCESS)
                  }
                  className={classes.title}
                  id="activity-title"
                >
                  {item.title}
                </div>
                {isEmail() ? (
                  <p
                    className={clsx(classes.fromEmailAddr, {
                      [classes.mobileFromEmailAddr]: IsMobile,
                    })}
                  >
                    <span
                      style={{
                        color: "#707070",
                        fontSize: "12px",
                        fontWeight: "600",
                        paddingRight: "3px",
                      }}
                    >
                      From:
                    </span>
                    {item.fromAddr} at {item.date}
                  </p>
                ) : (
                  <div className={classes.date} id="activity-date">
                    <span className={classes.dateLabel}>{item.dateLabel}</span>
                    {item.date}
                  </div>
                )}
              </div>
              <div className={classes.moreOptionsContainer}>
                {isEmail() ? null : (
                  <IconButton size="small">
                    {expandActivity ? (
                      <ExpandLessIcon
                        className={classes.expandIcon}
                        onClick={toggleExpandActivity}
                      />
                    ) : (
                      <ExpandMoreIcon
                        className={classes.expandIcon}
                        onClick={toggleExpandActivity}
                      />
                    )}
                  </IconButton>
                )}
                <MoreOptionsButton
                  item={item}
                  isEmail={isEmail}
                  onTabRefresh={onTabRefresh}
                  tabValue={tabValue}
                  setIsSubpanelUpdated={setIsSubpanelUpdated}
                  recordId={recordId}
                  recordName={recordName}
                />
              </div>
            </div>
            {isEmail() ? (
              <div className={classes.otherData}>
                <ToAddrs item={item} />
                <ToAddrs item={item} cc={true} />
                <ToAddrs item={item} bcc={true} />
              </div>
            ) : (
              <div className={classes.moreDetailsWrapper}>
                {isEmpty(item.assignedUser) ||
                isNil(item.assignedUser) ? null : (
                  <div
                    className={
                      item.status === ""
                        ? classes.moreDetailsFull
                        : classes.moreDetails
                    }
                  >
                    <div className={classes.user} id="assigned-user-name">
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{
                          marginRight: "5px",
                          fontSize: "11px",
                          color: "#828282",
                        }}
                      />
                      {item.assignedUser}
                    </div>
                  </div>
                )}
                <div
                  className={
                    item.status === ""
                      ? classes.disabledActivityStatus
                      : classes.activityStatus
                  }
                >
                  {!isEmpty(item.status) && (
                    <StyledChip
                      size="small"
                      className={classes.statusChip}
                      label={item.status}
                      style={chipStyle}
                      sx={{
                        maxWidth: 100, // Set max-width to ensure ellipsis is applied
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {expandActivity ? (
          <pre
            style={{ whiteSpace: "pre-wrap" }}
            className={classes.description}
          >
            {parse(displayedText)}
            {words.length > 50 && (
              <button
                onClick={toggleExpand}
                style={{
                  marginLeft: "0px",
                  color: "#0071d2",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  fontFamily:"Poppins"
                }}
              >
                {isReadMore ? "Read Less" : "Read More"}
              </button>
            )}
          </pre>
        ) : null}
      </Card>
    </>
  );
};

export default memo(SidePanelCard);

const ToAddrs = ({ item, cc, bcc }) => {
  const classes = useStyles();
  const [popperOpen, setPopperOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const avtarName = (str) => {
    let userName = str;
    if (userName) {
      userName = userName.trim()[0];
    }
    return userName ? userName.toUpperCase() : <AccountCircleIcon />;
  };
  const avtarColor = (str) => {
    let color = stringToColor(str);
    return color;
  };

  const handleShowAll = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setPopperOpen((prev) => !prev);
  };
  const handleClickAway = () => {
    setPopperOpen(false);
  };
  let chipsData = [];
  const chipsDataTo = item?.toAddr
    ? item.toAddr.split(",").map((email) => email.trim())
    : [];
  const chipsDataCc = item?.cc_addrs
    ? item.cc_addrs.split(",").map((ccEmail) => ccEmail.trim())
    : [];
  const chipsDataBcc = item?.bcc_addrs
    ? item.bcc_addrs.split(",").map((bccEmail) => bccEmail.trim())
    : [];
  chipsData = cc ? chipsDataCc : bcc ? chipsDataBcc : chipsDataTo;

  const visibleChips = chipsData.slice(0, 1);
  const hiddenChips = chipsData.slice(visibleChips.length);
  const hiddenChipsCount = chipsData.length - 1;
  const label = cc ? "Cc: " : bcc ? "Bcc: " : "To: ";
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };
  return (
    <>
      {chipsData.length === 0 ? (
        <>{""}</>
      ) : (
        <Typography className={classes.addrs}>
          <span className={classes.emailAddrsLabel}>{label}</span>
          <span>
            {visibleChips.map((chip, index) => (
              <Chip
                size="small"
                key={index}
                label={
                  chip.length > 30 ? (
                    <Tooltip title={chip}>
                      <span>{truncate(chip, 30)}</span>
                    </Tooltip>
                  ) : (
                    truncate(chip, 30)
                  )
                }
                className={classes.chip}
                avatar={
                  <Avatar
                    alt={chip}
                    style={{
                      backgroundColor: `${avtarColor(chip)}`,
                      color: "white",
                      opacity: "0.6",
                      marginLeft: "0px",
                      height: "15px",
                      width: "15px",
                    }}
                  >
                    {avtarName(chip)}
                  </Avatar>
                }
              />
            ))}
            {hiddenChipsCount > 0 && (
              <span onClick={handleShowAll} className={classes.count}>
                {"+" + hiddenChipsCount}
              </span>
            )}
          </span>
          <ClickAwayListener onClickAway={handleClickAway}>
            <Popper
              open={popperOpen}
              anchorEl={anchorEl}
              placement="bottom-start"
              style={{ zIndex: "1000" }}
            >
              <Paper className={classes.popperContent}>
                <span className={classes.emailAddrsLabel}>{label}</span>
                {hiddenChips.map((chip, index) => (
                  <Chip
                    size="small"
                    key={index}
                    label={chip}
                    className={classes.chip}
                    avatar={
                      <Avatar
                        alt={chip}
                        style={{
                          backgroundColor: avtarColor(chip),
                          color: "white",
                          opacity: "0.6",
                          height: "15px",
                          marginLeft: "0px",
                          width: "15px",
                        }}
                      >
                        {avtarName(chip)}
                      </Avatar>
                    }
                  />
                ))}
              </Paper>
            </Popper>
          </ClickAwayListener>
        </Typography>
      )}
    </>
  );
};

const MoreOptionsButton = ({
  item,
  isEmail,
  onTabRefresh,
  tabValue,
  setIsSubpanelUpdated,
  recordId,
  recordName,
}) => {
  const { module } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const metaObj = useModuleViewDetail();
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activityRecord, setActivityRecord] = useState("");
  const [alertVisible, setAlertVisibility] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const { actions } = useComposeViewData((state) => ({
    actions: state.actions,
  }));
  const [openQuickCreateDialog, setOpenQuickCreateDialog] = useState(false);

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleEdit = (module, id) => {
    history.push(`/app/editview/${module}/${id}`);
  };
  const closeActivityMethod = async () => {
    setAlertVisibility(!alertVisible);
    try {
      var submitData = {
        data: {
          type: activityRecord.relationship,
          id: activityRecord.relateId,
          attributes: {
            status: activityRecord.status,
          },
        },
      };
      let data = JSON.stringify(submitData);
      const res = await closeActivity(data);
      if (res.data.data.id) {
        onTabRefresh();
        setIsSubpanelUpdated(true);
        toast(LBL_CLOSED);
      }
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
    }
  };
  const confirmCloseActivity = (module, record, relationship, relateId) => {
    setAlertVisibility(true);
    setActivityRecord({
      module: module,
      record: record,
      relationship: relationship,
      status: item.recordModule === "Tasks" ? "Completed" : "Held",
      relateId: relateId,
      function: "closeActivity",
      msg: LBL_CLOSE_CONFIRM_MESSAGE,
      title: LBL_WARNING_TITLE,
    });
  };
  const deleteRelationshipRecord = async () => {
    setAlertVisibility(!alertVisible);
    try {
      const res = await deleteRelationship(
        activityRecord.module,
        activityRecord.record,
        activityRecord.relationship,
        activityRecord.relateId,
        activityRecord.rel,
      );
      toast(res?.data ? res?.data?.meta?.message : res?.data?.errors?.detail);
      setIsSubpanelUpdated(true);
      onTabRefresh();
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
    }
  };
  const confirmDeleteRelationship = (
    module,
    record,
    relationship,
    relateId,
    rel,
  ) => {
    setAlertVisibility(true);
    setActivityRecord({
      rel: rel,
      module: module,
      record: record,
      relationship: relationship,
      relateId: relateId,
      function: "deleteRelationshipRecord",
      msg: LBL_DELETE_RELATIONSHIP_CONFIRM_MESSAGE,
      title: LBL_DELETE_RELATIONSHIP_CONFIRM_TITLE,
    });
  };
  const handleOpenQuickCreateDialog = (option, actionName, data = null) => {
    if (option === "Create") {
      if (actionName !== "Emails") {
        setOpenQuickCreateDialog(!openQuickCreateDialog);
      } else {
        setOpenEmailDialog(true);
        actions.handleOpenEmailCompose(
          {
            moduleName: "Emails",
            actionType: data.type,
            recordId: item.record_id,
          },
          {
            ...data,
            parent_name: {
              parent_type: module,
              parent_id: recordId,
              parent_name: recordName,
            },
            name: data.title,
            date_entered: data.date,
          },
          data.type,
        );
      }
    } else {
      setOpenRelatedTo(!openRelatedTo);
    }
  };
  const activityOptions = [
    {
      label: "Close",
      access: tabValue == "History" ? false : item?.ACLAccess.edit,
      icon: <CloseIcon className={classes.optionIcon} />,
      action: () =>
        confirmCloseActivity(
          metaObj?.currentModule,
          metaObj?.recordId,
          item?.recordModule,
          item?.record_id,
        ),
    },
    {
      label: "Edit",
      access: item.ACLAccess.edit,
      icon: <EditIcon className={classes.optionIcon} />,
      action: () => handleEdit(item.recordModule, item.record_id),
    },
    {
      label: "Delete",
      access: item.ACLAccess.delete,
      icon: <DeleteIcon className={classes.optionIcon} />,
      action: () =>
        confirmDeleteRelationship(
          metaObj?.currentModule,
          metaObj?.recordId,
          item?.recordModule.toLowerCase(),
          item?.record_id,
          item?.recordModule.toLowerCase(),
        ),
    },
  ];

  const filteredActivityOptions =
    tabValue === "History"
      ? activityOptions.filter((option) => option.label !== "Close")
      : activityOptions;

  const emailOptions = [
    {
      label: "Reply",
      access: item.ACLAccess.reply,
      icon: <ReplyIcon className={classes.optionIcon} />,
      action: () =>
        handleOpenQuickCreateDialog("Create", "Emails", {
          ...item,
          type: "reply",
        }),
    },
    {
      label: "ReplyAll",
      access: item.ACLAccess.replyAll,
      icon: <ReplyAllIcon className={classes.optionIcon} />,
      action: () =>
        handleOpenQuickCreateDialog("Create", "Emails", {
          ...item,
          type: "replyAll",
        }),
    },
    // {
    //   label: "Forward",
    //   access: item.ACLAccess.forward,
    //   icon: <ArrowForwardIcon className={classes.optionIcon} />,
    //   action: () =>
    //     handleOpenQuickCreateDialog("Create", "Emails", {
    //       ...item,
    //       type: "forward",
    //     }),
    // },
  ];
  return (
    <>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        style={{ zIndex: "1000" }}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <div>
                  <Card elevation={2} className={classes.moreOptionsWrapper}>
                    <List className={classes.moreOptionsList}>
                      {isEmail()
                        ? emailOptions.map((option) => {
                            return (
                              <ListItem
                                className={classes.option}
                                button
                                disabled={!option.access}
                                onClick={option.action}
                                id={option.label}
                              >
                                {option.icon}
                                <Typography className={classes.optionLabel}>
                                  {option.label}
                                </Typography>
                              </ListItem>
                            );
                          })
                        : filteredActivityOptions.map((option) => {
                            return (
                              <ListItem
                                className={classes.option}
                                button
                                disabled={!option.access}
                                onClick={option.action}
                                id={option.label}
                              >
                                {option.icon}
                                <Typography className={classes.optionLabel}>
                                  {option.label}
                                </Typography>
                              </ListItem>
                            );
                          })}
                    </List>
                  </Card>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
      <IconButton
        className={classes.moreOptionsContainer}
        onClick={handleClick("bottom-left")}
        id="moreButton-activity-panel"
        size="small"
        style={{ paddingTop: "6px" }}
      >
        <MoreVertIcon className={classes.moreIcon} />
      </IconButton>
      {alertVisible ? (
        <Alert
          title={activityRecord.title}
          msg={activityRecord.msg}
          open={alertVisible}
          agreeText={"Yes"}
          disagreeText={"No"}
          handleClose={() => setAlertVisibility(!alertVisible)}
          onAgree={
            activityRecord.function === "closeActivity"
              ? closeActivityMethod
              : deleteRelationshipRecord
          }
        />
      ) : null}
      {openEmailDialog ? (
        <ComposeEmail
          handleClose={() => setOpenEmailDialog(false)}
          open={openEmailDialog}
        />
      ) : null}
    </>
  );
};
