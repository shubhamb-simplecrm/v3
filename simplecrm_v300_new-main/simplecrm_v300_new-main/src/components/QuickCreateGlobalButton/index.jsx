import React, { useState, memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { pathOr } from "ramda";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import { LEFT, RIGHT_SIDEBAR_ACTION, TOP } from "../../constant";
import useStyles from "./styles";
import FaIcon from "../FaIcon";
import QuickCreate from "../QuickCreate";
import { SpeedDialIcon } from "@material-ui/lab";
import { IconButton } from "../SharedComponents/IconButton";
import useComposeViewData from "../ComposeEmail/hooks/useComposeViewData";
import ComposeEmail from "../ComposeEmail";

export default memo(function QuickCreateGlobalButton({
  open,
  handleOpen,
  isMobile,
}) {
  const classes = useStyles();
  const { emailLoading, actions } = useComposeViewData((state) => ({
    emailLoading: state.emailLoading,
    actions: state.actions,
  }));
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openQuickCreateDialog, setOpenQuickCreateDialog] = useState(false);
  const [whichQuickCreate, setWhichQuickCreate] = useState(null);
  const { quickCreateModules } = useSelector(
    (state) => state?.layout?.sidebarLinks,
  );
  const { detailViewTabData } = useSelector((state) => state.detail);
  const location = useLocation();
  let splitPathName = location.pathname.split("/");
  let isDetail = pathOr([], [2], splitPathName);
  let isDetailView = !!isDetail && isDetail === "detailview" ? true : false;
  const module = isDetailView ? splitPathName[3] : "";
  const recordInfo = pathOr(
    [],
    ["data", "templateMeta", "recordInfo"],
    detailViewTabData[module],
  );
  const currentTheme = useSelector((state) =>
    pathOr("", ["config", "V3SelectedTheme"], state.config),
  );
  const handleOpenQuickCreateDialog = (actionName) => {
    if (actionName == "Emails") {
      setOpenEmailDialog(true);
      actions.handleOpenEmailCompose(
        isDetailView
          ? {
              recordId: recordInfo.record_id,
              recordName: recordInfo.record_name,
              moduleName: module,
            }
          : {
              moduleName: "Emails",
            },
        isDetailView && { to_addrs_names: [recordInfo.record_email] || [] },
      );
    } else {
      setOpenQuickCreateDialog(!openQuickCreateDialog);
      setWhichQuickCreate(actionName);
    }
  };

  const parentData = {
    parent_name: isDetailView ? recordInfo.record_name : null,
    parent_id: isDetailView ? recordInfo.record_id : null,
    parent_type: isDetailView ? module : null,
  };
  const handleCloseDialog = useCallback(() => {
    setOpenQuickCreateDialog(false);
  }, []);
  const handleOnRecordSuccess = useCallback(() => {
    setOpenQuickCreateDialog();
  }, []);

  return (
    <>
      {isMobile ? (
        // For Mobile view
        <SpeedDial
          ariaLabel={RIGHT_SIDEBAR_ACTION}
          className={`${classes.speedDial} ${open ? classes.whiteBack : ""}`}
          icon={<SpeedDialIcon />}
          direction={LEFT}
          open={open}
          onClick={handleOpen}
        >
          {quickCreateModules &&
            Object.keys(quickCreateModules).map(
              (moduleName) =>
                pathOr(
                  0,
                  [moduleName, "ACLAccess", "create"],
                  quickCreateModules,
                ) == 1 && (
                  <SpeedDialAction
                    key={`mobile-${moduleName}`}
                    icon={
                      <FaIcon
                        color={
                          currentTheme === "dark"
                            ? "rgb(224, 222, 224)"
                            : "rgb(110,110,110)"
                        }
                        icon={`fas ${pathOr(
                          "fas fa-cube",
                          [moduleName, "icon", "icon"],
                          quickCreateModules,
                        )}`}
                        size="1x"
                      />
                    }
                    placement={TOP}
                    tooltipPlacement={TOP}
                    tooltipTitle={pathOr(
                      moduleName,
                      [moduleName, "label"],
                      quickCreateModules,
                    )}
                    onClick={() => handleOpenQuickCreateDialog(moduleName)}
                    className={classes.iconColor}
                    TooltipClasses={classes}
                    boxShadow={2}
                  />
                ),
            )}
        </SpeedDial>
      ) : (
        // For Desktop View
        <div className={classes.profileBtn}>
          {quickCreateModules &&
            Object.keys(quickCreateModules).map(
              (moduleName) =>
                pathOr(
                  "0",
                  [moduleName, "ACLAccess", "create"],
                  quickCreateModules,
                ) === 1 && (
                  <IconButton
                    key={`mobile-${moduleName}`}
                    tooltipTitle={pathOr(
                      moduleName,
                      [moduleName, "label"],
                      quickCreateModules,
                    )}
                    // aria-controls={`option-${key}`}
                    className={classes.iconBtn}
                    onClick={() => handleOpenQuickCreateDialog(moduleName)}
                  >
                    <FaIcon
                      // color={
                      //   currentTheme === "dark"
                      //     ? "rgb(224, 222, 224)"
                      //     : "rgb(110,110,110)"
                      // }
                      icon={`fas ${pathOr(
                        "fas fa-cube",
                        [moduleName, "icon", "icon"],
                        quickCreateModules,
                      )}`}
                      size="1x"
                      // className={classes.iconInner}
                    />
                    {/* {<option.icon />} */}
                  </IconButton>
                ),
            )}
        </div>
      )}
      {openQuickCreateDialog && (
        <QuickCreate
          open={openQuickCreateDialog}
          onCancelClick={handleCloseDialog}
          onRecordSuccess={handleOnRecordSuccess}
          moduleName={whichQuickCreate}
          parentData={parentData}
        />
      )}
      {openEmailDialog ? (
        <ComposeEmail
          handleClose={() => setOpenEmailDialog(false)}
          open={openEmailDialog}
        />
      ) : null}
    </>
  );
});
