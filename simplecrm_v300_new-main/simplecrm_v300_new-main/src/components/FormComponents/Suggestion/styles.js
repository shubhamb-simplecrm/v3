import { makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  tableBorder: {
    border: "#cccccc43 solid thin",
    borderCollapse: "collapse",
    width: "100%",
    "& th, & td" : {
        borderBottom: "1px solid rgba(224, 224, 224, .5)",
        borderCollapse: "collapse",
        padding: "7px 5px",
        textAlign: "left",
    }
  },
  accordionBox: {
    border: "none",
  },
  headerBackground: {
    background: "rgba(0, 0, 0, 0.03)",
  
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.overlayBg.background,
  },
  hiddenAccor: {
    padding: 0,
  }
}));


export const getMuiTheme = (theme) => {
  return createMuiTheme ({
    ...theme,
    overrides: {
      MuiButton: {
        containedSizeSmall: {
          padding: '0px 10px',
          color: "#ffffff",
          textTransform: "none",
        }
      },
      MuiIconButton: {
        root: {
          padding: "8px 12px",
        }
      },
      MuiAccordionSummary : {
        content: {
          margin: "7px 0px",
          "&$expanded": {
            margin: "7px 0px",
          }
        },
        root: {
          minHeight: "40px",
          "&$expanded": {
            minHeight: "40px",
          }
        }
      }
    }
  })

}


