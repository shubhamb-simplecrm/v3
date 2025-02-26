import { makeStyles } from "@material-ui/styles";
export default makeStyles((theme) => ({
  // Added to keep the notifications badge color white - 03/03/2023
  badgeColor: {
    backgroundColor: "red",
    color: "white",
  },
  iconBtn: {
    // Styling changes as per suggestions 24/02/2023
    "&:hover": {
      // On hover added same styling on navbar icons - 27/02/2023
      background: theme.palette.primary.main,
      color: "#FFFFFF",
    },
    height: "2rem",
    width: "2rem",
    // Added for theme toggle
    background: theme.palette.primary.main + "20",
    color: theme.palette.primary.main,
    borderRadius: "0.8rem",
    "& svg": {
      width: "0.8em",
      height: "0.8em",
    },
  },
  selectedIcon: {
    //Changes as per New mockup changes 27/02/2023
    background: theme.palette.primary.main,
    color: "#FFFFFF",
  },
  profileIcon: {
    "&:hover": {
      backgroundColor: "transparent",
    },
    backgroundColor: "transparent",
    marginTop: "0.5rem",
    height: "2.4rem",
    width: "2.4rem",
  },
  profileBtn: {
    display: "inline-table",
    alignItems: "center",
    marginLeft: "1rem",
    // Changes in Navbar styling 01/03/2023
    paddingBottom: "0.45rem",
    backgroundColor: "transparent",
    // Border added between profile icon and navbar icons
    borderLeft: "2px solid #DEDEDE",
    paddingLeft: "1rem",
  },
  grow: {
    flexGrow: 1,
  },
  profileMenuIconSize: {
    [theme.breakpoints.down("xs")]: {
      width: 45,
      height: 45,
    },
    "& svg": {
      margin: 0,
    },
    // width: 30,
    // height: 30
  },
}));
