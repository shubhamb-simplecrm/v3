import { makeStyles } from "@material-ui/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";

export default makeStyles(theme => ({
  logoBox: {
    // Changes for logo in footer
    // float: 'right',
    margin: '10px 5px 1px 5px',
   // backgroundColor:"#fff",
    whiteSpace: "nowrap",
    // [theme.breakpoints.down("xs")]: {
    //   display: "none",
    // },
  },
  logoBoxDrawer: {
    display: "flex",
    justifyContent: "center",
    margin: '20px 5px 1px 5px',
    whiteSpace: "nowrap",
    // [theme.breakpoints.down("xs")]: {
    //   display: "none",
    // },
  },
  logotype: {
    color: theme.palette.primary.main,
    // marginRight: theme.spacing(1),
    fontWeight: 'bold',
    fontSize: 14,

  },
  footerLogo: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  imageLogo: {    
    objectFit: "contain", 
    width: "8rem", 
    marginTop: "0.2rem"
  },
  version: {
    fontSize: 10,
    textAlign: 'right',
    float: 'right',
    marginTop: '-3px'
  },
  // Footer adjustment - 03/03/2023
  cstmLogo:{ 
    objectFit: "contain",
    width: "8rem",
    marginTop: "0.4rem" 
  }
}));
