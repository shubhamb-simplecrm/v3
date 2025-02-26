import { makeStyles } from "@material-ui/styles";
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  // paper: {
  //   padding: theme.spacing(2),
  //   textAlign: 'center',
  //   color: theme.palette.text.secondary,
  // },
  topRow: {
    minHeight: 105,
    textAlign: "center",
    padding: 10,
    wordBreak: "break-all",
    // borderRadius:0,
    // border: "#cccc80 solid thin",
    // borderTop: "3px solid "+theme.palette.primary.main
  },
  control: {
    padding: theme.spacing(1),
  },
  DashletRoot: {
    // borderRadius:0,
    // border: "#cccc80 solid thin",
    // borderTop: "3px solid "+theme.palette.primary.main
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
  // dashlet: {
  //   padding: '10px',
  //   minHeight: '300px',
  //   border: '1px solid #d9dada',
  //   margin: '10px'
  // },
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

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiTypography: {
        body1: {
          fontSize: "0.875rem",
        },
        body2: {
          fontSize: "0.675rem",
        },
      },
      MuiGrid: {
        root: {
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:959.95px)"]: {
            width: "100%",
          },
        },
      },
    },
  });
};
