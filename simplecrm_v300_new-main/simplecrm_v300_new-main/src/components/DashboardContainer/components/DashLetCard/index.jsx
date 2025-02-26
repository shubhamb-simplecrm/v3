import { Card, CardContent, CardHeader, IconButton } from "@material-ui/core";
import React from "react";
import useStyles from "./styles";
import Refresh from "@material-ui/icons/Refresh";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { LBL_DASHLET_EDIT_BUTTON, LBL_DASHLET_REMOVE_BUTTON } from "@/constant";
const metaData = [
  {
    id: "dashletEdit",
    label: LBL_DASHLET_EDIT_BUTTON,
    icon: <EditIcon />,
  },
  {
    id: "dashletDelete",
    label: LBL_DASHLET_REMOVE_BUTTON,
    icon: <DeleteIcon />,
  },
];
const DashLetCard = (props) => {
  const {
    title,
    icon,
    onActionClick = null,
    onRefreshClick = null,
    children = null,
  } = props;
  const classes = useStyles();
  return (
    <Card classes={{ root: classes.dashLetCardRoot }}>
      <CardHeader
        classes={{
          avatar: icon && classes.iconBtn,
        }}
        avatar={icon}
        action={
          <>
            <IconButton
              aria-controls={`dashboardMenu-${title}`}
              aria-haspopup="true"
              onClick={onRefreshClick}
              className={classes.curPointMobileLayout}
              disabled={!onRefreshClick}
            >
              <Refresh />
            </IconButton>
            {metaData?.map((option) => (
              <IconButton
                key={option.label}
                tooltipTitle={option.label}
                className={classes.curPointMobileLayout}
                aria-label={option.label}
                disabled={!onActionClick}
                onClick={() => onActionClick(option.label)}
              >
                {option.icon}
              </IconButton>
            ))}
          </>
        }
        title={<span className={classes.dashLetHeaderTitle}>{title}</span>}
        className={classes.dashLetHeader}
      />

      <CardContent className={classes.dashLetCardContentRoot}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashLetCard;
