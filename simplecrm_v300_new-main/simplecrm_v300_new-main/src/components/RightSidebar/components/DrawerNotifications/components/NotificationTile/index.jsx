import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import GetAppIcon from "@material-ui/icons/GetApp";
import ClearIcon from "@material-ui/icons/Clear";
import FaIcon from "../../../../../FaIcon";
import { Avatar, Grid, Tooltip } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, pathOr } from "ramda";
import { saveAs } from "file-saver";
import { useHistory } from "react-router-dom";
import { useStyles } from "./styles";
import StatusBadge from "../../../../../CommonComponents/StatusBadge";
import { parseV267URL } from "@/common/utils";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import { useModuleViewDetail } from "@/hooks/useModuleViewDetail";
async function downloadFileWithCustomName(url, filename) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    const blob = await response.blob();
    saveAs(blob, filename);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
}

export default function NotificationTile(props) {
  const {
    notification,
    markAsRead,
    notificationIndex,
    handleRightSidebarClose,
  } = props;
  const isMobile = useIsMobileView();
  const { moduleList } = useModuleViewDetail();
  const site_url = pathOr(
    "",
    ["config", "site_url"],
    useSelector((state) => state.config),
  );
  const notificationObj = {};
  notificationObj["id"] = pathOr("", ["id"], notification);
  notificationObj["title"] = pathOr("", ["attributes", "name"], notification);
  notificationObj["description"] = pathOr(
    "",
    ["attributes", "description"],
    notification,
  );
  notificationObj["moduleLabel"] = pathOr(
    "",
    ["attributes", "module_label"],
    notification,
  );
  notificationObj["subheader"] = pathOr(
    "",
    ["attributes", "date_entered"],
    notification,
  );
  notificationObj["isDownloadable"] = pathOr(
    "",
    ["attributes", "extra_data", "is_download_able"],
    notification,
  );
  notificationObj["icon"] = pathOr(
    "",
    ["attributes", "extra_data", "module_icon"],
    notification,
  );
  notificationObj["moduleLabel"] = pathOr(
    "",
    ["attributes", "extra_data", "module_label"],
    notification,
  );
  notificationObj["iconColor"] = pathOr(
    "",
    ["attributes", "extra_data", "icon_color"],
    notification,
  );
  notificationObj["status"] = pathOr(
    "",
    ["attributes", "extra_data", "status"],
    notification,
  );
  notificationObj["redirectUrl"] = pathOr(
    "",
    ["attributes", "url_redirect"],
    notification,
  );
  notificationObj["targetModule"] = pathOr(
    "",
    ["attributes", "target_module"],
    notification,
  );
  const downloadACL = pathOr(
    0,
    ["attributes", "ACLAccess", "download"],
    notification,
  );
  const classes = useStyles();

  const history = useHistory();
  function getCurrentDateTime() {
    const today = new Date();

    const date = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    const time = [
      String(today.getHours()).padStart(2, "0"),
      String(today.getMinutes()).padStart(2, "0"),
      String(today.getSeconds()).padStart(2, "0"),
    ].join(":");

    return `${date} ${time}`;
  }
  const handleOnDownloadFile = () => {
    const n = notificationObj?.redirectUrl.lastIndexOf("/");
    let filename = notificationObj?.redirectUrl.substring(n + 1);
    const todayDatetime = getCurrentDateTime();
    const targetModuleLabel = pathOr(
      notificationObj?.targetModule,
      [notificationObj?.targetModule],
      moduleList,
    );
    filename = `${targetModuleLabel} ${todayDatetime}`;
    saveAs(`${site_url}/${notificationObj?.redirectUrl}`, filename);
    markAsRead(notificationObj?.id);
  };
  const handleOnNotificationClick = () => {
    if (notificationObj?.redirectUrl !== "") {
      const parsedURL = parseV267URL(notificationObj?.redirectUrl);
      if (parsedURL?.module !== undefined && parsedURL?.record !== undefined) {
        const target_module = parsedURL.module;
        const target_id = parsedURL.record;
        markAsRead(notificationObj?.id);
        if (isMobile) {
          handleRightSidebarClose();
        }
        history.push("/app/detailview/" + target_module + "/" + target_id);
      }
    }
  };
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Tooltip title={notificationObj?.moduleLabel}>
            <Avatar style={{ backgroundColor: notificationObj?.iconColor }}>
              <FaIcon icon={`fas ${notificationObj?.icon}`} size="1x" />
            </Avatar>
          </Tooltip>
        }
        action={
          <>
            {notificationObj?.isDownloadable && (
              <>
                <IconButton
                  disabled={!downloadACL}
                  onClick={handleOnDownloadFile}
                  id={`download-btn-${notificationIndex}`}
                >
                  <GetAppIcon />
                </IconButton>
                <IconButton
                  // className="tile-clear-icon"
                  onClick={() => markAsRead(notificationObj?.id)}
                >
                  <ClearIcon />
                </IconButton>
              </>
            )}
            {!notificationObj?.isDownloadable && (
              <IconButton
                className="tile-clear-icon"
                onClick={() => markAsRead(notificationObj?.id)}
              >
                <ClearIcon />
              </IconButton>
            )}
          </>
        }
        title={
          <Typography style={{ cursor: "pointer" }}>
            {notificationObj?.title}
          </Typography>
        }
        subheader={notificationObj?.subheader}
        style={{ padding: 6 }}
        onClick={
          !notificationObj?.isDownloadable ? handleOnNotificationClick : null
        }
      />
      <CardContent style={{ padding: 6 }}>
        <Typography variant="body2" color="textSecondary" component="p">
          {notificationObj?.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing={true}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            {!isEmpty(notificationObj?.status) && (
              <StatusBadge
                title={notificationObj?.status}
                bgColorParam={{
                  module: notificationObj?.targetModule,
                  fieldName: "status",
                  optionName: "default",
                }}
              />
            )}
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
