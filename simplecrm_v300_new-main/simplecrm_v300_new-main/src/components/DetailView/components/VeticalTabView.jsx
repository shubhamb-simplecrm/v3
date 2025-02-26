import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import SubPanelListView from "../../SubPanel/SubPanelListView";
import {FaIcon} from "../../";
import { LBL_SUBPANEL_DETAILVIEW_TITLE } from "../../../constant";

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
        <Box p={3}>
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
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tab: {},
  wrapper: {
    display: "inline-block",
  },
}));

export default function DetailView({ data}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  data = data && data.subpanel_tabs ? data.subpanel_tabs : "";

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab
          label={
            <span>
              {<FaIcon icon={`fas fas fa-cube`} size="1x" />} {LBL_SUBPANEL_DETAILVIEW_TITLE}
            </span>
          }
          key="12"
          style={{ textAlign: "left" }}
          {...a11yProps("12")}
        />
        {Object.keys(data).map((tab, key) => (
          <Tab
            label={
              <span>
                {
                  <FaIcon
                    icon={`fas ${
                      data[tab].module_icon
                        ? data[tab].module_icon
                        : "fas fa-cube"
                    }`}
                    color={data[tab].moduleicon_color }
                    size="1x"
                  />
                }{" "}
                {data[tab].title}
              </span>
            }
            key={key}
            style={{ textAlign: "left" }}
            {...a11yProps(key)}
          />
        ))}
      </Tabs>
      <TabPanel
        value={value}
        index="12"
        key="12"
        style={{ width: "100%" }}
      ></TabPanel>
      {Object.keys(data).map((tab, num) => (
        <TabPanel value={value} index={num} key={num} style={{ width: "100%" }}>
          <SubPanelListView data={data[tab]} />
        </TabPanel>
      ))}
    </div>
  );
}
