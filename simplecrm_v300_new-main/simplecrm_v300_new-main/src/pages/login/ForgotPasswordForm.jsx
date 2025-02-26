import React, { useState } from "react";
import { Button, CircularProgress, Link } from "@material-ui/core";
import { useDispatch } from "react-redux";
import useStyles from "./styles";
import {
  LBL_BACK_TO_LOGIN_BUTTON_LABEL,
  LBL_ENTER_VALID_EMAIL,
  LBL_FORGOT_PASSWORD_FORM_TITLE,
  LBL_SUBMIT_BUTTON_TITLE,
} from "../../constant";
import { isEmpty } from "ramda";
import { isValidEmail } from "../../common/validations";
import { FormInput } from "../../components";
import { useAuthState } from "@/customStrore";

const userNameField = {
  label: "Username",
  field_key: "username",
  name: "username",
  type: "varchar",
};
const emailField = {
  label: "Email",
  field_key: "useremail",
  name: "useremail",
  type: "varchar",
};

const ForgotPasswordForm = ({ handleOnFormTypeChange }) => {
  const { forgetLoading, authActions } = useAuthState((state) => ({
    forgetLoading: state.forgetLoading,
    authActions: state.authActions,
  }));
  const [formValues, setFormValues] = useState({
    username: "",
    useremail: "",
  });
  const [errors, setError] = useState({});
  const classes = useStyles();
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username: formValues["username"],
      useremail: formValues["useremail"],
    };
    const isValid = formValidation(payload);
    setError(isValid.errors);
    if (isValid.formIsValid) {
      authActions.onForgotPasswordAction(payload, {
        onSuccess: handleOnFormTypeChange,
      });
    }
  };
  const formValidation = (payload) => {
    let tempErrors = {};
    let formIsValid = true;
    if (payload["useremail"] && payload["useremail"].trim()) {
      if (!isValidEmail(payload["useremail"])) {
        formIsValid = false;
        tempErrors["useremail"] = LBL_ENTER_VALID_EMAIL;
      }
    }
    return { formIsValid: formIsValid, errors: tempErrors };
  };
  const handleFormValueChange = (fieldName, value) => {
    setFormValues((v) => {
      v[fieldName] = value;
      return { ...v };
    });
  };
  const isSubmitButtonDisable = () => {
    return (
      isEmpty(formValues?.username) ||
      isEmpty(formValues?.useremail) ||
      !isValidEmail(formValues?.useremail) ||
      forgetLoading
    );
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className={classes.loginFormWrapper}>
          <h3>{LBL_FORGOT_PASSWORD_FORM_TITLE}</h3>
          <FormInput
            field={userNameField}
            onChange={(value) => handleFormValueChange("username", value)}
            value={formValues["username"]}
            errors={errors}
          />
          <FormInput
            field={emailField}
            onChange={(value) => handleFormValueChange("useremail", value)}
            value={formValues["useremail"]}
            errors={errors}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmitButtonDisable()}
            className={classes.formField}
            startIcon={forgetLoading ? <CircularProgress size={26} /> : null}
          >
            {LBL_SUBMIT_BUTTON_TITLE}
          </Button>
        </div>
      </form>
      <Link
        to="#"
        disabled
        onClick={handleOnFormTypeChange}
        className={classes.forgetPasswordLink}
      >
        {LBL_BACK_TO_LOGIN_BUTTON_LABEL}
      </Link>
    </>
  );
};

export default ForgotPasswordForm;
