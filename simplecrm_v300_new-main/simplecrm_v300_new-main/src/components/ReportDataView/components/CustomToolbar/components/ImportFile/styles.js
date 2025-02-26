import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  dropzone: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: "2px",
    borderRadius: "2px",
    borderColor: theme.palette.text.primary,
    borderStyle: "dashed",
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.text.primary,
    outline: "none",
    transition: "border .24s ease-in-out",
  },
  container: {
      margin: theme.spacing(2, 4)
  }
}));
