import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    ctiCont: {
        display: "flex",
        position: "relative",
        zIndex: 9999,
    },
    ctiIframeCont: {
        position: "fixed",
        bottom: "6%" ,
        right: "5%",
    },
    ctiIframe:{
        border:"none"
    }  
}))

export const getMuiTheme = (theme) => {
    return createMuiTheme({
      ...theme,
      overrides: {
          MuiIconButton: {
              root: {
                  color: "#ffffff",
                  height: 56,
                  width: 56,
                  position: "fixed",
                  bottom: "2.7%" ,
                  right: "11%",
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                  }
              },
              
          }
      }
    })
}