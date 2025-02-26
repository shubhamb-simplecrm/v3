import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  subMenuRoot: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.sidebar,
    position: "relative",
    overflow: "auto",
    maxHeight: 300,
  },
  listItemOpen: {
    paddingLeft: "10px",
    // [theme.breakpoints.up("sm")]: {
    //     paddingLeft: "10px",
    //     // width: theme.spacing(9) + 1
    // }
  },
  activeLink: {
    // paddingLeft: 0,
    //backgroundColor: theme.palette.background.linkActive,
    backgroundColor: theme.palette.background.linkActiveBg,
    borderLeft: "5px solid " + theme.palette.background.linkActive,
  },
  link: {
    textDecoration: "none",
    padding: 0,
    paddingLeft: 16,
    "&:hover, &:focus,&:focus-within,&:focus-visible,&:active": {
      //backgroundColor: theme.palette.background.linkActive,
      backgroundColor: theme.palette.background.linkActiveBg,
      borderLeft: "5px solid " + theme.palette.background.linkActive,
    },
    color: "#fff",
    borderLeft: "5px solid " + theme.palette.background.sidebar,
    "&:hover, &:focus": {
      //backgroundColor: theme.palette.background.linkActive,
      backgroundColor: "#333435",
      borderLeft: "5px solid " + theme.palette.background.linkActive,
    },
  },
  linkIcon: {
    // marginRight: theme.spacing(1),
    // marginRight: theme.spacing(1),
    color: theme.appbar.text,
    transition: theme.transitions.create("color"),
    minWidth: 30,
    // width: 24,
    // display: "flex",
    // justifyContent: "center",
  },
  linkText: {
    // padding: 0,
    // marginLeft: 0,
    // color: theme.palette.text.secondary + "CC",
    transition: theme.transitions.create(["opacity", "color"]),
    fontSize: 14,
    whiteSpace: `nowrap`,
    overflow: `hidden`,
    textOverflow: `ellipsis`,
    // maxWidth: '145px !important',
  },
  activeLinkText: {
    //color: theme.palette.text.primary + "CC",
    color: theme.palette.background.linkActive,
  },
  nestedList: {
    borderRadius: "0 !important",
    padding: "0px !important",
    //paddingLeft: theme.spacing(2) + 30,
    //position: "fixed",
    left: theme.spacing(2) + 210,
    //background: "#ccc",
    //zIndex:1000,
    MuiPopoverPaper: {
      borderRadius: 0,
    },
  },
  dividerInset: {
    margin: `5px 0 0 ${theme.spacing(2.5)}px`,
    color: "cornflowerblue",
  },
  nestedLinkText: {
    paddingRight: 10,
    marginLeft: 0,
    // color: theme.palette.text.secondary + "CC",
    transition: theme.transitions.create(["opacity", "color"]),
    fontSize: 14,
    whiteSpace: `nowrap`,
    overflow: `hidden`,
    textOverflow: `ellipsis`,
    maxWidth: "145px",
  },
}));
