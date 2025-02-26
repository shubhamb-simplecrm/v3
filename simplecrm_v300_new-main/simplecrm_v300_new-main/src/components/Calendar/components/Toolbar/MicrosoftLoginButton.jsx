import React, { memo, useCallback, useEffect } from "react";

const MICROSOFT_URL = "https://login.microsoftonline.com";
const MICROSOFT_API_URL = "https://graph.microsoft.com";
// const PREVENT_CORS_URL: string = 'https://cors.bridged.cc'

export const LoginSocialMicrosoft = ({
  tenant = "common",
  state = "",
  client_id,
  className,
  redirect_uri,
  scope = "profile openid email",
  response_type = "code",
  response_mode = "query",
  children,
  code_challenge = "19cfc47c216dacba8ca23eeee817603e2ba34fe0976378662ba31688ed302fa9",
  code_challenge_method = "plain",
  prompt = "select_account",
  isOnlyGetCode = false,
  isOnlyGetToken = false,
  onLoginStart,
  onReject,
  onResolve,
  style = null
}) => {
  useEffect(() => {
    const popupWindowURL = new URL(window.location.href);
    const code = popupWindowURL.searchParams.get("code");
    const state = popupWindowURL.searchParams.get("state");
    if (state?.includes("_microsoft") && code) {
      localStorage.setItem("microsoft", code);
      window.close();
    }
  }, []);

  const getProfile = useCallback(
    (data) => {
      fetch(`${MICROSOFT_API_URL}/v1.0/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          onResolve({ provider: "microsoft", data: { ...res, ...data } });
        })
        .catch((err) => {
          onReject(err);
        });
    },
    [onReject, onResolve],
  );

  const getAccessToken = useCallback(
    (code) => {
      if (isOnlyGetCode) onResolve({ provider: "microsoft", data: { code } });
      else {
        const params = {
          code,
          scope,
          client_id,
          redirect_uri,
          code_verifier: code_challenge,
          grant_type: "authorization_code",
        };
        const headers = new Headers({
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        });
        fetch(`${MICROSOFT_URL}/${tenant}/oauth2/v2.0/token`, {
          method: "POST",
          headers,
          body: new URLSearchParams(params),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.access_token) {
              if (isOnlyGetToken)
                onResolve({ provider: "microsoft", data: { ...data, code } });
              const popupWindowURL = new URL(window.location.href);
              const popupCode = popupWindowURL.searchParams.get("code");
              const state = popupWindowURL.searchParams.get("state");
              if (state?.includes("_microsoft") && popupCode) {
                localStorage.setItem("microsoft", popupCode);
                window.close();
              }
              // else getProfile(data);
            } else {
              onReject("no data");
            }
          })
          .catch((err) => {
            onReject(err);
          });
      }
    },
    [
      scope,
      tenant,
      onReject,
      getProfile,
      client_id,
      onResolve,
      redirect_uri,
      code_challenge,
      isOnlyGetCode,
      isOnlyGetToken,
    ],
  );

  const handlePostMessage = useCallback(
    async ({ type, code, provider }) =>
      type === "code" &&
      provider === "microsoft" &&
      code &&
      getAccessToken(code),
    [getAccessToken],
  );

  const onChangeLocalStorage = useCallback(() => {
    window.removeEventListener("storage", onChangeLocalStorage, false);
    const code = localStorage.getItem("microsoft");
    if (code) {
      handlePostMessage({ provider: "microsoft", type: "code", code });
      localStorage.removeItem("microsoft");
    }
  }, [handlePostMessage]);

  const onLogin = useCallback(() => {
    onLoginStart && onLoginStart();
    window.addEventListener("storage", onChangeLocalStorage, false);
    const oauthUrl = `${MICROSOFT_URL}/${tenant}/oauth2/v2.0/authorize?client_id=${client_id}
        &response_type=${response_type}
        &redirect_uri=${redirect_uri}
        &response_mode=${response_mode}
        &scope=${scope}
        &state=${state + "_microsoft"}
        &prompt=${prompt}
        &code_challenge=${code_challenge}
        &code_challenge_method=${code_challenge_method}`;
    const width = 450;
    const height = 730;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      oauthUrl,
      "Microsoft",
      "menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=" +
      width +
      ", height=" +
      height +
      ", top=" +
      top +
      ", left=" +
      left,
    );
  }, [
    scope,
    state,
    prompt,
    tenant,
    client_id,
    onLoginStart,
    redirect_uri,
    response_mode,
    response_type,
    code_challenge,
    onChangeLocalStorage,
    code_challenge_method,
  ]);

  return (
    <div className={className} style={style} onClick={onLogin}>
      {children}
    </div>
  );
};

export default memo(LoginSocialMicrosoft);
