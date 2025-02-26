import React from "react";
import { useTheme,Modal, Paper, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import useStyles, { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Scrollbars } from 'react-custom-scrollbars';

const CustomModal = ({
  visible,
  toggleVisibility,
  children,
  title,
  size = "",
}) => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
    <Modal open={visible} onClose={toggleVisibility}>
      <Paper
        square
        className={size === "full-width" ? classes.fullWidth : classes.paper}
      >
        <Scrollbars autoHide={true}>
        <div className={classes.titleHeadWrapper}>
            <Typography variant="h6" style={{ fontWeight: "500", color: theme.palette.text.primary }}>
              {title}
            </Typography>
            <Close
              onClick={() => toggleVisibility(!visible)}
              className={classes.closeIcon}
            />
          </div>
        {children}
        </Scrollbars>
      </Paper>
      
    </Modal>
    </MuiThemeProvider>
  );
};

export default CustomModal;
