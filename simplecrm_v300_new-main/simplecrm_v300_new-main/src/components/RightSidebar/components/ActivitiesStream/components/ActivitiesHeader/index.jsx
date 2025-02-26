import React from "react";
import useStyles from "./styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import DrawerHeader from "../../../DrawerHeader";
import { LBL_ACTIVITIES_STREAM_TITLE } from "../../../../../../constant";

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function ActivitiesHeader(props) {
  const { activityType, handleActivityTypeChange } = props;
  const classes = useStyles();

  return (
    <>
      <DrawerHeader title={LBL_ACTIVITIES_STREAM_TITLE} />
      <Tabs
        value={activityType}
        onChange={handleActivityTypeChange}
        className={classes.tab}
        variant="scrollable"
        aria-label="full width tabs example"
      >
        <Tab label="My Items" key={0} {...a11yProps(0)} />
        <Tab label="My Groups" key={1} {...a11yProps(1)} />
      </Tabs>
    </>
  );
}
