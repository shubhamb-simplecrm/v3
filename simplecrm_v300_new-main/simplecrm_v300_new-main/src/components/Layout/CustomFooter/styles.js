import { FOOTER_HEIGHT } from "@/common/theme-constants";
import { makeStyles } from "@material-ui/styles";
export default makeStyles((theme) => ({
  footerRoot: {
    height: FOOTER_HEIGHT,
    width: "100%",
    zIndex: 998,
    position: "fixed",
    bottom: 0,
    boxShadow: 2,
    display: "flex",
    justifyContent: "flex-end",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  versionSpan: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderLeft: "2px solid #DEDEDE",
  },
  footerItem: {
    padding: "0px 20px",
  },
  rightSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderLeft: "2px solid #DEDEDE",
  },
}));
