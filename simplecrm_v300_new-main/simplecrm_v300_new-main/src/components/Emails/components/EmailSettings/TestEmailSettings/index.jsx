import React,{useEffect, useState} from 'react';
import {TextField,IconButton,Typography ,useTheme, Button,Dialog,DialogActions as MuiDialogActions ,DialogContent as MuiDialogContent ,DialogContentText,DialogTitle as MuiDialogTitle } from '@material-ui/core';
import useStyles from "./styles";
import { getMuiTheme } from "./styles";
import { MuiThemeProvider,withStyles } from "@material-ui/core/styles";
import {pathOr,clone} from "ramda";
import CloseIcon from '@material-ui/icons/Close';
import { toast } from 'react-toastify';
import { testEmailSettings } from '../../../../../store/actions/emails.actions';
import { useSelector, useDispatch } from "react-redux";
import CircularProgress from '@material-ui/core/CircularProgress';
import {isValidEmail} from "../../../../../common/validations";
import Alert from '@material-ui/lab/Alert';
import { LBL_EMAIL_SEND_SUCCESS, SOMETHING_WENT_WRONG } from '../../../../../constant';

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
export default function TestEmailSettingsComp(props) {
  const classes = useStyles();
  //console.log("TestEmailSettingsComp props",props);
  const currentTheme = useTheme();
  const [validForm, setValidForm]=useState(false);
  const [editValues, setEditValues]=useState({});
  const [loading, setLoading]=useState(false);
  const [successMsg, setSuccessMsg]=useState("");
  const { currentUserData } = useSelector((state) => state.config);
  const [testEmail, setTestEmail] = useState(pathOr("",["data","attributes","email1"], currentUserData));
  
  const dispatch = useDispatch();

  const { emailTestLoading, emailTestError, emailTestTabData,emailTestSubmitLoader } = useSelector((state) => state.emails);
  
  
  const sendTestEmail = () =>{
    let payload = clone(props.testSettingPoup.data);
    
    let addArr = {
            mail_id: "",
            type: "",
            mail_sendtype: "",
            sugar_body_only: "true",
            to_pdf: "true",
            module: "Emails",
            action: "EmailUIAjax",
            emailUIAction: "testOutbound",
            outboundtest_from_address: testEmail};
    payload = {...payload ,...addArr};
   // console.log("sendTestEmail",payload);
    dispatch(testEmailSettings('testoutboundemail',payload)).then(function (res) {
      if(res.ok){
        let status = pathOr("",["data","data","status"],res);
        if(status==true)
        {
          toast(LBL_EMAIL_SEND_SUCCESS);
          
          setSuccessMsg(<Alert severity="success">An email was sent to the specified email address using the provided outgoing mail settings. Please check to see if the email was received to verify the settings are correct.</Alert>);
        }else{
          toast(pathOr(SOMETHING_WENT_WRONG,["data","data","errorMessage"],res));
          setSuccessMsg(<Alert severity="error">{pathOr(SOMETHING_WENT_WRONG,["data","data","errorMessage"],res)}</Alert>);
        }
        
      }
     // console.log("res",res);
    });
  }  
  const handleClose = () => {
    props.setTestSettingPoup({open:false});
  };
  let success = pathOr("",["Emails","data","status"],emailTestTabData);
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>     
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={props.open}
        onClose={handleClose}
        aria-labelledby="imap-settings-form"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Send Test Email
        </DialogTitle>
        
        <DialogContent>
          {emailTestLoading?<p>One moment please...</p>:""}
          {(!emailTestLoading || !success)?
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            name="testEmail"
            value={testEmail}
            onChange={(e)=>{setTestEmail(e.target.value); setSuccessMsg("")}}
          />:""}
          {(successMsg)?successMsg:""}

          
        </DialogContent>
        <DialogActions>
          <Button disabled={!testEmail || (testEmail && !isValidEmail(testEmail))} className={classes.btn} onClick={()=>sendTestEmail()} variant="contained" size="small" color="primary" startIcon={emailTestLoading?<CircularProgress size={14} style={{ marginLeft: 10, color: "White" }} />:""}>{emailTestLoading?"Sending...":"Send Test Email"}</Button>
          <Button className={classes.btn} variant="contained" size="small" onClick={handleClose} color="primary">Cancel</Button>
        </DialogActions>
        
      </Dialog>
    </MuiThemeProvider>
  );
}
