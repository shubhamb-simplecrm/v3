import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  editor: {
    border:"1px solid rgb(196,196,196)",
    borderRadius: "3px",
    marginBottom: "7px",
  },
  mobileLayoutAccoDetails : {
    [theme.breakpoints.down('xs')] : {
      padding: "8px 0px 16px"
    }
  },                      
  btn:{
    margin:"0px",
    padding:"0px"
  },
  danger:{
    color:'#f44336',
    fontSize:'0.75rem',
    marginLeft:'14px',
    marginRight:'14px'
  }
}));
