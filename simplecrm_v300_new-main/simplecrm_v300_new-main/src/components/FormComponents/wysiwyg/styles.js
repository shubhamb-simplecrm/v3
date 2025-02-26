import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  wysiwygToolbox: {
    border: "1px solid #c4c4c4",
    color:
      theme.palette.type === "dark"
        ? theme.palette.background.default
        : theme.palette.text.primary,
    backgroundColor: theme.palette.background.default,
  },
  wysiwygEditorBox: {
    border: "1px solid #c4c4c4",
    padding: "10px",
    height: "30vh",
    color:
      theme.palette.type === "dark"
        ? "#fff !important"
        : theme.palette.text.primary+" !important",
  },
  errorBox:{
    border: '1px solid rgb(244,67,54)',
    borderRadius: "4px",
  },
  errorTitle:{
    margin: "0.5vw", 
    fontWeight: "400", 
    display: "flex", 
    color: "rgb(244,67,54)"
  },
  title:{
    margin: "0.5vw", 
    fontWeight: "400", 
    display: "flex", 
    color: "rgb(117,117,117)"
  },
  fullHeight:{
    height:'100%'
  }
}));
