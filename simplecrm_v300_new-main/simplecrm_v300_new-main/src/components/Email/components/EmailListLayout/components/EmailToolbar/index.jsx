import React, { useCallback, useEffect, useState } from "react";
import TuneIcon from "@material-ui/icons/Tune";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";
import LayersClearIcon from "@material-ui/icons/LayersClear";
import RefreshIcon from "@material-ui/icons/Refresh";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
  Checkbox,
  Grid,
  IconButton,
  Input,
  LinearProgress,
  Menu,
  MenuItem,
  Tooltip,
} from "@material-ui/core";
import { useEmailState } from "@/components/Email/useEmailState";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import { isEmpty, isNil } from "ramda";
import FilterDialog from "../FilterDialog";
import clsx from "clsx";
import {
  LBL_CLEAR_BUTTON_LABEL,
  LBL_CONFIRM_DELETE_RECORD_TITLE,
  LBL_DELETE_EMAILS,
  LBL_MARK_AS_FAVORITE,
  LBL_MARK_AS_READ,
  LBL_MARK_AS_UNREAD,
  LBL_REMOVE_FAVORITE,
  LBL_WARNING_TITLE,
} from "@/constant";
import { Alert } from "@/components";

const massActionOptions = {
  flagged: { label: LBL_MARK_AS_FAVORITE },
  unflagged: { label: LBL_REMOVE_FAVORITE },
  read: { label: LBL_MARK_AS_READ },
  unread: { label: LBL_MARK_AS_UNREAD },
  // delete: { label: LBL_CONFIRM_DELETE_RECORD_TITLE },
};

const EmailToolbar = () => {
  const { selectedRowsList } = useEmailState((state) => ({
    selectedRowsList: state.selectedRowsList,
  }));

  const renderToolbar = useCallback(() => {
    return (
      <span>
        <EmailSearch />
        <EmailTopbar selectedRowsList={selectedRowsList} />
      </span>
    );
  }, [selectedRowsList]);
  return renderToolbar();
};

export default EmailToolbar;

export const EmailTopbar = ({ selectedRowsList }) => {
  const classes = useStyles();
  const isMobileViewCheck = useIsMobileView("md");
  const {
    selectedFolderId,
    listData,
    listViewLoading,
    isDetailViewOpen,
    filterObj,
    actions,
  } = useEmailState((state) => ({
    selectedFolderId: state.selectedFolderId,
    listData: state.listData,
    listViewLoading: state.listViewLoading,
    isDetailViewOpen: state.isDetailViewOpen,
    filterObj: state.filterObj,
    actions: state.actions,
  }));

  const renderCheckbox = useCallback(() => {
    return isMobileViewCheck ||
      isDetailViewOpen ||
      isEmpty(listData) ||
      isNil(listData) ? null : (
      <Checkbox
        color="primary"
        size="small"
        disabled={listViewLoading}
        checked={isEmpty(selectedRowsList) ? false : selectedRowsList["all"]}
        onChange={() => actions.onRowSelectionChange("all")}
      />
    );
  }, [selectedRowsList, isDetailViewOpen, listViewLoading]);

  if ((isEmpty(listData) || isNil(listData)) && listViewLoading) {
    return <LinearProgress className={classes.noDataLoading} />;
  }

  return (
    <fieldset
      disabled={listViewLoading}
      className={clsx(classes.fieldset, {
        [classes.fieldsetMobile]: isDetailViewOpen || isMobileViewCheck,
      })}
    >
      <Grid
        container
        justifyContent="space-between"
        direction="row"
        alignContent="center"
        alignItems="center"
        className={clsx(classes.topbar, {
          [classes.mobileTopbar]: isDetailViewOpen || isMobileViewCheck,
        })}
      >
        <Grid item alignContent="center" alignItems="center">
          {renderCheckbox()}
          <IconButton
            size="small"
            disabled={listViewLoading}
            onClick={() => actions.getListViewData(selectedFolderId)}
          >
            <RefreshIcon className={classes.smallIcon} />
          </IconButton>
          {!isEmpty(filterObj) ? (
            <Tooltip title={LBL_CLEAR_BUTTON_LABEL}>
              <IconButton
                size="small"
                disabled={listViewLoading}
                onClick={() => actions.getListViewData(selectedFolderId, 1, {})}
              >
                <LayersClearIcon className={classes.clearIcon} />
              </IconButton>
            </Tooltip>
          ) : null}
          {Object.values(selectedRowsList).includes(true) ? (
            <MassActions />
          ) : null}
        </Grid>
        <EmailPagination />
      </Grid>
      {listViewLoading ? (
        <LinearProgress
          className={clsx({
            [classes.mobileLoading]: isDetailViewOpen || isMobileViewCheck,
          })}
        />
      ) : null}
    </fieldset>
  );
};

export const EmailSearch = () => {
  const classes = useStyles();
  const isMobileViewCheck = useIsMobileView("md");
  const { emailAction } = useEmailState((state) => ({
    emailAction: state.actions,
  }));
  return (
    <div className={classes.emailSearch}>
      {isMobileViewCheck ? (
        <ArrowForwardIosIcon
          color="primary"
          style={{
            cursor: "pointer",
            marginLeft: "3px",
            transform: "scale(0.8)",
          }}
          onClick={() => emailAction.toggleSideBar()}
        />
      ) : null}
      <EmailSearchbar />
    </div>
  );
};

