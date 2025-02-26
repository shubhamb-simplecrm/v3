import React, { useState, useEffect } from "react";
import { pathOr } from "ramda";
import { Paper } from "@material-ui/core";
import { ErrorBoundary, SkeletonShell } from "@/components";
import { api } from "@/common/api-utils";
import { base64decode, base64encode } from "@/common/encryption-utils";
import IFrameContainer from "@/components/SharedComponents/IFrameContainer";
import styled from "styled-components";
import useCommonUtils from "@/hooks/useCommonUtils";
import { SOMETHING_WENT_WRONG } from "@/constant";
import { toast } from "react-toastify";
import { useAuthState } from "@/customStrore";

const FullHeightPaper = styled(Paper)`
  height: 100vh;
`;

const useMSID = () => {
  const [loading, setLoading] = useState(true);
  const [MSID, setMSID] = useState("");
  useEffect(() => {
    api
      .post("V8/meta/getMSID")
      .then((res) => {
        if (res.ok) {
          const msid = pathOr("", ["data", "data", "msid"], res);
          setMSID(base64decode(msid));
        } else {
          const error = pathOr(
            SOMETHING_WENT_WRONG,
            ["data", "errors", "detail"],
            res,
          );
          toast(error);
        }
        setLoading(false);
      })
      .catch((e) => {
        toast(SOMETHING_WENT_WRONG);
        setLoading(false);
      });
  }, []);

  return { loading, MSID };
};

const Admin = () => {
  // const { loading, MSID } = useMSID();
  const { siteUrl } = useCommonUtils();
  const tokenObj = useAuthState((state) => state.tokenObj);
  let url = new URL(`${siteUrl}/index.php?module=Administration&action=index`);

  // encryptAES(aesKey, JSON.stringify(tokenObj.accessToken)),
  url.searchParams.append("accessToken", base64encode(tokenObj.accessToken));
  url.searchParams.append("no_saml", "y");

  // if (MSID) {
  //   url.searchParams.append("MSID", MSID);
  // }
  // if (loading) {
  //   return <SkeletonShell />;
  // }

  return (
    <ErrorBoundary>
      <FullHeightPaper>
        <IFrameContainer
          url={url.href}
          height="100%"
          width="100%"
          id="admin-iframe"
          display="initial"
          position="relative"
          className="iframe"
        />
      </FullHeightPaper>
    </ErrorBoundary>
  );
};

export default Admin;