import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  paper: {
    margin: "3% auto",
    width: "90%",
    height: "90%",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "3px",
    boxShadow: theme.shadows[5],
    outline: 0,
    borderTop: theme.palette.primary.main + " solid 3px",
  },
  sectionsWrappers: {
    padding: theme.spacing(1),
  },
  closeIcon: {
    color: theme.palette.text.secondary,
    cursor: "pointer",
  },
  perSectionWrapper: {
    padding: "0.5rem 0.8rem",
    margin: "1rem 0",
    border: "1px solid #d6d5d5",
  },
  sectionTitle: {
    paddingBottom: "0.9rem",
    marginTop: "0px",
    color: theme.palette.text.primary,
  },
  fieldsGrid: {
    marginTop: theme.spacing(2),
  },
  modal: {
    outline: "none",
  },
  buttonsWrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
    marginRight: 4,
  },
  titleHeadWrapper: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.8rem 1.2rem",
    position: "sticky",
    top: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 101,
  },
  progressWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  adornment: {
    padding: 0,
    margin: 0,
    cursor: "pointer",
  },
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    fontSize: "0.875rem",
    [theme.breakpoints.down("xs")]: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      display: "block",
    },
  },
  btn: {
    margin: "5px",
  },
  cstmBtn: {
    color: theme.palette.text.primary,
    margin: "0px",
  },
  mobileLayoutButton: {
    [theme.breakpoints.down("sm")]: {
      // width: "100%",
      marginBottom: "5px",
    },
  },
  inputPadding: {
    padding: "11px 14px",
  },
}));
