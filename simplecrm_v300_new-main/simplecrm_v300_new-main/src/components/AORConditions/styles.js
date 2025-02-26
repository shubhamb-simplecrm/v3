import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
   container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  fieldSpacing:{
    padding:'5px'
  },
  errorColor: {
    color:'red'
  },
   formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  buttonMobileLayout : {
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    },
  },
  text: {
    [theme.breakpoints.down("xs")]: {
      margin: "10px 7px"
    },   
  },
  updateMobileLayout : {
    [theme.breakpoints.down("xs")]: {
      padding: "0px !important",
    }, 
  }


}));
