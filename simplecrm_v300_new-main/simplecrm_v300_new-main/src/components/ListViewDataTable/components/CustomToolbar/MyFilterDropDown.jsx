import React, { memo, useState } from "react";
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  makeStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Alert } from "@/components";
import { deleteRecordFromModule } from "@/store/actions/listview.actions";
import { toast } from "react-toastify";
import {
  LBL_CONFIRM_DELETE_FILTER_DESCRIPTION,
  LBL_CONFIRM_DELETE_FILTER_TITLE,
  SOMETHING_WENT_WRONG,
} from "@/constant";
import useStyles from "./styles";
function MyFilterDropDown({
  optionEventCurrentTarget,
  onClose,
  optionKey,
  saveSearchOptionList,
  onListStateChange,
  savedSearchId,
}) {
  const classes = useStyles();
  const [onFilterDeleteState, setOnFilterDeleteState] = useState({
    dialogState: false,
    recordId: null,
  });

  const handleOnOptionSelection = (key) => {
    onListStateChange({
      pageNo: 1,
      filterOption: {
        saved_search_id: key,
        // "": null,
      },
    });
    onClose();
  };

  const handleOnFilterDeleteDialogOpen = (id) => {
    setOnFilterDeleteState({
      dialogState: true,
      recordId: id,
    });
  };

  const handleOnFilterDeleteDialogClose = () => {
    setOnFilterDeleteState({
      dialogState: false,
      recordId: null,
    });
  };

  const handleOnFilterDeleteAgree = async () => {
    handleOnFilterDeleteDialogClose();

    if (!onFilterDeleteState?.recordId) return;
    try {
      const res = await deleteRecordFromModule(
        "SavedSearch",
        onFilterDeleteState?.recordId,
      );
      if (res.ok) {
        if (onFilterDeleteState?.recordId === savedSearchId) {
          onListStateChange({
            pageNo: 1,
            resetFilter: true,
          });
        } else {
          onListStateChange({
            pageNo: 1,
            withAppliedFilter: true,
          });
        }
        onClose();
      } else {
        toast(res?.data?.meta?.message || res?.data?.errors.detail);
      }
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
    }
  };

  return (
    <>
      <Menu
        id={`option-${optionKey}`}
        anchorEl={optionEventCurrentTarget}
        keepMounted
        open={Boolean(optionEventCurrentTarget)}
        onClose={onClose}
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
        {Object.entries(saveSearchOptionList).map(([key, value]) => (
          <ListItem
            key={key}
            onClick={() => handleOnOptionSelection(key)}
            className={classes.listItem}
            selected={key === savedSearchId}
          >
            <ListItemText
              primary={value}
              primaryTypographyProps={{
                className: classes.listItemText,
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleOnFilterDeleteDialogOpen(key)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </Menu>
      <Alert
        title={LBL_CONFIRM_DELETE_FILTER_TITLE}
        msg={LBL_CONFIRM_DELETE_FILTER_DESCRIPTION}
        open={onFilterDeleteState?.dialogState}
        handleClose={handleOnFilterDeleteDialogClose}
        onAgree={handleOnFilterDeleteAgree}
      />
    </>
  );
}

export default memo(MyFilterDropDown);
