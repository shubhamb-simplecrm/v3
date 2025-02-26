import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  betweenSeparator: {
    display: "flex",
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
}));
