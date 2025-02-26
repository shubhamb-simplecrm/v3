import React, { useState, useEffect, memo, useCallback } from "react";
import { useIdleTimer } from "react-idle-timer";
import AlertDialog from "../Alert";
import { useAuthState } from "@/customStrore";
import useCommonUtils from "@/hooks/useCommonUtils";

const ConfigTimeout = ({ children }) => {
  const { authActions } = useAuthState((state) => ({
    authActions: state.authActions,
  }));

  const { idleSessionPopupShowTime, idleSessionTimeout } = useCommonUtils();
  // const idleSessionTimeout = 500000;
  // const idleSessionPopupShowTime = 491000;

  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(idleSessionTimeout);

  const onIdle = useCallback(() => {
    setOpen(false);
    authActions.onLogoutAction(true);
  }, [authActions]);

  const onActive = useCallback(() => {
    setOpen(false);
  }, []);

  const onPrompt = useCallback(() => {
    setOpen(true);
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(
        'Your session is about to expire. Please click on "Stay Connected" to continue.',
      );
      notification.onclick = () => {
        window.focus();
        onStillHere();
        notification.close();
      };
    }
  }, []);

  const handleLogoutTimer = useCallback(() => {
    authActions.onLogoutAction(true);
  }, [authActions]);

  const { getRemainingTime, activate: onStillHere } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout: idleSessionTimeout,
    promptBeforeIdle: idleSessionPopupShowTime,
    crossTab: true,
    syncTimers: 200,
  });

  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.error("Notification permission not granted");
        }
      } catch (e) {
        console.error(
          "Notification API not supported or permission request failed",
          e,
        );
      }
    };

    if ("Notification" in window && Notification.permission !== "granted") {
      requestNotificationPermission();
    }
  }, []);

  useEffect(() => {
    if (open) {
      const interval = setInterval(() => {
        setRemaining(Math.ceil(getRemainingTime() / 1000));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [open, getRemainingTime]);

  return (
    <>
      <AlertDialog
        msg={`Your session is about to expire. Redirecting in ${remaining} seconds.`}
        title="Are you still there?"
        open={open}
        onAgree={onStillHere}
        handleClose={handleLogoutTimer}
        agreeText="Stay Connected"
        disagreeText="Logout"
      />
      {children}
    </>
  );
};

export default memo(ConfigTimeout);
