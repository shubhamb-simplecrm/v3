import React, { useMemo, useState } from "react";
import useStyles from "./styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ViewRows from "../ViewRows";
import { Typography } from "../Wrappers/Wrappers";
import { isEmpty, pathOr } from "ramda";

const ControlledAccordions = ({
  data,
  module,
  recordId,
  parentId,
  recordName,
  initialValues,
  errors = {},
  headerBackground = false,
  onChange,
  onBlur = null,
  view = "editview",
  quickCreate = false,
  hiddenAll,
  fieldConfiguratorData = [],
  recordInfo = {},
  panelFieldData,
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState({});
  const handleChange = (panelKey) => (event, isExpanded) => {
    setExpanded((v) => ({ ...v, panelKey: !v[panelKey] }));
  };

  const filteredData = useMemo(() => {
    let tData =
      parentId != 1 && parentId != recordId
        ? data?.filter((panel) => panel.key !== "calendar_repeat_recurrences")
        : data;
    if (
      !isEmpty(panelFieldData) &&
      !isEmpty(errors) &&
      (view === "editview" || view === "detailview")
    ) {
      tData = data?.filter((panel) => {
        let panelFields = [];
        panel?.attributes?.map((row) => {
          row?.map((field) => {
            panelFields.push(field?.field_key);
          });
        });
        return !panelFields.every(
          (v) =>
            (errors.hasOwnProperty(v) && errors[v] == "ReadOnly") ||
            errors[v] == "InVisible",
        );
      });
    }
    return tData;
  }, [data, panelFieldData, errors]);
  return (
    <div className={classes.root}>
      {filteredData.map((panel, panelKey) => (
        <React.Fragment key={`panel-${panelKey}`}>
          <Accordion
            className={classes.accordionBox}
            onChange={() => handleChange(panel?.key)}
            key={`accordion-1-${panelKey}`}
            expanded={expanded[panel?.key]}
            defaultExpanded={panel?.expanded ?? true}
          >
            <AccordionSummary
              key={`accordionsummary-1-${panelKey}`}
              expandIcon={<ExpandMoreIcon />}
              aria-controls={"panel-" + panelKey + "-bh-content"}
              id={"panel-" + panelKey + "-bh-content"}
              className={headerBackground ? classes.headerBackground : null}
            >
              <Typography
                className={classes.text}
                weight="light"
                variant="subtitle2"
                key={panel?.label}
              >
                {panel.label.toUpperCase()}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              key={`accordion-details-1-${panelKey}`}
              className={classes.mobileLayoutAccoDetails}
            >
              <ViewRows
                key={`view-rows-1-${panelKey}`}
                data={panel}
                initialValues={initialValues}
                errors={errors}
                module={module}
                onChange={onChange}
                onBlur={onBlur}
                view={view}
                recordName={recordName}
                recordId={recordId}
                quickCreate={quickCreate}
                hiddenAll={hiddenAll}
                fieldConfiguratorData={fieldConfiguratorData}
                recordInfo={recordInfo}
              />
            </AccordionDetails>
          </Accordion>
          {panel?.panels?.length > 0
            ? panel.panels.map((item, index) => (
                <Accordion
                  className={classes.accordionBox}
                  onChange={handleChange(panelKey)}
                  key={`accordion-2-${index}-${item.panelKey}`}
                  defaultExpanded={expanded[panelKey]}
                >
                  <AccordionSummary
                    key={`accordion-summary-2-${index}-${item.panelKey}`}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={"panel-" + item?.panelKey + "-bh-content"}
                    id={"panel-" + item?.panelKey + "-bh-content"}
                    className={
                      headerBackground ? classes.headerBackground : null
                    }
                  >
                    <Typography
                      className={classes.text}
                      weight="light"
                      variant="subtitle2"
                      key={item?.label}
                    >
                      {item?.label.toUpperCase()}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    key={`accordion-details-2-${index}-${item.panelKey}`}
                    className={classes.mobileLayoutAccoDetails}
                  >
                    <ViewRows
                      key={`view-rows-2-${index}-${item.panelKey}`}
                      data={item}
                      initialValues={initialValues}
                      errors={errors}
                      module={module}
                      onChange={onChange}
                      onBlur={onBlur}
                      view={view}
                      recordName={recordName}
                      recordId={recordId}
                      quickCreate={quickCreate}
                      hiddenAll={hiddenAll}
                      fieldConfiguratorData={fieldConfiguratorData}
                    />
                  </AccordionDetails>
                </Accordion>
              ))
            : ""}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ControlledAccordions;
