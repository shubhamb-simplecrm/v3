import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";

import { useSelector } from "react-redux";
import FormInput from "../../../FormInput";
import { FaIcon } from "../../..";

const useStyles = makeStyles((theme) => ({
  root: {
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
  exampleWrapper: {
    // position: 'relative',
    // marginTop: theme.spacing(3),
    // height: 200,
  },
  radioGroup: {
    margin: theme.spacing(1, 0),
  },
  speedDial: {
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
}));

export default function SpeedDials(props) {
  const classes = useStyles();
  const [direction, setDirection] = useState("left");
  const [open, setOpen] = useState(false);

  const { sidebarLinks, sidebarLoading } = useSelector((state) => state.layout);

  let Users = sidebarLinks.attributes["Users"]
    ? {
        module: "Users",
        icon: (
          <FaIcon
            icon={`fas ${
              sidebarLinks.attributes["Users"]["icon"].icon
                ? sidebarLinks.attributes["Users"]["icon"].icon
                : "fas fa-cube"
            }`}
            size="1x"
          />
        ),
        name: sidebarLinks.attributes["Users"]["label"],
      }
    : "";
  let Prospects = sidebarLinks.attributes["Prospects"]
    ? {
        module: "Prospects",
        icon: (
          <FaIcon
            icon={`fas ${
              sidebarLinks.attributes["Prospects"]["icon"].icon
                ? sidebarLinks.attributes["Prospects"]["icon"].icon
                : "fas fa-cube"
            }`}
            size="1x"
          />
        ),
        name: sidebarLinks.attributes["Prospects"]["label"],
      }
    : "";

  let Leads = sidebarLinks.attributes["Leads"]
    ? {
        module: "Leads",
        icon: (
          <FaIcon
            icon={`fas ${
              sidebarLinks.attributes["Leads"]["icon"].icon
                ? sidebarLinks.attributes["Leads"]["icon"].icon
                : "fas fa-cube"
            }`}
            size="1x"
          />
        ),
        name: sidebarLinks.attributes["Leads"]["label"],
      }
    : "";
  let Contacts = sidebarLinks.attributes["Contacts"]
    ? {
        module: "Contacts",
        icon: (
          <FaIcon
            icon={`fas ${
              sidebarLinks.attributes["Contacts"]["icon"].icon
                ? sidebarLinks.attributes["Contacts"]["icon"].icon
                : "fas fa-cube"
            }`}
            size="1x"
          />
        ),
        name: sidebarLinks.attributes["Contacts"]["label"],
      }
    : "";
  let Accounts = sidebarLinks.attributes["Accounts"]
    ? {
        module: "Accounts",
        icon: (
          <FaIcon
            icon={`fas ${
              sidebarLinks.attributes["Accounts"]["icon"].icon
                ? sidebarLinks.attributes["Accounts"]["icon"].icon
                : "fas fa-cube"
            }`}
            size="1x"
          />
        ),
        name: sidebarLinks.attributes["Accounts"]["label"],
      }
    : "";
  const actions = [Users, Prospects, Leads, Contacts, Accounts];

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className={classes.root}>
      <div className={classes.exampleWrapper}>
        <SpeedDial
          ariaLabel="SpeedDial example"
          className={classes.speedDial}
          hidden={true}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={props.hidden}
          direction={direction}
        >
          {actions.map((action) =>
            action != "" ? (
              <FormInput
                field={{ type: "relate" }}
                multiSelect={true}
                value=""
                module={action.module}
                onClick={handleClose}
                isIconBtn={true}
                btnIcon={action.icon}
                onChange={(val) => props.setEmails(val)}
                tooltipTitle={action.name}
                component={"reminder"}
              />
            ) : (
              ""
            ),
          )}
        </SpeedDial>
      </div>
    </div>
  );
}
