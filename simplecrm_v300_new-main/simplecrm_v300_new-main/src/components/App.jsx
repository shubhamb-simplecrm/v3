import React, { useEffect, Suspense, memo, lazy } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { pathOr } from "ramda";
import LocalStorageUtils from "../common/local-storage-utils";
import SkeletonShell from "./Skeleton";
import { Error } from "@/components";
import { useAuthState } from "@/customStrore";
import history from "@/common/history";
import { PAGE_NOT_FOUND_MESSAGE, PAGE_NOT_FOUND_TITLE } from "@/constant";
import WrapRoute from "./WrapRoute";

const Layout = lazy(() => import("../components/Layout"));
const Login = lazy(() => import("../pages/login"));

const FAVICON_ID = "favicon";
const PUBLIC_ROUTES = ["/login", "/resetPassword"];

const getFaviconEl = () => document.getElementById(FAVICON_ID);

const isUserAuthenticated = ({
  location,
  isPublicRoute,
  onRedirectUrlChangeAction,
  isAuthenticated,
}) => {
  const currentPath = pathOr("", ["pathname"], location);
  if (!PUBLIC_ROUTES.includes(currentPath) && !isPublicRoute) {
    onRedirectUrlChangeAction(currentPath);
  }
  return isAuthenticated;
};

export default function App() {
  const { redirectUrl, onRedirectUrlChangeAction, isAuthenticated } =
    useAuthState((state) => ({
      redirectUrl: state.redirectUrl,
      onRedirectUrlChangeAction: state.authActions.onRedirectUrlChangeAction,
      isAuthenticated: state.isAuthenticated,
    }));

  useEffect(() => {
    const faviconUrl = LocalStorageUtils.getValueByKey("favicon");
    if (faviconUrl) {
      const faviconEl = getFaviconEl();
      if (faviconEl) faviconEl.href = faviconUrl;
    }
  }, []);

  return (
    <Router history={history}>
      <Suspense fallback={<SkeletonShell />}>
        <Switch>
          <WrapRoute
            exact
            path="/"
            render={() => <Redirect to="/app/Home" />}
          />
          <WrapRoute
            exact
            path="/app"
            render={() => <Redirect to="/app/Home" />}
          />
          <PrivateRoute
            path="/app"
            component={Layout}
            isAuthenticated={isAuthenticated}
            onRedirectUrlChangeAction={onRedirectUrlChangeAction}
          />
          <PublicRoute
            path="/login/:samlAuthId"
            component={Login}
            isAuthenticated={isAuthenticated}
            redirectUrl={redirectUrl}
            onRedirectUrlChangeAction={onRedirectUrlChangeAction}
            exact
          />
          <PublicRoute
            path="/login"
            component={Login}
            isAuthenticated={isAuthenticated}
            redirectUrl={redirectUrl}
            onRedirectUrlChangeAction={onRedirectUrlChangeAction}
          />
          <PublicRoute
            path="/resetPassword"
            component={Login}
            isAuthenticated={isAuthenticated}
            redirectUrl={redirectUrl}
            onRedirectUrlChangeAction={onRedirectUrlChangeAction}
          />
          <WrapRoute
            render={() => (
              <Error
                description={PAGE_NOT_FOUND_MESSAGE}
                title={PAGE_NOT_FOUND_TITLE}
                showTitle
              />
            )}
          />
        </Switch>
      </Suspense>
    </Router>
  );
}

const PrivateRoute = memo(
  ({
    component: Component,
    isAuthenticated,
    onRedirectUrlChangeAction,
    ...rest
  }) => (
    <WrapRoute
      {...rest}
      render={(props) =>
        isUserAuthenticated({
          location: props.location,
          isPublicRoute: false,
          onRedirectUrlChangeAction,
          isAuthenticated,
        }) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  ),
);

const PublicRoute = memo(
  ({
    component: Component,
    isAuthenticated,
    onRedirectUrlChangeAction,
    redirectUrl,
    ...rest
  }) => (
    <WrapRoute
      {...rest}
      render={(props) =>
        isUserAuthenticated({
          location: props.location,
          isPublicRoute: true,
          onRedirectUrlChangeAction,
          isAuthenticated,
        }) ? (
          <Redirect to={{ pathname: redirectUrl }} />
        ) : (
          <Component {...props} />
        )
      }
    />
  ),
);
