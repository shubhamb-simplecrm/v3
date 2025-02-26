import React, { useCallback, useState } from "react";
import CallIcon from "@material-ui/icons/Call";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import useStyles from "./styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import {
  LBL_CREATE_CALL_BUTTON,
  LBL_CREATE_MEETING_BUTTON,
  LBL_CREATE_TASK_BUTTON,
} from "../../../../constant";
import QuickCreate from "@/components/QuickCreate";
export default function AddEditEvent({ setIsSubpanelUpdated }) {
  let direction = "up";
  const classes = useStyles();
  const [openDashboardActions, setOpenDashboardActions] = useState(false);
  const [openQuickCreateDialog, setOpenQuickCreateDialog] = useState(false);
  const [whichQuickCreate, setWhichQuickCreate] = useState(null);
  const handleOpenQuickCreateDialog = (actionName) => {
    setOpenQuickCreateDialog(!openQuickCreateDialog);
    setWhichQuickCreate(actionName);
  };
  const DashboardActions = [
    {
      icon: <FormatListBulletedIcon />,
      name: "Tasks",
      label: LBL_CREATE_TASK_BUTTON,
    },
    {
      icon: <PeopleAltIcon />,
      name: "Meetings",
      label: LBL_CREATE_MEETING_BUTTON,
    },
    { icon: <CallIcon />, name: "Calls", label: LBL_CREATE_CALL_BUTTON },
  ];
  const handleOpenDashboardActions = () => {
    setOpenDashboardActions(openDashboardActions ? false : true);
  };
  const handleCloseDialog = useCallback(() => {
    setOpenQuickCreateDialog(false);
  }, []);
  const handleOnRecordSuccess = useCallback(() => {
    setIsSubpanelUpdated(true);
    setOpenQuickCreateDialog(false);
  }, []);

  return (
    <>
      {openQuickCreateDialog && (
        <QuickCreate
          moduleName={whichQuickCreate}
          open={openQuickCreateDialog}
          onCancelClick={handleCloseDialog}
          onRecordSuccess={handleOnRecordSuccess}
        />
      )}
      {DashboardActions.length ? (
        <SpeedDial
          ariaLabel="Detailview Actions"
          className={classes.speedDial}
          icon={<SpeedDialIcon />}
          onClick={handleOpenDashboardActions}
          open={openDashboardActions}
          direction={direction}
        >
          {DashboardActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.label}
              tooltipOpen
              onClick={() => handleOpenQuickCreateDialog(action.name)}
              classes={classes}
              TooltipClasses={classes}
            />
          ))}
        </SpeedDial>
      ) : null}
    </>
  );
}
