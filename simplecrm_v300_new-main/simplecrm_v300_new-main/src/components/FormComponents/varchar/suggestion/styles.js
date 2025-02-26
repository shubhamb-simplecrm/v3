import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  suggestionText:{
    fontStyle:"italic", 
    textDecoration:'none !important',
    lineHeight:"2.5"
  },
  suggestionCopyBtn:{
      cursor:"pointer",
  }
}));