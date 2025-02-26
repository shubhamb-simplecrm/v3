import React,{useState} from "react";
import { styled } from "@material-ui/core/styles";
import {
  Menu,
  MenuItem,
  Divider,
  IconButton,
  Tooltip,
  Avatar,
  useTheme,
} from "@material-ui/core";
import useStyles, { getMuiTheme } from "./styles";
import { pathOr } from "ramda";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { MenuConfigurator } from "../../components";
import {
  useLayoutDispatch,
  toggleRightSidebar,
} from "../../../../context/LayoutContext";
import {
  LBL_PROFILE,
  LBL_ADMINISTRATOR,
  LBL_THEME_LABEL,
  LBL_LOGOUT,
  LBL_MENU_ORDER_CONFIGURATOR_ACTION_TITLE,
} from "../../../../constant";
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: "#ccc",
      },
    },
  },
}));

export default function ProfileMenu({ userData, toggleDrawer }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const layoutDispatch = useLayoutDispatch();
  const theme = useTheme();
  const [isOpenMenuConfigurator, setIsOpenMenuConfigurator] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const userPhoto = () => {
    return pathOr("", ["photo"], userData);
  };
  const navigateToUserDetail = () => {
    history.push(`/app/detailview/Users/${userData.id}`);
    handleClose();
  };
  const resetToggle = () => {
    toggleRightSidebar(layoutDispatch);
  };
  const navigateToAdmin = () => {
    history.push(`/app/administrator`);
  };
  
  const navigateToPortalAdmin = () => {
    history.push(`/app/portalAdministrator`);
  };
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Tooltip
        key="profile-menu-btn-tt"
        title={userData && userData.user_name.toUpperCase()}
        placement="left"
      >
        <IconButton
          color="primary"
          key="profile-menu-btn"
          aria-haspopup="true"
          className={classes.headerProfileMenuButton}
          aria-controls="right-profile-menu"
          onClick={handleClick}
          onClose={handleClose}
        >
          <Avatar
            className={classes.profileMenuIconSize}
            alt={userData && userData.user_name.toUpperCase()}
            src={userPhoto()}
          />
        </IconButton>
      </Tooltip>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className={classes.headerProfileMenuListButton}
      >
        <MenuItem onClick={(e) => navigateToUserDetail()} disableRipple>
          <AccountCircleIcon />
          {LBL_PROFILE}
        </MenuItem>
        {userData && userData.is_admin === "1" ? (
          <MenuItem onClick={(e) => navigateToAdmin()} disableRipple>
            <SettingsIcon />
            {LBL_ADMINISTRATOR}
          </MenuItem>
        ) : (
          ""
        )}
        
        {userData && userData.is_admin === "1" ? (
          <MenuItem onClick={(e) => navigateToPortalAdmin()} disableRipple>
            <SettingsIcon />
            Portal {LBL_ADMINISTRATOR}
          </MenuItem>
        ) : (
          ""
        )}
        <MenuItem
          onClick={() => {
            setIsOpenMenuConfigurator(true);
            handleClose();
          }}
          className={classes.iconListpaddingRight}
        >
          <SettingsIcon /> {LBL_MENU_ORDER_CONFIGURATOR_ACTION_TITLE}
        </MenuItem>
        <MenuItem onClick={toggleDrawer("right", true)} disableRipple>
          <ColorLensIcon />
          {LBL_THEME_LABEL}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            // dispatch(logout());
            resetToggle();
            handleClose();
          }}
          disableRipple
        >
          <ExitToAppIcon />
          {LBL_LOGOUT}
        </MenuItem>
      </StyledMenu>
      <MenuConfigurator
        open={isOpenMenuConfigurator}
        close={() => setIsOpenMenuConfigurator(!isOpenMenuConfigurator)}
      />
    </MuiThemeProvider>
  );
}
