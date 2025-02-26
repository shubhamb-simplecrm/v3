import React, { useState } from "react";
import useStyles from "./styles";
import PropTypes from "prop-types";
import { Paper, Tooltip, Typography } from "@material-ui/core";
import InboxIcon from "@material-ui/icons/InboxOutlined";
import SendIcon from "@material-ui/icons/SendOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import DraftsIcon from "@material-ui/icons/DraftsOutlined";
import ArchiveIcon from "@material-ui/icons/Archive";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import { useEmailState } from "../../useEmailState";
import { isEmpty, isNil } from "ramda";
import { truncate } from "@/common/utils";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import clsx from "clsx";

function StyledTreeItem(props) {
  const classes = useStyles();
  const { labelText, labelIcon: LabelIcon, color, bgColor, ...other } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          {LabelIcon ? (
            <LabelIcon
              color="inherit"
              size="small"
              className={classes.listIcon}
            />
          ) : null}
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
        </div>
      }
      style={{
        color: color,
        backgroundColor: bgColor,
      }}
      classes={{
        root: classes.itemRoot,
        content: classes.content,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelText: PropTypes.string.isRequired,
};

const FolderIcons = new Map(
  Object.entries({
    drafts: DraftsIcon,
    sent: SendIcon,
    archive: ArchiveIcon,
    "[gmail]/trash": DeleteIcon,
    "[gmail]/bin": ArchiveIcon,
    inbox: InboxIcon,
  }),
);

const EmailFolders = () => {
  const classes = useStyles();
  const isMobileViewCheck = useIsMobileView();
  const { folderData, selectedParentFolderId, actions } = useEmailState(
    (state) => ({
      folderData: state.folderData,
      selectedParentFolderId: state.selectedParentFolderId,
      actions: state.actions,
    }),
  );

  if (isEmpty(folderData) || isNil(folderData)) {
    return;
  }

  return (
    <Paper
      className={clsx(classes.emailSidebar, {
        [classes.mobileEmailSidebar]: isMobileViewCheck,
      })}
    >
      {folderData.map((folder) => (
        <TreeView
          defaultExpandIcon={<FolderOpenIcon color="primary" />}
          defaultCollapseIcon={<ArrowDropDownIcon color="primary" />}
          selected={folder.selected}
          defaultExpanded={[selectedParentFolderId]}
        >
          <StyledTreeItem
            nodeId={folder.id}
            labelText={
              <Tooltip
                title={folder.label}
                disableHoverListener={folder.label >= 17}
              >
                <p className={classes.parentLabel}>
                  {truncate(folder.label, 17)}
                </p>
              </Tooltip>
            }
            bgColor={"#CFDCEE80"}
          >
            {folder.children.map((subfolder) => (
              <StyledTreeItem
                nodeId="5"
                labelText={
                  <span className={classes.subFolderLabel}>
                    {subfolder.label}
                  </span>
                }
                labelIcon={FolderIcons.get(subfolder.name)}
                color={subfolder.selected ? "#000000" : "#0071D2"}
                bgColor={subfolder.selected ? "#0071D2" + "30" : "transparent"}
                onClick={() => {
                  if (isMobileViewCheck) {
                    actions.toggleSideBar();
                  }
                  actions.getListViewData(subfolder.id, 1, {});
                }}
              />
            ))}
          </StyledTreeItem>
        </TreeView>
      ))}
    </Paper>
  );
};

export default EmailFolders;
