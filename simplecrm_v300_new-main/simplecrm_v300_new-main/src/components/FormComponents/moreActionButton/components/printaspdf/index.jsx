import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";
import { DetailView } from "../../components";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ActivityTimeline from "./ActivityTimeline";
import { useReactToPrint } from "react-to-print";
import { CircularProgress, LinearProgress } from "@material-ui/core";

const PrintAsPdf = ({ open, setOpen, detailViewTabData, module, id }) => {
  const [loading, setLoading] = useState(false);
  const currentTheme = useSelector(
    (state) => state.config.themeConfig.currentTheme,
  );
  const subpanels = pathOr(
    [],
    [module, "data", "templateMeta", "subpanels", "subpanel_tabs"],
    detailViewTabData,
  );
  let recordName = pathOr(
    "",
    [module, "data", "templateMeta", "recordInfo", "record_name"],
    detailViewTabData,
  );
  let recordInfo = pathOr(
    {},
    [module, "data", "templateMeta", "recordInfo"],
    detailViewTabData,
  );
  const historySubpanel =
    subpanels.filter((item) => item.module_name == "History")[0] ?? [];
  const activityTimelineRef = useRef();
  const handlePrint = useReactToPrint({
    documentTitle: recordName,
    contentRef: activityTimelineRef,
  });
  const renderLoader = () => (
    <div style={{ textAlign: "center", color: "black" }}>
      <CircularProgress />
      <br />
      Please wait while the document is prepared...
    </div>
  );
  return (
    <Dialog
      fullScreen={true}
      fullWidth={true}
      maxWidth={"md"}
      open={open}
      // onClose={() => setOpen(!open)}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Print Preview</DialogTitle>

      <DialogContent ref={activityTimelineRef}>
        <DialogContentText>
          {loading ? (
            renderLoader()
          ) : (
            <DetailView
              data={detailViewTabData[module]}
              subpanels={subpanels}
              module={module}
              currentTheme={currentTheme}
              view="detailview"
              headerBackground="true"
              recordName={recordName}
              recordId={id}
              calenderView={true}
              recordInfo={recordInfo}
            />
          )}
          <ActivityTimeline
            module={module}
            subpanel={historySubpanel?.rel_module}
            subpanel_module={historySubpanel?.module_name}
            title={historySubpanel.title}
            record={id}
            recordName={recordInfo?.record_name || ""}
            // setIsSubpanelUpdated={setIsSubpanelUpdated}
            // value={value}
            // setValue={setValue}
            relationShipName={historySubpanel?.rel_name}
            relationShipModule={historySubpanel?.rel_module}
            // fieldConfiguratorData={fieldConfiguratorData}
            loading={loading}
            setLoading={setLoading}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpen(!open)}
          color="primary"
          variant="contained"
        >
          Close
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => handlePrint()}
          disabled={loading}
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintAsPdf;
