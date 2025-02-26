import { makeStyles } from "@material-ui/styles";
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  topRow: {
    minHeight: 105,
    textAlign: "center",
    padding: 10,
    wordBreak: "break-all",
  },
  control: {
    padding: theme.spacing(1),
  },
  DashletRoot: {
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },

  btnMarginRight: {
    marginRight: "5px",
  },
  topBtnBox: {
    float: "right",
  },
  dashlet: {
    padding: "10px",
    minHeight: "300px",
    border: "1px solid #d9dada",
    margin: "10px",
  },
  dashletHeader: {
    backgroundColor: theme.dashletHeader.background,
    color: theme.dashletHeader.text,
    fontSize: "0.875rem",
    fontWeight: "bold",
    padding: "5px 10px",
    // borderBottom: theme.palette.text.primary + ' groove 0.1px'
  },
  filterArea: {
    paddingTop: 15,
    boxShadow: "none",
    borderRadius: 0,
  },
}));

export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {
      MuiMenu: {
        list: {
          padding: 0,
        },
      },
      MuiPaper: {
        elevation: {
          boxShadow: "none",
        },
      },
      MuiCardHeader: {
        title: {
          fontSize: "1rem",
        },
      },
    },
  });
};
