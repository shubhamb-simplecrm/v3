import { makeStyles } from "@material-ui/styles";
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
export default makeStyles((theme) => ({
  root: {
    width: "90%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  noteDesc: {
    color: "rgba(0, 0, 0, 0.6)",
  },
  subject: {
    //whiteSpace: "nowrap",
    //width: "50%",
    //overflow: "hidden",
    //textOverflow: "ellipsis",
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiButton: {
        containedPrimary: {
          color: "#ffffff",
        },
      },
      // MuiListItemSecondaryAction:{
      //   root: {
      //     top:"7% !important"
      //   }
      // }
    },
  });
};
