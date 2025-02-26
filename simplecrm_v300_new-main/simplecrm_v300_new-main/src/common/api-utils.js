import { createApiInstance, createHandleError } from "./axios-utils";
import EnvUtils from "./env-utils";
import { useAuthState } from "@/customStrore";

const getToken = () => {
  const { tokenObj } = useAuthState.getState();
  return tokenObj?.accessToken || null;
};

const baseURL = useAuthState.getState().baseURL;

const encryptionConfig = {
  isEnabled:
    EnvUtils.getValue("REACT_APP_API_TRANSACTION_ENCRYPTED") === "true",
  aesKey: EnvUtils.getValue("REACT_APP_AES_KEY") || "",
};

const api = createApiInstance({
  baseURL,
  getToken,
  encryptionConfig,
  handleError: createHandleError({
    refreshAuthToken: useAuthState.getState().authActions.onRefreshTokenLogin,
    resetAuthState: useAuthState.getState().authActions.resetAuthState,
    encryptionConfig,
  }),
  additionalHeaders: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
    withCredentials: true,
  },
});

const auth = createApiInstance({
  baseURL,
  getToken,
  encryptionConfig,
  handleError: createHandleError({
    encryptionConfig,
  }),
  additionalHeaders: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

export { api, auth };
