import React, { memo } from "react";
import CustomDialog from "../SharedComponents/CustomDialog";
import { LBL_CLOSE_BUTTON_TITLE } from "../../constant";
import CloseIcon from "@material-ui/icons/Close";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import useStyles from "./styles";
import { Box } from "@material-ui/core";
import { Button } from "../SharedComponents/Button";
import { toast } from "react-toastify";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./style.css";

const DocsViewer = ({ fileMetaData, dialogOpenStatus, onClose }) => {
  const classes = useStyles();
  const { fileName = "", filePath = "", fileType = "" } = fileMetaData;
  const supportedVideoExt = ["MP4", "OGG", "AVI", "MOV", "WMV", "WEBM"];
  let docs = [{ uri: filePath }];

  const handleOnDownload = () => {
    saveAs(filePath, fileName);
    toast(fileName);
  };
  return (
    <CustomDialog
      isDialogOpen={dialogOpenStatus}
      handleCloseDialog={onClose}
      title={fileName}
      maxWidth={"lg"}
      height={"100%"}
      bodyContent={
        !supportedVideoExt.includes(
          !!fileType ? fileType.toUpperCase() : "",
        ) ? (
          <DocViewer
            pluginRenderers={DocViewerRenderers}
            documents={docs}
            config={{
              header: {
                disableHeader: true,
                disableFileName: true,
                retainURLParams: true,
              },
              pdfVerticalScrollByDefault: true,
            }}
          />
        ) : (
          <video
            style={{ margin: "0 auto", width: "100%", height: "100%" }}
            controls
          >
            <source src={filePath} type={`video/${fileType}`} />
          </video>
        )
      }
      bottomActionContent={
        <Box className={classes.buttonGroupRoot}>
          <Button
            label={"Download"}
            startIcon={<GetAppRoundedIcon />}
            onClick={handleOnDownload}
          />
          <Button
            label={LBL_CLOSE_BUTTON_TITLE}
            startIcon={<CloseIcon />}
            onClick={onClose}
          />
        </Box>
      }
    />
  );
};

export default memo(DocsViewer);
