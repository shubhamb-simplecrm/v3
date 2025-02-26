import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
  },

  card: {
    width: "30vw",
    minWidth: "350px",
    minHeight: "30vh",
    margin: "auto",
    border: "rgb(204 204 204 / 50%) solid thin",
    background: "rgb(255 255 255 / 50%)",
  },

  formWrapper: {
    width: "70%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    padding: "20px 0",
  },
  loginFormWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 10,
  },
  formField: {
    width: "100%",
    margin: "15px 0",
  },

  textFieldUnderline: {
    "&:before": {
      borderBottomColor: theme.palette.primary.light,
    },
    "&:after": {
      borderBottomColor: theme.palette.primary.main,
    },
    "&:hover:before": {
      borderBottomColor: `${theme.palette.primary.light} !important`,
    },
  },
  textField: {
    borderBottomColor: theme.palette.background.light,
  },
  formButtons: {
    width: "100%",
    marginTop: theme.spacing(4),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  creatingButtonContainer: {
    marginTop: theme.spacing(2.5),
    height: 46,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  spinnerContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "10px 0",
  },
  forgetPasswordLink: {
    marginLeft: "auto",
    pointerEvents: "initial",
    cursor: "pointer",
  },
}));
