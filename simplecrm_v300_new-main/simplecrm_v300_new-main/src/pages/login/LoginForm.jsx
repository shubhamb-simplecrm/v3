import React, { useState } from "react";
import { Button, Link, CircularProgress } from "@material-ui/core";
import useStyles from "./styles";
import {
  LBL_BACK_TO_LOGIN_BUTTON_LABEL,
  LBL_FORGOT_PASSWORD_TITLE,
  LBL_LOGIN_BUTTON_LABEL,
} from "../../constant";
import EnvUtils from "../../common/env-utils";
import { isEmpty } from "ramda";
import { FormInput } from "../../components";
import { encryptAES } from "../../common/encryption-utils";
import { useAuthState } from "@/customStrore";
import { validateForm } from "@/common/utils";
const userNameField = {
  label: "Username",
  field_key: "username",
  name: "username",
  type: "varchar",
};
const newPasswordField = {
  label: "New Password",
  field_key: "new_password",
  name: "new_password",
  type: "password",
};
const confirmPasswordField = {
  label: "Confirm Password",
  field_key: "confirm_new_password",
  name: "confirm_new_password",
  type: "password",
};
const LoginForm = ({
  loginMetaData,
  handleOnFormTypeChange,
  getInstanceDetail,
  instanceField,
  passwordValidation,
}) => {
  const classes = useStyles();
  const {
    loginLoading,
    baseURL,
    authActions,
    isChangePassword,
    resetAuthState,
  } = useAuthState((state) => ({
    loginLoading: state.loginLoading,
    isChangePassword: state.isChangePassword,
    baseURL: state.baseURL,
    authActions: state.authActions,
  }));
  const passwordField = {
    label: isChangePassword ? "Old Password" : "Password",
    field_key: "password",
    name: "password",
    type: "password",
  };
  const [formStateValue, setFormStateValue] = useState({
    username: "",
    password: "",
  });
  let [errors, setErrors] = useState({});
  const handleFormValueChange = (fieldName, value) => {
    setFormStateValue((v) => {
      v[fieldName] = value;
      return { ...v };
    });
  };
  const isLoginButtonDisable = () => {
    return (
      ((!formStateValue["username"]?.length ||
        !formStateValue["password"]?.length) &&
        !isChangePassword) ||
      (isChangePassword &&
        (!formStateValue["new_password"]?.length ||
          !formStateValue["confirm_new_password"]?.length))
    );
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    let fields = [newPasswordField, confirmPasswordField];
    let validate = validateForm(
      fields,
      formStateValue,
      passwordValidation ?? {},
    );
    errors = validate.errors;
    setErrors({ ...errors });

    const encryptPass = encryptString(
      isChangePassword
        ? formStateValue["new_password"]
        : formStateValue["password"],
    );
    const loginPayload = {
      username: formStateValue["username"],
      password: encryptPass,
      grant_type: EnvUtils.getValue("REACT_APP_GRANT_TYPE"),
      client_id: EnvUtils.getValue("REACT_APP_CLIENT_ID"),
      client_secret: EnvUtils.getValue("REACT_APP_CLIENT_SECRET"),
    };
    if (isChangePassword) {
      const payload = {
        username: formStateValue["username"],
        oldpassword: encryptString(formStateValue["password"]),
        newpassword: encryptString(formStateValue["new_password"]),
      };
      if (isEmpty(errors)) {
        authActions.onPasswordChangeAction(
          payload,
          loginMetaData.loginType,
          loginPayload,
        );
      }
    } else {
      authActions.onLoginAction(loginPayload, loginMetaData.loginType);
    }
  };
  const encryptString = (inputString) => {
    const aesKey = EnvUtils.getValue("REACT_APP_AES_KEY");
    return encryptAES(aesKey, inputString);
  };
  const handleBaseUrlChange = (url) => {
    authActions.onBaseURLChange(url);
    getInstanceDetail(url);
  };
  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className={classes.loginFormWrapper}>
          {!isEmpty(instanceField["options"]) && (
            <FormInput
              field={instanceField}
              onChange={handleBaseUrlChange}
              value={baseURL}
            />
          )}
          <FormInput
            field={userNameField}
            onChange={(value) => handleFormValueChange("username", value)}
            value={formStateValue["username"]}
          />
          <FormInput
            field={passwordField}
            onChange={(value) => handleFormValueChange("password", value)}
            value={formStateValue["password"]}
            isAutoComplete={true}
          />
          {isChangePassword && (
            <>
              <FormInput
                field={newPasswordField}
                onChange={(value) =>
                  handleFormValueChange("new_password", value)
                }
                value={formStateValue["new_password"]}
                errors={errors}
                validation={passwordValidation?.passwordValidation}
              />
              <FormInput
                field={confirmPasswordField}
                onChange={(value) =>
                  handleFormValueChange("confirm_new_password", value)
                }
                value={formStateValue["confirm_new_password"]}
                errors={errors}
              />
            </>
          )}
          {loginLoading ? (
            <div className={classes.spinnerContainer}>
              <CircularProgress size={26} />
            </div>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoginButtonDisable()}
              className={classes.formField}
            >
              {LBL_LOGIN_BUTTON_LABEL}
            </Button>
          )}
        </div>
      </form>

      {isChangePassword ? (
        <Link
          to="#"
          disabled
          onClick={() => authActions.resetAuthState()}
          className={classes.forgetPasswordLink}
        >
          {LBL_BACK_TO_LOGIN_BUTTON_LABEL}
        </Link>
      ) : loginMetaData?.isForgotPasswordEnabled ? (
        <Link
          to="#"
          disabled
          className={classes.forgetPasswordLink}
          onClick={handleOnFormTypeChange}
        >
          {LBL_FORGOT_PASSWORD_TITLE}
        </Link>
      ) : null}
    </>
  );
};

export default LoginForm;
