import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  root: {
    // maxWidth: 345,
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
    backgroundColor: "#ccc",
  },
  emailLink: {
    textDecoration: "none !important",
    color: theme.palette.primary.main,
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  link: {
    textDecoration: "none !important",
    color: theme.palette.primary.main,
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  photo: {
    maxWidth: 40,
  },
  fileNameLinkTxt: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    fontSize: "0.875rem",
    width: "250px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    cursor: "pointer",
    textDecoration: "none",
  },
  statusBg: {
    borderRadius: "2px",
    textTransform: "uppercase",
    fontSize: "10px",
    fontWeight: "600",
    letterSpacing: "1px",
    paddingRight: "12px",
    paddingLeft: "12px",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "-webkit-fill-available",
    },
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiPaper: {
        elevation1: {
          boxShadow: "none",
          //  border:"1px solid #ccc"
        },
      },
      // MuiBox:{
      //   root:{
      //     margin:"15px 0",
      //   }
      // },
      MuiCardHeader: {
        root: {
          padding: 10,
        },
        // action:{
        //     marginRight:"-15px"
        // },
        title: {
          //fontSize:"1rem"
        },
        subheader: {
          fontSize: "0.7rem",
        },
      },
      MuiCardContent: {
        root: {
          padding: "0px 10px",
        },
      },
      MuiList: {
        padding: {
          paddingBottom: 0,
          paddingTop: 0,
        },
      },
      MuiListItemSecondaryAction: {
        root: {
          right: 0,
          fontSize: "0.875rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "50%",
          minWidth: "50%",
        },
      },
      MuiListItemIcon: {
        root: {
          fontSize: "0.875rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "45%",
          minWidth: "45%",
        },
      },
      MuiListItem: {
        root: {
          paddingBottom: 0,
        },
        gutters: {
          paddingLeft: 0,
          paddingRight: 0,
        },
        secondaryAction: {
          paddingRight: 0,
        },
      },
      MuiIconButton: {
        root: {
          padding: 5,
        },
      },
    },
  });
};
