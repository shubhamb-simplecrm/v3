import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => {
 return ({
  paper: {
    margin: `5% auto`,
    width: "90%",
    backgroundColor: theme.palette.background.default,
    // border: "1px solid #fff",
    borderRadius: "3px",
    maxHeight: "80%",
    overflowY: "scroll",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(0, 4, 2, 2),
    outline: 0,
    [theme.breakpoints.up('md')]: {
      margin: `7% auto`,
      width: "70%",
    },
    [theme.breakpoints.up('md')]: {
      margin: `7% auto`,
      width: "60%",
    },
  },
  fieldsGrid: {
    marginTop: theme.spacing(2),
  },
  modal: {
    outline: "none",
  },
  buttonsWrapper: { 
    display: "flex",
     width: "100%", 
     justifyContent: "flex-end", 
     marginTop: theme.spacing(2)
  },
  titleHeadWrapper: {
    display: "flex", 
    justifyContent: "space-between", 
    padding: "12px 0px 0px 8px"
  }
})});
