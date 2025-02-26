import React,{useEffect, useState,useCallback} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Menu,
  MenuItem,
  Checkbox,
  Typography,
  IconButton,
  Input,
  Paper,
  Tooltip
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import TuneIcon from '@material-ui/icons/Tune';
import { useDispatch, useSelector } from "react-redux";
import {pathOr,clone} from "ramda";;
// import { Filter } from "../../../../../ListView/components";
import { getFilterConfig, getListView, } from "../../../../../../store/actions/module.actions";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.white,
    //padding: theme.spacing(2),
    height: 68,
    display: 'flex',
    alignItems: 'center'
  },
  backButton: {
    marginRight: theme.spacing(2),
    // [theme.breakpoints.up('md')]: {
    //   display: 'none'
    // }
  },
  select: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  search: {
    height: 42,
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'center',
    flexBasis: "100%",
    marginLeft: '20px',
    backgroundColor: "#cccccc17",
    border:"#cccccc5c solid thin",
    [theme.breakpoints.down('sm')]: {
      flex: '1 1 auto'
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
    }
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.icon,
    cursor:"pointer"
  },
  searchInput: {
    flexGrow: 1
  },
  refreshButton: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  moreButton: {
    marginLeft: theme.spacing(2)
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: "10px",
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  paginationDetails: {
    whiteSpace: 'nowrap'
  }
}));

