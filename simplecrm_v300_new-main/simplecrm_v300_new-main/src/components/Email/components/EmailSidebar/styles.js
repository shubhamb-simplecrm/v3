import { makeStyles } from "@material-ui/core";
export default makeStyles((theme) => ({
  itemRoot: {
    borderRadius: "5px",
    margin: "5px",
    color: theme.palette.text.secondary,
    // "&:hover > $content": {
    //   backgroundColor: "rgb(237,225,250)",
    // },
    "&:hover > $content, &$selected > $content $label": {
      backgroundColor: "#0071D2" + "15",
    },
    "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label":
      {
        backgroundColor: "transparent",
      },
  },
  content: {
    padding: theme.spacing(0.4, 1.5),
    borderRadius: "5px",
    color: theme.palette.text.primary,
    "$expanded > &": {
      fontWeight: "bold",
    },
  },
  group: {
    backgroundColor: "#ffffff90",
    borderRadius: "5px",
    // backgroundColor: "rgb(237,225,250,0.4)",
    marginLeft: 0,
    "& $content": {
      paddingLeft: theme.spacing(2),
    },
  },
  label: {
    fontWeight: "inherit",
    color: "inherit",
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1,
  },
  emailSidebar: {
    height: "79.3vh",
    overflowY: "scroll",
    padding: "4px 0px 4px 4px",
  },
  mobileEmailSidebar: {
    height: "88.3vh",
    overflowY: "scroll",
    padding: "4px 0px 4px 4px",
  },
  parentLabel: {
    padding: "6px 0px",
    margin: "0px",
    wordWrap: "break-word",
    width: "80%",
  },
  subFolderLabel: {
    display: "inline-block",
    wordWrap: "break-word",
    width: "75%",
  },
  listIcon: { padding: "2.5px", marginRight: "5px" },
  //EmailCompose
  emailCompose: {
    padding: "20px 20px 20px 15px",
    display: "flex",
    // justifyContent: "space-between",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  composeBtn: {
    width: "100%",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    color: "#0071d2",
    padding: "6px 15px",
    border: "1px solid #0071d2",
    borderRadius: "5px",
    cursor: "pointer",
  },
}));
