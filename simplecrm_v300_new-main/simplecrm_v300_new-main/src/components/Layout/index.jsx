import React, { useCallback, useEffect, memo } from "react";
import clsx from "clsx";
import { Box } from "@material-ui/core";
import useStyles from "./styles";
import CustomAppBar from "./CustomAppBar";
import CustomSideBar from "./CustomSideBar";
import RouteNavigation from "./RouteNavigation";
import CustomFooter from "./CustomFooter";
import CustomRightSideBar from "./CustomRightSideBar";
import { useLayoutState } from "../../customStrore/useLayoutState";
import ConfigProvider from "../ConfigProvider";
import { useIsMobileView } from "../../hooks/useIsMobileView";
import { isOptionAllow } from "../../common/layout-constants";
import { useModuleViewDetail } from "../../hooks/useModuleViewDetail";
import { pathOr } from "ramda";
import useCommonUtils from "@/hooks/useCommonUtils";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const Layout = () => {
  const classes = useStyles();
  const history = useHistory();
  const isMobile = useIsMobileView("xs");
  const fullscreenModules = [
    "/studio",
    "/FieldConfigurator",
  ];
  const isFullScreen = fullscreenModules.some((module) =>
    history.location.pathname.includes(module),
  );
  const { navbarOptions, isCopyPasteContentAllow } = useCommonUtils();
  const { sideBarState, rightSidebarDrawerState, rightSidebarSelectedOption } =
    useLayoutState((state) => ({
      sideBarState: state.sideBarState,
      rightSidebarDrawerState: state.rightSidebarState?.drawerState,
      rightSidebarSelectedOption: state.rightSidebarState?.selectedOption,
    }));
  const { toggleSideBar, changeRightSideBarState } = useLayoutState(
    (state) => state.actions,
  );
  let isMobileViewCheck = useIsMobileView();
  const appRouteData = useModuleViewDetail();

  const handleDrawerOpen = useCallback(() => {
    toggleSideBar(true);
    if (isMobileViewCheck) {
      changeRightSideBarState({ drawerState: false });
    }
  }, [toggleSideBar]);
  const handleDrawerClose = useCallback(() => {
    toggleSideBar(false);
  }, []);
  const isRightSidebarClose = () => {
    let selectedOptionItem = navbarOptions?.allNavbarOptions?.filter(
      (o) => o.key == rightSidebarSelectedOption,
    );
    selectedOptionItem = pathOr(null, [0], selectedOptionItem);
    if (
      rightSidebarDrawerState &&
      (!isOptionAllow(selectedOptionItem, appRouteData) ||
        rightSidebarSelectedOption == "filter_option")
    ) {
      changeRightSideBarState({ drawerState: false });
    }
  };

  useEffect(() => {
    if (isMobileViewCheck) {
      handleDrawerClose();
    }
    isRightSidebarClose();
  }, [appRouteData]);
  return (
    <ConfigProvider>
      <div
        className={clsx(classes.root, {
          [classes.contentCopyDisable]: !isCopyPasteContentAllow,
        })}
      >
        {!isFullScreen && (
          <CustomAppBar
            sideBarState={sideBarState}
            handleDrawerClose={handleDrawerClose}
            handleDrawerOpen={handleDrawerOpen}
            rightSidebarState={rightSidebarDrawerState}
          />
        )}
        <Box
          className={classes.container}
          style={{
            height: isFullScreen
              ? "100vh"
              : isMobile
                ? "90vh"
                : `calc(100vh - 6.5rem)`,
          }}
          // className={clsx(classes.container, {
          //   [!isFullScreen]: classes.containerHeight,
          //   [isFullScreen]: classes.containerFullHeight,
          // })}
        >
          {!isFullScreen && (
            <CustomSideBar
              handleDrawerClose={handleDrawerClose}
              drawerState={sideBarState}
            />
          )}

          <Box
            className={clsx(classes.layoutMainSection, {
              [classes.contentRightShift]: rightSidebarDrawerState,
            })}
          >
            <RouteNavigation />
            <CustomRightSideBar />
          </Box>
        </Box>
        {!isFullScreen && <CustomFooter />}
      </div>
    </ConfigProvider>
  );
};

export default memo(Layout);
