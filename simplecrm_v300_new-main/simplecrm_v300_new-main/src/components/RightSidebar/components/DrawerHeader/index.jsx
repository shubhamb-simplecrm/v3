import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import useStyles from "./styles";
import { Divider, Typography } from "@material-ui/core";
import { useCallback } from "react";
import { useLayoutState } from "../../../../customStrore/useLayoutState";

export default function DrawerHeader(props) {
  const { title, subheader = null } = props;
  const classes = useStyles();
  const { changeRightSideBarState } = useLayoutState((state) => state.actions);
  const handleCloseRightSideBar = useCallback(() => {
    changeRightSideBarState({ drawerState: false });
  }, []);

  return (
    <>
      <Card style={{ zIndex: 999 }}>
        <CardHeader
          className={classes.header}
          action={
            <IconButton aria-label="settings" onClick={handleCloseRightSideBar}>
              <ClearIcon />
            </IconButton>
          }
          title={
            <Typography
              gutterBottom
              variant="body1"
              color="primary"
              component="p"
            >
              {title}
            </Typography>
          }
          subheader={subheader}
        />
      </Card>
      <Divider />
    </>
  );
}
