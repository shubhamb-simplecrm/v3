import { AppBar, Link } from "@material-ui/core";
import clsx from "clsx";
import React, { memo } from "react";
import { useHistory } from "react-router";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import useStyles from "./styles";
import { CustomNavBar } from "../CustomNavBar";
import { useModuleViewDetail } from "../../../hooks/useModuleViewDetail";
import { useIsMobileView } from "../../../hooks/useIsMobileView";
const CustomAppBar = ({
  sideBarState,
  handleDrawerClose,
  handleDrawerOpen,
  toggleStudioDialog,
}) => {
  const classes = useStyles();
  const history = useHistory();
  let isMobileViewCheck = useIsMobileView();
  const metaObj = useModuleViewDetail();
  const handleTitleOnClick = () => {
    handleDrawerClose(false);
    history.replace(`/app/${metaObj.currentModule}`);
  };
  return (
    <>
      <AppBar
        position="fixed"
        color="neutral"
        className={clsx(classes.appBar, {
          [classes.appBarShiftRight]: sideBarState,
        })}
      >
        <Toolbar
          className={clsx(classes.customToolBarStyle, {
            [classes.customToolBar]: !sideBarState,
          })}
          disableGutters={true}
        >
          <div
            className={clsx(classes.menuButton, {
              [classes.hide]: sideBarState,
            })}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          </div>

          <Link
            component="button"
            variant="h5"
            onClick={handleTitleOnClick}
            noWrap
            style={{ textDecoration: "none" }}
            classes={{ button: classes.appBarTitle }}
          >
            {metaObj?.currentModuleLabel}
          </Link>
          <div className={classes.grow} />
          <CustomNavBar
            isMobileViewAppBar={isMobileViewCheck}
            toggleStudioDialog={toggleStudioDialog}
          />
        </Toolbar>
      </AppBar>
      <div className={classes.appBarSpacer} />
    </>
  );
};

export default memo(CustomAppBar);