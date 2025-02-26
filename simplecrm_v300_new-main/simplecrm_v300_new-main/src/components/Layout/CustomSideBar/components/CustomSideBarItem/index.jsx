import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Popover,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { memo, useMemo, useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { isEmpty, pathOr } from "ramda";
import {
  LBL_FAVORITES,
  LBL_NEW_BUTTON_LABEL,
  LBL_RECENTLY_VIEWED,
  LBL_VIEW_LABEL,
} from "../../../../../constant";
import Scrollbars from "react-custom-scrollbars";
import FaIcon from "../../../../FaIcon";
import { Link } from "react-router-dom";
import useStyles from "./styles";
import clsx from "clsx";
import { useEffect } from "react";
import { useModuleViewDetail } from "@/hooks/useModuleViewDetail";

export const CustomSideBarItem = (props) => {
  const { moduleKey, drawerState, metaObject } = props;
  const classes = useStyles();
  const [toggle, setToggle] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const metaObj = useModuleViewDetail();
  const moduleLink = `/app/${moduleKey}`;
  const isLinkActive =
    moduleLink && metaObj?.currentModule == moduleLink.replace("/app/", "");

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const subMenuListData = useMemo(() => {
    let moduleACLAccess = pathOr([], ["access"], metaObject);
    let moduleRecentRecords = Object.values(
      pathOr([], ["RecentViews"], metaObject),
    );
    let moduleFavRecords = Object.values(
      pathOr([], ["FavoriteRecords"], metaObject),
    );
    const subMenuDataObj = {
      Action: [],
      [LBL_RECENTLY_VIEWED]: [],
      [LBL_FAVORITES]: [],
    };
    if (moduleACLAccess.includes("create") && moduleKey !== "AOR_Reports") {
      subMenuDataObj["Action"].push({
        label: `${LBL_NEW_BUTTON_LABEL} ${metaObject.label}`,
        icon: { icon: "fa-plus" },
        link: `/app/createview/${moduleKey}`,
      });
    }

    if (moduleACLAccess.includes("access", "view", "list")) {
      subMenuDataObj["Action"].push({
        label: `${LBL_VIEW_LABEL} ${metaObject?.label}`,
        icon: { icon: "fa-eye" },
        link: `/app/${moduleKey}`,
      });
    }
    if (!isEmpty(moduleRecentRecords)) {
      moduleRecentRecords.forEach((datarecent, index) => {
        if (datarecent && index < 5) {
          subMenuDataObj[LBL_RECENTLY_VIEWED].push({
            label: `${datarecent.item_summary}`,
            icon: {
              icon: metaObject.icon,
            },
            link: moduleACLAccess.includes("view")
              ? `/app/detailview/${moduleKey}/${datarecent.item_id}`
              : "#",
          });
        }
      });
    }

    if (!isEmpty(moduleFavRecords)) {
      moduleFavRecords.forEach((datafav, index) => {
        if (datafav && index < 5) {
          subMenuDataObj[LBL_FAVORITES].push({
            label: `${datafav.attributes.name}`,
            icon: {
              icon: metaObject?.icon,
            },
            link: moduleACLAccess.includes("view")
              ? `/app/detailview/${moduleKey}/${datafav.id}`
              : "#",
          });
        }
      });
    }
    return subMenuDataObj;
  }, [metaObject]);
  const isSubMenuExist = useMemo(
    () => !isEmpty(Object.values(subMenuListData).flat()),
    [subMenuListData],
  );
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setToggle(!toggle);
  };

  const handleClose = () => {
    setToggle(false);
    setAnchorEl(null);
  };

  //   useEffect for close submenu popover if sidebar drawer was closed state
  useEffect(() => {
    if (!drawerState) {
      handleClose();
    }
  }, [drawerState]);
  return (
    <>
      <Tooltip title={metaObject?.label}>
        <ListItem
          component={moduleLink && Link}
          className={clsx({
            [classes.link]: !isLinkActive,
            [classes.activeLink]: isLinkActive,
            [classes.listItemOpen]: drawerState,
            [classes.listItemClose]: !drawerState,
          })}
          to={moduleLink}
          key={moduleKey}
          style={{
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
          disableRipple
        >
          <ListItemIcon
            className={classes.linkIcon}
            style={{ minWidth: drawerState ? "25px" : "37px" }}
          >
            {metaObject.icon && (
              <FaIcon
                icon={`fas ${
                  metaObject.icon ? metaObject.icon.icon : "fa-cube"
                }`}
                size="lg"
              />
            )}
          </ListItemIcon>
          <ListItemText
            primary={metaObject?.label}
            primaryTypographyProps={{
              style: {
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap ",
                maxWidth: "75%",
                fontSize: 14,
              },
            }}
            className={clsx(classes.linkText, {
              [classes.linkText]: !isLinkActive,
              [classes.activeLinkText]: isLinkActive,
            })}
          />
          {drawerState && isSubMenuExist && (
            <ListItemSecondaryAction>
              <IconButton
                aria-label="delete"
                aria-describedby={id}
                onClick={handleClick}
                style={{ padding: "0px", color: "#fff" }}
              >
                {toggle ? (
                  <ExpandLessIcon color="#fff" />
                ) : (
                  <ExpandMoreIcon color="#fff" />
                )}
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className={classes.nestedList}
      >
        <SubMenuList subMenuListData={subMenuListData} />
      </Popover>
    </>
  );
};

const SubMenuList = memo((props) => {
  const { subMenuListData } = props;
  const classes = useStyles();

  return (
    <List className={classes.subMenuRoot} subheader={<li />}>
      <Scrollbars autoHide={true} style={{ height: 200, width: 200 }}>
        {Object.entries(subMenuListData).map(
          ([sectionLabel, sectionData], sectionId) => (
            <div key={`submenu-${sectionId}`}>
              {!isEmpty(sectionData) && (
                <>
                  <Divider component="li" variant="middle" />
                  <li>
                    <Typography
                      className={classes.dividerInset}
                      color="textSecondary"
                      display="block"
                      variant="caption"
                    >
                      {` ${sectionLabel}`}
                    </Typography>
                  </li>
                  <SubMenuListItemList subMenuItemData={sectionData} />
                </>
              )}
            </div>
          ),
        )}
      </Scrollbars>
    </List>
  );
});

const SubMenuListItemList = memo((props) => {
  const { subMenuItemData } = props;
  const classes = useStyles();
  return subMenuItemData.map((subMenuItem, index) => (
    <ListItem
      key={`${subMenuItem?.label}-${index}`}
      button
      component={Link}
      to={subMenuItem?.link}
      classes={{
        root: clsx(classes.link),
      }}
      disableRipple
    >
      {subMenuItem?.icon && (
        <ListItemIcon className={clsx(classes.linkIcon)}>
          <FaIcon
            icon={`fas ${
              subMenuItem?.icon ? subMenuItem?.icon?.icon : "fa-cube"
            }`}
            size="1x"
          />
        </ListItemIcon>
      )}

      {subMenuItem?.label && (
        <Tooltip title={subMenuItem?.label} placement="right-start">
          <ListItemText
            classes={{
              primary: clsx(classes.nestedLinkText, {}),
            }}
            primary={subMenuItem?.label}
          />
        </Tooltip>
      )}
    </ListItem>
  ));
});
