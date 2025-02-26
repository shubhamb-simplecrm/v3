import React from "react";
import PropTypes from "prop-types";
import { IconButton as MUIIconButton, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import { isNil } from "ramda";
const useStyles = makeStyles((theme) => ({
  iconBtn: {
    [theme.breakpoints.up("sm")]: {
      "&:hover": {
        cursor: "pointer",
        background: theme.palette.primary.main,
        color: "#FFFFFF",
      },
    },
    height: "2rem",
    width: "2rem",
    background: theme.palette.primary.main + "20",
    color: theme.palette.primary.main,
    borderRadius: "50%",
    "& svg": {
      width: "0.8em",
      height: "0.8em",
    },
  },
  selectedIcon: {
    background: `${theme.palette.primary.main} !important`,
    color: "#FFFFFF",
  },
}));

export const IconButton = ({
  onClick,
  className = null,
  color = "secondary",
  size = "small",
  disabled = false,
  isActive = false,
  children,
  tooltipTitle = null,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Tooltip
      disableHoverListener={isNil(tooltipTitle)}
      disableFocusListener={isNil(tooltipTitle)}
      disableTouchListener={isNil(tooltipTitle)}
      title={tooltipTitle}
    >
      <MUIIconButton
        {...props}
        color={color}
        onClick={onClick}
        disabled={disabled}
        size={size}
        className={clsx(classes.iconBtn, className, {
          [classes.selectedIcon]: isActive,
        })}
      >
        {children}
      </MUIIconButton>
    </Tooltip>
  );
};

IconButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
};
