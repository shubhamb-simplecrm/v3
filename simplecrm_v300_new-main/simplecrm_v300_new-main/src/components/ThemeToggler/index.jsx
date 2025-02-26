import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, Radio, SwipeableDrawer } from "@material-ui/core";
import clsx from "clsx";
import useStyles from "./styles";
import { changeTheme } from "../../store/actions/config.actions";
import { memo } from "react";
import { THEME_TYPES } from "../../common/theme-constants";

const ThemeToggler = ({ toggleDrawer, toggleState }) => {
  const currentTheme = useSelector(
    (state) => state?.config?.config?.V3SelectedTheme,
  );
  const dispatch = useDispatch();
  const classes = useStyles();
  const anchor = "right";
  const themeSelection = (e) => {
    dispatch(changeTheme(e.target.value));
    toggleDrawer(false);
  };

  return (
    <SwipeableDrawer
      anchor={anchor}
      open={toggleState}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <div
        className={clsx(classes.list, {
          [classes.fullList]: anchor === "top" || anchor === "bottom",
        })}
        role="presentation"
      >
        {THEME_TYPES.map((theme) => (
          <Box key={theme} className={classes.selectedContainer}>
            <Typography className={classes.text}>{theme}</Typography>
            <div style={{ textAlign: "center" }}>
              <Radio
                checked={currentTheme === theme}
                onChange={themeSelection}
                value={theme}
                name="radio-button-demo"
                inputProps={{ "aria-label": "light" }}
              />
            </div>
          </Box>
        ))}
      </div>
    </SwipeableDrawer>
  );
};

export default memo(ThemeToggler);
