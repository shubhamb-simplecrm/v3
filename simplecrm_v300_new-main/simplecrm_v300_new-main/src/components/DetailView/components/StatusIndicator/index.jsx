import React from "react";
import {Stepper,StepButton,StepLabel,useTheme,Tooltip} from '@material-ui/core';
import useStyles,{getMuiTheme} from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
function StatusIndicator(props) {
    const {statusBarData} = props;
    const theme = useTheme();
    const classes = useStyles();
    return (
        <MuiThemeProvider theme={getMuiTheme(theme)}>
        <Stepper orientation={'horizontal'} sx={{m:0,minWidth: 300}}>
            {statusBarData.options.map((label, index) => {
                if(label){
                    let current = classes.stepsGreen;
                    switch(label.color){
                        case 'green':
                            current = classes.stepsGreen;                            
                            break;
                        case 'blue':
                            current = classes.stepsBlue;
                            break;
                        case 'red':
                            current = classes.stepsRed;
                            break;
                        default:
                            current=classes.stepsNone;
                            break;
                    }
                    return(
                    <StepButton key={`step-${index}`} className={`${classes.steps} ${current}`} active={statusBarData.value === label.value ? true : false}
                       >
                           <Tooltip title={label.value}>
                        <StepLabel key={`label-${index}`} className={classes.step} icon={false}>{label.value}</StepLabel>
                        </Tooltip>
                    </StepButton >)
                }
                })
            }
        </Stepper>
    </MuiThemeProvider>);
}

export default StatusIndicator;