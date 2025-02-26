import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  //column chooser classes
  item: {
    padding: "0.2rem 0.6rem",
    fontSize: "0.85rem",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    border: (props) =>
      `0.2px solid ${theme.palette.studio[props?.colId]?.color ?? theme.palette.primary.main}`,
    borderRadius: "5px",
    marginBottom: "0.5rem",
    marginRight: "0.1rem",
    color: (props) =>
      theme.palette.studio[props?.colId]?.color ?? theme.palette.primary.main,
    backgroundColor: (props) =>
      theme.palette.studio[props?.colId]?.bgColor ?? theme.palette.primary.main,
  },
  itemDisabled: {
    padding: "0.5rem",
    fontSize: "0.9rem",
    border: `1px solid grey`,
    color: "grey",
    borderRadius: "2px",
    marginBottom: "0.5rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  secondaryText: {
    padding: "0px",
    margin: "0px",
    fontSize: "0.65rem",
    color: "rgb(89,94,114, 0.7)",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  innerColumn: { paddingRight: "10px", paddingTop: "10px" },
  columnHeading: {
    paddingBottom: "0.8rem",
    fontSize: "0.95rem",
    // color: "rgb(84,98,114)",
    // fontWeight:"bold"
    // color: theme.palette.primary.main,
  },
  columnTab: {
    border: "1px solid #dedede",
    borderRadius: "5px",
    padding: "1rem 0.35rem 1rem 1rem",
    width: "50%",
    overflowX: "hidden",
    overflowY: "auto",
    maxHeight: "68vh",
  },
  column: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    height: "84%",
  },
}));
