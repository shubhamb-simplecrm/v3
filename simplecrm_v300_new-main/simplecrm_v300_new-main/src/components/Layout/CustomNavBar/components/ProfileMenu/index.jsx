import { Avatar, Grid, IconButton, Popover, Tooltip } from "@material-ui/core";
import { pathOr } from "ramda";
import React, { useMemo, useState } from "react";
import useStyles from "./styles";
import clsx from "clsx";
import { memo } from "react";
import { LBL_LOGOUT } from "../../../../../constant";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import { MenuConfigurator } from "../../../../RightSidebar/components";
import ThemeToggler from "../../../../ThemeToggler";
import { useHistory } from "react-router-dom";
import { useLayoutState } from "../../../../../customStrore/useLayoutState";
import { useAuthState } from "@/customStrore";
import { truncate } from "@/common/utils";
import useComposeViewData from "@/components/ComposeEmail/hooks/useComposeViewData";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import useCommonUtils from "@/hooks/useCommonUtils";

export const ProfileMenu = memo(() => {
  const classes = useStyles();
  const { currentUserData } = useCommonUtils();
  const [toggle, setToggle] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenMenuConfiguration, setIsOpenMenuConfiguration] = useState(false);
  const [themeSidebarToggle, setThemeSidebarToggle] = useState(false);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const userData = useMemo(() => {
    return currentUserData?.data?.attributes
      ? { ...currentUserData.data.attributes }
      : {};
  }, [currentUserData]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setToggle(!toggle);
  };

  const handleClose = () => {
    setToggle(false);
    setAnchorEl(null);
  };

  return (
    <>
      <ProfileNavBarOption
        key={`${userData.photo}-${userData.user_name}`}
        userData={userData}
        id={id}
        handleClick={handleClick}
        handleClose={handleClose}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        className={classes.nestedList}
      >
        <ProfileMenuPopOver
          userData={userData}
          handleClose={handleClose}
          id={id}
        />
      </Popover>
      {isOpenMenuConfiguration && (
        <MenuConfigurator
          open={isOpenMenuConfiguration}
          close={() => setIsOpenMenuConfiguration(!isOpenMenuConfiguration)}
        />
      )}
      {themeSidebarToggle && (
        <ThemeToggler
          toggleDrawer={setThemeSidebarToggle}
          toggleState={themeSidebarToggle}
        />
      )}
    </>
  );
});
const ProfileNavBarOption = memo((props) => {
  const { handleClick, id, userData } = props;
  const classes = useStyles();

  const userPhoto = useMemo(() => {
    const photo = pathOr("", ["photo"], userData);
    return photo ? `${photo}#t=${new Date().getTime()}` : "";
  }, [userData]);
  const userName = useMemo(
    () => pathOr("", ["user_name"], userData).toUpperCase(),
    [userData],
  );

  return (
    <Tooltip title={userName}>
      <IconButton
        aria-label="delete"
        aria-describedby={id}
        onClick={handleClick}
        style={{ padding: "0px", color: "#fff" }}
        color="action"
        align={"right"}
        className={clsx(classes.iconBtn, classes.profileIcon)}
      >
        <Avatar
          className={classes.profileMenuIconSize}
          alt={userName}
          src={userPhoto}
          loading="lazy"
        />
      </IconButton>
    </Tooltip>
  );
});

const ProfileMenuPopOver = memo((props) => {
  const { userData, handleClose, id } = props;
  const classes = useStyles();
  const history = useHistory();
  const { resetStore } = useLayoutState((state) => state.actions);
  const { resetComposeStore } = useComposeViewData((state) => state.actions);
  const { authActions } = useAuthState((state) => ({
    authActions: state.authActions,
  }));
  const { changeRightSideBarState } = useLayoutState((state) => state.actions);
  const handleOptionOnClick = (link) => {
    changeRightSideBarState({ drawerState: false });
    handleClose();
    history.push(link);
  };
  const handleOnLogout = () => {
    handleClose();
    resetStore();
    resetComposeStore();
    authActions.onLogoutAction();
  };
  const listItemArr = [
    {
      label: `Settings`,
      onClick: () => handleOptionOnClick(`/app/portalAdministrator`),
      icon: <SettingsIcon />,
      access: true,
      url: `/app/portalAdministrator`,
    },
    {
      label: LBL_LOGOUT,
      onClick: handleOnLogout,
      icon: <ExitToAppIcon />,
      access: true,
    },
  ];
  return (
    <>
      <div className={classes.userDetails}>
        <ProfileNavBarOption
          userData={userData}
          id={id}
          handleClick={() =>
            handleOptionOnClick(`/app/detailview/Users/${userData.id}`)
          }
          handleClose={handleClose}
        />
        <Tooltip
          title={userData.full_name}
          disableHoverListener={userData.full_name.length < 25}
        >
          <Link
            underline="none"
            className={classes.fullName}
            onClick={() =>
              handleOptionOnClick(`/app/detailview/Users/${userData.id}`)
            }
          >
            {truncate(userData.full_name, 25)}
          </Link>
        </Tooltip>
        <Tooltip
          title={userData.email1}
          disableHoverListener={userData.email1.length < 30}
        >
          <span className={classes.email}>{truncate(userData.email1, 30)}</span>
        </Tooltip>
      </div>
      <Grid container justifyContent="space-between">
        {listItemArr.map((listItem) => {
          return (
            listItem.access && (
              <Grid item onClick={listItem.onClick} className={classes.btnGrid}>
                <Link
                  className={classes.btn}
                  to={listItem?.url}
                  underline="none"
                >
                  {listItem.icon}
                  {listItem.label}
                </Link>
              </Grid>
            )
          );
        })}
      </Grid>
    </>
  );
});

export default ProfileMenu;
