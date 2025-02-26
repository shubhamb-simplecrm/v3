import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    fontSize: "1.1rem",
    cursor: "pointer",
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: theme.overlayBg.background,
    },
  },
  breadcrumb: {
    background: theme.palette.background.paper,
    padding: "10px 10px 0px 10px",
    paddingBottom: "14.5px",
  },
  grid: { borderBottom: "1px solid #dedede" },
  exit: { padding: "10px 10px 0px 0px " },
}));
