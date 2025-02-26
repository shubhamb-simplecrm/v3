import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Chip, Tab, Tabs, Typography, Box, IconButton, Input, Paper, Tooltip } from '@material-ui/core';
import { pathOr } from "ramda";
import SubPanelListView from "../../../SubPanel/SubPanelListView";
import { textEllipsis } from '../../../../common/utils';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    height: 68,
    // display: 'flex',
    // alignItems: 'center'
  },
  backButton: {
    marginRight: theme.spacing(2)
  },
  search: {
    height: 42,
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'center',
    flexBasis: 300,
    marginLeft: 'auto',
    [theme.breakpoints.down('sm')]: {
      flex: '1 1 auto'
    }
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.icon
  },
  searchInput: {
    flexGrow: 1
  },
  moreButton: {
    marginLeft: theme.spacing(2)
  },
  tabPanel: {
    width: "100%",
    marginBottom: 20
  }
}));

const EmailSubpanels = props => {
  const { className, subpanels, record, setIsSubpanelUpdated, setValue, value, ...rest } = props;
  const myRef = useRef(null);
  const executeScroll = () => myRef.current.scrollIntoView({ behavior: "smooth", block: "end" });;
  const classes = useStyles();
  //const [value,setValue] = useState(0);
  //const [isSubpanelUpdated, setIsSubpanelUpdated] = useState(false);
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
          <Box p={2} style={{ paddingTop: 5 }}>
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
  const handleChange = (event, newValue) => { executeScroll(); setValue(newValue); };
  // useEffect(()=>{  
  //   setValue(value)
  //   setIsSubpanelUpdated(true)

  // },[value]);

  return (
    <div {...rest} className={clsx(classes.root, className)} >
      <Tabs variant="scrollable" scrollButtons="auto" value={value} onChange={handleChange} aria-label="scrollable">
        {pathOr([], ["subpanel_tabs"], subpanels).map((tab, key) => (
          <Tab
            className={classes.tabButton}
            label={
              <Tooltip title={tab.title} arrow placement="top">
                <div className={classes.tabName}>
                  {textEllipsis(tab.title, 15)} {tab.title !== 'Activities' && tab.title !== 'History' ? <Chip size="small" label={tab.data_count} /> : null}
                </div>
              </Tooltip>
            }
            key={key}
            {...a11yProps(key)}
          />

        ))}
      </Tabs>
      {pathOr([], ["subpanel_tabs"], subpanels).map((panel, panelKey) => (
        <TabPanel
          value={value}
          index={panelKey}
          key={panelKey}
          className={classes.tabPanel}
        >
          <SubPanelListView
            data={panel}
            module={subpanels.module}
            subpanel={panel.rel_module}
            subpanel_module={panel.module_name}
            title={panel.title}
            record={subpanels.id}
            setIsSubpanelUpdated={setIsSubpanelUpdated}
            value={value}
            setValue={setValue}
            relationShipName={panel?.rel_name}
          />

        </TabPanel>
      ))}
      <div ref={myRef}></div>
    </div>
  );
};
EmailSubpanels.propTypes = {
  className: PropTypes.string,
  onBack: PropTypes.func
};

export default EmailSubpanels;
