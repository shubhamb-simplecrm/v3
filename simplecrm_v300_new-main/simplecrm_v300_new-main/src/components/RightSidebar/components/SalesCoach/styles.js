import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    // backgroundColor: theme.palette.background.paper,
    overflow: "hidden",
  },
  contentHeight: {
    height: "78vh !important",
    background: theme.palette.background.paper,
    [theme.breakpoints.down("sm")]: {
      height: "88vh !important",
    },
  },
  rootBox: {
    display: "flex",
    flexDirection: "column",
    background: theme.palette.background.paper,
    height: "calc(100vh - 40vh)",
    // [theme.breakpoints.down("xs")]: {
    //   height: "calc(100vh - 12vh)",
    // },
  },
  cardRoot: {
    padding: "5px",
    border: "1px solid #ccc",
    margin: "5px",
    borderRadius: "5px",
  },
  RightBadge: {
    padding: "1px",
  },
  badgeColor: {
    color: "white",
  },
  activityTab: {
    // marginTop:'10px',
    // position:'initial !important',
    // borderBottom:'unset'
  },
  tabpanelBox: {
    // padding: "5px",
    backgroundColor: theme.palette.background.listView,
  },
  rightBarHeader: {
    borderBottom: "1px solid #ccc",
  },
  flexContainer: {
    borderBottom: "unset !important",
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
  margin: {
    margin: theme.spacing(1),
  },
  media: {
    width: "unset",
    margin: "auto",
    minHeight: "100px",
    borderRadius: "10px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  mediaBox: {
    margin: "auto",
  },
  searchFieldDiv: {
    margin: "20px 0 0 0",
  },
  searchField: {
    paddingLeft: 15,
    zIndex: theme.zIndex.drawer + 1,
  },
  iconButton: {
    float: "right",
  },
  form: {
    borderTop: "1px solid black",
    height: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    padding: "10px",
  },
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  },
  chat: {
    height: "95%",
  },
  text: {
    width: "80%",
    height: "100%",
    border: "none",
    fontFamily: "Roboto",
    fontSize: "15px",
  },
  sendButton: {
    width: "15%",
    height: "100%",
    backgroundColor: "#fff",
    borderColor: "#1D2129",
    borderStyle: "solid",
    // borderRadius: 30,
    borderWidth: 2,
    color: "#1D2129",
    fontWeight: "300",
  },
  chatContainer: {
    background: theme.palette.background.paper,
  },
  horizontalCenter: {
    //width: '100%',
    "& > * + *": {
      marginTop: theme.spacing(20),
    },
    margin: "0",
    right: "35%",
    left: "35%",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%, -50%)",
  },
  salesCoachSection: {
    padding: "2px 15px",
    fontSize: "1rem",
    fontWeight: "400",
    color: theme.bolBhaiGPT.palette.defaultColor,
    margin: "0px",
    lineHeight: "1.75",
    background: theme.palette.background.paper,
  },
  loader: {
    width: "65%",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "0.5s linear",
    color: "#00000061",
    fontWeight: "500",
  },
  ball: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    animation: " bounce6135 1s alternate infinite",
    transition: "0.5s linear",
    background: theme.bolBhaiGPT.palette.loadingSectionColor,
  },
}));

export const getMuiTheme = (selectedTheme) => {
  return createMuiTheme({
    ...selectedTheme,
    overrides: {
      // MuiPaper: {
      //   root: {
      //     margin:'10px',
      //   },
      // },

      MuiCardContent: {
        root: {
          padding: "2px",
          // paddingTop: '0px !important',
          // paddingBottom: '5px !important',
          // borderBottom:'1px solid #ccc !important'
        },
      },
      MuiTypography: {
        overline: {
          fontWeight: "600",
          lineHeight: "unset",
        },
      },
      MuiInput: {
        underline: {
          "&:before,&:hover,&:focus,&:after,&:hover&:not(Mui-disabled)&:before":
            {
              borderBottom: "none",
            },
        },
      },
    },
  });
};
