import { createWithEqualityFn } from "zustand/traditional";
import { persist } from "zustand/middleware";
import { api, auth } from "@/common/api-utils";
import EnvUtils from "@/common/env-utils";
import {
  LOGIN_ONGOING_MSG,
  LOGIN_SUCCESS_MSG,
  LOGOUT_ONGOING_MSG,
  LOGOUT_SUCCESS_MSG,
  SESSION_REFRESH_ERROR1_MSG,
  SESSION_REFRESH_ERROR_MSG,
  SESSION_REFRESH_ONGOING_MSG,
  SESSION_REFRESH_SUCCESS_MSG,
  SOMETHING_WENT_WRONG,
} from "@/constant";
import { isEmpty, pathOr } from "ramda";
import { toast } from "react-toastify";
import history from "@/common/history";
import { store } from "@/store/config-store";
import * as Sentry from "@sentry/react";
import {
  changeInstanceNativeButton,
  logoutConfirmedToNative,
} from "@/common/mobile-utils";

const appBaseurl = EnvUtils.getValue("REACT_APP_BASE_URL");
const authClientId = EnvUtils.getValue("REACT_APP_CLIENT_ID");
const authClientSecret = EnvUtils.getValue("REACT_APP_CLIENT_SECRET");

const initialState = {
  baseURL: appBaseurl,
  isAuthenticated: false,
  authClientId,
  authClientSecret,
  userDetail: {},
  tokenObj: { accessToken: "", refreshToken: "" },
  redirectUrl: "/",
  expiresIn: null,
  tokenExpireTime: null,
  loginLoading: false,
  logoutLoading: false,
  forgetLoading: false,
  resetLoading: false,
};

const handleToastError = (message, pendingId) => {
  toast.update(pendingId, {
    render: message || SOMETHING_WENT_WRONG,
    type: "error",
    isLoading: false,
    autoClose: 3000,
  });
};

