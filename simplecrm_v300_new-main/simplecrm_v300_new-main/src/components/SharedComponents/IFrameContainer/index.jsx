import React, { useState, useEffect } from "react";
import { Skeleton } from "@material-ui/lab";

const IFrameContainer = ({
  url,
  height = "100%",
  width = "100%",
  display = "block",
  style = {},
  skeletonProps = {},
  iframeProps = {},
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Use a ref to access the iframe DOM node
  const iframeRef = React.useRef(null);

  useEffect(() => {
    const iframeCurrent = iframeRef.current;

    // Define load and error handlers
    const handleLoad = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    // Attach event listeners
    if (iframeCurrent) {
      iframeCurrent.addEventListener("load", handleLoad);
      iframeCurrent.addEventListener("error", handleError);
    }

    // Cleanup event listeners on unmount
    return () => {
      if (iframeCurrent) {
        iframeCurrent.removeEventListener("load", handleLoad);
        iframeCurrent.removeEventListener("error", handleError);
      }
    };
  }, [url]); // Re-run effect if the URL changes

  return (
    <div
      style={{
        position: "relative",
        height,
        width,
        display,
        overflow: "hidden",
        ...style,
      }}
    >
      {isLoading && !hasError && (
        <Skeleton
          variant="rect"
          height="100%"
          width="100%"
          {...skeletonProps}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            ...skeletonProps.style,
          }}
        />
      )}
      {hasError && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            zIndex: 1,
          }}
        >
          Failed to load content.
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={url}
        height="100%"
        width="100%"
        style={{
          border: "none",
          imageRendering: "auto",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
          boxSizing: "border-box",
          ...style,
        }}
        allow="microphone;"
        {...iframeProps}
      />
    </div>
  );
};

export default IFrameContainer;