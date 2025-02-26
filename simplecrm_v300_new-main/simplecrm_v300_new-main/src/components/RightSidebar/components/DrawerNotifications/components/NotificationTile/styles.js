import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 400,
      minHeight: 100,
      "& .tile-clear-icon": {
        display: "none"
        // visibility: "hidden"
      },
      "&:hover": {
        "& .tile-clear-icon": {
          display: "inline"
        // visibility: "visible"
        }
      }
    },
  }));