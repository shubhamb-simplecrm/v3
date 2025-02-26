import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    paddingRight: "50px",
    marginTop: "-12px",
  },
  icon: {
    cursor: "pointer",
  },
  noDiffText: {
    textAlign: "center",
    paddingBottom: "80px",
    color: "grey",
    fontSize: "1.2rem",
  },
}));
