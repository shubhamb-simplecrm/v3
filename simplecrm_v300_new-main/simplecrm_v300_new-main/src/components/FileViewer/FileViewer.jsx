import React from "react";
import {
  DialogContent,
  Slide,
  Dialog,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import "./styles.css";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import CloseIcon from "@material-ui/icons/Close";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import { Scrollbars } from "react-custom-scrollbars";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core";
import { LBL_DOWNLOAD_INPROGRESS } from "../../constant";

const useStyles = makeStyles((theme) => ({
  fileViewMobileLayout: {
    [theme.breakpoints.down("xs")]: {
      width: "auto !important",
      paddingRight: "0px !important",
    },
  },
  title: {
    flexWrap: "none",
    justifyContent: "space-between",
  },
  name: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    width: "70%",
  },
  dialogPaper: {
    minHeight: "90vh",
    maxHeight: "90vh",
  },
}));

function FileViewerComp({ previewFile, setPreviewFile, maxWidth = "md" }) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const supportedVideoExt = ["MP4", "OGG", "AVI", "MOV", "WMV", "WEBM"];
  let docs = [{ uri: previewFile.filepath }];
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const handleClickClose = () => {
    setPreviewFile({ open: false, filename: "", filentype: "", filepath: "" });
  };
  const handleDownload = () => {
    saveAs(previewFile.filepath, previewFile.filename);
    toast(LBL_DOWNLOAD_INPROGRESS);
  };

  return (
    <div>
      {
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          fullScreen={fullScreen}
          fullWidth
          maxWidth={maxWidth}
          open={previewFile.open}
          onClose={handleClickClose}
          TransitionComponent={Transition}
        >
          <DialogTitle id="max-width-dialog-title">
            <Grid container direction="row" className={classes.title}>
              <Grid item className={classes.name}>
                <Typography>{previewFile.filename}</Typography>
              </Grid>
              <Grid item>
                <GetAppRoundedIcon
                  style={{ cursor: "pointer", fontSize: "3.5vh" }}
                  onClick={handleDownload}
                />
                <CloseIcon
                  style={{ cursor: "pointer", fontSize: "3.5vh" }}
                  onClick={handleClickClose}
                />
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <div id="view">
              {!supportedVideoExt.includes(previewFile.filetype) ? (
                <DocViewer
                  style={{ height: "75vh" }}
                  pluginRenderers={DocViewerRenderers}
                  documents={docs}
                  config={{
                    header: {
                      disableHeader: true,
                      disableFileName: true,
                      retainURLParams: true,
                    },
                  }}
                />
              ) : (
                <video
                  style={{ margin: "0 auto", width: "100%", height: "100%" }}
                  controls
                >
                  <source
                    src={previewFile.filepath}
                    type={`video/${previewFile.filetype}`}
                  />
                </video>
              )}
            </div>
          </DialogContent>
        </Dialog>
      }
    </div>
  );
}
export default FileViewerComp;
