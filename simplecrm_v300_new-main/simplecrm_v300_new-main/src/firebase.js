import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";
import LocalStorageUtils from "./common/local-storage-utils";
import { FCMTokenApi } from "./store/actions/notification.actions";
import { notificationUtil } from "./utils/notification.utils";

const firebaseConfig = {
  apiKey: notificationUtil.apiKey,
  authDomain: notificationUtil.authDomain,
  projectId: notificationUtil.projectId,
  storageBucket: notificationUtil.storageBucket,
  messagingSenderId: notificationUtil.messagingSenderId,
  appId: notificationUtil.appId,
  measurementId: notificationUtil.measurementId,
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = (async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    }
    return null;
  } catch (err) {
    return null;
  }
})();

export const fetchToken = (setTokenFound) => {
  Notification.requestPermission().then(function (permission) {
    if (permission === "granted") {
      return getToken(messaging, {
        vapidKey: notificationUtil.VALID_TOKEN_URL,
      })
        .then((currentToken) => {
          if (currentToken) {
            setTokenFound(true);
            LocalStorageUtils.setFCMToken(currentToken);
            let token = LocalStorageUtils.getAccessToken();
            if (token != null) {
              FCMTokenApi(currentToken);
            }
          } else {
            setTokenFound(false);
            // shows on the UI that permission is required
          }
        })
        .catch((err) => {
          // catch error while creating client token
        });
    }
  });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
