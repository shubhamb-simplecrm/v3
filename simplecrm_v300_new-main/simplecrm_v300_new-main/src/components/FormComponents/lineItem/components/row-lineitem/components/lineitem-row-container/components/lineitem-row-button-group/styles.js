import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles((theme) => ({
  mobileLayoutFullWidth: {
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  marginBottom: {
    [theme.breakpoints.down("xs")]: {
      marginBottom: 10,
    },
  },
}));
