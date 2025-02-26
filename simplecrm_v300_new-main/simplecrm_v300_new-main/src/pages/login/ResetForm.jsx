import React, { useState } from "react";
import { Button, CircularProgress } from "@material-ui/core";
import useStyles from "./styles";
import { isEmpty } from "ramda";
import {
  LBL_BACK_TO_LOGIN_BUTTON_LABEL,
  LBL_RESET_BUTTON_LABEL,
  LBL_RESET_PASSWORD,
} from "../../constant";
import { FormInput } from "../../components";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuthState } from "@/customStrore";

const fieldMetaObj = {
  username: {
    label: "Username",
    field_key: "username",
    name: "username",
    type: "varchar",
  },
  newpassword: {
    label: "New Password",
    field_key: "newpassword",
    name: "newpassword",
    type: "password",
  },
  newconfirmpassword: {
    label: "Confirm Password",
    field_key: "newconfirmpassword",
    name: "newconfirmpassword",
    type: "password",
  },
};
const ResetForm = () => {
  const classes = useStyles();
  const [errors, setErrors] = useState({});
  const [formStateValue, setFormStateValue] = useState({
    username: "",
    newpassword: "",
    newconfirmpassword: "",
  });
  const history = useHistory();
  const { search } = useLocation();
  const { resetLoading, authActions } = useAuthState((state) => ({
    resetLoading: state.resetLoading,
    authActions: state.authActions,
  }));

  const handleFormValueChange = (fieldName, value) => {
    setFormStateValue((v) => {
      v[fieldName] = value;
      return { ...v };
    });
  };

  const isResetButtonDisable = () => {
    return (
      isEmpty(formStateValue["username"]) ||
      isEmpty(formStateValue["newpassword"]) ||
      isEmpty(formStateValue["newconfirmpassword"])
    );
  };
  const handleGoBackLoginPage = () => {
    history.push({
      pathname: "/login",
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(search);
    const linkId = searchParams.get("id");
    const payload = {
      username: formStateValue["username"],
      newpassword: formStateValue["newpassword"],
      newconfirmpassword: formStateValue["newconfirmpassword"],
      linkid: linkId,
    };
    const isValid = formValidation(payload);
    setErrors(isValid.errors);
    if (isValid.formIsValid) {
      authActions.onResetPasswordAction(
        {
          username: payload.username,
          newpassword: payload.newpassword,
          linkid: payload.linkid,
        },
        {
          onSuccess: handleGoBackLoginPage,
        },
      );
    }
  };

  const formValidation = (payload) => {
    let requiredTxt = "Missing Required Field:";
    let tempErrors = {};
    let formIsValid = true;
    if (payload["username"] && payload["username"].trim()) {
      let passwordExp =
        /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/;
      if (!payload["newpassword"].trim()) {
        formIsValid = false;
        tempErrors["newpassword"] = requiredTxt + " New password";
      }
      if (!payload["newconfirmpassword"].trim()) {
        formIsValid = false;
        tempErrors["newconfirmpassword"] = requiredTxt + "Confirm new password";
      }

      if (
        payload["newpassword"].trim() !== payload["newconfirmpassword"].trim()
      ) {
        formIsValid = false;
        tempErrors["newpassword"] = "*Confirm password is not matching.";
      }
      if (
        payload["newpassword"].trim() &&
        !payload["newpassword"].trim().match(passwordExp)
      ) {
        formIsValid = false;
        tempErrors["newpassword"] = "*Please enter secure and strong password.";
      }

      if (
        payload["newconfirmpassword"].trim() &&
        !payload["newconfirmpassword"].trim().match(passwordExp)
      ) {
        formIsValid = false;
        tempErrors["newconfirmpassword"] =
          "*Confirm Password should be same as new password";
      }
    }
    return { formIsValid: formIsValid, errors: tempErrors };
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className={classes.loginFormWrapper}>
          <h3>{LBL_RESET_PASSWORD}</h3>
          {Object.entries(fieldMetaObj).map(([key, fObj], index) => (
            <FormInput
              key={key}
              field={fObj}
              onChange={(value) => handleFormValueChange(key, value)}
              value={formStateValue[key]}
              errors={errors}
            />
          ))}
          {resetLoading ? (
            <div className={classes.spinnerContainer}>
              <CircularProgress size={26} />
            </div>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isResetButtonDisable()}
              className={classes.formField}
            >
              {LBL_RESET_BUTTON_LABEL}
            </Button>
          )}
        </div>
      </form>
      <Link
        to="/login"
        disabled
        onClick={handleGoBackLoginPage}
        className={classes.forgetPasswordLink}
      >
        {LBL_BACK_TO_LOGIN_BUTTON_LABEL}
      </Link>
    </>
  );
};

export default ResetForm;
