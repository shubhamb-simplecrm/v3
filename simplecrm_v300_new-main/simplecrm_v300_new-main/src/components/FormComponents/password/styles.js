import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  customWidth: {
    maxWidth: "500px",
  },
  checkBtn: { padding: "2px", color: "rgb(76,175,80)" },
  clearBtn: { padding: "2px" },
  tooltip: {
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    gap: "3px",
  },
}));
