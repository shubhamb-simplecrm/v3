import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { checkACLAccess } from "../../../../common/common-utils";
import { ACL_ACCESS_ACTION_TYPE } from "../../../../common/common-constants";
import useStyles from "./styles";
import {
  Badge,
  Grid,
  Hidden,
  ListItemIcon,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { Add, FilterList } from "@material-ui/icons";
import { useListViewState } from "../../../../customStrore/useListViewState";
import MyFilterDropDown from "./MyFilterDropDown";
import { SearchBarInput } from "./SearchBarInput";
import {
  LBL_CLEAR_BUTTON_LABEL,
  LBL_COLUMNS_FILTER_HEADER_TITLE,
  LBL_COLUMN_CHOOSER,
  LBL_FILTER_HEADER_TITLE,
  LBL_IMPORT,
  LBL_MY_FILTER_BUTTON_LABEL,
} from "../../../../constant";
import CloseIcon from "@material-ui/icons/Close";
import SettingsIcon from "@material-ui/icons/Settings";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CloudUpload from "@material-ui/icons/CloudUpload";
import ViewColumn from "@material-ui/icons/ViewColumn";
import PhotoFilterIcon from "@material-ui/icons/PhotoFilter";
import { ImportFile } from "./ImportFile";
import { useIsMobileView } from "../../../../hooks/useIsMobileView";
import { IconButton } from "../../../SharedComponents/IconButton";
import { Button } from "../../../SharedComponents/Button";
import BulkActionOption from "./components/BulkActionOption";
import { isEmpty } from "ramda";
import ColumnChooser from "./ColumnChooser";
import { useLayoutState } from "@/customStrore/useLayoutState";
import FilterDialog from "./FilterDialog";
import clsx from "clsx";
import { CustomCheckbox } from "../..";
const buttonOptionLabel = Object.freeze({
  add: "add",
  filterChange: "filterChange",
  filterApply: "filterApply",
  filterClear: "filterClear",
  myFilterList: "myFilterList",
  moreActionOption: "moreActionOption",
});
const CustomToolbar = (props) => {
  const {
    customListDataOptions = {
      listMetaData: {},
      moduleACLAccess: {},
      requiredImportFieldObj: {},
      saveSearchOptionList: {},
    },
    currentModule,
    selectedRowsList,
    isListEmpty,
    onRowSelectionChange,
    listViewOptions,
  } = props;
  const isBulkOptionEnable =
    typeof selectedRowsList == "object" &&
    !isEmpty(Object.keys(selectedRowsList));

  const {
    listMetaData,
    moduleACLAccess,
    requiredImportFieldObj,
    saveSearchOptionList,
    isFilterApplied,
    savedSearchId,
    listViewFilterPreference,
    onListStateChange,
    withFilterRefresh,
    isFilterLockApplied,
    basicSearchField,
  } = customListDataOptions;
  const classes = useStyles();
  const history = useHistory();
  const { changeRightSideBarState } = useLayoutState((state) => state.actions);
  const rightSidebarState = useLayoutState((state) => state.rightSidebarState);
  const isMobileView = useIsMobileView();
  const isTabletView = useIsMobileView("sm");
  const [selectedAction, setSelectedAction] = useState({
    dialogStatus: false,
    label: null,
    optionEventCurrentTarget: null,
  });
  const [moreOptionOpenStatus, setMoreOptionOpenStatus] = useState(null);
  const isCreateButtonExist =
    currentModule != "Emails" &&
    currentModule != "AOR_Reports" &&
    checkACLAccess(moduleACLAccess, ACL_ACCESS_ACTION_TYPE?.create);
  const isFilterDrawerOpen =
    rightSidebarState.selectedOption == "filter_option";

  const isMyFilterExist = ((optionList) => {
    if (optionList.hasOwnProperty("_none")) delete optionList["_none"];
    return !isEmpty(optionList) && !isEmpty(saveSearchOptionList);
  })(saveSearchOptionList);

  const buttonOptionList = useMemo(() => {
    return {
      [buttonOptionLabel.add]: {
        label: "Add",
        icon: Add,
        visible: isCreateButtonExist,
        variant: "outlined",
      },
      [buttonOptionLabel.filterChange]: {
        label: `${isFilterApplied ? "Change" : "Apply"} Filter`,
        icon: FilterList,
        visible: !isFilterDrawerOpen,
        variant: isFilterApplied ? "contained" : "outlined",
      },
      [buttonOptionLabel.filterClear]: {
        label: LBL_CLEAR_BUTTON_LABEL,
        icon: CloseIcon,
        visible: isFilterApplied,
        variant: "contained",
      },
      [buttonOptionLabel.myFilterList]: {
        label: LBL_MY_FILTER_BUTTON_LABEL,
        icon: PhotoFilterIcon,
        visible: isMyFilterExist,
        variant: savedSearchId ? "contained" : "outlined",
      },
      [buttonOptionLabel.moreActionOption]: {
        label: null,
        icon: MoreVertIcon,
        visible: !isMobileView,
      },
    };
  }, [
    isCreateButtonExist,
    isFilterDrawerOpen,
    isFilterApplied,
    isListEmpty,
    saveSearchOptionList,
    isMyFilterExist,
    isMobileView,
    savedSearchId,
  ]);

  const handleOptionOnClick = (event, optionKey) => {
    if (optionKey == buttonOptionLabel.filterClear) {
      onListStateChange({
        pageNo: 1,
        resetFilter: true,
        withSelectedRecords: false,
      });
    } else if (optionKey == buttonOptionLabel.filterChange) {
      if (isMobileView) {
        setSelectedAction({
          dialogStatus: true,
          optionKey: optionKey,
          optionEventCurrentTarget: event.currentTarget,
        });
      } else {
        changeRightSideBarState((state) => {
          return {
            drawerState: !(state?.selectedOption == "filter_option"),
            selectedOption: "filter_option",
            customData: {
              savedSearchId,
              onListStateChange,
              listViewFilterPreference,
              currentModule,
              withFilterRefresh: true,
            },
          };
        });
      }
    } else if (optionKey == buttonOptionLabel.add) {
      return history.push(`/app/createview/${currentModule}`);
    } else if (optionKey == buttonOptionLabel.moreActionOption) {
      setMoreOptionOpenStatus(event.currentTarget);
    } else {
      setSelectedAction({
        dialogStatus: true,
        optionKey: optionKey,
        optionEventCurrentTarget: event.currentTarget,
      });
    }
  };
  const handleCloseAction = () => {
    setSelectedAction({
      dialogStatus: false,
      label: null,
      optionEventCurrentTarget: null,
    });
  };
  const handleCloseMoreOption = useCallback(() => {
    setMoreOptionOpenStatus(null);
  }, []);
  useEffect(() => {
    if (isFilterDrawerOpen) {
      changeRightSideBarState((state) => {
        return {
          drawerState: state?.selectedOption == "filter_option",
          selectedOption: "filter_option",
          customData: {
            savedSearchId,
            onListStateChange,
            listViewFilterPreference,
            currentModule,
            withFilterRefresh,
          },
        };
      });
    }
  }, [listViewFilterPreference]);
  useEffect(() => {
    if (!isMobileView && isFilterLockApplied) {
      changeRightSideBarState((state) => {
        return {
          drawerState: true,
          selectedOption: "filter_option",
          customData: {
            savedSearchId,
            onListStateChange,
            listViewFilterPreference,
            currentModule,
            withFilterRefresh: true,
          },
        };
      });
    }
  }, []);

  return (
    <>
      <Grid container className={classes.container}>
        {!isMobileView && (
          <Grid item className={classes.btnSpacing}>
            <SearchBarInput
              listViewFilterPreference={listViewFilterPreference}
              currentModule={currentModule}
              onListStateChange={onListStateChange}
              basicSearchField={basicSearchField}
            />
          </Grid>
        )}

        {isBulkOptionEnable && (
          <Grid item>
            <BulkActionOption
              currentModule={currentModule}
              customListDataOptions={customListDataOptions}
              selectedRowsList={selectedRowsList}
              onListStateChange={onListStateChange}
              listViewOptions={listViewOptions}
            />
          </Grid>
        )}

        {Object.entries(buttonOptionList).map(
          ([key, option]) =>
            !!option.visible && (
              <Grid item>
                {isTabletView || !option.label ? (
                  <IconButton
                    aria-controls={`option-${key}`}
                    className={
                      isMobileView
                        ? clsx(
                            classes.optionWrapperAdd,
                            option.variant === "contained" &&
                              classes.optionBorder,
                          )
                        : classes.btnSpacing
                    }
                    onClick={(event) => handleOptionOnClick(event, key)}
                  >
                    {<option.icon />}
                  </IconButton>
                ) : (
                  <Button
                    aria-controls={`option-${key}`}
                    label={option.label}
                    variant={option.variant}
                    startIcon={<option.icon />}
                    className={classes.btnSpacing}
                    onClick={(event) => handleOptionOnClick(event, key)}
                  />
                )}
              </Grid>
            ),
        )}
        {isMobileView && (
          <div
            style={{
              // display: "flex",
              // alignItems: "center",
              // gap: "30px",
              width: "100%",
            }}
          >
            {/* <div style={{ width: "15%" }}>
              <CustomCheckbox
                {...props}
                onRowSelectionChange={onRowSelectionChange}
                selectedRowsList={selectedRowsList}
                data-description={"row-select-header"}
              />
            </div>
            <div style={{ width: "85%" }}> */}
            <SearchBarInput
              listViewFilterPreference={listViewFilterPreference}
              currentModule={currentModule}
              onListStateChange={onListStateChange}
              basicSearchField={basicSearchField}
            />
            {/* </div> */}
          </div>
        )}
      </Grid>
      <MoreOptionDropDown
        currentModule={currentModule}
        requiredImportFieldObj={requiredImportFieldObj}
        moreOptionOpenStatus={moreOptionOpenStatus}
        handleCloseMoreOption={handleCloseMoreOption}
        onListStateChange={onListStateChange}
        moduleACLAccess={moduleACLAccess}
      />
      {/* filter dialog for mobile view */}
      {selectedAction?.optionKey == buttonOptionLabel.filterChange && (
        <FilterDialog
          {...selectedAction}
          onClose={handleCloseAction}
          currentModule={currentModule}
          savedSearchId={savedSearchId}
          onListStateChange={onListStateChange}
        />
      )}
      {selectedAction?.optionKey == buttonOptionLabel.myFilterList &&
      !isEmpty(saveSearchOptionList) ? (
        <MyFilterDropDown
          {...selectedAction}
          onClose={handleCloseAction}
          saveSearchOptionList={saveSearchOptionList}
          currentModule={currentModule}
          onListStateChange={onListStateChange}
          savedSearchId={savedSearchId}
        />
      ) : null}
    </>
  );
};

const MoreOptionDropDown = memo(
  ({
    currentModule,
    requiredImportFieldObj,
    moreOptionOpenStatus,
    handleCloseMoreOption,
    onListStateChange,
    moduleACLAccess,
  }) => {
    const classes = useStyles();
    const [selectedActionState, setSelectedActionState] = useState({
      dialogOpenStatus: false,
      selectedOptionLabel: null,
    });
    const isMobileView = useIsMobileView();

    const handleActionSelect = (actionName) => {
      setSelectedActionState({
        dialogOpenStatus: true,
        selectedOptionLabel: actionName,
      });
    };

    const handleOnActionClose = () => {
      setSelectedActionState({
        dialogOpenStatus: false,
        selectedOptionLabel: null,
      });
      handleCloseMoreOption();
    };
    return (
      <>
        <Menu
          id="listview-option"
          anchorEl={moreOptionOpenStatus}
          keepMounted
          open={Boolean(moreOptionOpenStatus)}
          onClose={handleCloseMoreOption}
          elevation={1}
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
          {checkACLAccess(moduleACLAccess, ACL_ACCESS_ACTION_TYPE.import) ? (
            <MenuItem
              onClick={() => handleActionSelect(LBL_IMPORT)}
              className={classes.popoverMenuStyle}
            >
              <ListItemIcon style={{ minWidth: "30px" }}>
                <CloudUpload />
              </ListItemIcon>
              {LBL_IMPORT}
            </MenuItem>
          ) : null}

          <MenuItem
            onClick={() => handleActionSelect(LBL_COLUMN_CHOOSER)}
            className={classes.popoverMenuStyle}
          >
            <ListItemIcon style={{ minWidth: "30px" }}>
              <ViewColumn />
            </ListItemIcon>
            {LBL_COLUMN_CHOOSER}
          </MenuItem>
        </Menu>

        {selectedActionState?.selectedOptionLabel == LBL_IMPORT && (
          <ImportFile
            dialogOpenStatus={selectedActionState?.dialogOpenStatus}
            onClose={handleOnActionClose}
            currentModule={currentModule}
            requiredImportFieldObj={requiredImportFieldObj}
            onListStateChange={onListStateChange}
          />
        )}
        {selectedActionState?.selectedOptionLabel == LBL_COLUMN_CHOOSER && (
          <ColumnChooser
            dialogOpenStatus={selectedActionState?.dialogOpenStatus}
            onClose={handleOnActionClose}
            currentModule={currentModule}
            onListStateChange={onListStateChange}
          />
        )}
      </>
    );
  },
);

export default memo(CustomToolbar);
