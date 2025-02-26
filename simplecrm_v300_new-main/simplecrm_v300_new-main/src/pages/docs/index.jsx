import React from "react";
import { Paper } from "@material-ui/core";
import IFrameContainer from "../../components/SharedComponents/IFrameContainer";
import useCommonUtils from "@/hooks/useCommonUtils";
import { FOOTER_HEIGHT } from "@/common/theme-constants";

const Docs = () => {
  const { docsSiteURL } = useCommonUtils();
  return (
    <div style={{ height: "100vh" }}>
      <IFrameContainer url={docsSiteURL} height="100%" width="100%" />
    </div>
  );
};

export default Docs;
