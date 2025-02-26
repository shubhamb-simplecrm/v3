import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  chartBox: {
    minHeight: 280,
    [theme.breakpoints.down("xs")]: {
      minHeight: 300,
      textAlign: "center",
      width: 350,
    },
  },
  noData: {
    textAlign: "center",
    margin: "auto",
    width: "100%",
    marginTop: "60px",
    color: "rgba(0, 0, 0, 0.3)",
  },
}));
