import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => {
    return ({
        paper: {
            width: "100%",
            //backgroundColor: theme.palette.background.default,
            //borderRadius: "3px",
            //maxHeight: "80%",
            // overflowY: "scroll",
            // boxShadow: theme.shadows[5],
            padding: theme.spacing(0, 2, 2, 2),
            outline: 0,
            // [theme.breakpoints.up('md')]: {
            //     margin: `7% auto`,
            //     width: "70%",
            // },
            // [theme.breakpoints.up('md')]: {
            //     margin: `7% auto`,
            //     width: "60%",
            // },
        },
        headerBackground: {
            background: "rgba(0, 0, 0, 0.03)",
            minHeight:"20px !important"
        },
        accordionBox: {
            border: "none",
        },
        basicSearchActionBtn: {
            color: '#ffffff'
        },
        fieldsGrid: {
            // marginTop: theme.spacing(2),
        },
        buttonsWrapper: {
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            marginTop: theme.spacing(2),
        },
        titleHeadWrapper: {
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0px 0px 8px"
        }
    })
});

export const getMuiTheme = (selectedTheme) => {
    return createMuiTheme({
        ...selectedTheme,
        overrides: {
            MuiAccordionSummary:{
                root:{
                    minHeight:20,
                    Mui:{
                        expanded:{
                            minHeight:20,
                            margin:"0 !important"
                        }
                    }
                },
                content:{
                    margin:"0 !important",
                    minHeight:20,                   
                }
            },
            Mui:{
                expanded:{
                    minHeight:20,
                    margin:"0 !important"
                }
            },
            MuiPaper:{
                elevation1:{
                    boxShadow:'none'
                }
            }
        },
    })
}
