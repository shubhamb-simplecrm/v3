import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  text: {
    resize: "none",
    height: "45px",
    fontSize: "0.9rem",
  },
  Inputwidth: {
    maxWidth: "32ch",
    // [theme.breakpoints.down("sm")]: {
    //     maxWidth: "22ch",
    // },
    [theme.breakpoints.down("xs")]: {
        maxWidth: "22ch",
    },
  },
}));
