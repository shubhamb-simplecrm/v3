import React, { useState } from "react";
import useStyles, { getMuiTheme } from "./styles";
import { useSelector, useDispatch } from "react-redux";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ViewRows from "../ViewRows";
import { pathOr } from "ramda";
import { Scrollbars } from "react-custom-scrollbars";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import { Button, CircularProgress } from "@material-ui/core";
import { updateBpmStep } from "../../store/actions/detail.actions";
import { NoRecord, Log } from "./components";
import { FormInput } from "../";
import { Link } from "react-router-dom";
import InfoIcon from "@material-ui/icons/Info";
import { toast } from "react-toastify";
import { LBL_BPM_CONDITION_REQUIRED, LBL_BPM_NOT_SETUP } from "../../constant";

export default function BPM({
  module,
  recordId,
  initialValues,
  errors,
  headerBackground = false,
  onChange,
  view = "editview",
  isExpanded = true,
  setEmailModal,
  quickCreate = false,
  mode = "detailpanel",
}) {
  const theme = useTheme();

  const classes = useStyles();
  const [expanded, setExpanded] = useState(isExpanded);
  const [cond_id, setCondId] = useState("");
  const [task_id, setTaskId] = useState("");
  const [openLog, setOpenLog] = useState(false);
  const { detailViewTabData, detailBPMLoading } = useSelector(
    (state) => state.detail,
  );
  const dispatch = useDispatch();

  const data1 = pathOr(
    [],
    ["data", "templateMeta", "bpm", "data"],
    detailViewTabData[module],
  );

  const dataStatus = pathOr(
    false,
    ["data", "templateMeta", "bpm", "status"],
    detailViewTabData[module],
  );
  const bpmLog = pathOr(
    [],
    ["data", "templateMeta", "bpm", "data", 0, "sla_log"],
    detailViewTabData[module],
  );

  let data2 =
    data1.length > 0
      ? pathOr(
          [],
          ["data", "templateMeta", "bpm", "data", 0, "panels"],
          detailViewTabData[module],
        )
      : [];

  const updateBpmSteps = async (
    stepid,
    condition_task_id,
    sla_m_d_id,
    sla_m_d_task_con_id,
    moduleName,
    moduleId,
    sla_wf_id,
  ) => {
    if (!cond_id && !condition_task_id) {
      toast(LBL_BPM_CONDITION_REQUIRED);
      return;
    }

    dispatch(
      updateBpmStep(
        stepid,
        cond_id || condition_task_id,
        sla_m_d_id,
        task_id,
        moduleName,
        moduleId,
        sla_wf_id,
        module,
        detailViewTabData,
      ),
    );
    setCondId("");
    setTaskId("");
  };

  const updateConditionSteps = (task_id, condition_id) => {
    setCondId(condition_id);
    setTaskId(task_id[condition_id]);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Scrollbars autoHide className={classes.contentHeight}>
        <div className={classes.root}>
          {data1 && data1[0] && data1[0].label ? (
            <List className={classes.bpmRecordTitle}>
              <ListItem>
                <ListItemText primary={data1[0].label.toUpperCase()} />
                <ListItemSecondaryAction>
                  <Tooltip title="BPM Log">
                    <IconButton
                      edge="end"
                      aria-label="bpmlog"
                      onClick={() => setOpenLog(true)}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          ) : (
            ""
          )}

          {data2 && data2.length > 0 ? (
            data2.map((panel, panelKey) => (
              <>
                <Accordion
                  className={classes.accordionBox}
                  onChange={handleChange(panelKey)}
                  key={panelKey}
                  defaultExpanded={
                    panel.panel_completed === "completed" ? false : expanded
                  }
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: "#fff" }} />}
                    aria-controls={"panel" + panelKey + "bh-content"}
                    id={"panel" + panelKey + "bh-content"}
                    className={
                      headerBackground ? classes.headerBackground : null
                    }
                    style={{
                      backgroundColor: `${panel.panel_color_app}`,
                      color: "#fff",
                    }}
                  >
                    <Typography
                      className={classes.text}
                      weight="light"
                      variant="subtitle2"
                    >
                      {panel.label.toUpperCase()}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      {panel.attributes ? (
                        <ViewRows
                          data={panel}
                          initialValues={initialValues}
                          errors={errors}
                          module={module}
                          onChange={onChange}
                          view={"detailview"}
                          setEmailModal={setEmailModal}
                          recordId={recordId}
                          quickCreate={quickCreate}
                          hiddenAll={{ hidden: [], disabled: [] }}
                          mode={mode}
                        />
                      ) : (
                        ""
                      )}
                      {panel.panel_completed === "in-progress" ? (
                        <div style={{ width: "100%", textAlign: "Right" }}>
                          {panel.button_user ? (
                            <Button
                              variant="contained"
                              onClick={() =>
                                updateBpmSteps(
                                  panel.stepid,
                                  panel.condition_task_id,
                                  panel.sla_m_d_id,
                                  panel.sla_m_d_task_con_id,
                                  panel.moduleName,
                                  panel.moduleId,
                                  panel.sla_wf_id,
                                )
                              }
                              color="primary"
                              size="small"
                              className={classes.btn}
                              disableElevation
                              disabled={detailBPMLoading}
                              style={{ color: "#fff" }}
                            >
                              {detailBPMLoading ? (
                                <CircularProgress
                                  size={16}
                                  className={classes.spinner}
                                />
                              ) : (
                                ""
                              )}{" "}
                              Next Step
                            </Button>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    {/* </RibbonContainer> */}
                  </AccordionDetails>
                  {panel?.panels?.length > 0 &&
                  panel.panels.filter((word) => word.panel_type === "tasks")
                    .length > 0 ? (
                    <Stepper orientation={"vertical"}>
                      {panel.panels
                        .filter((word) => word.panel_type === "tasks")
                        .map((item, i) => (
                          <Step
                            key={item?.label}
                            active={true}
                            id={`task-${panelKey}-${i}`}
                          >
                            <StepLabel>
                              <span style={{ color: item.color }}>
                                <Link
                                  target="_blank"
                                  style={{
                                    color: item.color,
                                    textDecoration: "none",
                                  }}
                                  to={`/app/detailview/Tasks/${item.crm_task_id}`}
                                  className={classes.link}
                                  variant="body2"
                                >
                                  {"TASK - " + item?.label}
                                </Link>
                              </span>
                            </StepLabel>
                            <StepContent>
                              {item.attributes ? (
                                <ViewRows
                                  data={item}
                                  initialValues={initialValues}
                                  errors={errors}
                                  module={module}
                                  onChange={onChange}
                                  view={view}
                                  setEmailModal={setEmailModal}
                                  recordId={recordId}
                                  quickCreate={quickCreate}
                                  hiddenAll={{ hidden: [], disabled: [] }}
                                  mode={mode}
                                />
                              ) : (
                                ""
                              )}
                            </StepContent>
                          </Step>
                        ))}
                    </Stepper>
                  ) : (
                    ""
                  )}

                  {panel?.panels?.length > 0 &&
                  panel.panels.filter((word) => word.panel_type === "condition")
                    .length > 0 ? (
                    <Stepper orientation={"vertical"}>
                      {panel.panels
                        .filter((word) => word.panel_type === "condition")
                        .map((item) => (
                          <Step key={item?.label.toUpperCase()} active={true}>
                            <StepLabel>
                              <span style={{ color: item.color }}>
                                {item?.label.toUpperCase()}
                              </span>
                            </StepLabel>
                            <StepContent>
                              {item.attributes
                                ? item.attributes.map((field, fieldNum) => (
                                    <FormInput
                                      field={field}
                                      value={
                                        cond_id === "" ? field.value : cond_id
                                      }
                                      module={module}
                                      small={true}
                                      onChange={(val) =>
                                        updateConditionSteps(field.task_id, val)
                                      }
                                      disabled={
                                        panel.panel_completed ===
                                          "in-progress" && panel.button_user
                                          ? false
                                          : true
                                      }
                                      view={"editview"}
                                      quickCreate={quickCreate}
                                      required={true}
                                      helperText={LBL_BPM_CONDITION_REQUIRED}
                                    />
                                  ))
                                : ""}
                            </StepContent>
                          </Step>
                        ))}
                    </Stepper>
                  ) : (
                    ""
                  )}

                  {panel?.panels?.length > 0 &&
                  panel.panels.filter(
                    (word) => word.panel_type === "escalation",
                  ).length > 0 ? (
                    <Stepper orientation={"vertical"}>
                      {panel.panels
                        .filter((word) => word.panel_type === "escalation")
                        .map((item) => (
                          <Step key={item?.label.toUpperCase()} active={true}>
                            <StepLabel>
                              <span style={{ color: item.color }}>
                                {item?.label.toUpperCase()}
                              </span>
                            </StepLabel>
                            <StepContent>
                              {item.attributes ? (
                                <ViewRows
                                  data={item}
                                  initialValues={initialValues}
                                  errors={errors}
                                  module={module}
                                  onChange={onChange}
                                  view={view}
                                  setEmailModal={setEmailModal}
                                  recordId={recordId}
                                  quickCreate={quickCreate}
                                  hiddenAll={{ hidden: [], disabled: [] }}
                                  mode={mode}
                                />
                              ) : (
                                ""
                              )}
                            </StepContent>
                          </Step>
                        ))}
                    </Stepper>
                  ) : (
                    ""
                  )}
                </Accordion>
              </>
            ))
          ) : !dataStatus ? (
            <NoRecord type="error" title={LBL_BPM_NOT_SETUP} />
          ) : (
            ""
          )}
        </div>
      </Scrollbars>

      <Log open={openLog} handleClose={() => setOpenLog(false)} data={bpmLog} />
    </MuiThemeProvider>
  );
}
