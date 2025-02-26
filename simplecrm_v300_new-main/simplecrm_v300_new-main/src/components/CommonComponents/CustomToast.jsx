// CustomToast.jsx
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button, IconButton, Box } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import WarningIcon from "@material-ui/icons/Warning";
import InfoIcon from "@material-ui/icons/Info";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const useStyles = makeStyles((theme) => ({
  toastContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    // padding: theme.spacing(1),
    // backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  icon: {
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(1),
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    marginBottom: theme.spacing(1),
  },
  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    marginRight: theme.spacing(1),
    textTransform: "none",
  },
  closeButton: {
    padding: theme.spacing(0.5),
  },
}));

const CustomToast = ({
  closeToast,
  iconType = "info",
  message,
  actions = [],
  icon = null,
  useDefaultIcon = false,
}) => {
  const classes = useStyles();

  const renderIcon = () => {
    if (useDefaultIcon) return null;

    if (icon) {
      return React.cloneElement(icon, { className: classes.icon });
    }

    switch (iconType) {
      case "error":
        return <WarningIcon color="error" className={classes.icon} />;
      case "success":
        return (
          <CheckCircleIcon
            style={{ color: "#4caf50" }}
            className={classes.icon}
          />
        );
      case "info":
      default:
        return <InfoIcon color="primary" className={classes.icon} />;
    }
  };

  return (
    <Box className={classes.toastContainer}>
      {renderIcon()}
      <Box className={classes.messageContainer}>
        {message}
        {/* <Typography variant="body2" className={classes.message}>
        </Typography> */}
        {actions.length > 0 && (
          <Box className={classes.actions}>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="contained"
                size="small"
                className={classes.actionButton}
                style={{
                  backgroundColor: action.color || "#1976d2",
                  color: "#fff",
                }}
                onClick={() => {
                  if (action.onClick) action.onClick();
                  if (action.autoClose) closeToast();
                }}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
      {/* <IconButton
        size="small"
        className={classes.closeButton}
        onClick={closeToast}
      >
        <CloseIcon fontSize="small" />
      </IconButton> */}
    </Box>
  );
};

CustomToast.propTypes = {
  closeToast: PropTypes.func.isRequired,
  iconType: PropTypes.oneOf(["error", "info", "success"]),
  message: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      color: PropTypes.string,
      autoClose: PropTypes.bool,
    }),
  ),
  icon: PropTypes.element, // Custom icon component
  useDefaultIcon: PropTypes.bool, // Use default toast icon
};

export default CustomToast;
