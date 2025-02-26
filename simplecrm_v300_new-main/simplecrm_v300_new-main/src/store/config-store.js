import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from "redux";
import { persistReducer, persistStore } from "redux-persist";
import thunkMiddleware from "redux-thunk";
import localForage from "localforage";

import rootReducer from "./reducers";
import EnvUtils from "../common/env-utils";

const configStore = () => {
  const middleware = [thunkMiddleware];
  const enhancers = [];

  const __DEV__ = EnvUtils.getValue("NODE_ENV") !== "production";
  if (__DEV__) {
    //const devToolsExtension = window.devToolsExtension;
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
    if (typeof devToolsExtension === "function") {
      enhancers.push(devToolsExtension());
    }
  }

  let persistConfig = {
    key: "auth",
    storage: localForage,
    debug: __DEV__,
    whitelist: ["config"],
    timeout: null,
  };

  let persistRootReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(
    persistRootReducer,
    {},
    compose(applyMiddleware(...middleware), ...enhancers),
  );

  const persistor = persistStore(store);

  return { store, persistor };
};

export const { store, persistor } = configStore();
