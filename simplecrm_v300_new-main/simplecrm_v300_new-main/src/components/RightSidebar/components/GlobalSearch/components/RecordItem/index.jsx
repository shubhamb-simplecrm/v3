import React, { useState } from "react";
import useStyles, { getMuiTheme } from "./styles";
import { useSelector } from "react-redux";
import clsx from "clsx";
import {
  Tooltip,
  Checkbox,
  Link,
  ListItemIcon,
  List,
  ListItem,
  ListItemSecondaryAction,
  useTheme,
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useHistory } from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { pathOr } from "ramda";
import { useIsMobileView } from "@/hooks/useIsMobileView";

export default function RecordItem({
  module,
  datalabels,
  id,
  data,
  icon,
  color,
  setEmailModal,
  handleShowPreviewFile,
  onCloseRightSideBar,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const isMobile = useIsMobileView()
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const { config } = useSelector((state) => state.config);
  const site_url = pathOr("", ["site_url"], config);
  const parseField = (name) => {
    if (name === "email1") {
      return (
        <Link
          to="#"
          className={classes.emailLink}
          variant="body2"
          onClick={(e) => {
            e.preventDefault();
            setEmailModal({
              visible: true,
              to: data[name],
              parent_type: module || "",
              parent_id: id || "",
              parent_name: data["name"] || "",
            });
          }}
        >
          {data[name]}
        </Link>
      );
    }
    if (name === "name" || name === "document_name") {
      return (
        <Link
          onClick={() => {
            handleOnMobileCloseDrawer();
            history.push(`/app/detailview/${module}/${id}`);
          }}
          to={`/app/detailview/${module}/${id}`}
          className={classes.link}
          variant="body2"
        >
          {data[name]}
        </Link>
      );
    }
    if (name === "filename") {
      datalabels[name].type = "file";
    }
    if (name === "lead_scoring_c" || name === "opportunities_scoring_c") {
      let tmp = document.createElement("SPAN");
      tmp.innerHTML = data[name];
      return (data[name] = tmp.textContent || tmp.innerText || "");
    }
    switch (datalabels[name].type) {
      case "bool":
        return (
          <Checkbox disabled checked={data[name] == 1} style={{ padding: 0 }} />
        );
        break;
      case "parent":
        return (
          <Link
            to={`/app/detailview/${data["parent_type"]}/${data["parent_id"]}`}
            onClick={() => {
              handleOnMobileCloseDrawer();
              history.push(
                `/app/detailview/${data["parent_type"]}/${data["parent_id"]}`,
              );
            }}
            className={classes.link}
            variant="body2"
          >
            {data["parent_name"]}
          </Link>
        );
      case "relate":
        let relateId = datalabels[name].id
          ? datalabels[name].id.toLowerCase()
          : pathOr("", ["related_fields", 0], datalabels[name]);
        let relateModule = datalabels[name].module
          ? datalabels[name].module
          : "";
        if (name === "created_by") {
          relateModule = "Users";
        }
        return (
          <Link
            to={`/app/detailview/${relateModule}/${data[relateId]}`}
            onClick={() => {
              handleOnMobileCloseDrawer();
              history.push(`/app/detailview/${relateModule}/${data[relateId]}`);
            }}
            className={classes.link}
            variant="body2"
          >
            {data[name]}
          </Link>
        );
        break;
      case "image":
        return (
          <img src={data[name]} alt={data[name]} className={classes.photo} />
        );
        break;
      case "file":
        let furl = `${site_url}/index.php?entryPoint=customDownload&id=${id}&type=${module}`;
        return (
          <Typography>
            {data[name] ? (
              <VisibilityIcon
                fontSize="small"
                style={{
                  margin: "-1vh",
                  marginLeft: "1vh",
                  marginRight: "1vw",
                  cursor: "pointer",
                }}
                onClick={() => handleShowPreviewFile(data[name], furl)}
              ></VisibilityIcon>
            ) : (
              ""
            )}
            <Tooltip title={data[name]}>
              <Link
                to={`#`}
                className={classes.fileNameLinkTxt}
                onClick={() => {
                  saveAs(furl, data[name]);
                  toast("Download is in progress...");
                }}
                variant="body2"
              >
                {truncate(data[name], 13)}
              </Link>
            </Tooltip>
          </Typography>
        );
      default:
        return pathOr("", [name], data);
        break;
    }
  };
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };
  const handleOnMobileCloseDrawer = () => {
    if (isMobile) {
      onCloseRightSideBar();
    }
  };

  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Box boxShadow={0} m={1}>
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label={module} style={{ backgroundColor: color }}>
                {icon}
              </Avatar>
            }
            action={
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                disableRipple
              >
                <ExpandMoreIcon fontSize="small" />
              </IconButton>
            }
            title={
              <Link
                className={classes.link}
                variant="body2"
                onClick={handleOnMobileCloseDrawer}
                to={`/app/detailview/${module}/${id}`}
              >
                {parseField(module === "Documents" ? "document_name" : "name")}
              </Link>
            }
            subheader={data.date_entered ?? ""}
          />
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <List>
                {data
                  ? Object.keys(datalabels).map((field, key) =>
                      pathOr(false, [field, "label"], datalabels) ? (
                        <ListItem key={"listitem-" + key}>
                          <ListItemIcon
                            key={"listitem-icon-" + key}
                            textOverflow="ellipsis"
                          >{`${pathOr(
                            "",
                            [field, "label"],
                            datalabels,
                          )} :`}</ListItemIcon>
                          <ListItemSecondaryAction
                            key={"listitem-action-" + key}
                          >
                            {parseField(field)}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ) : (
                        ""
                      ),
                    )
                  : ""}
              </List>
            </CardContent>
          </Collapse>
        </Card>
      </Box>
    </MuiThemeProvider>
  );
}
