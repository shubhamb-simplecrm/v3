import React, { useMemo, useState, memo } from "react";
import {
  LBL_ADD_TO_TARGET_LIST,
  LBL_DELETE_BUTTON_TITLE,
  LBL_EXPORT,
  LBL_MASS_DELETE_LIMIT_ERROR,
  LBL_MASS_UPDATE_LIMIT_ERROR,
  LBL_MASS_UPDATE_TITLE,
  LBL_MERGE_RECORD,
} from "../../../../../../constant";
import useCommonUtils from "../../../../../../hooks/useCommonUtils";
const optionLabelType = Object.freeze({
  LBL_ADD_TO_TARGET_LIST,
  LBL_MERGE_RECORD,
  LBL_EXPORT,
  LBL_MASS_UPDATE_TITLE,
  LBL_DELETE_BUTTON_TITLE,
});
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import MergeTypeIcon from "@material-ui/icons/MergeType";
import { Add, CloudDownload, Delete, Update } from "@material-ui/icons";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import useStyles from "./styles";

import { Box, ButtonGroup, Menu, MenuItem } from "@material-ui/core";

import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import MassUpdateDialog from "./MassUpdateDialog";
import { toast } from "react-toastify";
import MassDeleteDialog from "./MassDeleteDialog";
import MassExportDialog from "./MassExportDialog";
import MergeViewDialog from "./MergeViewDialog";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import { IconButton } from "@/components/SharedComponents/IconButton";
import { Button } from "@/components/SharedComponents/Button";
import { pathOr } from "ramda";

