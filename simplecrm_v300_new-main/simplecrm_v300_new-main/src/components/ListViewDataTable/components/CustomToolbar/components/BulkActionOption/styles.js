import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  btnSpacing: {
    margin: "0 8px 0 0",
  },
  buttonGroupRoot: {
    display: "flex",
    justifyContent: "end",
    gap: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  perSectionWrapper: { margin: "0px 5px" },
  optionWrapperAdd: {
    display: "flex",
    height: "40px",
    padding: "0px 10px",
    margin: "0px",
    alignItems: "center",

    "& svg": {
      width: "20px",
      height: "20px",
      marginRight: "5px",
      marginLeft: "5px",
    },
    "&:hover": {
      cursor: "pointer",
      color: theme.palette.secondary.dark,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "10px 5px",
      margin: "0 5px",
      fontSize: 0,
      background: theme.palette.primary.main + "20",
      color: theme.palette.primary.main,
      borderRadius: 5,
      //border: "1px solid #d9d9d9"
    },
  },
}));
