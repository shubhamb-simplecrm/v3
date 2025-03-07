import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Input, Paper, Tooltip } from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.white,
    padding: theme.spacing(2),
    height: 68,
    display: 'flex',
    alignItems: 'center'
  },
  backButton: {
    marginRight: theme.spacing(2)
  },
  search: {
    height: 45,
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'center',
    flexBasis: "100%",
    marginLeft: '15px',
    backgroundColor: "#cccccc17",
    border:"#cccccc5c solid thin",
    [theme.breakpoints.down('sm')]: {
      flex: '1 1 auto'
    },
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
  }
}));

const EmailToolbar = props => {
  const { onBack,view='list', className, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Tooltip title="Back">
        <IconButton
          className={classes.backButton}
          onClick={onBack}
          size="small"
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      <Paper
        className={classes.search}
        elevation={1}
      >
        <SearchIcon className={classes.searchIcon} />
        <Input
          className={classes.searchInput}
          disableUnderline
          placeholder="Search email"
        />
      </Paper>
      {view==='list'?
      <>
      <Tooltip title="More options">
        <IconButton
          className={classes.moreButton}
          size="small"
        >
          <MoreIcon />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Previous email">
        <IconButton
          className={classes.previousButton}
          size="small"
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Next email">
        <IconButton
          className={classes.nextButton}
          size="small"
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Tooltip></>:""}
    </div>
  );
};
EmailToolbar.propTypes = {
  className: PropTypes.string,
  onBack: PropTypes.func
};

export default EmailToolbar;
