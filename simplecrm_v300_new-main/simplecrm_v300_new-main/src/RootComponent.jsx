import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import * as Sentry from "@sentry/react";
import { persistor, store } from "./store/config-store";
import { Skeleton } from "./components";
import { toastStyle } from "./common/theme-constants";
import App from "./components/App";
import themes from "./themes";
import EnvUtils from "./common/env-utils";
import "./style.css";

// Add Icons in global states:START
const iconList = Object.keys(Icons)
  .filter((key) => key !== "fas" && key !== "prefix")
  .map((icon) => Icons[icon]);

library.add([...iconList]);
// Add Icons in global states:END

// Integrate Sentry:START
const formattedUrl = new URL(window.location.href).host
  .replace(":", "-")
  .split(".")
  .join("-");
const SENTRY_DSN = EnvUtils.getValue("REACT_APP_SENTRY_DSN");
const isSentryEnable = EnvUtils.getValue("REACT_APP_SENTRY_ENABLE") == "true";
Sentry.init({
  dsn: SENTRY_DSN,
  environment: formattedUrl,
  enabled: isSentryEnable,
  integrations: [
    Sentry.reactRouterV5BrowserTracingIntegration({ history }),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
  // tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
// Integrate Sentry:END

const RootComponent = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={themes.simpleX}>
        <CssBaseline />
        <PersistGate persistor={persistor} loading={<Skeleton />}>
          <App />
          <ToastContainer
            position="bottom-left"
            autoClose={3500}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            transition={Zoom}
            hideProgressBar={true}
            toastStyle={toastStyle}
          />
        </PersistGate>
      </ThemeProvider>
    </Provider>
  );
};

export default RootComponent;
