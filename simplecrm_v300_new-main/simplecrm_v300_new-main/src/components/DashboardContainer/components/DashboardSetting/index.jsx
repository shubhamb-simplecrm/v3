import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Box,
  Fade,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { isEmpty, isNil, pathOr } from "ramda";
import SettingsIcon from "@material-ui/icons/Settings";
import {
  LBL_CONFIRM_NO,
  LBL_CONFIRM_YES,
  LBL_DASHBOARD_ADD_ACTIVE_TILE_BUTTON,
  LBL_DASHBOARD_ADD_BUTTON,
  LBL_DASHBOARD_DELETE_BUTTON,
  LBL_DASHBOARD_EDIT_LAYOUT_BUTTON,
  LBL_DASHBOARD_REMOVE_BUTTON,
  LBL_DASHBOARD_REMOVE_CONFIRM_MESSAGE,
  LBL_DASHBOARD_REMOVE_SUCCESS,
  LBL_DASHBOARD_RENAME_BUTTON,
  LBL_DASHBOARD_SAVE_LAYOUT_BUTTON,
  LBL_LAYOUT_UPDATED,
  SOMETHING_WENT_WRONG,
} from "../../../../constant";
import EditIcon from "@material-ui/icons/Edit";
import GridOnIcon from "@material-ui/icons/GridOn";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import BarChartIcon from "@material-ui/icons/BarChart";
import SaveIcon from "@material-ui/icons/Save";
import { Alert } from "../../..";
import {
  removeDashboardTabAction,
  saveDashboardGridLayoutAction,
  setDashboardLayoutEditableAction,
} from "../../../../store/actions/dashboard.actions";
import { toast } from "react-toastify";
import DashboardRenameDialog from "./DashboardRenameDialog";
import DashboardAddDialog from "./DashboardAddDialog";
import DashboardAddDashLetTile from "./DashboardAddDashLetDialog";
import { useSelector } from "react-redux";
import CustomCircularProgress from "../../../SharedComponents/CustomCircularProgress";
import useStyles from "./styles";
import { Button } from "../../../SharedComponents/Button";
import { useIsMobileView } from "../../../../hooks/useIsMobileView";
import { CancelOutlined } from "@material-ui/icons";

