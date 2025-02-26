import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  progressWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingTop:"50px",
  },
  dialogContent: {
    padding: "20px", 
    // overflowX: "hidden"
  }
}));
