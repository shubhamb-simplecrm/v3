import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  spinner: {
    marginLeft: 15,
    position: "relative",
    top: 4,
  },
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    fontSize: "0.875rem",
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      display: "block",
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.overlayBg.background,
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.overlayBg.background,
    zIndex: 2,
    cursor: "pointer",
  },
  statusBg: {
    borderRadius: "2px",
    textTransform: "uppercase",
    fontSize: "10px",
    fontWeight: "600",
    letterSpacing: "1px",
    paddingRight: "12px",
    paddingLeft: "12px",
    paddingLeft: "12px",
    [theme.breakpoints.down("md")]: {
      width: "-webkit-fill-available",
    },
  },
  text: {
    padding: "0px 10px",
  },
  grid: {
    background: theme.palette.background.dashletBg,
    minHeight: "79vh",
    [theme.breakpoints.down("sm")]: {
      minHeight: "84vh",
    },
  },
  NameCell: {
    [theme.breakpoints.down("sm")]: {
      display: "block !important",
      position: "absolute",
      borderBottom: "none",
      top: "0.45vh",
      zIndex: "999",
      width: "87% !important",
      padding: "2px 10px",
      "& > div": {
        width: "100%",
        textOverflow: "ellipsis",
        // overflow: "hidden",
        whiteSpace: "nowrap",
        padding: "0px 4px",
      },
      "& > div:nth-of-type(1)": {
        display: "none !important",
      },
    },
  },
  emptyDashboardStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
  },
  emptyDashboardImageStyle: {
    margin: "auto",
    display: "block",
    maxWidth: "100px",
    maxHeight: "100px",
  },
  buttonGroupRoot: {
    display: "flex",
    justifyContent: "end",
    gap: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  dataTableStyle: {
    boxShadow: "none",
  },
  errorMessage :{
    display:"flex",
    justifyContent:"center"
  }
}));
