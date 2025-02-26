import React, { useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import { SocketProvider } from "../../context/SocketContext";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getAlertNotifications,
  getNotifications,
  updateNotificationCount,
} from "../../store/actions/notification.actions";
import { getConfigData } from "../../store/actions/config.actions";
import { getSidebarLinks } from "../../store/actions/layout.actions";
import { isEmpty, isNil, pathOr } from "ramda";
import Themes from "../../themes";
import { ThemeProvider } from "@material-ui/styles";
import SkeletonShell from "../Skeleton";
import Error from "../Error";
import { useLayoutState } from "../../customStrore/useLayoutState";
import { useIsMobileView } from "../../hooks/useIsMobileView";
import { changeInstanceNativeButton } from "../../common/mobile-utils";
import ConfigTimeout from "../ConfigTimeout";
import EnvUtils from "../../common/env-utils";
import FirebaseToast from "../Notification/FirebaseToast";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DayjsUtils from "@date-io/dayjs";
import { APP_DATE_LOCALE } from "../../constant";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FilePreviewProvider } from "../../context/FilePreviewContext";

dayjs.extend(customParseFormat);
dayjs.extend(duration);

const ConfigProvider = (props) => {
  const { children } = props;
  const { resetStore } = useLayoutState((state) => state.actions);
  const dispatch = useDispatch();
  const { config, configLoading, configError, currentUserData } = useSelector(
    (state) => state.config,
  );
  const sidebarLoading = useSelector((state) => state.layout?.sidebarLoading);
  const currentSelectedTheme = pathOr("", ["V3SelectedTheme"], config);
  const isMobileView = useIsMobileView();
  const selectedMUIThemeObj = useMemo(() => {
    if (currentSelectedTheme === "light") return Themes.default;
    else if (currentSelectedTheme === "dark") return Themes.dark;
    else return Themes.simpleX;
  }, [currentSelectedTheme]);
  const firebaseNotificationEnableFlag = EnvUtils.getValue(
    "REACT_FIREBASE_NOTIFICATION_ENABLE",
  );
  const isFirebaseNotificationEnable = firebaseNotificationEnableFlag == "true";
  const userData = pathOr(undefined, ["data", "attributes"], currentUserData);
  const getConfig = useCallback(async () => {
    return (isEmpty(config) || isNil(config)) && dispatch(getConfigData());
  }, [dispatch]);
  const getSidebarData = useCallback(() => {
    dispatch(getSidebarLinks());
  }, [dispatch]);

  const fetchNotifications = useCallback(() => {
    dispatch(getAlertNotifications(1)).then((res) => {
      if (res.ok) {
        const totalRecords = pathOr(0, ["data", "meta", "total-records"], res);
        dispatch(updateNotificationCount(totalRecords));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(config) && !isNil(config)) {
      const interval = setInterval(() => {
        fetchNotifications();
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [config]);

  useLayoutEffect(() => {
    resetStore();
    getConfig().then(() => {
      changeInstanceNativeButton(true);
    });
    getSidebarData();
    if (!isEmpty(config) && !isNil(config)) {
      fetchNotifications();
    }
  }, []);

  // showing loading screen until all prerequisite data api like config and sidebar api not load
  if (configLoading || sidebarLoading) {
    return <SkeletonShell />;
  }

  // // showing error screen when all prerequisite data api like config and sidebar api not load
  if (!configLoading && configError) {
    return (
      <Error
        description={configError.toString()}
        errorObj={configError}
        view="EditView"
        title="Error"
      />
    );
  }

  if (isNil(config)) return <SkeletonShell />;

  return (
    <ThemeProvider theme={selectedMUIThemeObj}>
      <ConfigTimeout>
        <FilePreviewProvider>
          <MuiPickersUtilsProvider
            libInstance={dayjs}
            utils={DayjsUtils}
            locale={APP_DATE_LOCALE}
          >
            <SocketProvider>{children}</SocketProvider>
          </MuiPickersUtilsProvider>
        </FilePreviewProvider>
      </ConfigTimeout>
    </ThemeProvider>
  );
};

export default ConfigProvider;
