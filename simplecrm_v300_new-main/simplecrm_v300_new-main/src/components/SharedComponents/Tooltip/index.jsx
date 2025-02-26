import { Tooltip as MUITooltip } from "@material-ui/core";
import React from "react";

const Tooltip = ({ children, title }) => {
  return (
    <MUITooltip
      title={title}
      disableHoverListener={!title}
      placement="top-start"
      disableFocusListener={!title}
      disableTouchListener={!title}
    >
      {children}
    </MUITooltip>
  );
};

export default Tooltip;
