import React,{useEffect,useState} from 'react';
import { TextField, Tooltip,Link } from "@material-ui/core";
import { pathOr } from 'ramda';
import { useSelector, useDispatch } from "react-redux";
import {FaIcon} from "../../../";
import useStyles from "./styles";
import { RowingTwoTone } from '@material-ui/icons';
export default function SuggestionName({initialValues, onChange}) {
    const classes = useStyles();
    
    const [nameTxt, setNameTxt] = useState(null);
  
    const displayString = ()=>{
        let account_name = pathOr(null,["account_name","value"],initialValues);
        let category = pathOr(null,["type"],initialValues);
        let subtype = pathOr(null,["subtype_c"],initialValues);
        let partner = pathOr(null,["partner_module_c","value"],initialValues);
        let type = pathOr(null,["opportunity_type"],initialValues);
        let dom=[];
        category = pathOr(null,["type",category],dom);
        type = pathOr(null,["opportunity_type"],initialValues);        ;
        subtype = pathOr(null,["subtype_c",subtype],dom);
        partner = pathOr(null,["partner_module_c","value"],initialValues);
        let arr = [type, account_name,category, subtype, partner];
        arr = arr.filter(n=>n);
        setNameTxt(arr.join(" - "));
    }       
    
    useEffect(()=>{
        displayString();
    },[initialValues]);

    return (
     
    nameTxt?   
    <Tooltip
      title={'Click to pick suggestion'}
      placement="top-start"
    >
      <Link className={classes.suggestionText} 
      onClick={
          ()=>onChange(nameTxt)}
          >
          {nameTxt}  <FaIcon className={classes.suggestionCopyBtn} icon={`fas fa-copy`} size="1x" /></Link>

    </Tooltip>:""
  );
}