import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles(theme => ({
   addBtn:{
     margin:10,
     color:"#fff"
   },
   rightBtn:{
    display: "flex",
    justifyContent: "center",
    "& svg":{
      width: "16px",
      height: "16px",
    }
  },
}));


export const getMuiTheme = (theme) =>{
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiDialogContent:{
        root:{
          overflowY:'hidden'
        }
      },
      MuiFormLabel:{
        root:{
          fontSize:"0.875rem"
        }
      },
      MuiPaper:{
        elevation4:{
          boxShadow:'none',
          border:"1px solid #ccc",
          borderRadius:'0',
          marginBottom:10
        }

      },
      MuiToolbar: {
        root: {
          padding: "0px",
          fontFamily: "Poppins"
        },
        gutters: {
          paddingLeft:5,
          paddingRight: 5,
          //eslint-disable-next-line no-useless-computed-key
          ["@media (min-width:600px)"]: {
            paddingLeft:5,
            paddingRight: 5,
          }
        },
        
      },
      MUIDataTableToolbar: {
        paddingLeft: '10px',
      },
      MuiTableCell: {
        root: {
          fontFamily: "Poppins"
        },
        alignRight:{
          textAlign:'center'
        }
      },
      MUIDataTableBodyCell: {
        root: {
          padding: "4px",
          // eslint-disable-next-line no-useless-computed-key
          // ["@media (min-width:959.5px)"]: {
          //   padding: "px 4px",
          // },
        },
      },
      MUIDataTableHeadCell: {
        root: {
          padding: "0px 8px",

        },
      },
      PrivateSwitchBase: {
        root: {
          padding: "4px 0px 4px 4px"
        }
      },
    },
  })};