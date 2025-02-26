import { makeStyles } from "@material-ui/styles";
import {  colors} from '@material-ui/core';
import { createMuiTheme } from "@material-ui/core/styles";


export default makeStyles(theme => ({
  showButtons:{
    color:'white',
    textDecoration:'none',
    marginRight:"17px",
    marginBottom:"17px",
  },
  showButtons1:{
    color:'white',
    textDecoration:'none',
    // marginRight:"17px",
    marginBottom:"17px",
  },
  infoLabel:{
    // fontWeight:'bold',
    color:"grey",
    fontSize:12,
    width:"50%",
    textAlign:"left",
  },
  infoValue:{
    // fontWeight:'bold',
    color:"black",
    fontSize:12,
    // paddingBottom:'5px',
    width:"50%",
    textAlign:"left",
  },
  mobileLayoutAccoDetails:{
    height:"250px",
    maxHeight:"250px"
    
  },
  accordionBox: {

    border: "1px solid grey",
    ["@media (max-width: 600px)"]: {
        height:"500px"
        },
    // backgroundColor:"rgba(247,247,247)"
  },
  headerBackground: {
    background: "rgba(0, 0, 0, 0.03)",
  
  },
  inline:{
    // width:"100%",
    display: "flex",
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"space-between",
    flexGrow:1,
    width:"50%",
    ["@media (max-width: 600px)"]: {
        display: "block",
        width:"100%",
        flexWrap:"none",
        },
    
    // height:"500px"
    // textAlign:"left"
  },
  
}))

export const getMuiTheme = (selectedTheme) => {
    return createMuiTheme({
      ...selectedTheme,
      overrides: {
        MuiCardContent:{
          root:{
            // padding: selectedTheme.palette.primary.main + ' solid 3px',
            },
        },
        MuiDialog:{
          paper:{
            borderTop: selectedTheme.palette.primary.main + ' solid 5px',
            },
        },
   
      },
  
    })
  }


  