import React, { memo, useState } from "react";
import useStyles from "./styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditViewRows from "./EditViewRows";
import { Typography } from "@/components/Wrappers/Wrappers";
import { pathOr } from "ramda";
import { useFormStore } from "./hooks/useEditViewState";

const EditViewPanelAccordions = memo(
  ({ formMetaData, moduleMetaData, customProps }) => {
    return formMetaData?.map((panelData, panelKey) => (
      <PanelAccordionItem
        key={`EditViewPanelAccordions-${panelKey}`}
        panelIndex={panelKey}
        panelData={panelData}
        moduleMetaData={moduleMetaData}
        customProps={customProps}
      />
    ));
  },
);

const PanelAccordionItem = memo(
  ({ panelData, panelIndex, moduleMetaData, customProps }) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(panelData?.expanded);
    const formId = pathOr(null, ["formId"], customProps);
    const isPanelHide = useFormStore((state) =>
      pathOr(
        true,
        ["formMetaData", formId, "panelData", "panelState", panelData?.key],
        state,
      ),
    );
    const handlePanelExpandChange = () => (event, isExpanded) => {
      setExpanded(isExpanded ? panelIndex : false);
    };
    return (
      isPanelHide && (
        <Accordion
          key={`PanelAccordionItem-${panelIndex}`}
          onChange={handlePanelExpandChange}
          defaultExpanded={expanded}
          className={classes.accordion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={"panel-" + panelIndex + "-bh-content"}
            id={"panel-" + panelIndex + "-bh-content"}
            className={classes.headerBackground}
          >
            <Typography
              weight="light"
              variant="subtitle2"
              key={panelData?.label}
            >
              {panelData.label.toUpperCase()}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.mobileLayoutAccoDetails}>
            <EditViewRows
              key={`${panelData.label}-${panelIndex}`}
              panelIndex={panelIndex}
              panelData={panelData}
              moduleMetaData={moduleMetaData}
              customProps={customProps}
            />
          </AccordionDetails>
        </Accordion>
      )
    );
  },
);
export { EditViewPanelAccordions };