const BulkActionOption = memo(
  ({
    currentModule,
    selectedRowsList,
    customListDataOptions,
    onListStateChange,
    listViewOptions,
    ...props
  }) => {
    const classes = useStyles();
    const isMobileView = useIsMobileView();
    const isTabletView = useIsMobileView("sm");
    const selectedRowIdList = Object.keys(selectedRowsList);
    const isAllRowSelected = selectedRowsList.hasOwnProperty("all");
    const pageNo = pathOr(1, ["pageNo"], listViewOptions);
    const {
      allowMergeModulesList,
      maxMassUpdateLimit,
      maxMassDeleteLimit,
      maxMergeRecordLimit,
    } = useCommonUtils();
    const [anchorRef, setAnchorRef] = React.useState(false);

    const [selectedAction, setSelectedAction] = useState({
      dialogStatus: false,
      label: null,
    });
    const dropDownOptionObj = useMemo(() => {
      return {
        // [optionLabelType.LBL_ADD_TO_TARGET_LIST]: {
        //   label: LBL_ADD_TO_TARGET_LIST,
        //   visible: allowMergeModulesList?.includes(currentModule),
        //   icon: <Add />,
        // },
        // [optionLabelType.LBL_MERGE_RECORD]: {
        //   label: LBL_MERGE_RECORD,
        //   visible:
        //     allowMergeModulesList?.includes(currentModule) &&
        //     !!customListDataOptions?.moduleACLAccess?.massupdate,
        //   icon: <MergeTypeIcon />,
        // },
        [optionLabelType.LBL_EXPORT]: {
          label: LBL_EXPORT,
          visible: !!customListDataOptions?.moduleACLAccess?.export,
          icon: <CloudDownload />,
        },
        [optionLabelType.LBL_MASS_UPDATE_TITLE]: {
          label: LBL_MASS_UPDATE_TITLE,
          visible: !!customListDataOptions?.moduleACLAccess?.massupdate,
          icon: <Update />,
        },
        [optionLabelType.LBL_DELETE_BUTTON_TITLE]: {
          label: LBL_DELETE_BUTTON_TITLE,
          visible: !!customListDataOptions?.moduleACLAccess?.delete,
          icon: <Delete />,
        },
      };
    }, [allowMergeModulesList, customListDataOptions, currentModule]);

    const handleOptionOnClick = (optionLbl) => {
      if (optionLbl == optionLabelType.LBL_MASS_UPDATE_TITLE) {
        if (selectedRowIdList?.length > maxMassUpdateLimit) {
          toast(LBL_MASS_UPDATE_LIMIT_ERROR);
        } else {
          setSelectedAction({
            dialogStatus: true,
            label: optionLbl,
          });
        }
      } else if (optionLbl == optionLabelType.LBL_DELETE_BUTTON_TITLE) {
        if (selectedRowIdList?.length > maxMassDeleteLimit) {
          toast(LBL_MASS_DELETE_LIMIT_ERROR);
        } else {
          setSelectedAction({
            dialogStatus: true,
            label: optionLbl,
          });
        }
      } else if (optionLbl == optionLabelType.LBL_MERGE_RECORD) {
        if (
          isAllRowSelected ||
          selectedRowIdList?.length > maxMergeRecordLimit
        ) {
          toast(LBL_MASS_DELETE_LIMIT_ERROR);
        } else {
          setSelectedAction({
            dialogStatus: true,
            label: optionLbl,
          });
        }
      } else if (optionLbl == optionLabelType.LBL_ADD_TO_TARGET_LIST) {
        setSelectedAction({
          dialogStatus: true,
          label: optionLbl,
        });
      } else if (optionLbl == optionLabelType.LBL_EXPORT) {
        setSelectedAction({
          dialogStatus: true,
          label: optionLbl,
        });
      }
      handleCloseDropDown();
    };
    const handleCloseAction = () => {
      setSelectedAction({
        dialogStatus: false,
        label: null,
      });
    };

    const handleOpenDropDown = (event) => {
      setAnchorRef(event.currentTarget);
    };

    const handleCloseDropDown = (event) => {
      setAnchorRef(null);
    };

    return (
      <Box>
        {isMobileView || isTabletView ? (
          <IconButton
            className={
              isMobileView ? classes.optionWrapperAdd : classes.btnSpacing
            }
            onClick={handleOpenDropDown}
          >
            <DynamicFeedIcon />
          </IconButton>
        ) : (
          <ButtonGroup
            variant="outlined"
            color="primary"
            aria-label="split button"
            size="small"
            className={classes.btnSpacing}
          >
            <Button
              label={"Bulk Action"}
              startIcon={<DynamicFeedIcon />}
              onClick={handleOpenDropDown}
              size="small"
            />
            <Button
              label={<ArrowDropDownIcon />}
              onClick={handleOpenDropDown}
              size="small"
            />
          </ButtonGroup>
        )}

        <Menu
          id="listview-option"
          anchorEl={anchorRef}
          keepMounted
          open={Boolean(anchorRef)}
          onClose={handleCloseDropDown}
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
          {Object.entries(dropDownOptionObj).map(([key, option]) => {
            return (
              <MenuItem
                onClick={(e) => handleOptionOnClick(key)}
                classes={classes.popoverMenuStyle}
                disabled={!option?.visible}
              >
                <ListItemIcon style={{ minWidth: "30px" }}>
                  {option.icon}
                </ListItemIcon>
                {option.label}
              </MenuItem>
            );
          })}
        </Menu>
        {selectedAction.label === optionLabelType.LBL_MASS_UPDATE_TITLE && (
          <MassUpdateDialog
            {...selectedAction}
            key={LBL_MASS_UPDATE_TITLE}
            currentModule={currentModule}
            onClose={handleCloseAction}
            selectedRowIdList={selectedRowIdList}
            isAllRowSelected={isAllRowSelected}
            onListStateChange={onListStateChange}
          />
        )}
        {selectedAction.label === optionLabelType.LBL_DELETE_BUTTON_TITLE && (
          <MassDeleteDialog
            {...selectedAction}
            key={LBL_DELETE_BUTTON_TITLE}
            currentModule={currentModule}
            onClose={handleCloseAction}
            selectedRowIdList={selectedRowIdList}
            isAllRowSelected={isAllRowSelected}
            onListStateChange={onListStateChange}
            pageNo={pageNo}
            customListDataOptions={customListDataOptions}
          />
        )}
        {selectedAction.label === optionLabelType.LBL_EXPORT && (
          <MassExportDialog
            {...selectedAction}
            key={LBL_EXPORT}
            currentModule={currentModule}
            onClose={handleCloseAction}
            selectedRowIdList={selectedRowIdList}
            isAllRowSelected={isAllRowSelected}
          />
        )}
        {selectedAction.label === optionLabelType.LBL_MERGE_RECORD && (
          <MergeViewDialog
            {...selectedAction}
            key={LBL_MERGE_RECORD}
            currentModule={currentModule}
            onClose={handleCloseAction}
            selectedRecords={selectedRowIdList}
            isAllRowSelected={isAllRowSelected}
          />
        )}
      </Box>
    );
  },
);

export default BulkActionOption;
