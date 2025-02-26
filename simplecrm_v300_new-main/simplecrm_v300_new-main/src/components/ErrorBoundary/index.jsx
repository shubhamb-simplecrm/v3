import React, { Component } from "react";
import { LBL_ERROR_TITLE, SOMETHING_WENT_WRONG } from "../../constant";
import * as Sentry from "@sentry/react";
import Error from "../Error";
class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      Sentry.withScope((scope) => {
        scope.setExtras(errorInfo);
        Sentry.captureException(error);
      });
      // You can also log the error to an error reporting service
      console.log(error, errorInfo);
    }
  
    render() {
      if (this?.state?.hasError) {
        // You can render any custom fallback UI
        return <Error description={SOMETHING_WENT_WRONG} title={LBL_ERROR_TITLE} />;
      }
  
      return this.props.children; 
    }
  }

  export default ErrorBoundary;