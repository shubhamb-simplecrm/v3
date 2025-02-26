import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  headerBackground: {
    background: "rgba(0, 0, 0, 0.03)",
  
  },
  accordionBox: {
    border: "none",
  },
  mobileLayoutAccoDetails : {
    [theme.breakpoints.down('xs')] : {
      padding: "8px 0px 16px"
    }
  }
  
}));
