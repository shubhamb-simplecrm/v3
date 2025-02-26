
import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({

    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
    link: {
        textDecoration: "none",
        color: theme.palette.primary.main,
        fontSize: '0.875rem'
    },
    linkDate: {
        textDecoration: "none",
        // color: theme.palette.primary.main,
        fontSize:'14px',
        fontWeight:'600'
    },
    linkName: {
        textDecoration: "none",
        fontSize: '0.875rem',
        color: theme.palette.text.secondary,
    },
    subLink: {
        textDecoration: "none",
        color: theme.palette.primary.main,
        fontSize: '0.751rem'
    },
    editButton: {
        float: 'right'
    },
    statusBg: {
        borderRadius: '2px',
        textTransform: 'uppercase',
        fontSize: '10px',
        fontWeight: '600',
        letterSpacing: '1px',
        paddingRight: '4px',
        paddingLeft: '4px',
        width: "-webkit-fill-available"
    },
    
    InfiniteScroll: {

        scrollBehaviour: 'smooth',
        overflow: 'auto'

    },
    plannedActivity:{
        borderRight: '7px solid ' + theme.palette.success.main,
    },
    todaysActivity: {
        borderRight: '7px solid ' + theme.palette.primary.main
    },
    pastActivity: {
        borderRight: '7px solid ' + theme.palette.warning.main
    },
    futureActivities: {
        borderRight: '7px solid ' + theme.palette.primary.main
    },
    todaysOpenActivity:{
        borderRight: '7px solid ' + theme.palette.warning.main,
        background:theme.palette.warning.main +'30'
    },
    daangerActivity: {
        borderRight: '7px solid ' + theme.palette.error.dark
    },
    completedActivity:{
        borderRight: '7px solid ' + theme.palette.success.main,
    },
    contentHeight:{
        height: "77vh !important", 
        [theme.breakpoints.down("sm")]: {
            height: "88vh !important",
        },
    }

}));


export const getMuiTheme = (selectedTheme) => {
    return createMuiTheme({
        ...selectedTheme,
        overrides: {
            MuiTimeline: {
                root: {
                    padding: '2px'
                }
            },
            MuiPaper: {
                root: {
                    minHeight: '70px',
                    padding: '6px',
                    boxShadow: '0px 2px 2px -2px rgb(0 0 0 / 20%), 0px 1px 2px 0px rgb(0 0 0 / 14%), 0px 1px 4px 0px rgb(0 0 0 / 12%) !important'
                },
                // elevation:{
                //     boxShadow:'0px 2px 2px -2px rgb(0 0 0 / 20%), 0px 1px 2px 0px rgb(0 0 0 / 14%), 0px 1px 4px 0px rgb(0 0 0 / 12%) !important'
                // }
            },
            MuiTimelineContent: {
                root: {
                    padding: '6px 6px',
                },
            },
            MuiTimelineItem: {
                missingOppositeContent:
                {
                    '&:before': {
                        content: '""',
                        flex: 'unset',
                        padding: '0px',
                    }
                }
            },
            MuiTimelineOppositeContent: {
                root: {
                    textAlign: 'left',
                    padding: '6px 1px'
                }
            },
            MuiTimelineDot: {
                root: {
                    color: 'white !important'
                },
            },
        },

    })
}