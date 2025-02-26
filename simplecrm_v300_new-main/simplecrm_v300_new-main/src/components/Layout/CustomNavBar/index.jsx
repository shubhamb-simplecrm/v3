import { Badge, Box, Tooltip } from "@material-ui/core";
import React, { useState, useCallback, useMemo } from "react";
import useStyles from "./styles";
import {
  LBL_BPM_TITLE,
  LBL_NOTIFICATIONS_TITLE,
  LBL_PROFILE_LABEL_TITLE,
} from "../../../constant";
import { ProfileMenu } from "./components/ProfileMenu";
import { memo } from "react";
import { useLayoutState } from "../../../customStrore/useLayoutState";
import QuickCreateGlobalButton from "../../QuickCreateGlobalButton";
import { useModuleViewDetail } from "../../../hooks/useModuleViewDetail";
import { pathOr } from "ramda";
import { useSelector } from "react-redux";
import { useIsMobileView } from "../../../hooks/useIsMobileView";
import { getNavbarIcon, isOptionAllow } from "../../../common/layout-constants";
import useCommonUtils from "@/hooks/useCommonUtils";
import { IconButton } from "@/components/SharedComponents/IconButton";

export const CustomNavBar = memo(({ isMobileViewAppBar = false }) => {
  const { navbarOptions, userRoles } = useCommonUtils();
  const metaObj = useModuleViewDetail();
  const { rightSidebarState } = useLayoutState(
    (state) => ({
      rightSidebarState: state.rightSidebarState,
    })
  );

  const { toggleMobileRightSideBar, changeRightSideBarState } = useLayoutState(
    (state) => state.actions,
  );
  const { isUserHaveCustomerPortalRole } = useCommonUtils();
  const commonNavbarOptionList = pathOr(
    [],
    ["commonNavbarOption"],
    navbarOptions,
  );
  const mobileViewNavBarOpenerOption = pathOr(
    {},
    ["mobileViewNavBarOpenerOption"],
    navbarOptions,
  );
  const quickCreateNavBarOpenerOption = pathOr(
    {},
    ["quickCreateNavBarOpenerOption"],
    navbarOptions,
  );
  const fixedNavbarOption = pathOr({}, ["fixedNavbarOption"], navbarOptions);

  let isMobileViewCheck = useIsMobileView();
  const handleOnToggle = useCallback((label) => {
    changeRightSideBarState((state) => {
      return {
        drawerState: !(state?.selectedOption == label),
        selectedOption: label,
      };
    });
  }, []);
  const handleOnMobileToggle = useCallback((label) => {
    toggleMobileRightSideBar();
  }, []);
  return (
    <Box
      sx={{ display: { xs: "none", sm: "block" } }}
      style={{
        display: "flex",
        flexDirection: isMobileViewCheck ? "column-reverse" : "row",
        justifyContent: "space-between",
        gap: "20px",
        alignItems: "center",
      }}
    >
      {isMobileViewAppBar ? (
        <IconButton
          tooltipTitle={mobileViewNavBarOpenerOption.label}
          color="inherit"
          aria-label={mobileViewNavBarOpenerOption.label}
          onClick={() =>
            handleOnMobileToggle(mobileViewNavBarOpenerOption.label)
          }
        >
          {getNavbarIcon(mobileViewNavBarOpenerOption?.key)}
        </IconButton>
      ) : (
        <>
          {isMobileViewCheck && (
            <QuickCreateNavbarOption
              metaData={quickCreateNavBarOpenerOption}
              metaObj={metaObj}
            />
          )}
          {!isUserHaveCustomerPortalRole &&
            commonNavbarOptionList?.map((item) =>
              !!item?.isOptionVisible ? (
                <CustomNavBarOptionIcon
                  key={item?.key}
                  metaData={item}
                  handleOnToggle={handleOnToggle}
                  isActiveOption={rightSidebarState?.selectedOption == item.key}
                  metaObj={metaObj}
                />
              ) : null,
            )}

          <FixedNavBarOptions
            handleOnToggle={handleOnToggle}
            selectedOption={rightSidebarState?.selectedOption}
            isUserHaveCustomerPortalRole={isUserHaveCustomerPortalRole}
            fixedNavbarOption={fixedNavbarOption}
          />
        </>
      )}
    </Box>
  );
});
const CustomNavBarOptionIcon = memo((props) => {
  const { metaData, metaObj, handleOnToggle, isActiveOption } = props;
  const classes = useStyles();
  return isOptionAllow(metaData, metaObj) ? (
    <IconButton
      tooltipTitle={metaData.label}
      color="action"
      align={"right"}
      isActive={isActiveOption}
      onClick={() => handleOnToggle(metaData.key)}
    >
      {getNavbarIcon(metaData?.key)}
    </IconButton>
  ) : null;
});

