import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => {
  return {
    root: {
      flexGrow: 1,
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
    paper: {
      // padding: theme.spacing(2),
      margin: "auto",
    },
    paperEdit: {
      padding: theme.spacing(2),
      margin: "auto",
      marginTop: theme.spacing(1),
    },
    margin: {
      marginLeft: theme.spacing(1),
    },
    marginTop: {
      marginTop: theme.spacing(1),
    },
    errorColor: {
      color: "red",
    },
    tabButton: {
      //background: theme.palette.divider,
      //borderRadius: "4px",
      //margin: "5px",
      color: theme.palette.text.primary,
      // fontWeight: "bold"
    },
    cstmAction: {
      marginTop: "5px !important",
      marginRight: "-3px !important",
    },
    cstmEditbtn: {
      minWidth: "40px !important",
      margin: "1px",
      padding: "5px 10px",
    },
    tabName: {
      whiteSpace: `nowrap`,
      overflow: `hidden`,
      textOverflow: `ellipsis`,
      fontWeight: "normal",
    },

    breadCrumbWrapper: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
    },
    editBtnDet: {
      padding: "4px 20px",
    },
    headerCstm: {
      marginLeft: "0px",
    },
    breadCrumbItem: {
      fontWeight: "normal",
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
    favCustom: {
      display: "flex",
    },
    isNone: {
      display: "none",
    },
    favBtn: {
      padding: 0,
      marginRight: "0.5rem",
      background: theme.palette.primary.main + "20",
      color: theme.palette.primary.main,
      "&:hover": {
        background: theme.palette.primary.main + "20",
        color: theme.palette.primary.main,
        // color: "#FFFFFF"
      },
    },
    speedDial: {
      position: "fixed",
      "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
        bottom: theme.spacing(2),
        right: theme.spacing(8),
        [theme.breakpoints.down("xs")]: {
          right: theme.spacing(6),
        },
      },
      "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
        top: theme.spacing(3),
        left: theme.spacing(3),
      },
    },
    steps: {
      fontSize: "14px",
      textAlign: "center",
      color: "#d9e3f7",
      margin: "5px 3px",
      padding: "5px 5px 5px 15px",
      minWidth: "135px",
      float: "left",
      position: "relative",
      backgroundColor: "#d9e3f7",
      "&:first-child::before": {
        border: "none",
      },
      "&::before": {
        content: `''`,
        position: "absolute",
        top: "0",
        // right: "-16px",
        width: "0",
        height: "0",
        borderTop: "18px solid transparent",
        borderBottom: "13px solid transparent",
        // zIndex: "1",
        transition: "border-color 0.2s ease",
        right: "auto",
        left: "0",
        borderLeft: "17px solid #fff",
        zIndex: "0",
      },
      "&::after": {
        content: `''`,
        position: "absolute",
        top: "0",
        right: "-16px",
        width: "0",
        height: "0",
        borderTop: "18px solid transparent",
        borderBottom: "13px solid transparent",
        borderLeft: "17px solid",
        borderLeftColor: "inherit",
        zIndex: "1",
        transition: "border-color 0.2s ease",
      },
    },
    countChip: {
      background: "#0071d220",
      color: "#0071d2",
      marginLeft: "2px",
    },
    detailViewGrid: {
      backgroundColor: theme.palette.background.paper,
      border: "4px solid rgba(0, 0, 0, 0.03)",
      borderRight:"2.5px solid rgba(0, 0, 0, 0.03)",
      height: "calc(100% - 0vh)",
      flexGrow: 1,
    },
    sidePanelGrid: {
      backgroundColor: theme.palette.background.paper,
      padding: "3px",
      border: "4px solid rgba(0, 0, 0, 0.03)",
      borderLeft:"2.5px solid rgba(0, 0, 0, 0.03)",
      height: "calc(100% - 0vh)",
      overflow:"hidden",
      flexGrow: 1,
    },
    sidePanelGridMobile: {
      backgroundColor: theme.palette.background.paper,
      padding: "0px",
      display:"none",
      border: "4px solid rgba(0, 0, 0, 0.03)",
      borderLeft:"2.5px solid rgba(0, 0, 0, 0.03)",
      height: "calc(100% - 0vh)",
      overflow:"hidden",
      flexGrow: 1,
    },
  };
});
