import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingBottom:10
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',

  },
  paperEdit: {
    padding: theme.spacing(2),
    margin: 'auto',
    paddingTop: 0,
    paddingBottom:theme.spacing(4)
    // marginTop: theme.spacing(1),
  },
  margin: {
    marginLeft: theme.spacing(1),
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
  errorColor: {
    color: 'red'
  }

}));
