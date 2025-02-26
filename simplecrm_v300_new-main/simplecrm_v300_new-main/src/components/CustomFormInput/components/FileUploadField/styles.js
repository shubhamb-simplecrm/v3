import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  fileName: {
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  removeBtn: {
    display: "flex",
    justifyContent: "flex-end",
    cursor: "pointer",
    color: "blue",
    marginRight: "0.4rem",
  },
  errorFile: {
    color: "red",
    borderColor: "red",
  },
  error: {
    display: "flex",
    justifyContent: "flex-start",
    color: "red",
    marginLeft: "0.4rem",
    fontSize: "0.75rem",
  },
  fileFormHelperLabel: {
    display: "flex",
    justifyContent: "space-between",
  },
  fileMultiRoot: {
    display: "flex",
    justifyContent: "center",
    margin: 10,
  },
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  list_divider: { margin: 10 },
  fileUploadHelperText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));
