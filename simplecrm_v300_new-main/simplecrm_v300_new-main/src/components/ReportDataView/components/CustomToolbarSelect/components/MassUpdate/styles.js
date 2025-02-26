import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  perSectionWrapper: {
    // backgroundColor: theme.palette.background.default,
    padding: "1rem 0.8rem",
    borderRadius: "0.2rem",
    margin: "1rem 0",
  },

  fieldsGrid: {
    marginTop: theme.spacing(2),
  },

  buttonsWrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
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
  },
}));
