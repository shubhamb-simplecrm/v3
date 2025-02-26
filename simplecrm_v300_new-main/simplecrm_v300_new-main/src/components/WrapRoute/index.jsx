import React from "react";
import * as Sentry from "@sentry/react";
import { Route } from "react-router-dom";

const SentryRoute = Sentry.withSentryRouting(Route);

const WrapRoute = ({ children, ...rest }) => {
  return <SentryRoute {...rest}>{children}</SentryRoute>;
};

export default WrapRoute;
