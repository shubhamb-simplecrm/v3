import React, { createContext, useCallback, useContext, useState } from "react";
import DocsViewer from "../components/DocsViewer";
import { isEmpty, pathOr } from "ramda";
import useCommonUtils from "../hooks/useCommonUtils";

export const FilePreviewContext = createContext({
  fileMetaData: { fileName: "", filePath: "", fileType: "" },
  dialogOpenStatus: false,
});

export const FilePreviewProvider = ({ children }) => {
  const [dialogOpenStatus, setDialogOpenStatus] = useState(false);
  const { siteUrl } = useCommonUtils();
  const [fileMetaData, setFileMetaData] = useState({
    fileName: "",
    filePath: "",
    fileType: "",
  });
  const handleOnClose = useCallback(() => {
    setDialogOpenStatus(false);
  }, []);
  const handleDialogStateChange = useCallback(
    (
      dialogStatus,
      metaData = { fileName: "", filePath: "", fileType: "" },
      useSiteURL = true,
    ) => {
      if (isEmpty(metaData?.fileName) && isEmpty(metaData?.filePath)) {
        setDialogOpenStatus(false);
      } else {
        let finalFilePath = metaData?.filePath;
        if (useSiteURL && !isEmpty(siteUrl)) {
          finalFilePath = new URL(
            metaData?.filePath || "",
            siteUrl || "",
          ).toString();
        }
        setDialogOpenStatus(dialogStatus);
        setFileMetaData({
          fileName: metaData?.fileName,
          filePath: finalFilePath,
          fileType: metaData?.fileType,
        });
      }
    },
    [siteUrl],
  );

  return (
    <FilePreviewContext.Provider
      value={{
        dialogOpenStatus,
        fileMetaData,
        onFileDialogStateChange: handleDialogStateChange,
      }}
    >
      {children}
      <DocsViewer
        fileMetaData={fileMetaData}
        dialogOpenStatus={dialogOpenStatus}
        onClose={handleOnClose}
      />
    </FilePreviewContext.Provider>
  );
};

export const useFilePreviewer = () => useContext(FilePreviewContext);