export const DashboardSetting = memo((props) => {
  const { currentActiveTabIndex, selectedTabData } = props;
  const classes = useStyles();
  const isMobile = useIsMobileView();
  const isTabView = useIsMobileView("md");
  const isDashboardLayoutEditable = useSelector(
    (state) => state?.dashboard?.isDashboardLayoutEditable,
  );
  const isEditLayoutDisabled =
    useSelector((state) => state?.dashboard?.dashboardData[0]?.lock_homepage) ??
    false;
  const dashboardDashLetList = useSelector(
    (state) => state?.dashboard?.dashboardData[currentActiveTabIndex]?.dashlets,
  );
  const [selectedActionKey, setSelectedActionKey] = useState(null);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOptionClick = useCallback(
    (optionLabel) => {
      if (optionLabel == LBL_DASHBOARD_EDIT_LAYOUT_BUTTON) {
        dispatch(setDashboardLayoutEditableAction(true));
      } else {
        setSelectedActionKey({
          dialogOpenStatus: true,
          selectedOptionLabel: optionLabel,
          dashboardIndex: currentActiveTabIndex,
          selectedTabData,
        });
      }
      handleClose();
    },
    [currentActiveTabIndex, selectedTabData],
  );
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseDialog = useCallback(() => {
    setSelectedActionKey({
      dialogOpenStatus: false,
      selectedOptionLabel: null,
      dashboardIndex: null,
      selectedTabData: null,
    });
  }, []);

  const dashboardSettingMenu = useMemo(
    () => [
      {
        key: "delete_dashboard",
        title: LBL_DASHBOARD_DELETE_BUTTON,
        action: () => handleOptionClick(LBL_DASHBOARD_DELETE_BUTTON),
        icon: <RemoveCircleOutlineIcon fontSize="small" />,
        disabled: isNil(currentActiveTabIndex),
      },
      {
        key: "rename_dashboard",
        title: LBL_DASHBOARD_RENAME_BUTTON,
        action: () => handleOptionClick(LBL_DASHBOARD_RENAME_BUTTON),
        icon: <EditIcon fontSize="small" />,
        disabled:
          isNil(currentActiveTabIndex) ||
          selectedTabData?.pageTitle == "Support Dashboard" ||
          selectedTabData?.pageTitle == "Sales Dashboard" ||
          pathOr("", ["dashType"], selectedTabData) === "default",
      },
      {
        key: "add_dashboard",
        title: LBL_DASHBOARD_ADD_BUTTON,
        action: () => handleOptionClick(LBL_DASHBOARD_ADD_BUTTON),
        icon: <AddCircleOutlineIcon fontSize="small" />,
        disabled: false,
      },
      {
        key: "add_active_tile",
        title: LBL_DASHBOARD_ADD_ACTIVE_TILE_BUTTON,
        action: () => handleOptionClick(LBL_DASHBOARD_ADD_ACTIVE_TILE_BUTTON),
        icon: <BarChartIcon fontSize="small" />,
        disabled:
          isNil(currentActiveTabIndex) ||
          pathOr("", ["dashType"], selectedTabData) === "default",
      },
      {
        key: "edit_dashboard_layout",
        title: LBL_DASHBOARD_EDIT_LAYOUT_BUTTON,
        action: () => handleOptionClick(LBL_DASHBOARD_EDIT_LAYOUT_BUTTON),
        icon: <GridOnIcon fontSize="small" />,
        disabled:
          isEmpty(dashboardDashLetList) ||
          isEditLayoutDisabled ||
          isDashboardLayoutEditable ||
          isNil(currentActiveTabIndex) ||
          pathOr("", ["dashType"], selectedTabData) === "default" ||
          isMobile ||
          isTabView,
      },
    ],
    [
      currentActiveTabIndex,
      selectedTabData,
      isDashboardLayoutEditable,
      dashboardDashLetList,
    ],
  );
  return (
    <>
      <Grid item xs={3}>
        <Box style={{ display: "flex", justifyContent: "flex-end" }}>
          {isDashboardLayoutEditable && (
            <DashboardLayoutSaveOption
              currentActiveTabIndex={currentActiveTabIndex}
            />
          )}
          <IconButton
            disableRipple={true}
            aria-controls="dashboard-setting-option"
            aria-haspopup="true"
            onClick={handleClick}
            className={classes.btn}
          >
            <SettingsIcon />
          </IconButton>
        </Box>

        <Menu
          id="dashboard-setting-option"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          {dashboardSettingMenu.map((o) => (
            <MenuItem
              key={o.key}
              disabled={o.disabled}
              onClick={o.action}
              className={classes.dashboardSettingPopover}
            >
              <ListItemIcon style={{ minWidth: "30px" }}>{o.icon}</ListItemIcon>
              {o.title}
            </MenuItem>
          ))}
        </Menu>
        <DashboardOptionItems
          selectedActionKey={selectedActionKey}
          handleCloseDialog={handleCloseDialog}
        />
      </Grid>
    </>
  );
});

