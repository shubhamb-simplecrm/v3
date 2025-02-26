import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  dialogBox: {
    borderTop: theme.palette.primary.main + ' solid 3px',
  },
  loadingCircular: {
    margin: 'auto',
    textAlign: 'center',

  },

}));