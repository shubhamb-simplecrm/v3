import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2, 0.5),
    },
  },
  paperEdit: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    // paddingTop: theme.spacing(1.5),
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  headerBackground: {
    background: "rgba(0, 0, 0, 0.03)",
  },

  buttonGroupRoot: {
    display: "flex",
    justifyContent: "end",
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  fieldSpacing: {
    paddingTop: 5,
    paddingBottom: 5,
    [theme.breakpoints.up("xs")]: {
      // overflow: "scroll",
      paddingLeft: 5,
      paddingRight: 5,
    },
  },
  accordion: {
    paddingBottom: "5px",
  },
}));