const EmailToolbar = props => {
  const {
    selectedFolder,
    selectedEmails,
    setSelectedEmails,
    selectedEmail,
    setSelectedEmail,
    onSelectAll,
    onDeselectAll,
    onBack,
    className,
    setEmailSettingModal,meta,
    listViewWhere,page,sortBy,sortOrder,lastListViewSort,rowsPerPage,
    changePageOrSort,
    handleOpenEmailImportDialog,
    view="ListView",
    listViewLoader,
    setListViewLoader,
    handleMassAction,
    setEmailRecords,
    ...rest
  } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const [pageNo, setPageNo]=useState(page);
  const [lastRecordCount, setLastRecordCount]=useState(meta["records-on-this-page"]);
  const [totalRecords, setTotalRecords]=useState(meta["total-records"]);
  const [modalVisible, setModalVisibility] = useState(false);
  
  const [filterQuery, setFilterQuery] = useState(null);
  const [filterQueryMeta, setFilterQueryMeta] = useState(null);
  
  const { filterConfig,filterConfigError, filterConfigLoading, listViewTabData, selectedModule } = useSelector((state) => state.modules);
  const sort = pathOr({}, ['data', 'templateMeta', 'sort'], listViewTabData[selectedModule]);
  const [textQuery, setTextQuery] = useState(pathOr("",["Emails","templateMeta","data","advanced_search",2,"value"],filterConfig));
  const fetchFilterConfig = useCallback(() => {
    if (selectedModule) {
      dispatch(getFilterConfig(selectedModule));
    }
  }, [dispatch, selectedModule]);

  useEffect(() => { fetchFilterConfig(); setFilterQuery(null); }, [fetchFilterConfig, selectedModule]);
  const searchFilter = (query, isReset) => {
    query = query.replace("[lke]","[eq]");
    if (isReset) {
      setFilterQuery(null);
      setFilterQueryMeta(null);
      
    }
    dispatch(getListView(selectedModule, 0, rowsPerPage, sort, query,selectedFolder)).then(function (res) {
      setSelectedEmail(null);  
      setEmailRecords(pathOr([], ['data', 'data','templateMeta','data'], res));
      setTotalRecords(pathOr([], ['data','meta', 'total-records'], res));
      setLastRecordCount(pathOr([], ['data','meta', 'records-on-this-page'], res));
      dispatch(getFilterConfig(selectedModule));
   
    });
    if (!isReset) {
      setModalVisibility(!modalVisible);
      
    }
  }
  const handleCheckboxChange = event => {
    if (event.target.checked) {
      onSelectAll && onSelectAll();
    } else {
      onDeselectAll && onDeselectAll();
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEmailImport = () => {
    setAnchorEl(null);
    handleOpenEmailImportDialog();
  };
  const handleChangePageOrSort = (type)=>{
    let page = clone(pageNo);
    if(type==='next')
    {
      page = page + 1;
      setLastRecordCount(lastRecordCount);
    }
    if(type==='prev'){
      page = page - 1;
      setLastRecordCount(lastRecordCount);
    }   
    setPageNo(page);
    changePageOrSort(page,'');
  }
  const refresh=()=>{
    setSelectedEmail(null);
    setPageNo(0);
    changePageOrSort(0,'');
  }
  const handleTextSearch=(e,type)=>{
    if(type==='clear')
    {
      setTextQuery("");
      setModalVisibility(false);
      searchFilter(`filter[reset][eq]=true`,true);
      return;
    }
    if(type==='enter' && e.key!=='Enter'){ 
      return;
    }
    searchFilter(`filter[name][eq]=${textQuery}`,true)
  }
  useEffect(()=>{
    setLastRecordCount(meta["records-on-this-page"])
    setTotalRecords(meta["total-records"])
  },[meta])
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
      {view!=="DetailView"?
      <div className={classes.select}>
         <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleEmailImport}>Import Email</MenuItem>
          <MenuItem onClick={()=>{handleClose();handleMassAction('unread')}}>Mark As Unread</MenuItem>
          <MenuItem onClick={()=>{handleClose();handleMassAction('read')}}>Mark As Read</MenuItem>
          <MenuItem onClick={()=>{handleClose();handleMassAction('flagged')}}>Mark As Flagged</MenuItem>
          <MenuItem onClick={()=>{handleClose();handleMassAction('unflagged')}}>Mark As Unflagged</MenuItem>
        </Menu>
        <Checkbox
          checked={selectedEmails && selectedEmails.length}
          className={classes.checkbox}
          color="primary"
          indeterminate={
            selectedEmails && selectedEmails.length > 0 && selectedEmails.length < totalRecords
          }
          onChange={handleCheckboxChange}
        />
        
        <IconButton aria-label="simple-menu" aria-haspopup="true" className={classes.margin} size="small" onClick={handleClick}>
          <ArrowDropDownIcon fontSize="inherit" />
        </IconButton>
        
      </div>:""}
      <Paper
        className={classes.search}
        elevation={1}
      >
        <SearchIcon className={classes.searchIcon} onClick={(e)=>handleTextSearch(e,'click')} />
        <Input
          className={classes.searchInput}
          disableUnderline
          placeholder="Search email"
          onChange={(e)=>setTextQuery(e.target.value)}
          value={textQuery}
          onKeyPress={(e)=>handleTextSearch(e,"enter")}
        />
        {textQuery?<CloseIcon className={classes.searchIcon} onClick={(e)=>handleTextSearch(e,'clear')} />:""}
        <TuneIcon className={classes.searchIcon} onClick={()=>setModalVisibility(true)} />
      </Paper>
      <Tooltip title="Refresh">
        <IconButton className={classes.refreshButton} size="small" onClick={()=>refresh()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Setting options">
        <IconButton
          className={classes.moreButton}
          size="small"
          onClick={setEmailSettingModal}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      
      {view!=="DetailView" && meta && totalRecords && totalRecords>0?
      <div className={classes.pagination}>
        <Tooltip title="Previous page">
          <IconButton size="small" disabled={parseInt(page)===0} onClick={()=>handleChangePageOrSort('prev')}>
            <KeyboardArrowLeftIcon />
          </IconButton>
        </Tooltip>
        <Typography
          className={classes.paginationDetails}
          variant="body2"
        >
          {/* {pageNo==0?1:(rowsPerPage*(pageNo-1)) } - {(totalRecords>rowsPerPage)?rowsPerPage:totalRecords} of {totalRecords} */}
          {parseInt(page)===0?1:(parseInt(rowsPerPage)*(page))+1 } - {parseInt(page)===0?rowsPerPage:`${parseInt(parseInt(rowsPerPage)*(page))+parseInt(rowsPerPage)}`} of {((parseInt(parseInt(rowsPerPage)*(page))+parseInt(rowsPerPage))>=parseInt(rowsPerPage))?meta["total-records"]:(parseInt(parseInt(rowsPerPage)*(page))+parseInt(rowsPerPage))}
        </Typography>
        <Tooltip title="Next page">
          <IconButton size="small" disabled={(parseInt(meta["total-pages"])-1)===parseInt(page)} onClick={()=>handleChangePageOrSort('next')}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </Tooltip>
      </div>:""}
      {/* {modalVisible?<Filter
        modalState={modalVisible}
        handleClose={() => setModalVisibility(!modalVisible)}
        loading={filterConfigLoading}
        error={filterConfigError}
        config={filterConfig[selectedModule]}
        search={(query, isReset) => searchFilter(query, isReset)}
        setFilterQuery={(query) => setFilterQuery(query)}
        setFilterQueryMeta={(query) => setFilterQueryMeta(query)}
        selectedModule={selectedModule}
        
      />:null} */}
    </div>
  );
};

EmailToolbar.propTypes = {
  className: PropTypes.string,
  onBack: PropTypes.func,
  onDeselectAll: PropTypes.func,
  onSelectAll: PropTypes.func,
  selectedEmail: PropTypes.array.isRequired,
};

export default EmailToolbar;
