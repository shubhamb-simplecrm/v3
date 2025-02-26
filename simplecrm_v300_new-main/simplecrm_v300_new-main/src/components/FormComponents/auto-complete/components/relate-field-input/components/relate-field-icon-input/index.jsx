import { Button, IconButton, Tooltip } from "@material-ui/core";
import React from "react";
import {
  VARIANT,
  LBL_SELECT_BUTTON_LABEL,
} from "../../../../../../../constant";
import useStyles from "./styles";
const RelateFieldIconInput = (props) => {
  const { 
    btnIcon = null,
    isSelectBtn = false,
    tooltipTitle,
    variant = VARIANT,
    view = null,
    disabled = false,
    color = "",
    isIconBtnLabel = "",
    toggleDialogVisibility,
  } = props;
  const classes = useStyles();
  return (
    <Tooltip title={tooltipTitle ? tooltipTitle : ""} aria-label={tooltipTitle}>
      {isSelectBtn ? (
        <Button
          className={classes.mobileLayoutButton}
          color={color}
          variant={variant}
          size="small"
          disabled={disabled}
          onClick={() => toggleDialogVisibility()}
        >
          {btnIcon}
          {isIconBtnLabel
            ? isIconBtnLabel
            : { LBL_SELECT_BUTTON_LABEL } + view === "calendar"
            ? "Users"
            : null}
        </Button>
      ) : (
        <IconButton onClick={() => toggleDialogVisibility()}>
          {btnIcon}
        </IconButton>
      )}
    </Tooltip>
  );
};

export default RelateFieldIconInput;