const DashboardOptionItems = memo(
  ({ selectedActionKey, handleCloseDialog }) => {
    const dispatch = useDispatch();
    const dialogOpenStatus = pathOr(
      false,
      ["dialogOpenStatus"],
      selectedActionKey,
    );
    const dialogOpenLabel = pathOr(
      "",
      ["selectedOptionLabel"],
      selectedActionKey,
    );
    const dashboardIndex = pathOr(null, ["dashboardIndex"], selectedActionKey);
    const selectedTabData = pathOr(
      null,
      ["selectedTabData"],
      selectedActionKey,
    );
    const deleteDashboardDashLet = async () => {
      try {
        dispatch(removeDashboardTabAction(dashboardIndex)).then(function (res) {
          if (res.ok) {
            toast(res.ok ? LBL_DASHBOARD_REMOVE_SUCCESS : SOMETHING_WENT_WRONG);
            handleCloseDialog();
          } else {
            toast(SOMETHING_WENT_WRONG);
          }
        });
      } catch (e) {
        toast(SOMETHING_WENT_WRONG);
      }
    };
    if (dialogOpenStatus) {
      if (dialogOpenLabel === LBL_DASHBOARD_DELETE_BUTTON) {
        return (
          <Alert
            title={LBL_DASHBOARD_REMOVE_BUTTON}
            msg={LBL_DASHBOARD_REMOVE_CONFIRM_MESSAGE}
            open={dialogOpenStatus}
            agreeText={LBL_CONFIRM_YES}
            disagreeText={LBL_CONFIRM_NO}
            handleClose={handleCloseDialog}
            onAgree={deleteDashboardDashLet}
          />
        );
      } else if (dialogOpenLabel === LBL_DASHBOARD_RENAME_BUTTON) {
        return (
          <DashboardRenameDialog
            dialogOpenStatus={dialogOpenStatus}
            handleCloseDialog={handleCloseDialog}
            dashboardIndex={dashboardIndex}
            selectedTabData={selectedTabData}
          />
        );
      } else if (dialogOpenLabel === LBL_DASHBOARD_ADD_BUTTON) {
        return (
          <DashboardAddDialog
            dialogOpenStatus={dialogOpenStatus}
            handleCloseDialog={handleCloseDialog}
            dashboardIndex={dashboardIndex}
            selectedTabData={selectedTabData}
          />
        );
      } else if (dialogOpenLabel === LBL_DASHBOARD_ADD_ACTIVE_TILE_BUTTON) {
        return (
          <DashboardAddDashLetTile
            dialogOpenStatus={dialogOpenStatus}
            handleCloseDialog={handleCloseDialog}
            dashboardIndex={dashboardIndex}
            selectedTabData={selectedTabData}
          />
        );
      }
    }
    return null;
  },
);

const DashboardLayoutSaveOption = memo(({ currentActiveTabIndex }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const changedDashLetLayout = useSelector(
    (state) => state?.dashboard?.changedDashLetLayout,
  );
  const dispatch = useDispatch();
  const handleSaveLayout = useCallback(() => {
    if (isEmpty(changedDashLetLayout)) {
      dispatch(setDashboardLayoutEditableAction(false));
      toast(LBL_LAYOUT_UPDATED);
      return null;
    }
    setLoading(true);
    try {
      const payload = {
        current_tab: currentActiveTabIndex.toString(),
        layout: changedDashLetLayout,
      };
      dispatch(saveDashboardGridLayoutAction(payload)).then(function (res) {
        if (res.ok) {
          toast(LBL_LAYOUT_UPDATED);
          setLoading(false);
        } else {
          toast(SOMETHING_WENT_WRONG);
        }
      });
    } catch (e) {
      setLoading(false);
      toast(SOMETHING_WENT_WRONG);
    }
  }, [changedDashLetLayout, currentActiveTabIndex]);
  const handleCandleLayoutEdit = useCallback(() => {
    dispatch(setDashboardLayoutEditableAction(false));
  }, []);

  return (
    <>
      <Button
        className={classes.dashboardLayoutIcon}
        variant="outlined"
        label={LBL_DASHBOARD_SAVE_LAYOUT_BUTTON}
        onClick={handleSaveLayout}
        startIcon={
          loading ? <CustomCircularProgress size={16} /> : <SaveIcon />
        }
        disabled={loading}
      />
      <Button
        className={classes.dashboardLayoutIcon}
        variant="outlined"
        label={"Cancel"}
        onClick={handleCandleLayoutEdit}
        startIcon={<CancelOutlined />}
        disabled={loading}
      />
    </>
  );
});