export const EmailPagination = () => {
  const {
    rowsPerPage,
    pageNo,
    listMetaData,
    selectedFolderId,
    listData,
    emailActions,
  } = useEmailState((state) => ({
    rowsPerPage: state.rowsPerPage,
    pageNo: state.pageNo,
    listMetaData: state.listMetaData,
    selectedFolderId: state.selectedFolderId,
    listData: state.listData,
    emailActions: state.actions,
  }));
  const fromRecords = pageNo == 1 ? 1 : rowsPerPage * (pageNo - 1) + 1;
  const toRecords = rowsPerPage * (pageNo == 1 ? pageNo : pageNo);

  if (isEmpty(listData) || isNil(listData)) {
    return;
  }

  return (
    <Grid item>
      <IconButton
        size="small"
        disabled={pageNo == 1}
        onClick={() =>
          emailActions.getListViewData(selectedFolderId, pageNo - 1)
        }
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <span style={{ fontSize: "0.8rem", color: "rgb(110,106,114)" }}>
        {fromRecords} {"- "}
        {toRecords > listMetaData["total-records"]
          ? listMetaData["total-records"]
          : toRecords}{" "}
        {"of "}
        {listMetaData["total-records"]}
      </span>
      <IconButton
        size="small"
        disabled={
          listMetaData["last_page"] ||
          listMetaData["total-records"] <= rowsPerPage
        }
        onClick={() =>
          emailActions.getListViewData(selectedFolderId, pageNo + 1)
        }
      >
        <KeyboardArrowRightIcon />
      </IconButton>
    </Grid>
  );
};

export const EmailSearchbar = () => {
  const classes = useStyles();
  const { filterObj, actions, selectedFolderId, listViewLoading } =
    useEmailState((state) => ({
      filterObj: state.filterObj,
      actions: state.actions,
      selectedFolderId: state.selectedFolderId,
      listViewLoading: state.listViewLoading,
    }));
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const requestSearch = (searchedVal) => {
    setSearchQuery(searchedVal);
  };
  const cancelSearch = () => {
    setSearchQuery("");
    actions.getListViewData(selectedFolderId, 1, {});
  };
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const onListStateChange = (inputObj) => {
    setSearchQuery("");
    actions.changeTableState(inputObj);
  };

  const handleTextSearch = (e, type = "click") => {
    if (type === "enter" && e.key !== "Enter") {
      return;
    }
    const filterObj = {
      "filter[sort_column][eq]": "date_entered",
      "filter[sort_order][eq]": "desc",
      "filter[subject][lke]": searchQuery,
      sort: "-date_entered",
    };
    if (!isEmpty(searchQuery)) {
      actions.changeTableState({
        filterOption: filterObj,
      });
    }
  };

  useEffect(() => {
    if (isEmpty(filterObj)) {
      setSearchQuery("");
    }
  }, [filterObj]);
  return (
    <>
      <FilterDialog
        dialogStatus={isFilterOpen}
        onClose={toggleFilter}
        onListStateChange={onListStateChange}
      />
      <div className={classes.searchBar}>
        <SearchIcon
          color="primary"
          onClick={(e) => handleTextSearch(e)}
          className={classes.searchIcon}
        />
        <Input
          disableUnderline
          placeholder="Search email"
          value={searchQuery}
          className={classes.searchInput}
          onChange={(e) => requestSearch(e.target.value)}
          onKeyPress={(e) => handleTextSearch(e, "enter")}
        />
        {searchQuery ? (
          <IconButton disabled={listViewLoading}>
            <CloseIcon className={classes.icon} onClick={cancelSearch} />
          </IconButton>
        ) : null}
        <TuneIcon
          color="primary"
          className={classes.icon}
          onClick={toggleFilter}
        />
      </div>
    </>
  );
};

export const MassActions = () => {
  const classes = useStyles();
  const isMobileViewCheck = useIsMobileView();

  const { selectedRowsList, isDetailViewOpen, actions } = useEmailState(
    (state) => ({
      selectedRowsList: state.selectedRowsList,
      isDetailViewOpen: state.isDetailViewOpen,
      actions: state.actions,
    }),
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteAlert, setOpenAlert] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onMassActionClick = (actionType) => {
    handleClose();
    const selectedKeys = Object.keys(selectedRowsList).filter(
      (key) => selectedRowsList[key] === true && key != "all",
    );
    if (actionType === "read") {
      actions.onMassChangeEmailStatus("seen", true);
    } else if (actionType === "unread") {
      actions.onMassChangeEmailStatus("seen", false);
    } else if (actionType === "flagged") {
      actions.onMassChangeEmailStatus("flagged", true);
    } else if (actionType === "unflagged") {
      actions.onMassChangeEmailStatus("flagged", false);
    } else if (actionType === "delete") {
      setOpenAlert(!openDeleteAlert);
      return;
    }
    actions.onEmailAction(actionType, selectedKeys);
  };

  const handleMassDelete = () => {
    setOpenAlert(!openDeleteAlert);
    const selectedKeys = Object.keys(selectedRowsList).filter(
      (key) => selectedRowsList[key] === true && key != "all",
    );
    actions.onEmailAction("delete", selectedKeys);
  };

  if (isDetailViewOpen || isMobileViewCheck) {
    return;
  }
  return (
    <>
      {openDeleteAlert ? (
        <Alert
          msg={LBL_DELETE_EMAILS}
          title={LBL_WARNING_TITLE}
          onAgree={() => handleMassDelete()}
          handleClose={() => setOpenAlert(!openDeleteAlert)}
          open={openDeleteAlert}
          onDisagree={() => setOpenAlert(!openDeleteAlert)}
        />
      ) : null}
      <IconButton
        size="small"
        className={classes.smallIcon}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
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
        {Object.entries(massActionOptions).map(([key, item]) => {
          return (
            <MenuItem
              onClick={() => onMassActionClick(key)}
              className={classes.menuList}
              key={key}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};