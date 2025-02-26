import React from "react";
import { useSelector } from "react-redux";
// styles
import useStyles from "./styles";
import Drawer from "@material-ui/core/Drawer";
import { pathOr } from "ramda";
import {
  DrawerNotifications,
  Activities,
  GlobalSearch,
  NewsFeeds,
  BPMRight,
  SmartSearch,
} from "../";
import {
  LBL_GLOBAL_SEARCH_TITLE,
  LBL_GLOBAL_SMART_SEARCH_TITLE,
  LBL_NOTIFICATIONS_TITLE,
  LBL_ACTIVITIES_TITLE,
  LBL_BPM_TITLE,
  LBL_NEWS_FEED_TITLE,
  LBL_ACTIVITIES_STREAM_TITLE,
} from "../../../../constant";
import { useHistory } from "react-router-dom";
import ActivitiesStream from "../ActivitiesStream";

export default function InnerRightDrawer({
  toggleDrawerDetailRightBar,
  openDetailRightBar,
  setOpenDetailRightBar,
}) {
  const classes = useStyles();
  const history = useHistory();

  const name = pathOr("", ["data", "name"], openDetailRightBar);

  const renderComponent = (type) => {
    switch (type) {
      case LBL_NOTIFICATIONS_TITLE:
        return (
          <DrawerNotifications
            toggleDrawerDetailRightBar={toggleDrawerDetailRightBar}
            openDetailRightBar={openDetailRightBar}
            setOpenDetailRightBar={setOpenDetailRightBar}
            history={history}
          />
        );
      case LBL_ACTIVITIES_TITLE:
        return (
          <Activities
            toggleDrawerDetailRightBar={toggleDrawerDetailRightBar}
            openDetailRightBar={openDetailRightBar}
            setOpenDetailRightBar={setOpenDetailRightBar}
            history={history}
          />
        );
      case LBL_ACTIVITIES_STREAM_TITLE:
        return (
          <ActivitiesStream
            toggleDrawerDetailRightBar={toggleDrawerDetailRightBar}
            openDetailRightBar={openDetailRightBar}
            setOpenDetailRightBar={setOpenDetailRightBar}
            history={history}
          />
        );
      case LBL_GLOBAL_SEARCH_TITLE:
        return (
          <GlobalSearch
            toggleDrawerDetailRightBar={toggleDrawerDetailRightBar}
            openDetailRightBar={openDetailRightBar}
            setOpenDetailRightBar={setOpenDetailRightBar}
            history={history}
          />
        );
      case LBL_GLOBAL_SMART_SEARCH_TITLE:
        return (
          <SmartSearch
            toggleDrawerDetailRightBar={toggleDrawerDetailRightBar}
            openDetailRightBar={openDetailRightBar}
            setOpenDetailRightBar={setOpenDetailRightBar}
            history={history}
          />
        );
      case LBL_BPM_TITLE:
        return (
          <BPMRight
            toggleDrawerDetailRightBar={toggleDrawerDetailRightBar}
            openDetailRightBar={openDetailRightBar}
            setOpenDetailRightBar={setOpenDetailRightBar}
            history={history}
          />
        );
      case LBL_NEWS_FEED_TITLE:
        return <NewsFeeds />;
      default:
        return null;
    }
  };
  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={openDetailRightBar["right"]}
      className={clsx(classes.drawer, {
        [classes.drawerOpenRightBar]: openDetailRightBar["right"],
        [classes.drawerCloseRightBar]: !openDetailRightBar["right"],
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpenRightBar]: openDetailRightBar["right"],
          [classes.drawerCloseRightBar]: !openDetailRightBar["right"],
        }),
      }}
      style={{ overflow: name === LBL_GLOBAL_SEARCH_TITLE ? "hidden" : "auto" }}
    >
      {renderComponent(name)}
    </Drawer>
  );
}
