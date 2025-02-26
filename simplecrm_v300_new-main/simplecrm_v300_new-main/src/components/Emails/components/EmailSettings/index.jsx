import React,{useEffect, useState} from 'react';
import {IconButton,Typography,Grid,useTheme, Button,Dialog,DialogActions as MuiDialogActions ,DialogContent as MuiDialogContent ,DialogContentText,DialogTitle as MuiDialogTitle } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import useStyles from "./styles";
import { getMuiTheme } from "./styles";
import { MuiThemeProvider,withStyles } from "@material-ui/core/styles";
import { pathOr, clone } from 'ramda';
import { validateForm } from '../../../../common/utils';
import { Scrollbars } from 'react-custom-scrollbars';
import CloseIcon from '@material-ui/icons/Close';
import List from "./List";
import Inbound from "./Inbound";
import { toast } from 'react-toastify';
import CircularProgress from '@material-ui/core/CircularProgress';

import { submitInOutboundEmail} from "../../../../store/actions/edit.actions";
import { LBL_CLOSE_BUTTON_TITLE, LBL_SAVE_BUTTON_TITLE, LBL_SAVE_INPROGRESS, SOMETHING_WENT_WRONG } from '../../../../constant';


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
export default function EmailSettings(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const currentTheme = useTheme();
  const [validForm, setValidForm]=useState(false);
  const [errors, setErrors] = useState({});

  const [editValues, setEditValues]=useState({});
  const [loading, setLoading]=useState(false);
  const [outboundList, setOutboundList] = useState([]);
  const [fields, setFields] = useState({});
  const { userPreference, config } = useSelector((state) => state.config);
  const default_date_format = pathOr("",["default_date_format"],config);
  const calendar_format = pathOr(default_date_format, ['attributes', 'global', 'calendar_format'], userPreference);
  const date_reg_format = pathOr(default_date_format, ['attributes', 'global', 'date_reg_format'], userPreference);
  const time_reg_format = pathOr(default_date_format, ['attributes', 'global', 'time_reg_format'], userPreference);
  const date_reg_positions = pathOr(default_date_format, ['attributes', 'global', 'date_reg_positions'], userPreference);

  const [modal, setModal]=useState({title:"Settings", type:"list"});
  const [isEditingView, setIsEditingView] = useState(false);
  const handleClose = ()=>{
    setModal({title:"Settings", type:"list"});
  }


  const getFormatedValue = () => {
    let init1 = clone(editValues);
   
    for (let key in init1) {
      if (key === "ie_status") {
        init1[key] = init1[key] ? "Active" : ""
      }
    }
    
    return JSON.stringify(init1);
  };
  const { currentUserData } = useSelector((state) => state.config);
  const currentUserId = pathOr(
    [],
    ["data", "attributes", "id"],
    currentUserData,
  );

  const handleSubmit = (e) =>{
    var submitData= null;
    e.preventDefault();
    let validate = validateForm(fields, editValues, { calendar_format, date_reg_format, time_reg_format, date_reg_positions });  
    setErrors(validate.errors);
    if (validate.formIsValid) {
      if (modal.type === "signature") {
        submitData = {
          name: editValues.name,
          signature: editValues.signature_html.replace(/<[^>]+>/g, ""),
          signature_html: editValues.signature_html,
          default_signature: editValues.default,
        };
        if (isEditingView) {
          submitData["record_id"] = editValues.id;
          submitData["view"] = "EditView";
        } else {
          submitData["view"] = "CreateView";
        }
      } 

      else {
        let init1 = clone(editValues);
        
        for (let key in init1) {
          if (key === "ie_status") {
            init1[key] = init1[key] ? "Active" : ""
          }
        }
        
        submitData = {
          data: {
            type: "InboundEmail",
            attributes: init1,
          },
        };
       
      }
     
      //return;
      onSubmit(submitData);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      dispatch(submitInOutboundEmail(data, modal.type)).then(function (res) {
        if (modal.type === "signature") {
          toast(
            editValues.id === "" || editValues.id === ""
              ? "Record created."
              : "Record updated.",
          );
          setModal({ title: "Settings", type: "list" });
          setFields({});
          setErrors({});
          setLoading(false);
          return;
        } else if (modal.type === "outbound") {
          let id = pathOr("", ["data", "id"], res);
            toast(
              editValues.ie_id === "" || editValues.mail_id === ""
                ? "Record created."
                : "Record updated.",
            );
            setModal({ title: "Settings", type: "list" });
            setFields({});
            setErrors({});
            setLoading(false);
        }
      });
      
  } catch (e) {
      toast(SOMETHING_WENT_WRONG);
  }
};

  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>     
      <Dialog fullWidth={true} maxWidth={"lg"} disableEnforceFocus={true} open={props.open} onClose={props.handleClose} aria-labelledby="imap-settings-form">
        <form className={classes.form} onSubmit={handleSubmit} noValidate autoComplete={"off"}>
          <DialogTitle id="customized-dialog-title" onClose={modal.type==="list" ? props.handleClose:handleClose}>
            {modal.title}
          </DialogTitle>
          
          <DialogContent>
            <Scrollbars  autoHide={true} style={{height:"60vh"}}>
            {modal.type==='list'?<List modal={modal} setIsEditingView={setIsEditingView} setModal={setModal} handleClose={handleClose} setOutboundList={setOutboundList} setFields={setFields} setErrors={setErrors}  />:
            <Inbound type={modal.type} outboundList={outboundList} modal={modal} setModal={setModal}  handleClose={handleClose} 
            editValues={editValues} setIsEditingView={setIsEditingView} setEditValues={setEditValues}  fields={fields}    setFields={setFields} setErrors={setErrors} errors={errors}/>}
            </Scrollbars>
          </DialogContent>
          <DialogActions>
            {modal.type!=='list'?<>
            <Button className={classes.btn} type="submit" variant="contained" size="small" color="primary">{loading?<><CircularProgress size={14} style={{ marginLeft: 10, color: "White" }} />{` `}{LBL_SAVE_INPROGRESS}</>:LBL_SAVE_BUTTON_TITLE}</Button>
            <Button className={classes.btn} variant="contained" size="small" onClick={handleClose} color="primary">{LBL_CLOSE_BUTTON_TITLE}</Button></>:""}
          </DialogActions>
        </form>
      </Dialog>
    </MuiThemeProvider>
  );
}
