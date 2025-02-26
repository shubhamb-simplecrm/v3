import React, { useState, useEffect } from "react";
import { getMuiTheme } from "./styles";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import {
  CircularProgress,
  Button,
  Divider,
  Typography,
  useTheme,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import InboxIcon from "@material-ui/icons/InboxOutlined";
import SendIcon from "@material-ui/icons/SendOutlined";
import DraftsIcon from "@material-ui/icons/DraftsOutlined";
import FlagIcon from "@material-ui/icons/OutlinedFlag";
import ArchiveIcon from "@material-ui/icons/Archive";

import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import Label from "@material-ui/icons/Label";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { LBL_EMAIL_COMPOSE_BUTTON_TITLE } from "../../../../constant";

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    // '&:hover > $content': {
    //   backgroundColor: theme.palette.primary.main,
    //   color:'#ffffff'
    // },
    "&:focus > $content, &$selected > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.primary.main})`,
      color: "#fff",
    },
    "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label":
      {
        backgroundColor: "transparent",
      },
  },
  content: {
    color: theme.palette.text.primary,
    paddingRight: theme.spacing(1),

    "$expanded > &": {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    "& $content": {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: "inherit",
    color: "inherit",
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1,
  },
  selectedSubBack: {
    backgroundColor: theme.palette.primary.main,
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    ...other
  } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        color: color,
        backgroundColor: bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
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
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 400,
    [theme.breakpoints.down("xs")]: {
      margin: "15px auto",
      "& > li": {
        margin: "0px 4%",
      },
    },
  },
  toolbar: {
    height: "67px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",

    "& button": {
      width: "90%",
      margin: "0px auto",
    },
  },
}));

const EmailFolders = (props) => {
  const {
    onFolderOpen,
    className,
    folderData,
    selectedFolder,
    handleComposeEmailPopup,
    emailCreateViewLoading,
    ...rest
  } = props;
  const theme = useTheme();
  const classes = useStyles();

  const [active, setActive] = useState("inbox");

  const handleSelect = (folder) => {
    setActive(folder.id);
    onFolderOpen && onFolderOpen(folder.id);
  };

  const getFolderIcon = (folder_type) => {
    if (folder_type === "draft") {
      return DraftsIcon;
    } else if (folder_type === "sent") {
      return SendIcon;
    } else if (folder_type === "archived") {
      return ArchiveIcon;
    } else {
      return FlagIcon;
    }
  };

  const getFolderText = (folder_type) => {
    if (folder_type === "draft") {
      return "Drafts";
    } else if (folder_type === "sent") {
      return "Sent Emails";
    } else if (folder_type === "archived") {
      return "Archived Emails";
    } else {
      return FlagIcon;
    }
  };

  const sss = [];

  useEffect(() => {
    folderData &&
      folderData.map((folder) => {
        if (folder.id === selectedFolder) {
          sss.push(folder.id);
        }
        folder.children.map((subfolder) => {
          if (subfolder.id === selectedFolder) {
            sss.push(folder.id);
          }
        });
      });
  }, [folderData]);

  const getReplaceText = (accountText) => {
    let ss = accountText.replace("INBOX (", "");
    ss = ss.replace(")", "");
    return ss?.length > 20 ? ss.substr(0, 20 - 1) + "..." : ss;
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.toolbar}>
        <Button
          color="primary"
          fullWidth
          variant="contained"
          onClick={() => handleComposeEmailPopup("new", [])}
        >
          {emailCreateViewLoading ? (
            <CircularProgress disableShrink size={20} />
          ) : (
            <AddIcon className={classes.addIcon} />
          )}
          {LBL_EMAIL_COMPOSE_BUTTON_TITLE}
        </Button>
      </div>
      <Divider />
      <MuiThemeProvider theme={getMuiTheme(theme)}>
        {folderData &&
          folderData.map((folder) => (
            <TreeView
              className={classes.root}
              defaultExpanded={sss}
              defaultCollapseIcon={<ArrowDropDownIcon />}
              defaultExpandIcon={<ArrowRightIcon />}
              defaultEndIcon={<div style={{ width: 24 }} />}
              selected={sss}
            >
              <StyledTreeItem
                nodeId={folder.id}
                labelText={getReplaceText(folder.text)}
                labelIcon={Label}
              >
                <StyledTreeItem
                  nodeId="5"
                  labelText="Inbox"
                  labelIcon={InboxIcon}
                  /*labelInfo="90"*/
                  color={
                    folder.id === selectedFolder
                      ? "#000000"
                      : theme.palette.text.primary
                  }
                  bgColor={
                    folder.id === selectedFolder
                      ? theme.palette.primary.main + "30"
                      : "transparent"
                  }
                  onClick={() => onFolderOpen(folder.id)}
                />
                {folder.children.map((subfolder) => (
                  <StyledTreeItem
                    nodeId={subfolder.id}
                    labelText={getFolderText(subfolder.folder_type)}
                    labelIcon={getFolderIcon(subfolder.folder_type)}
                    /*labelInfo="90"*/
                    color={
                      subfolder.id === selectedFolder
                        ? "#000000"
                        : theme.palette.text.primary
                    }
                    bgColor={
                      subfolder.id === selectedFolder
                        ? theme.palette.primary.main + "30"
                        : "transparent"
                    }
                    onClick={() => onFolderOpen(subfolder.id)}
                  />
                ))}
              </StyledTreeItem>
            </TreeView>
          ))}
      </MuiThemeProvider>
    </div>
  );
};

EmailFolders.propTypes = {
  className: PropTypes.string,
  selectedFolder: PropTypes.string,
  onFolderOpen: PropTypes.func,
  folderData: PropTypes.array.isRequired,
};

export default EmailFolders;
