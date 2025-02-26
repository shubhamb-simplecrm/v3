import { makeStyles } from "@material-ui/styles";
import {colors} from '@material-ui/core';
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    root: {
        cursor: 'pointer',
        fontSize:"0.875rem",
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
          backgroundColor: theme.palette.background.default,
        },
        padding:3,
        // [theme.breakpoints.up('md')]: {
        //   padding:0
        // },
        // [theme.breakpoints.up('sm')]: {
        //   padding:0
        // },
        // [theme.breakpoints.up('xs')]: {
        //   padding:10
        // }
      },
      new: {
        position: 'relative',
        '&:before': {
          content: '" "',
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          width: 4,
          backgroundColor: theme.palette.background.paper,
        },
        '& $name, & $subject': {
          fontWeight: theme.typography.fontWeightBold
        }
      },
      selected: {
        backgroundColor: theme.palette.background.default,
      },
      checkbox: {
        marginRight: theme.spacing(1),
        [theme.breakpoints.down('sm')]: {
          display: 'none'
        }
      },
      favoriteButton: {    
        [theme.breakpoints.down('sm')]: {
          display: 'none'
        }
      },
      starIcon: {
        cursor: 'pointer'
      },
      starFilledIcon: {
        color: colors.amber[400]
      },
      details: {
        minWidth: 1,
        display: 'flex',
        flexGrow: 1
      },
      avatar: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        width:30,
        height:30
      },
      name: {
        whiteSpace: 'nowrap',
        [theme.breakpoints.up('md')]: {
          minWidth: 180,
          flexBasis: 180
        },
        fontSize:"0.875rem",
        overflow: "hidden",
        textOverflow: "ellipsis"
      },
      content: {
        minWidth: 1,
        fontSize:"0.875rem",
        [theme.breakpoints.up('md')]: {
          display: 'flex',
          alignItems: 'center',
          flexGrow: 1
        }
      },
      subject: {
        width: "100%",
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize:"0.875rem",
        paddingLeft:10
      },
      separator: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
          display: 'none'
        }
      },
      message: {
        maxWidth: 800,
        flexGrow: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        marginRight: 'auto',
        [theme.breakpoints.down('sm')]: {
          display: 'none'
        },
        fontSize:"0.875rem"
      },
      labels: {
        display: 'flex',
        marginRight: theme.spacing(2),
        '& > * + *': {
          marginLeft: theme.spacing(1)
        },
        [theme.breakpoints.down('sm')]: {
          display: 'none'
        },
        fontSize:"0.875rem"
      },
      date: {
        whiteSpace: 'nowrap',
        fontSize:"0.875rem",
        paddingRight:5
      }  
}));

export const getMuiTheme = (theme) =>{
  return createMuiTheme({
    ...theme,
    overrides: {
        
        
    },
  })};