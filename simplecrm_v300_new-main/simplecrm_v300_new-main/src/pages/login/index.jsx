import React, { useCallback, useEffect, useState } from "react";
import { Card, CardMedia } from "@material-ui/core";
import ParticlesBg from "particles-bg";
import company_logo from "../../assets/company_logo.png";
import useStyles from "./styles";
import { getMetaAssets } from "../../store/actions/auth.actions";
import {
  changeInstanceNativeButton,
  nativeInitConfiguration,
} from "../../common/mobile-utils";
import { isEmpty, isNil, pathOr } from "ramda";
import LocalStorageUtils from "../../common/local-storage-utils";
import ForgotPasswordForm from "./ForgotPasswordForm";
import LoginForm from "./LoginForm";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import ResetForm from "./ResetForm";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import SAMLLoginForm from "./SAMLLoginForm";

const getFaviconEl = () => document.getElementById("favicon");
const instanceField = {
  label: "Select Instance",
  field_key: "instance",
  name: "instance",
  type: "enum",
  options: {},
};
const Login = () => {
  const classes = useStyles();
  const { samlAuthId } = useParams();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search || "");
  const isNoSAMLRequest = searchParams.get("no_saml") == "1";
  const loginErrors = searchParams.get("errors");
  const [loginMetaData, setLoginMetaData] = useState({
    logoImage: "",
    instanceUrls: [],
    loginType: "access_token",
    isEncryptionEnable: true,
    passwordValidation: null,
  });
  const [isForgetFormSelected, setIsForgetFormSelected] = useState(false);
  const handleOnFormTypeChange = () => {
    setIsForgetFormSelected((v) => !v);
  };

  const getInstanceDetail = useCallback((url) => {
    fetch(`${url}/Api/logo`)
      .then((res) => res.json())
      .then((data) => {
        const faviconEl = getFaviconEl();
        const logoIcon = pathOr(undefined, ["logo_icon"], data);
        const logoImage = pathOr(undefined, ["logo_image"], data);
        const loginType = pathOr(null, ["loginType"], data);
        const isForgotPasswordEnabled = pathOr(
          null,
          ["forgotpasswordON"],
          data,
        );
        const isEncryptionAllow = pathOr(null, ["AES_Encryption"], data);
        if (logoIcon) {
          LocalStorageUtils.setValue("favicon", logoIcon);
        }
        faviconEl.href = logoIcon;
        setLoginMetaData((v) => ({
          ...v,
          logoImage,
          logoFavicon: logoIcon,
          loginType,
          isEncryptionEnable: isEncryptionAllow,
          isForgotPasswordEnabled,
        }));
      });
  }, []);

  const getLogoData = useCallback(async () => {
    try {
      const res = await getMetaAssets();
      const faviconEl = getFaviconEl();
      const logoIcon = pathOr(undefined, ["data", "logo_icon"], res);
      const logoImage = pathOr("No Logo", ["data", "logo_image"], res);
      const loginType = pathOr(null, ["data", "loginType"], res);
      const isEncryptionAllow = pathOr(false, ["data", "AES_Encryption"], res);
      const authType = pathOr(false, ["data", "authType"], res);
      const authUrl = pathOr(false, ["data", "authUrl"], res);
      const instanceList = pathOr([], ["data", "demo_instances_apis"], res);
      const systemName = pathOr([], ["data", "system_name"], res);
      const isForgotPasswordEnabled = pathOr(
        [],
        ["data", "forgotpasswordON"],
        res,
      );
      const nativeDeviceSettings = pathOr(
        {},
        ["data", "nativeDeviceSettings"],
        res,
      );
      document.title = systemName;
      if (!isEmpty(instanceList)) {
        // instanceField["options"][`default:${appBaseurl}`] = appBaseURlOrigin;
        instanceList.forEach((o) => {
          instanceField["options"][o.value] = o.name;
        });
      }
      if (logoIcon) {
        LocalStorageUtils.setValue("favicon", logoIcon);
      }
      faviconEl.href = logoIcon;
      setLoginMetaData({
        logoImage: logoImage,
        logoFavicon: logoIcon,
        loginType: loginType,
        authType: authType,
        isEncryptionEnable: isEncryptionAllow,
        nativeDeviceSettings: nativeDeviceSettings,
        passwordValidation: pathOr(null, ["data"], res),
        isForgotPasswordEnabled,
      });
      if (!isNil(nativeDeviceSettings) && !isEmpty(nativeDeviceSettings)) {
        nativeInitConfiguration(nativeDeviceSettings);
      }
      if (
        authType === "SAML2Authenticate" &&
        (isNil(samlAuthId) || isEmpty(samlAuthId)) &&
        !isNoSAMLRequest &&
        !loginErrors
      ) {
        window.open(authUrl, "_self");
      }
    } catch (ex) {
      console.log(ex);
    }
  }, []);

  useEffect(() => {
    getLogoData();
    changeInstanceNativeButton(false);
  }, []);

  return (
    <div className={classes.container}>
      <ParticlesBg type="cobweb" color="#b2dae8" bg={true} rps="0.9" />
      <Card className={classes.card}>
        <div className={classes.formWrapper}>
          <CardMedia
            component="img"
            style={{ margin: "25px 0", width: "100%" }}
            src={loginMetaData.logoImage || company_logo}
            alt="logo"
          />
          <LoginRedirectContainer
            loginMetaData={loginMetaData}
            samlAuthId={samlAuthId}
            isForgetFormSelected={isForgetFormSelected}
            handleOnFormTypeChange={handleOnFormTypeChange}
            getInstanceDetail={getInstanceDetail}
            instanceField={instanceField}
            isNoSAMLRequest={isNoSAMLRequest}
            passwordValidation={loginMetaData.passwordValidation}
            loginErrors={loginErrors}
          />
        </div>
      </Card>
    </div>
  );
};

const LoginRedirectContainer = ({
  loginMetaData,
  samlAuthId,
  isForgetFormSelected,
  handleOnFormTypeChange,
  instanceField,
  getInstanceDetail,
  isNoSAMLRequest,
  passwordValidation,
  loginErrors,
}) => {
  const { pathname } = useLocation();
  if (
    (loginMetaData?.authType == "SAML2Authenticate" &&
    (!isNil(samlAuthId) || !isEmpty(samlAuthId)) &&
    !isNoSAMLRequest)
  ) {
    return (
      <SAMLLoginForm
        loginMetaData={loginMetaData}
        samlAuthId={samlAuthId}
        loginErrors={loginErrors}
      />
    );
  } else if (pathname.includes("resetpassword")) {
    return <ResetForm />;
  } else if (isForgetFormSelected) {
    return (
      <ForgotPasswordForm handleOnFormTypeChange={handleOnFormTypeChange} />
    );
  } else {
    return (
      <LoginForm
        loginMetaData={loginMetaData}
        handleOnFormTypeChange={handleOnFormTypeChange}
        getInstanceDetail={getInstanceDetail}
        instanceField={instanceField}
        passwordValidation={passwordValidation}
      />
    );
  }
};

export default Login;