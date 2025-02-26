import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  adjust: {
    height: "72vh !important",
    [theme.breakpoints.down("sm")]: {
      height: "83vh !important",
    },
  },
  timeline: { padding:"7px 7px 30px 7px", margin:"0px"},
  noRecords: { textAlign: "center", fontSize: "bold" },
}));
