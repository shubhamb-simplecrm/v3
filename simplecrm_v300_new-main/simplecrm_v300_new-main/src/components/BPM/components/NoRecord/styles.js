import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles(theme => ({
  container: {
    //height: "85vh",
    //width: "26vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
   // backgroundColor: theme.palette.primary.main,
   
  },
  logotype: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(12),
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  logotypeText: {
    fontWeight: 500,
    color: "white",
    marginLeft: theme.spacing(2),
  },
  logotypeIcon: {
    width: 70,
    marginRight: theme.spacing(2),
  },
  paperRoot: {
      backgroundColor:'transparent',
    //boxShadow: theme.customShadows.widgetDark,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // paddingTop: theme.spacing(8),
    // paddingBottom: theme.spacing(8),
    // paddingLeft: theme.spacing(6),
    // paddingRight: theme.spacing(6),
    //maxWidth: 404,
  },
  textRow: {
    marginBottom: theme.spacing(2),
    textAlign: "center",
  },
  errorCode: {
    fontSize: 148,
    //fontWeight: 600,
    color:theme.grey[400]
  },
  safetyText: {
    fontWeight: 300,
    color: theme.palette.text.hint,
    //width:"80%"
  },
  backButton: {
    //boxShadow: theme.customShadows.widget,
    textTransform: "none",
   // fontSize: 22,
  },
}));

export const getMuiTheme = (theme) =>{
  return createMuiTheme({
    ...theme,
    overrides: {
        MuiPaper:{
            elevation1:{
                boxShadow:'none',
              //  border:"1px solid #ccc"
            }
        },
    }
})
}
