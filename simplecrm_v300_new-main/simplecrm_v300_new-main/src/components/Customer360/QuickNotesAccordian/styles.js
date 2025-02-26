import { makeStyles } from "@material-ui/styles";
import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
export default makeStyles((theme) => ({
  root: {
    width: "100%",
    borderRadius: "5px",
    borderTop: "2px solid rgb(159,213,195)",
    borderBottom: "2px solid rgb(132, 132,132)",
    background: "#DCDCDC",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  headerBackground: {
    // background: "#DCDCDC",
    // borderColor:'red',
    // borderWidth:4
  },
  line: {
    background: "#C0C0C0",
    height: 1,
    width: "95%",
  },
  accordionBox: {
    border: "none",
  },
  text: {
    // fontWeight: 600,
    // fontSize: "13px",
    // color: "rgb(29,174,234)",
    // marginLeft: "10px",
    // marginTop: "5px",
  },
  mobileLayoutAccoDetails: {
    height: "100%",
    [theme.breakpoints.down("xs")]: {
      padding: "8px 0px 16px",
    },
  },
  noData: {
    marginTop: "5px",
    marginLeft: "10px",
    marginRight: "10px",
    float: "left",
  },
  iconW: {
    width: "15%",
  },
  icon: {
    textAlign: "center",
    width: "32px",
    height: "32px",
    marginRight:10
  },
  middle: {
    width: "70%",
  },
  label: {
    paddingTop: "0px",
    marginBottom: "10px",
    width: "100%",
  },

  labelNotes: {
    marginBottom: "5px",
    width: "100%",
    height: "30px",
  },
  createBtn: {
    marginTop: 20,
    padding: 10,
    marginLeft: 10,
  },
  btn: {
    marginLeft: 300,
  },
  title: {
    marginTop: -5,
    width: 160,
    fontSize: "12px",
    fontWeight: "bold",
  },
  description: {
    marginTop: -12,
    width: 160,
    fontSize: "10px",
    color: "#COCOCO",
  },
  heightList: { height: 200 },
  date: {
    marginTop: -5,
    width: 160,
    fontSize: "10px",
  },
  circleText: {
    fontSize: "10px",
  },

  text: {
    paddingLeft: "13px",
    paddingRight: "13px",
    fontSize: "12px",
    ["@media (max-width: 600px)"]: {
      paddingLeft: "0px",
      paddingRight: "0px",
    },
  },
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiAccordionDetails:{
        root:{
          padding:16
        }
      },
      MuiAccordionSummary:{
        content:{
          margin: "0!important",  
          "&.Mui-expanded":{
            margin: "0!important",  
          }
        },
        root:{
          margin: "0!important",  
          "&.Mui-expanded":{
            margin: "0!important",  
            minHeight:48
          }
        },
      },
      MuiCardHeader: {
        root: {
          borderBottom: '1px solid #ccc',
          padding: '5px 10px'
        },
        
      },
      MuiPaper: {
        elevation1: {
          boxShadow: "none",
        },
        rounded: {
          borderRadius: 0,
        },
      },
      MuiSvgIcon: {
        root: {
          width: "0.8em",
          height: "0.8em",
        },
      },
      MuiTypography: {
        body1: {
          fontSize: "0.875rem",
        },
        body2: {
          fontSize: "0.675rem",
        },
        subtitle2:{
          fontWeight:600,
          color:"rgb(29,174,239)",
          fontSize:"1rem"
        }
      },
      MuiButton:{
        containedPrimary:{
          color:"#ffffff"
        }
      }
    },
  });
};
