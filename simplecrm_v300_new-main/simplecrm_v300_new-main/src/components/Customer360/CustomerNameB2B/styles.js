import { makeStyles } from "@material-ui/styles";
import { red, yellow } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100%",
    backgroundColor: "rgb(0,164,231)",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  buttons: {
    float: "right",
    color: "white",
  },
  topRow: {
    margin: "120px 20px 15px 20px",
    height: 90,
    textAlign: "center",
    padding: "5px 0px 0px 0px",
    wordBreak: "break-word",
    borderRadius: "7px",
    border: "unset",
    // borderLeft: "3px solid "+theme.palette.primary.main,
    color: "white",
    backgroundColor: "#ffffff",
    ["@media (max-width: 600px)"]: {
      margin: "20px 20px 15px 20px",
      height: "fit-content",
    },
  },
  profilePicture: {
    borderRadius: "7px",
    height: 80,
    width: 280,
    margin: "0px",
  },

  paper: {
    textAlign: "left",
    wordBreak: "break-word",
    borderRadius: "5px",
    border: "unset",
    // borderLeft: "3px solid "+theme.palette.primary.main,
    color: "white",
    backgroundColor: "rgba(229, 228, 226)",
    alignContent: "left",
    width: "fit-content",
    padding: "0px 10px",
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    borderRadius: 150 / 2,
    overflow: "hidden",
    borderWidth: 3,
    borderRadius: "50%",
    marginRight: "20px",
    boxShadow: "0 0 .3em .3em rgb(93, 63, 211)",
  },
  topButtons: {
    margin: theme.spacing(1),
    float: "right",
    color: "white",
  },
  ratingnumber: {
    padding: "0px 10px",
    "&h6": {
      fontSize: "10px",
    },
  },
  custName: {
    textAlign: "left",
    color: "black",
    fontWeight: "bold",
    fontSize: "1rem",
    // paddingBottom: "10px",
    // paddingTop: "2px",
    padding: "1% 0%"
  },
  ratingstar: {
    paddingTop: 3,
  },
  nameContent: {
    // padding: "2px 15px",
    // height: 90,
    padding: "2% 4%"
  },
  cardHeading: {
    textAlign: "left",
    color: "black",
    fontWeight: "400",
    fontSize: "0.875rem",
  },
  cardNo: {
    textAlign: "left",
    color: "black",
    fontSize: "1rem",
    // paddingBottom: "5px",
  },
  bottomRow: {
    margin: "0px 20px 118px 20px",
    height: "350px",
    textAlign: "center",
    padding: "10px  15px",
    wordBreak: "break-word",
    borderRadius: "7px",
    border: "unset",
    // borderLeft: "3px solid "+theme.palette.primary.main,
    color: "white",
    backgroundColor: "#ffffff",
    ["@media (max-width: 600px)"]: {
      margin: "0px 20px 20px 20px",
    },
  },
  bottomHeading: {
    // padding:"5px 10px",
    fontWeight: "bold",
    color: "black",
    fontSize: "0.9rem",
    textAlign: "left",
    // justifyContent:"space-inbetween",
    // display:"inline",
  },
  eyeIcon: {
    color: "#0e318f",
    // padding:"50px 20px 0px 0px"
  },
  headingContent: {
    marginRight: "10px",
    backgroundColor: "red",
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  infoLabel: {
    fontWeight: "bold",
    color: "black",
    fontSize: "0.875rem",
  },
  infoValue: {
    fontSize: "1rem",
    paddingBottom: "5px",
    textOverflow: "ellipsis",
   // whiteSpace: "nowrap",
    // width: "242px",
    overflow: "hidden",
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiPaper: {
        elevation1: {
          boxShadow: "none",
        },
        rounded: {
          borderRadius: 0,
        },
      },
      MuiTypography: {
        body1: {
          fontSize: "0.875rem",
        },
        body2: {
          fontSize: "0.675rem",
        },
      },
    },
  });
};
