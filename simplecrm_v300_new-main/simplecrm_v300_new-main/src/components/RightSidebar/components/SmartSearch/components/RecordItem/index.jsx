import React, { useState } from "react";
import useStyles, { getMuiTheme } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import {
  Tooltip,
  Checkbox,
  Link,
  ListItemIcon,
  ListItemText,
  List,
  ListSubheader,
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
  Chip,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { isEmpty, pathOr } from "ramda";
import { useHistory } from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import blankImage from "@/assets/blank-image.jpg";
import { useFilePreviewer } from "@/context/FilePreviewContext";
import { getChipStyle, getFileExtension } from "@/common/utils";
import useCommonUtils from "@/hooks/useCommonUtils";

export default function RecordItem({
  module,
  datalabels,
  id,
  data,
  icon,
  color,
  setEmailModal,
  onCloseRightSideBar,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const isMobile = useIsMobileView();
  const { getStatusFieldBackgroundColor } = useCommonUtils();
  const { onFileDialogStateChange } = useFilePreviewer();
  //const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const { currentUserData, config, userPreference } = useSelector(
    (state) => state.config,
  );
  const site_url = pathOr("", ["site_url"], config);
  const parseField = (fieldName, index) => {
    let field = datalabels[index];
    if (fieldName === "email1") {
      return (
        <Link
          to="#"
          className={classes.emailLink}
          variant="body2"
          onClick={(e) => {
            e.preventDefault();
            setEmailModal({
              visible: true,
              to: data[fieldName],
              parent_type: module || "",
              parent_id: id || "",
              parent_name: data["name"] || "",
            });
          }}
        >
          {data[fieldName]}
        </Link>
      );
    }
    if (fieldName === "name" || fieldName === "document_name") {
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
          {data[fieldName]}
        </Link>
      );
    }
    if (fieldName === "filename") {
      field["type"] = "file";
    }
    if (
      fieldName === "lead_scoring_c" ||
      fieldName === "opportunities_scoring_c"
    ) {
      let tmp = document.createElement("SPAN");
      tmp.innerHTML = data[fieldName];
      return (data[fieldName] = tmp.textContent || tmp.innerText || "");
    }
    switch (field?.type) {
      case "bool":
        return (
          <Checkbox
            disabled
            checked={data[fieldName] == 1}
            style={{ padding: 0 }}
          />
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
        let relateId = field?.id
          ? field?.id.toLowerCase()
          : pathOr("", ["related_fields", 0], field);
        let relateModule = field?.module ? field?.module : "";
        if (fieldName === "created_by") {
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
            {data[fieldName]}
          </Link>
        );
        break;
      case "image":
      case "file":
        let recordId = field?.type == "image" ? id + "_" + fieldName : id;
        let furl = `${site_url}/index.php?entryPoint=customDownload&id=${recordId}&type=${module}&field_id=${fieldName}`;
        return (
          <Typography>
            {data[fieldName] ? (
              <VisibilityIcon
                disabled={
                  data["ACLAccess"]?.hasOwnProperty("download")
                    ? data["ACLAccess"]["download"] && !isEmpty(data[fieldName])
                    : false
                }
                fontSize="small"
                style={{
                  margin: "-1vh",
                  marginLeft: "1vh",
                  marginRight: "1vw",
                  cursor: "pointer",
                }}
                onClick={() =>
                  onFileDialogStateChange(
                    true,
                    {
                      fileName: data[fieldName],
                      filePath: furl,
                      fileType: getFileExtension(data[fieldName]),
                    },
                    true,
                  )
                }
              ></VisibilityIcon>
            ) : (
              ""
            )}
            <Tooltip title={data[fieldName]}>
              <Link
                className={classes.fileNameLinkTxt}
                onClick={() => {
                  saveAs(furl, data[fieldName]);
                  toast("Download is in progress...");
                }}
                variant="body2"
              >
                {truncate(data[fieldName], 20)}
              </Link>
            </Tooltip>
          </Typography>
        );
      case "enum":
      case "dynamicenum":
        let fieldValue = pathOr("", [fieldName], data);
        if (isEmpty(fieldValue)) return null;
        const fieldOptions = pathOr({}, ["options"], field);
        const optionsBgColor = getStatusFieldBackgroundColor(
          module,
          field.name,
        );
        const optionLabel = pathOr(fieldValue, [fieldValue], fieldOptions);
        const selectedOption =
          Object.keys(fieldOptions).find(
            (key) => fieldOptions[key] === fieldValue,
          ) || "";
        const chipBgColor = pathOr(
          pathOr("", ["default", "background_color"], optionsBgColor),
          [fieldValue, "background_color"],
          optionsBgColor,
        );
        const chipStyle = getChipStyle(theme, chipBgColor);
        return isEmpty(optionsBgColor) ? (
          optionLabel
        ) : (
          <Chip
            size="small"
            className={classes.statusBg}
            style={chipStyle}
            label={optionLabel}
          />
        );
      default:
        return pathOr("", [fieldName], data);
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
        {/* 
            <RibbonContainer className="custom-class">
              <LeftRibbon backgroundColor="#448812" color="#f0f0f0" fontFamily="Poppins">
                Foo Bar
              </LeftRibbon>
            </RibbonContainer> 
            */}
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
                          {/* <ListItemText id="switch-list-label-wifi" primary="Assigned To" /> */}
                          <ListItemSecondaryAction
                            key={"listitem-action-" + key}
                          >
                            {parseField(
                              pathOr("", [field, "name"], datalabels),
                              field,
                            )}
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
