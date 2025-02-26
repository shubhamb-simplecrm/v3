import { Accordion, AccordionDetails, AccordionSummary, Button, Tooltip, MuiThemeProvider, Typography, useTheme, Backdrop } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import useStyles, {getMuiTheme} from "./styles";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { LBL_RESOLUTION_ADDED } from '../../../constant';


export default function Suggestion({ field, onChange, errors = {}, variant = "outlined", value, small = false,disabled=false, initialValues }) {
    const classes = useStyles();
    const expanded=false;
    const { suggestionError } = useSelector((state) => state.modules);
    if(suggestionError) {
        toast(suggestionError)
    }
    let [data, setData] = useState(null);
    let [open, setOpen] = useState(true);
    const currentTheme = useTheme();
    const HandleOnChange = (data) => {
        onChange(data.additional_info || "");
        toast(LBL_RESOLUTION_ADDED)
    }
    useEffect(() => {
        setData(initialValues.suggestion_box);
        setOpen(true);
       
    }, [initialValues])

    const HandleAccordionChange = () => {
        setOpen(!open);
    }

    return (
        <>
               <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
                <Accordion
					className={classes.accordionBox}
					defaultExpanded={expanded}
                    expanded={open}
                    onChange={() => HandleAccordionChange()}                    
				>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						className={classes.headerBackground}
					>
						<Typography className={classes.text} weight="light" variant="subtitle2">
							Suggestions
						</Typography>
					</AccordionSummary>
                    { data &&
					<AccordionDetails>
                        <table className={classes.tableBorder}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody> 
                                {data && Array.isArray(data) && data.map((item,key) => {
                                return (    
                                        <tr class="kb_article" key={key}>
                                            <Tooltip
                                                title={item.attributes.additional_info || ''}
                                                disableHoverListener={item.attributes.additional_info ? false : true}
                                                placement="left"
                                                disableFocusListener={item.attributes.additional_info ? false : true}
                                                disableTouchListener={item.attributes.additional_info ? false : true}
                                            >
                                                <td>{item.attributes.name}</td>
                                            </Tooltip>    
                                        <td>
                                            <Button 
                                            variant="contained"
                                            size="small"
                                            color="primary"
                                            onClick={() => HandleOnChange(item.attributes)}>
                                                Add Resolution
                                            </Button>
                                        </td>
                                        </tr>
                                    )
                                })}
                
                            </tbody>
                        </table>						
					</AccordionDetails>
                    }
				</Accordion>
              </MuiThemeProvider>
            
        </>
      );
}
