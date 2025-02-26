import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  betweenSeparator: {
    display: "flex",
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  errorFile: {
    color: "red",
    borderColor: "red",
  },
  removeBtn: {
    display: "flex",
    justifyContent: "flex-end",
    cursor: "pointer",
    color: "rgb(244,67,54)",
  },
  fileFormHelperLabel: {
    display: "flex",
    justifyContent: "space-between",
  },
  error: {
    color: "red",
  },
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
  inputPadding: {
    padding: 0,
  },
  uploadButton: {
    // marginTop: 8,
    overflow: "hidden",
    textTransform: "none",
  },
  //reminder
  formControl: {
    padding: "10px",
    border: "1px solid #dedede",
    borderRadius: "5px",
  },
  inputLabel: {
    backgroundColor: theme.palette.background.paper,
    zIndex: 99,
    padding: "0px 7px",
  },
  fileInputLabel: {
    backgroundColor: theme.palette.background.paper,
    zIndex: 99,
    padding: "0px 7px",
    color: theme.palette.primary.main,
  },
  fileInputValue: {
    wordBreak: "break-all",
    wordWrap: "break-word",
  },
  reminder: { marginTop: 3 },
  reminderCard: {
    border: "1px dashed #dedede",
    boxShadow: "none",
    padding: "20px 15px 17px 15px",
  },
  addInvitees: {
    display: "flex",
    gap: "5px",
    [theme.breakpoints.down("xs")]: {
      display: "grid",
    },
  },
  searchIcon: { padding: "3px" },
  inviteeList: { padding: "10px 0px" },
  inviteeChip: { margin: 2, fontSize: "0.75rem" },
  inviteeAvatar: {
    height: "18px",
    width: "18px",
    fontSize: "0.7rem",
    color: "#000",
  },
  reminderFieldBox: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },
  reminderField: { paddingLeft: "5px" },
  reminderBox: { padding: "10px" },
  deleteReminder: { marginTop: "8px" },
  emailChip: { backgroundColor: "#c5c5c530", height: "inherit" },
  emailMore: { paddingLeft: "5px", fontSize: "0.85rem" },
  emailChipLabelStyle: {
    fontSize: "0.8rem",
    [theme.breakpoints.down("xs")]: {
      whiteSpace: "normal",
    },
  },
  emailChipMobile: {
    wordBreak: "break-all",
  },
  emailTagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  emailAvatar: {
    opacity: "0.8",
    width: "16px",
    height: "16px",
  },
}));
