import React, { useCallback, useEffect } from "react";
import useStyles from "./styles";
import {
  LBL_NORMAL_LOGIN_BUTTON_LABEL,
  LBL_TRY_LOGIN_AGAIN_BUTTON_LABEL,
} from "../../constant";
import { Box, Button } from "@material-ui/core";
import { useHistory } from "react-router";
import { Alert, Skeleton } from "@material-ui/lab";
import { useAuthState } from "@/customStrore";
import { isEmpty, isNil } from "ramda";

const SAMLLoginForm = ({ loginMetaData, samlAuthId, loginErrors }) => {
  const classes = useStyles();
  const history = useHistory();
  const { loginLoading, authActions } = useAuthState((state) => ({
    loginLoading: state.loginLoading,
    authActions: state.authActions,
  }));
  const loginWithSAML = useCallback(
    (payload, loginType) => {
      authActions?.onLoginAction(payload, loginType);
    },
    [samlAuthId, loginMetaData],
  );

  useEffect(() => {
    if (!isNil(samlAuthId) && !isEmpty(samlAuthId) && samlAuthId !== "logout") {
      const payload = { token_id: samlAuthId };
      loginWithSAML(payload, loginMetaData.authType);
    }
  }, [samlAuthId]);

  const handleRedirectLoginAgain = () => {
    history.replace(`/login`);
  };

  const handleRedirectNormalLogin = () => {
    history.replace(`/login`);
  };

  return (
    <div>
      <div className={classes.loginFormWrapper}>
        {loginLoading ? (
          <Skeleton />
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center">
            {!!loginErrors && (
              <Alert component={Box} severity="warning" pb={2}>
                {loginErrors}
              </Alert>
            )}
            <Box display="flex" flexDirection="column" alignItems="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                onClick={handleRedirectLoginAgain}
                className={classes.formField}
              >
                {LBL_TRY_LOGIN_AGAIN_BUTTON_LABEL}
              </Button>
              {/* <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              onClick={handleRedirectNormalLogin}
              className={classes.formField}
            >
              {LBL_NORMAL_LOGIN_BUTTON_LABEL}
            </Button> */}
            </Box>
          </Box>
        )}
      </div>
    </div>
  );
};

export default SAMLLoginForm;