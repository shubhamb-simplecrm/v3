import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles(theme => ({
  composeBox:{
      border: "1px solid grey",
      overflowX: "hidden",
      // Full screen dialog when screen size < medium
      [theme.breakpoints.down("md")] : {
        width: "100% !important",
        right: "0% !important",
        height: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
        overflowX: "hidden",
        zIndex:9999,
        margin:0
      }
    },
    closePopupBtn:{
      minWidth:50, 
      padding:0,
      color:'white'
    },
    fullscreenBtn:{
      minWidth:50,
      padding:0,
      color:'white'
    },
    composeBody:{
      padding: "3px 7px 3px 3px "
    },
    contentMargin: {
      marginBottom: "1rem"
    },
    composeFooter:{
      bottom:0,
      width:'100%',
      display: "flex",
      alignItems: "center",
      padding: "0px 16px",
      backgroundColor: theme.palette.background.default
    },
    composeHeader:{
      // borderRadius: "8px 8px 0px 0px",
      color:"white",
      display: "flex",
      fontWeight:400,
      fontSize:"0.875rem",
      alignItems: "center",
      padding: "5px 15px",
      backgroundColor: theme.palette.compEmailBack.default
    },
    textArea: {
        ...theme.typography.body1,
        border: 'none',
        outline: 'none',
        resize: 'none',
        width: '100%',
        fontSize:"0.875rem"
    },
  composeAttachments:{
    maxHeight:100
  },
  attachmentBtn:{
    padding:"4px 5px", 
    border:0,
    maxWidth:200,
    width:200, 
    whiteSpace: "nowrap",
    overflow: "hidden !important",
    textOverflow: "ellipsis",
    display: "inlineBlock",
    '&:hover':{
      border:0
    }
  },
  attachmentIconBtn:{
    padding:1, 
    border:0, 
    minWidth:20,
    '&:hover':{
      border:0,
      color:"#ccc"
    }
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2)
  },
  sendButton: {
    marginRight: theme.spacing(2),
    color:"#fff"
  },
  fileInput: {
    display: 'none'
  },
  inputField:{
    fontSize:"0.875rem"
  },
  inputAdornmentBtn:{
    padding:0,
    width:45,
    minWidth:45
  },
  rdwEditorToolbar:{
   fontSize:13   
  },
  attachments:{
      margin:5
  },
}));


export const getMuiTheme = (theme) =>{
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiInputBase: {
        input: {
          fontSize:"0.875rem",
          fontWeight:400
        },
      },
      MuiFormLabel:{
          root:{
              fontSize:"0.875rem",
              fontWeight:400
          }
      },
      MuiButton:{
          label:{
              fontSize:"0.875rem",
              textTransform: "none",
              fontWeight:400
          }
      },
      MuiMenuItem:{
          root:{
              fontSize:"0.875rem",
              fontWeight:400
          }
      },
      MuiInput:{
          formControl:{
              marginTop:10
          }
      },
      MuiIconButton:{
          root:{

          }
      },
      MuiSelect:{
        outlined:{
          padding:10,
          textAlign:'left',
        },
        icon: {
          marginRight: 10,
        }

      },
      MuiFormControl:{
        root:{
          "&:first-child": {
            marginRight:"8px",
          },
        },
      },
    },
  })};