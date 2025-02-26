import React from 'react';
import PropTypes from 'prop-types';
// styles
import useStyles from './styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Box } from '@material-ui/core';
// Accordion
import { ControlledAccordions } from '../';

import ViewRows from '../ViewRows';

function TabPanel(props) {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<div key={index}>{children}</div>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
};

function a11yProps(index) {
	return {
		id: `scrollable-auto-tab-${index}`,
		'aria-controls': `scrollable-auto-tabpanel-${index}`
	};
}

export default function ScrollableTabsButtonAuto({ data, module, initialValues, errors, onChange, view = 'editview',hiddenAll, fieldConfiguratorData }) {
	const classes = useStyles();
	const [ value, setValue ] = React.useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<div className={classes.root}>
			<AppBar position="static" color="default">
				<Tabs
					value={value}
					onChange={handleChange}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					aria-label="scrollable auto tabs example"
				>
					{Object.keys(data).map((tab, key) => <Tab label={data[tab].label} key={key} {...a11yProps(key)} />)}
				</Tabs>
			</AppBar>
			{data.map((tab, num) => (
				<TabPanel value={value} index={num} key={num}>
					<ViewRows
						data={tab}
						module={module}
						initialValues={initialValues}
						errors={errors}
						onChange={onChange}
						view={view}
						hiddenAll={hiddenAll}
						fieldConfiguratorData={fieldConfiguratorData}
					/>
					<br />
					<ControlledAccordions
						data={tab.panels}
						module={module}
						initialValues={initialValues}
						errors={errors}
						headerBackground="true"
						onChange={onChange}
						view={view}
						hiddenAll={hiddenAll}
						fieldConfiguratorData={fieldConfiguratorData}
					/>
				</TabPanel>
			))}
		</div>
	);
}