export const useAuthState = createWithEqualityFn(
  persist(
    (set, get) => ({
      ...initialState,
      authActions: {
        setUserDetail: (userDetail) => set({ userDetail }),
        onBaseURLChange: (url) => {
          const baseURL = `${url}/Api`;
          set({ baseURL });
          auth.setBaseURL(baseURL);
          api.setBaseURL(baseURL);
        },

        onRedirectUrlChangeAction: (url) =>
          url !== get().redirectUrl && set({ redirectUrl: url }),

        onRefreshTokenLogin: async () => {
          const { refreshToken } = get()?.tokenObj;
          if (!refreshToken) {
            toast.error("No refresh token available.");
            return null;
          }
          if (!refreshToken) return null;
          const pendingId = toast.loading(SESSION_REFRESH_ONGOING_MSG);
          try {
            const token = await get().authActions.onLoginAction(
              {
                grant_type: "refresh_token",
                client_id: get().authClientId,
                client_secret: get().authClientSecret,
                refresh_token: refreshToken,
              },
              "access_token",
              true,
            );

            toast.update(pendingId, {
              render: token
                ? SESSION_REFRESH_SUCCESS_MSG
                : SESSION_REFRESH_ERROR_MSG,
              type: token ? "success" : "error",
              isLoading: false,
              autoClose: 3000,
            });

            return token;
          } catch (error) {
            Sentry.captureException(error);
            handleToastError(SESSION_REFRESH_ERROR1_MSG, pendingId);
            return null;
          }
        },

        onLoginAction: async (
          payload,
          loginType = "access_token",
          isRefresh = false,
        ) => {
          set({ loginLoading: true });

          const pendingId = isRefresh ? null : toast.loading(LOGIN_ONGOING_MSG);
          try {
            const res = await auth.post(`/${loginType}`, payload);
            if (res.ok) {
              const tokenObj = {
                accessToken: pathOr("", ["data", "access_token"], res),
                refreshToken: pathOr("", ["data", "refresh_token"], res),
              };

              if (isEmpty(tokenObj.accessToken)) {
                throw new Error("Missing access token.");
              }

              const expiresIn = pathOr(0, ["data", "expires_in"], res);
              const tokenExpireTime = Date.now() + expiresIn * 1000 - 300000;

              api.setHeader("Authorization", tokenObj.accessToken);
              set({
                isAuthenticated: true,
                tokenObj,
                tokenExpireTime,
                expiresIn,
              });

              if (!isRefresh) {
                changeInstanceNativeButton(true);
                toast.update(pendingId, {
                  render: LOGIN_SUCCESS_MSG,
                  type: "success",
                  isLoading: false,
                  autoClose: 3000,
                });
                history.push(get().redirectUrl || "/");
              }

              return tokenObj.accessToken;
            }
            throw new Error("Invalid credentials.");
          } catch (error) {
            Sentry.captureException(error);
            handleToastError(error.message, pendingId);
            set({ isAuthenticated: false });
            return null;
          } finally {
            set({ loginLoading: false });
          }
        },

        onPasswordChangeAction: async (payload, loginType, loginPayload) => {
          set({ loginLoading: true });
          const pendingId = toast.loading("Changing password...");
          try {
            const res = await auth.post(`/meta/changePassword`, payload);

            if (res.ok) {
              toast.update(pendingId, {
                render: "Password changed successfully.",
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });
              set({ isAuthenticated: false });
              await get().authActions.onLoginAction(loginPayload, loginType);
            } else {
              throw new Error();
            }
          } catch (error) {
            handleToastError(null, pendingId);
            Sentry.captureException(error);
          } finally {
            set({ loginLoading: false });
          }
        },

        onLogoutAction: async (isRedirectPersist = false) => {
          set({ logoutLoading: true });
          const pendingId = toast.loading(LOGOUT_ONGOING_MSG);
          try {
            const res = await api.post("/V8/logout");
            if (res.ok) {
              logoutConfirmedToNative();
              get().authActions.resetAuthState({
                redirectUrl: isRedirectPersist ? get().redirectUrl : "",
              });

              toast.update(pendingId, {
                render: LOGOUT_SUCCESS_MSG,
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });
            } else {
              throw new Error("Logout failed.");
            }
          } catch (error) {
            Sentry.captureException(error);
            handleToastError(error.message, pendingId);
          } finally {
            set({ logoutLoading: false });
          }
        },

        onForgotPasswordAction: async (
          payload,
          { onSuccess = () => {} } = {},
        ) => {
          set({ forgetLoading: true });
          const pendingId = toast.loading("Sending password reset link...");
          try {
            const res = await auth.post(`/meta/sentPasswordLink`, payload);
            if (res.ok) {
              toast.update(pendingId, {
                render: "Password reset link sent.",
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });
              onSuccess();
            } else {
              throw new Error();
            }
          } catch (error) {
            Sentry.captureException(error);
            handleToastError(null, pendingId);
          } finally {
            set({ forgetLoading: false });
          }
        },

        onResetPasswordAction: async (
          payload,
          { onSuccess = () => {} } = {},
        ) => {
          set({ resetLoading: true });
          const pendingId = toast.loading("Resetting password...");
          try {
            const res = await auth.post(`/meta/resetPassword`, payload);
            if (res.ok) {
              toast.update(pendingId, {
                render: "Password reset successfully.",
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });
              onSuccess();
            } else {
              throw new Error();
            }
          } catch (error) {
            Sentry.captureException(error);
            handleToastError(null, pendingId);
          } finally {
            set({ resetLoading: false });
          }
        },

        resetAuthState: (args = {}) => {
          const { samlLogoutUrl = "", ...rest } = args;
          set({ ...initialState, ...rest });
          store.dispatch({ type: "RESET_STORE" });
          if (samlLogoutUrl) {
            window.location.href = samlLogoutUrl;
          } else {
            history.push("/login");
          }
        },
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        baseURL: state.baseURL,
        userDetail: state.userDetail,
        authClientId: state.authClientId,
        authClientSecret: state.authClientSecret,
        redirectUrl: state.redirectUrl,
        isAuthenticated: state.isAuthenticated,
        tokenObj: state.tokenObj,
        tokenExpireTime: state.tokenExpireTime,
      }),
    },
  ),
);
