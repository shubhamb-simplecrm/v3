import React, { memo, useMemo } from "react";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import { useLayoutState } from "../../../customStrore/useLayoutState";
import { useStyles } from "./styles";
import {
  Activities,
  ActivitiesStream,
  BPMRight,
  DrawerNotifications,
  GlobalSearch,
  NewsFeeds,
  SmartSearch,
  Filter,
} from "../../RightSidebar/components";
import SalesCoach from "../../RightSidebar/components/SalesCoach";
import { CustomNavBar } from "../CustomNavBar";
import { useCallback } from "react";
import { useIsMobileView } from "@/hooks/useIsMobileView";

const CustomRightSideBar = () => {
  const classes = useStyles();
  const isMobile = useIsMobileView("md");
  const { mobileRightSidebarState, rightSidebarState } = useLayoutState(
    (state) => ({
      mobileRightSidebarState: state.mobileRightSidebarState,
      rightSidebarState: state.rightSidebarState,
      rightSidebarSelectedOption: state.rightSidebarState?.selectedOption,
    }),
  );
  const {
    drawerState = false,
    selectedOption = null,
    customData = null,
  } = rightSidebarState;
  const { changeRightSideBarState } = useLayoutState((state) => state.actions);
  const handleCloseRightSideBar = useCallback(() => {
    changeRightSideBarState({ drawerState: false });
  }, []);
  return (
    <>
      <MobileDrawer />
      <Drawer
        className={clsx({
          [classes.drawerOpen]: rightSidebarState,
          [classes.drawerClose]: !drawerState,
        })}
        variant="persistent"
        anchor="right"
        open={drawerState}
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.drawerTabOpen]: isMobile && drawerState,
            [classes.drawerPaperOpen]: !mobileRightSidebarState && drawerState,
            [classes.drawerPaperClose]: !drawerState,
            [classes.mobileRightDrawer]: mobileRightSidebarState,
          }),
        }}
      >
        <div className={classes.appBarSpacer}></div>
        <CustomRightSidebarBody
          drawerState={drawerState}
          optionLabel={selectedOption}
          rightSidebarState={rightSidebarState}
          customData={customData}
          handleCloseRightSideBar={handleCloseRightSideBar}
        />
      </Drawer>
    </>
  );
};
const MobileDrawer = memo(() => {
  const mobileRightSidebarState = useLayoutState(
    (state) => state.mobileRightSidebarState,
  );
  const classes = useStyles();
  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={mobileRightSidebarState}
      className={clsx({
        [classes.drawerMobileOpen]: mobileRightSidebarState,
        [classes.drawerMobileClose]: !mobileRightSidebarState,
      })}
      classes={{
        paper: clsx(classes.drawerMobileContainer, {
          [classes.drawerMobilePaperOpen]: mobileRightSidebarState,
          [classes.drawerMobilePaperClose]: !mobileRightSidebarState,
        }),
      }}
    >
      <div className={classes.drawerMobileSpacer}></div>
      <CustomNavBar />
    </Drawer>
  );
});
const CustomRightSidebarBody = memo((props) => {
  const { optionLabel, handleCloseRightSideBar, customData, drawerState } =
    props;

  let optionComponents = {
    bpm_option: <BPMRight />,
    profile_option: null,
    notification_option: (
      <DrawerNotifications handleCloseRightSideBar={handleCloseRightSideBar} />
    ),
    sales_coach_option: <SalesCoach />,
    global_search_option: (
      <GlobalSearch onCloseRightSideBar={handleCloseRightSideBar} />
    ),
    smart_search_option: (
      <SmartSearch onCloseRightSideBar={handleCloseRightSideBar} />
    ),
    activities_option: <Activities />,
    activity_stream_option: <ActivitiesStream />,
    news_feeds_option: <NewsFeeds />,
    filter_option: (
      <Filter
        handleCloseRightSideBar={handleCloseRightSideBar}
        customData={customData}
        drawerState={drawerState}
      />
    ),
    ["default"]: null,
  };
  let component = optionComponents[optionLabel] || optionComponents["default"];
  return component;
});

export default memo(CustomRightSideBar);
