import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  speedDial: {
    position: "fixed",
    bottom: theme.spacing(1),
    right: "0.8rem",
    //CSS added for QuickCreate button in navbar in mobile view updated - 03/03/2023
    // marginRight: "-5.8rem",
    // display: "flex",
    // flexDirection: "row-reverse",
    // Removed, SpeedDial only rendering in mobileView 06/03/2023
    // [theme.breakpoints.down("xs")]: {
    //   flexDirection: 'column',
    //   marginRight: "0 !important",
    //   marginLeft: "3rem !important"
    // },
    // ".MuiButtonBase-root": {
    //   width: "40px",
    //   height: "40px",
    //   [theme.breakpoints.down("xs")]: {
    //     width: 45,
    //     height: 45,
    //   },
    // },
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      marginRight: "0 !important",
      bottom: theme.spacing(2),
      right: theme.spacing(1),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(0),
      left: theme.spacing(0),
    },
  },
  speedDialAction: {
    // Quick create button styling changes - 03/03/2023
    margin: "0.225rem 1.5rem 0.225rem 0.1rem !important",
    color: "#6E6E6E !important",
    background: "#6E6E6E20 !important",
    minHeight: "1rem",
    height: "2rem",
    width: "2rem",
    borderRadius: "0.8rem",
    justifyContent: "center",
    display: "inline-table",
    alignItems: "center",
    // Removed smaller screen footer as per discussion 06/03/2023
    // [theme.breakpoints.down("xs")]: {
    //   margin: "0.2rem 1.5rem 0.2rem 0rem !important",
    //   "& svg": {
    //     width: "1.8em !important",
    //     height: "1.8em !important"
    //   },
    // },
    "& svg": {
      width: "1em !important",
      height: "1em !important",
    },
    "&:hover": {
      // On hover added same styling on navbar icons - 03/03/2023
      background: theme.palette.primary.main + "!important",
      color: "#FFFFFF !important",
    },
  },
  fab: {
    // Changes in icon styling as it is moving inside footer component, Added trigger speed dial icom
    // backgroundColor: theme.rightBarButtons.background + " !important",
    // color: theme.rightBarButtons.text,
    // border: "1px solid " + theme.rightBarButtons.text,
    display: "block",
    boxShadow: "none",
  },
  root: {
    // height: "20px",
  },
  // Added class for white background of quickCreateButton in mobileView 06/03/2023
  whiteBack: {
    backgroundColor: theme.palette.background.paper,
  },
  // Mobile view right side icons same as Navbar 06/03/2023
  iconColor: {
    color: theme.palette.primary.main,
    background: theme.palette.primary.main + 10,
  },
  // To make footer icons like navbar
  profileBtn: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    marginRight: "0.2rem",
    justifyContent: "right",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center !important",
      margin: "0.2rem 1.5rem 0.2rem 0rem !important",
    },
  },
  iconBtn: {
    margin: ".2rem 0 0 1.5rem",
    color: "#6E6E6E !important",
    background: "#6E6E6E20 ",
    "&:hover": {
      color: "#FFF !important",
    },
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      // MuiFab: {
      //   root: {
      //     height: '10px',

      //   }
      // },
      MuiSpeedDialIcon: {
        // root: {
        //   color: theme.rightBarButtons.text,
        // },
      },
      MuiFab: {
        root: {
          width: "40px",
          height: "40px",
          boxShadow: "none",
          // Added to match quickCreate toggle button styling with rest of icons 06/03/2023
          backgroundColor: `${theme.palette.primary.main + 10} !important`,
          color: `${theme.palette.primary.main} !important`,
          [theme.breakpoints.down("xs")]: {
            width: 45,
            height: 45,
          },
        },
      },
    },
  });
};