const FixedNavBarOptions = memo(
  ({
    handleOnToggle,
    selectedOption,
    isUserHaveCustomerPortalRole,
    fixedNavbarOption,
  }) => {
    const profileOption = pathOr(
      {},
      [LBL_PROFILE_LABEL_TITLE],
      fixedNavbarOption,
    );
    const notificationOption = pathOr(
      {},
      [LBL_NOTIFICATIONS_TITLE],
      fixedNavbarOption,
    );
    const BPMOption = pathOr({}, [LBL_BPM_TITLE], fixedNavbarOption);
    return (
      <>
        {!!BPMOption.isOptionVisible && !isUserHaveCustomerPortalRole && (
          <BPMNavBarOption
            metaData={BPMOption}
            handleOnToggle={handleOnToggle}
            isActiveOption={selectedOption == BPMOption.key}
          />
        )}

        {!!notificationOption.isOptionVisible && (
          <NotificationNavBarOption
            metaData={notificationOption}
            handleOnToggle={handleOnToggle}
            isActiveOption={selectedOption == notificationOption.key}
          />
        )}
        {!!profileOption.isOptionVisible && <ProfileMenu />}
      </>
    );
  },
);

const NotificationNavBarOption = (props) => {
  const { metaData, handleOnToggle, isActiveOption } = props;
  const classes = useStyles();
  const totalNotificationsCount = useSelector(
    (state) => state?.notification?.totalNotificationsCount,
  );
  return (
    <Badge
      badgeContent={totalNotificationsCount}
      classes={{ badge: classes.badgeColor }}
      color="warning"
    >
      <IconButton
        tooltipTitle={metaData.label}
        color="action"
        align={"right"}
        isActive={isActiveOption}
        onClick={() => handleOnToggle(metaData.key)}
      >
        {getNavbarIcon(metaData?.key)}
      </IconButton>
    </Badge>
  );
};

const BPMNavBarOption = (props) => {
  const { metaData, handleOnToggle, isActiveOption } = props;
  const classes = useStyles();
  const metaObj = useModuleViewDetail();
  return !!metaData?.isOptionVisible && isOptionAllow(metaData, metaObj) ? (
    <IconButton
      tooltipTitle={metaData.label}
      color="action"
      align={"right"}
      isActive={isActiveOption}
      onClick={() => handleOnToggle(metaData.key)}
    >
      {getNavbarIcon(metaData?.key)}
    </IconButton>
  ) : null;
};

const QuickCreateNavbarOption = memo((props) => {
  const { metaData, metaObj } = props;
  const [isOpenQuickCreate, setIsOpenQuickCreate] = useState(false);
  const classes = useStyles();
  return !!metaData?.isOptionVisible ? (
    <Tooltip title={metaData.label}>
      <QuickCreateGlobalButton
        isMobile={true}
        open={isOpenQuickCreate}
        handleOpen={() => setIsOpenQuickCreate(!isOpenQuickCreate)}
      />
    </Tooltip>
  ) : null;
});
