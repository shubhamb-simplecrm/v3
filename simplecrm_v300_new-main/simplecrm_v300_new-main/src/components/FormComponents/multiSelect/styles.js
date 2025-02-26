import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
   formControl: {
    // margin: theme.spacing(1),
    width: '100%',
    maxWidth: 700,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

export const getMuiTheme = (selectedTheme) => {
    return createMuiTheme({
        ...selectedTheme,
        overrides: {
          MuiInputLabel:{
            outlined:{
              transform:'translate(14px, 10px) scale(1)',
            }
          },
          MuiSelect:{
            selectMenu:{
              //height:'0.51em !important',
              minHeight:'1.1876em'
            }            
          },
          MuiOutlinedInput:{
            input:{
              padding:10
            }
          },
          MuiChip:{
            labelSmall:{
              color:'#fff'
            },
            deleteIconColorPrimary:{
              color:'#fff'
            }
          },
          
        }
      })
}