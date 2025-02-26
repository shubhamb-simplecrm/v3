import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

export default makeStyles((theme) => ({
  // root: {
  //   flexGrow: 1,
  //   width: '100%',
  //   // backgroundColor: theme.palette.background.paper,
  //   overflow: 'hidden',

  // },
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
    padding: "5px",
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
    zIndex: theme.zIndex.drawer+1
  },
  iconButton: {
    float: "right",
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
          "&:before,&:hover,&:focus,&:after,&:hover&:not(Mui-disabled)&:before": {
            borderBottom: "none",
          },
        },
      },
    },
  });
};
