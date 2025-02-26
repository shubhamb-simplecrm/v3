import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
      },
      closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
      },
}));

export const getMuiTheme = (theme) =>{
  return createMuiTheme({
    ...theme,
    overrides: {
        MuiTimelineItem:{
            root:{
                minHeight:50
            },
            missingOppositeContent:{
                "&::before":{
                    flex:0,
                    padding:0
                }
            }
        },
    }
})
}
