import { makeStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";


export default makeStyles((theme) => ({
  title: {
    fontSize: 14,
  },
  card:{
    border:'1px solid #ccc',
    marginBottom:15,
  },
  invitee:{
    margin:2
  },
  inviteeNames:{
    marginBottom:5,
  },
  select:{
    width:"100%"
  },
  addInviteeBtn:{
    margin:5,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    // float:'left'
  }
}));


export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiFormControlLabel:{
        label:{
          paddingLeft:5
        }
      }
    },
  });
}
