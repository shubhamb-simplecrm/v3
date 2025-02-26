import { create } from "apisauce";
import { decryptAES, encryptAES } from "./encryption-utils";
import qs from "qs";
import * as Sentry from "@sentry/react";
import { toast } from "react-toastify";
import CustomToast from "@/components/CommonComponents/CustomToast";

const SLOWNESS_TIME_THRESHOLD = 10000; // Time in milliseconds

/**
 * Decrypts API response data if encryption is enabled.
 */
const decryptAPIPayload = (inputData, { isEnabled, aesKey }) => {
  if (isEnabled && inputData) {
    try {
      const decryptedData = decryptAES(aesKey, inputData.data || inputData);
      return JSON.parse(decryptedData);
    } catch (error) {
      Sentry.captureException(error);
      return inputData;
    }
  }
  return inputData;
};

/**
 * Encrypts API request data if encryption is enabled.
 */
const encryptAPIPayload = (inputData, { isEnabled, aesKey }) => {
  if (isEnabled && inputData && Object.keys(inputData).length > 0) {
    try {
      const encryptedData = encryptAES(aesKey, JSON.stringify(inputData));
      return { data: encryptedData };
    } catch (error) {
      Sentry.captureException(error);
      throw new Error("Encryption Error");
    }
  }
  return inputData;
};

/**
 * Prepares the API request by adding a timestamp and encrypting the payload if needed.
 */
const prepareApiRequest = (config, encryptionConfig) => {
  config.params = {
    ...(config.params || {}),
    timestamp: Date.now(),
  };

  if (encryptionConfig.isEnabled && config.data) {
    config.data = encryptAPIPayload(config.data, encryptionConfig);
  }

  return config;
};

/**
 * Shows network slowness toast.
 */
const showNetworkSlownessToast = (toastId) => {
  toast.info(
    <CustomToast
      closeToast={() => {
        toast.dismiss(toastId);
      }}
      iconType="info"
      message="Your internet connection is slow."
      useDefaultIcon={true}
    />,
    {
      autoClose: false,
      closeOnClick: true,
      toastId,
    },
  );
};

/**
 * Creates a new API instance with custom configuration.
 */
const createApiInstance = ({
  baseURL,
  getToken,
  encryptionConfig = { isEnabled: false, aesKey: "" },
  additionalHeaders = {},
  handleError = (error) => Promise.reject(error),
}) => {
  const instance = create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      ...additionalHeaders,
    },
    paramsSerializer: (params) => qs.stringify(params, { encode: true }),
  });

  // Request interceptor
  instance.axiosInstance.interceptors.request.use(
    (config) => {
      const token = typeof getToken === "function" ? getToken() : null;
      if (token) {
        config.headers.Authorization = token;
      }

      config._isSlownessToastVisible = false;
      // config._slowRequestTimeout = setTimeout(() => {
      //   config._isSlownessToastVisible = true;
      //   const toastId = `slowness-toast-${Date.now()}`;
      //   config._slownessToastId = toastId;
      //   showNetworkSlownessToast(toastId);
      // }, SLOWNESS_TIME_THRESHOLD);

      return prepareApiRequest(config, encryptionConfig);
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor
  instance.axiosInstance.interceptors.response.use(
    (response) => {
      if (response.config._slowRequestTimeout) {
        clearTimeout(response.config._slowRequestTimeout);
      }
      if (response.config._isSlownessToastVisible) {
        toast.dismiss(response.config._slownessToastId);
      }
      response.data = decryptAPIPayload(response.data, encryptionConfig);
      return response;
    },
    (error) => {
      const originalRequest = error.config;
      if (originalRequest?._slowRequestTimeout) {
        clearTimeout(originalRequest._slowRequestTimeout);
      }
      if (originalRequest?._isSlownessToastVisible) {
        toast.dismiss(originalRequest._slownessToastId);
      }
      return handleError(error, originalRequest, instance);
    },
  );

  return instance;
};

/**
 * Creates a handleError function that manages token refresh logic and shows toast notifications.
 */
const createHandleError = ({
  refreshAuthToken,
  resetAuthState,
  encryptionConfig = { isEnabled: false, aesKey: "" },
}) => {
  let refreshTokenPromise = null;

  const handleError = async (error, originalRequest, instance) => {
    if (!error.response) {
      Sentry.captureException(new Error("Network Error"));
      // showNetworkErrorToast(retryRequest, () => reject(error));
      showNetworkErrorToast();
      return Promise.reject(error);
      // return new Promise((resolve, reject) => {
      //   const retryRequest = () =>
      //     instance.axiosInstance(originalRequest).then(resolve).catch(reject);
      //   showNetworkErrorToast(retryRequest, () => reject(error));
      // });
    }

    // Handle 401 errors and token refresh logic
    if (error.response.status === 401) {
      if (!originalRequest._retry && typeof refreshAuthToken === "function") {
        originalRequest._retry = true;

        // If token refresh is already in progress, wait for it
        if (refreshTokenPromise) {
          try {
            const newAccessToken = await refreshTokenPromise;
            if (newAccessToken) {
              // Update the token in headers and retry the request
              instance.setHeader("Authorization", newAccessToken);
              originalRequest.headers.Authorization = newAccessToken;
              return instance.axiosInstance(originalRequest);
            } else {
              // Token refresh failed, reset auth state
              if (typeof resetAuthState === "function") resetAuthState();
              return Promise.reject(new Error("Failed to refresh auth token"));
            }
          } catch (err) {
            if (typeof resetAuthState === "function") resetAuthState();
            return Promise.reject(err);
          }
        }

        // Start token refresh process
        refreshTokenPromise = refreshAuthToken()
          .then((newAccessToken) => {
            if (newAccessToken) {
              // Update the token in headers
              instance.setHeader("Authorization", newAccessToken);
              return newAccessToken;
            } else {
              throw new Error("Failed to refresh auth token");
            }
          })
          .catch((err) => {
            if (typeof resetAuthState === "function") resetAuthState();
            Sentry.captureException(err);
            throw err;
          })
          .finally(() => {
            // Reset the promise regardless of outcome
            refreshTokenPromise = null;
          });

        try {
          const newAccessToken = await refreshTokenPromise;
          // Retry the original request with the new token
          originalRequest.headers.Authorization = newAccessToken;
          return instance.axiosInstance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      } else {
        if (typeof resetAuthState === "function") resetAuthState();
      }
    }

    if (error.response?.data) {
      try {
        error.response.data = decryptAPIPayload(
          error.response.data,
          encryptionConfig,
        );
      } catch (decryptError) {
        Sentry.captureException(decryptError);
        return Promise.reject(decryptError);
      }
    }

    Sentry.captureException(error);
    return Promise.reject(error);
  };

  return handleError;
};

/**
 * Shows network error toast with a retry option.
 */
const showNetworkErrorToast = () => {
  const toastId = "network-error-toast";

  // Check if the toast is already active
  if (!toast.isActive(toastId)) {
    toast.error(
      <CustomToast
        closeToast={() => {
          toast.dismiss(toastId);
        }}
        iconType="error"
        message="Network error occurred. Please try again."
        useDefaultIcon={true}
      />,
      {
        autoClose: true,
        closeOnClick: false,
        onClose: () => {
          toast.dismiss(toastId);
        },
        toastId, // Use the constant toastId here
      },
    );
  }
};

export {
  decryptAPIPayload,
  encryptAPIPayload,
  prepareApiRequest,
  createApiInstance,
  createHandleError,
};
