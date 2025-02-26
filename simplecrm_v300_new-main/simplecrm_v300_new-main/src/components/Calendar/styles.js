import { makeStyles } from "@material-ui/styles";
import {  colors} from '@material-ui/core';
import { createMuiTheme } from "@material-ui/core/styles";


export default makeStyles(theme => ({
  root: {
    height: '100%',
    padding: '10px',
    '& .fc-slats tr':{
      height:"3.5em"
    },
    '& .fc-unthemed td.fc-today':{
      backgroundColor:theme.palette.warning.main,
    },
    '& .fc-list-heading td':{
      backgroundColor: theme.palette.type==='dark'?theme.palette.primary.main:colors.grey[50]
    },
    '& .fc-unthemed td': {
      borderColor: theme.palette.divider
    },
    '& .fc-widget-header': {
      backgroundColor: theme.palette.type==='dark'?theme.palette.primary.main:colors.grey[50]
    },
    '& .fc-axis': {
      ...theme.typography.body2
    },
    '& .fc-list-item-time': {
      ...theme.typography.body2
    },
    '& .fc-list-item-title': {
      ...theme.typography.body1
    },
    '& .fc-list-heading-main': {
      ...theme.typography.h6,
      fontSize:"1rem"
    },
    '& .fc-list-heading-alt': {
      ...theme.typography.h6,
      fontSize:"1rem"
    },
    '& .fc th': {
      borderColor: theme.palette.divider
    },
    '& .fc-day-header': {
      ...theme.typography.subtitle2,
      fontWeight: 500,
      color: theme.palette.text.primary,
      padding: theme.spacing(1),
      backgroundColor: theme.palette.type==='dark'?theme.palette.primary.main:colors.grey[50]
    },
    '& .fc-day-top': {
      ...theme.typography.body2
    },
    '& .fc-highlight': {
      backgroundColor: colors.blueGrey[50]
    },
    '& .fc-event': {
      backgroundColor: theme.palette.primary.main,
      //color: theme.palette.primary.contrastText,
      color: "#FFFFFF",
      borderWidth: 2,
      opacity: 0.9,
      '& .fc-time': {
        ...theme.typography.h6,
        color: 'inherit'
      },
      '& .fc-title': {
        ...theme.typography.body1,
        color: 'inherit'
      }
    },
    '& .fc-list-empty': {
      ...theme.typography.subtitle1
    },
    '& .fc th, & .fc td': {
      [theme.breakpoints.down("xs")] : {
        fontSize: "11px",
      }
    },
  },
  card: {
    marginTop: theme.spacing(3),
    [theme.breakpoints.down("xs")] : {
      overflow: "scroll",
      marginTop:0
    }
  },
  cardContent: {
    [theme.breakpoints.down("xs")] : {
      //width: "700px",
      width: "100%",
      padding:0
    }
  },
  breakText:{
    wordBreak:'break-word'
  }

}))

export const getMuiTheme = (selectedTheme) => {
    return createMuiTheme({
      ...selectedTheme,
      overrides: {
        MuiCardContent:{
          root:{
            // padding: selectedTheme.palette.primary.main + ' solid 3px',
            },
        },
        MuiPaper:{
          elevation1:{
            // eslint-disable-next-line no-useless-computed-key
            ["@media (max-width:959.95px)"]: {
            boxShadow:'none',
            borderRadius:0
          }
        }
      }
       
   
      },
  
    })
  }


  