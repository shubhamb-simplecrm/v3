import React,{useEffect, useState} from 'react';

import {Box,Typography,Grid,useTheme, Button} from '@material-ui/core';

import {EditViewMeta,defaultEmailSettings} from "../metdata";
import useStyles from "./styles";
import { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {pathOr,clone} from "ramda";
import FormInput from "../../../../FormInput";
import { testEmailSettings} from '../../../../../store/actions/emails.actions';
import { toast } from 'react-toastify';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector, useDispatch } from "react-redux";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ViewRows from '../../../../ViewRows';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TestEmailSettingsComp from '../TestEmailSettings';
import { LBL_FILL_REQUIRED_FIELDS, SOMETHING_WENT_WRONG } from '../../../../../constant';

export default function Inbound({editValues, setEditValues,type,modal,fields,errors,setFields,setErrors,outboundList}) {
  const classes = useStyles();
  const currentTheme = useTheme();

  const {currentUserData } = useSelector((state) => state.config);
  const currentUser = pathOr([], ["data", 'id'], currentUserData);

  const dispatch = useDispatch();

  const [ expanded, setExpanded ] = useState(true);
  const [testSettingPoup, setTestSettingPoup]= useState({open:false,data:''});
  
  const [loading, setLoading]=useState(false);
  
  const [viewData,setViewData]=useState(EditViewMeta[type].data);
  const [editData,setEditData]=useState(pathOr([],
    [ "rowData"],
    modal
  ));
  let [hiddenAll, setHiddenAll] = useState({hidden: [],disabled: []});
  const [openImapConfig, setOpenImapConfig] = useState(true);
  const { emailTestLoading } = useSelector((state) => state.emails);
  
    if(outboundList && type=='inbound'){
      let arr = {};
      outboundList.map((data)=>{
        arr[data.id] = data.name;
      });
      EditViewMeta[type].data[1].attributes[0][1].options=arr;
    }
  
  useEffect(
    () => {
  // console.log("rowData",editData)
      let initialState = [];
            let fieldState = [];
            Object.keys(viewData).map((row) => {
                setValues(viewData[row].attributes, initialState, fieldState);
                viewData[row].panels &&
                viewData[row].panels.map((panelRow) => {
                        setValues(panelRow.attributes, initialState, fieldState);
                    });
            });
            
            // console.log("initialState",initialState)
            if(editData){
              if(type==='outbound'){
                initialState['sugar_body_only']="true";
                initialState['to_pdf']="true";
                initialState['module']="Emails";
                initialState['action']="EmailUIAjax";
                initialState['emailUIAction']="saveOutbound";
                initialState['type']="user";
                initialState['mail_id']=editData['id'];

              }else if(type==='inbound'){
                initialState['email_password']=editData['email_password']?atob(editData['email_password']):"";
                initialState['sugar_body_only']="true";
                initialState['to_pdf']="true";
                initialState['module']="Emails";
                initialState['action']="EmailUIAjax";
                initialState['emailUIAction']="saveOutbound";
                initialState['type']="user";
                initialState['ie_id']=editData['id'] || '';
                initialState['name']=editData['ie_name'] || '';
                initialState['sentFolder']="";
                initialState['account_signature_id']="";
                initialState['auto_import_personal_email']="1";
                initialState['mailbox']="INBOX";
                initialState['trashFolder']=editData['trashFolder'] || "";
                initialState['sentFolder']=editData['sentFolder'] || ""; 
                initialState['searchField']="trash";
                initialState['mark_read']="1";
                initialState['group_id']="";
                initialState['searchField']="trash";
                // initialState['ie_status']="Active";
                initialState['ie_team']="";
                initialState['group_id']="";
                initialState['user']=currentUser;
              }
              else{
                initialState['id']=editData['id'] || '';
                initialState['name']=editData['name'] || '';
                initialState['signature']=editData['signature'] || '';
                initialState['signature_html']=editData['signature_html'] || '';
                initialState['default']=editData['default'] || false;
                
              }
            }
            editValues = initialState;
            // console.log(editValues);

            setEditValues({ ...editValues, ...initialState })
        
    }, [modal]
);

const setValues = (attributes, initialState, fieldState) => {
  attributes.map((rowField) => {
      rowField.map((field) => {

          // console.log("nameeee",field.name)
        if (field.name === 'ie_name' || field.name === 'mail_name') {
          return (
              field.name ? (initialState[field.name] = editData['name']?editData['name']:field.value ? field.value : ''):null,
              field.name ? (fields[field.name] = field) : null
          );

      } else if (field.name === 'server_url' && type!=='inbound') {
          return (
            field.name ? (initialState[field.name] = editData['mail_smtpserver']?editData['mail_smtpserver']:field.value ? field.value : ''):null,
            field.name ? (fields[field.name] = field) : null
        
          );
      } else if(field.name==='smtp_from_addr'){
        return (
          field.name ? (initialState[field.name] = editData['smtp_from_addr']?editData['smtp_from_addr']:field.value ? field.value : ''):null,
          field.name ? (fields[field.name] = field) : null
      
        );
      }else if(field.name==='reply_to_addr' && type==='inbound' && editData['id']){
        return (
          field.name ? (initialState[field.name] = editData['stored_options']['reply_to_addr']?editData['stored_options']['reply_to_addr']:field.value ? field.value : ''):null,
          field.name ? (fields[field.name] = field) : null
      
        );
      }else if(field.name==='outbound_email' && type==='inbound' && editData['id']){
        return (
          field.name ? (initialState[field.name] = editData['stored_options']['outbound_email']?editData['stored_options']['outbound_email']:field.value ? field.value : ''):null,
          field.name ? (fields[field.name] = field) : null
      
        );
      }else if(field.name==='is_status' && type==='inbound' && editData['id']){
        return (
          field.name ? (initialState[field.name] = editData['ie_status']==='Active'?true:field.value ? field.value : ''):false,
          field.name ? (fields[field.name] = field) : null  
      
        );
      }else
      {
              return (
                  field.name ? (initialState[field.name] = editData[field.name]?editData[field.name]:field.value ? field.value : '') : null
                  ,
              field.name ? (fields[field.name] = field) : null
              );
              }
      });
  });

};

  const handleChange = (panel) => (event, isExpanded) => {
		// setExpanded(isExpanded ? panel : false);
   // console.log(panel);
	};
  
  
  const testSettings = ()=>{
  
    if(type==='outbound'){
      let payload = clone(editValues);
      if(payload.mail_name && payload.mail_smtpserver && payload.mail_smtpport){
        payload.mail_smtppass = payload.mail_smtppass?btoa(editValues.mail_smtppass):"";
        setTestSettingPoup({open:true,data:payload});
      }else{
        toast(LBL_FILL_REQUIRED_FIELDS);
      }
    }

    else if(type==="signature"){
      setLoading(true);
      let payload = clone(editValues);
      if(payload.mail_name){
        payload.mail_name = payload.mail_name?btoa(payload.mail_name):"";
        dispatch(testEmailSettings('testinboundemail',payload)).then(function (res) {
          if(res.ok){
            //props.handleClose();
            toast(pathOr(SOMETHING_WENT_WRONG,["data","data","message"],res));
  
          // handleSave();
          }
        })
      }else{
        toast(LBL_FILL_REQUIRED_FIELDS);
      }
      }
      else{
        setLoading(true);
        let data = clone(editValues);
        let payload = {email_user:data.email_user,email_password:data.email_password,port:data.port,protocol:data.protocol,server_url:data.server_url,ssl:data.ssl,mailbox:data.mailbox};
        if(payload.email_password && payload.email_user && payload.protocol && payload.server_url && payload.port){
          payload.email_password = payload.email_password?btoa(payload.email_password):"";
          dispatch(testEmailSettings('testinboundemail',payload)).then(function (res) {
            if(res.ok){
              //props.handleClose();
              toast(pathOr(SOMETHING_WENT_WRONG,["data","data","message"],res));
    
            // handleSave();
            }
          })
        }else{
          toast(LBL_FILL_REQUIRED_FIELDS);
        }
        }
        
  }
  const onChange=(field,value)=>{
    if(field.name==='mail_smtpauth_req' && value==false){
      setHiddenAll({...hiddenAll,hidden:['mail_smtpuser','mail_smtppass']});
    } else if(field.type === "password") {
      hiddenAll["hidden"] = [];
      setHiddenAll(hiddenAll);
    } else{
      setHiddenAll({...hiddenAll,hidden:[]});
    }
    if(field.type === "password") {
      editValues[field.name] = value;
      setEditValues(editValues);
      return;
    } else {
      setEditValues({...editValues, [field.name]:value});   
    }
  }
  const preFill = (domain)=>{
    let config = defaultEmailSettings[domain][type];
    let data =clone(editValues);
    
    setEditValues({...data,...config});
  }

  useEffect(()=>{
    setEditValues(editValues);
  },[editValues]);

  const onBlur = (event) => {   
    // console.log("onBlur")
  }
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>     
    {viewData.map((panel, panelKey) => (
      
				<>
        
      <Accordion
					className={classes.accordionBox}
					onChange={handleChange(panelKey)}
					key={panelKey}
					defaultExpanded={expanded}
				>
          {/* {console.log("panel",panel)} */}
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls={'panel' + panelKey + 'bh-content'}
						id={'panel' + panelKey + 'bh-content'}
						className={classes.headerBackground}
					>
						<Typography className={classes.text} weight="light" variant="subtitle2">
							{panel.label.toUpperCase()}
						</Typography>
					</AccordionSummary>
          
					<AccordionDetails>
						<Grid container style={{display:type==='inbound' && panelKey==1?'block':'flex'}}>
              {panelKey===0 && type!=="signature" ?
              <Grid item>
                <Grid container direction="row" justify="space-between" alignItems="flex-start">
                  <Grid item className={classes.preFillBtn}>
                    <Button variant="outlined" size="small" onClick={()=>preFill('gmail')} color="primary">Gmail</Button>
                  </Grid>
                  <Grid item className={classes.preFillBtn}>
                    <Button variant="outlined" size="small" onClick={()=>preFill('yahoo')} color="primary">Yahoo</Button
                    >
                  </Grid>
                  <Grid item className={classes.preFillBtn}>
                    <Button variant="outlined" size="small" onClick={()=>preFill('exchange')} color="primary">Mircrosoft Exchange</Button>
                  </Grid>
                  <Grid item className={classes.preFillBtn}>
                    <Button variant="outlined" size="small" onClick={()=>preFill('other')} color="primary">Other</Button>
                  </Grid>
                </Grid>
              </Grid>:""}
              <Grid item>
                <ViewRows
                  data={panel}
                  initialValues={editValues}
                  errors={errors}
                  onChange={onChange}
                  recordId={""}
                  hiddenAll={hiddenAll}
                  // getDataLine={getDataLine}
                />
                
              </Grid>
               {panelKey===0 && type!=="signature"?
              <Grid item>
                <Button 
                  className={classes.btn} 
                  variant="contained" 
                  size="small" 
                  onClick={()=>testSettings()} 
                  color="primary" 
                  startIcon={emailTestLoading?
                    <CircularProgress size={14} style={{ marginLeft: 10, color: "White" }} />
                    :""}
                >
                    {emailTestLoading?"Connecting...":"Test Settings"}</Button>
                    
              </Grid>:""}
            </Grid>
					</AccordionDetails>

         { type === 'signature' &&<>  

         <FormInput
          height={window.innerWidth < 767 ?"35vh":"40vh"}
          field={{type:"bool",name:"default", label:"Default:"}}
          // initialValues={initialValues}
          value={editValues.default}
          onChange={(val) => {
            onChange({type:"bool",name:"default",value:editValues.default?editValues.default:''},val)
            // handleChange("description",val)
          }}
          onBlur={onBlur}
          module={"Emails"}
        />
        <FormInput   
          height={window.innerWidth < 767 ?"35vh":"40vh"}
          field={
          {type:"wysiwyg",name:"signature_html",value:"", label:"Default:"}}
          // initialValues={initialValues}
          value={editValues.signature_html?editValues.signature_html:''}
          onChange={(val) => {
  
            onChange({type:"wysiwyg",name:"signature_html",value:editValues.signature_html?editValues.signature_html:''},val)     
            
            // handleChange("description",val)
          }}
          toolbar={{options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'history'],inline: { inDropdown: true },list: { inDropdown: true },textAlign: { inDropdown: true },link: { inDropdown: true },}}
          // toolbarCustomButtons={[]}
          module={"Emails"}
          onBlur={onBlur}
        /></>}
        
				</Accordion>
        <TestEmailSettingsComp open={testSettingPoup.open} testSettingPoup={testSettingPoup} setTestSettingPoup={setTestSettingPoup} />
        
        </>))
    }
      
    </MuiThemeProvider>
  );
}