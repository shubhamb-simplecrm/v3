import { Box, Tab, Tabs, Typography, Tooltip } from "@material-ui/core";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import useStyles from "./styles";
import FieldManager from "./components/FieldManager";
import LayoutManager from "./components/LayoutManager";
import RelationshipManager from "./components/RelationshipManager";
import SubpanelManager from "./components/SubpanelManager";
import HistoryIcon from "@material-ui/icons/History";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getTabView } from "@/store/actions/studio.actions";
import { Skeleton } from "..";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import {
  LBL_FIELD_MANAGER,
  LBL_FIELD_MANAGER_LABEL,
  LBL_LAYOUT_MANAGER_LABEL,
  LBL_LAYOUT_MANAGER,
  LBL_RELATIONSHIP_MANAGER_LABEL,
  LBL_RELATIONSHIP_MANAGER,
  LBL_SUBPANEL_MANAGER_LABEL,
  LBL_SUBPANEL_MANAGER,
  LBL_VIEW_HISTORY,
} from "@/constant";
import StudioAuditView from "./components/StudioAuditView";
import { useState } from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2} style={{ padding: "0px" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
const TabView = (props) => {
  const { value, handleOnManagerClick } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { module, manager } = useParams();
  const tabViewLoading = useSelector((state) => state.studio?.tabViewLoading);
  const [isAuditDialogVisible, setIsAuditDialogVisible] = useState(false);
  const toggleDialogVisibility = () => {
    setIsAuditDialogVisible(!isAuditDialogVisible);
  };
  useEffect(() => {
    dispatch(getTabView(module, manager));
  }, [manager, module]);

  const tabpanels = [
    {
      tab: LBL_FIELD_MANAGER,
      label: LBL_FIELD_MANAGER_LABEL,
      key: 0,
    },
    {
      tab: LBL_LAYOUT_MANAGER,
      label: LBL_LAYOUT_MANAGER_LABEL,
      key: 1,
    },
    {
      tab: LBL_RELATIONSHIP_MANAGER,
      label: LBL_RELATIONSHIP_MANAGER_LABEL,
      key: 2,
    },
    {
      tab: LBL_SUBPANEL_MANAGER,
      label: LBL_SUBPANEL_MANAGER_LABEL,
      key: 3,
    },
  ];

  const renderManager = () => {
    switch (value) {
      case 0:
        return <FieldManager />;
      case 1:
        return <LayoutManager />;
      case 2:
        return <RelationshipManager />;
      case 3:
        return <SubpanelManager />;
    }
  };

  return (
    <>
      {isAuditDialogVisible ? (
        <StudioAuditView
          isDialogVisible={isAuditDialogVisible}
          toggleDialogVisibility={toggleDialogVisibility}
        />
      ) : null}
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={value}
        onChange={(e, newValue) => {
          handleOnManagerClick(
            newValue,
            tabpanels[newValue]["tab"],
          );
        }}
        aria-label="scrollable"
      >
        {tabpanels.map((tab) => (
          <Tab
            key={tab.key}
            {...a11yProps(tab.key)}
            label={
              <Tooltip title={tab.label} arrow placement="top">
                <div>{tab.label}</div>
              </Tooltip>
            }
          />
        ))}
      </Tabs>

      {tabpanels.map((tab) => (
        <TabPanel value={value} index={tab.key}>
          {tabViewLoading ? (
            <Skeleton />
          ) : (
            <>
              {renderManager()}
              <Tooltip title={LBL_VIEW_HISTORY}>
                <HistoryIcon
                  className={classes.historyIcon}
                  color="primary"
                  onClick={() => toggleDialogVisibility()}
                />
              </Tooltip>
            </>
          )}
        </TabPanel>
      ))}
    </>
  );
};

export default TabView;
