import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  searchFieldDiv: {
    margin: "20px 0 0 0",
    zIndex: 999,
  },
  searchField: {
    paddingLeft: 15,
  },
  tabPanel: {
    backgroundColor: "#cccccc26",
    minHeight:"92vh",
    paddingBottom:20
  },
  drawerHeaderClose: {
    float: "right",
  },
  cardView: {
    width: "90%",
    padding: 10,
    margin: 20,
    backgroundColor: "#cccccc26",
    borderWidth: 10,
  },
  link:{
    cursor:"pointer"
  },
  recordList:{
    //minHeight:"30vh", 
    //marginBottom:20   
  },
  contentHeight:{
    height: "69vh !important", 
    [theme.breakpoints.down("sm")]: {
        height: "80vh !important",
    },
  }
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiBadge: {
        colorPrimary: {
          color: "#fff",
        },
      },
      MuiTab: {
        root: {
          padding: "0 18px",
          // eslint-disable-next-line no-useless-computed-key
          ["@media (min-width:600px)"]: {
            minWidth: "auto",
          },
        },
      },
      MuiPaper: {
        elevation4: {
          boxShadow: "none",
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
      MuiButtonGroup: {
        groupedTextHorizontal: {
          "&:not(:last-child)": {
            borderRight: "none",
          },
        },
        grouped: {
          minWidth: "33%",
        },
      },
    },
  });
};
