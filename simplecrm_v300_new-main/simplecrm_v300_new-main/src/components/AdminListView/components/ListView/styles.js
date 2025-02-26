import React from "react"; 
import { makeStyles } from "@material-ui/styles";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";

export default makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 600,
  },
  searchBar: {
    border: "1px solid rgb(189,189,189, 0.5)", 
    backgroundColor: "rgb(189,189,189, 0.2)",
    marginRight:"10px"
  },
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    fontSize: "1rem",
    [theme.breakpoints.down("xs")]: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      display: "block",
    },
  },
  field: {
  //  margin : "0px",
  // padding : "0px",
  // height: "10px"
  }
}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MuiTableCell: {
        root: {
          fontFamily: "Poppins",
          background:theme.palette.primary.listview,
          // eslint-disable-next-line no-useless-computed-key
          [theme.breakpoints.down("sm")]: {
            display: "table",
            width: "100% !important",
            border:"none"
          },
        },
      },
     
      MUIDataTableHeadCell: {
        root: {
          padding: "0px 8px",
        },
      },
      MuiPaper: {
        elevation4: {
          boxShadow: "none",
        },
      },
      MuiTableSortLabel: {
        root: {
          marginTop: 5,
        },
      },
      MUIDataTablePagination: {
        tableCellContainer: {
          padding: "0px",
          margin:"0px",
          // width:"90px",
        },
      },
      MUIDataTableSelectCell: {
        fixedLeft: {
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:959.95px)"]: {
            borderWidth: theme.brdrWidth,
            borderColor: "#ffffff",
            borderStyle: "solid",
            //backgroundColor: theme.palette.primary.listview,
            // padding: 5, 
            display: "block",
          },
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:1099.95px)"]: { 
            position: "relative",
          }
        },
        fixedHeader: {
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:1099.95px)"]: {
            position: "relative", 
          }
        },
        root: {
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:959.95px)"]: {
            "& div": {
              justifyContent: "space-between",
              flexDirection: "row-reverse",
              // paddingRight: "15px",
            },
            "& ~ td": {
              display: "none",
              padding: "4px 7px",
              backgroundColor: theme.palette.primary.listview,
            },
            "& div > button": {
              // eslint-disable-next-line no-useless-computed-key
              ["@media (max-width:959.95px)"]: {
                //backgroundColor: "rgba(159, 159, 159, 0.5)",
              },
              "&:hover": {
                // eslint-disable-next-line no-useless-computed-key
                ["@media (max-width:959.95px)"]: {
                  //backgroundColor: "rgba(159, 159, 159, 0.5)",
                },
              },
            },
          },
        },
        icon: {
          // eslint-disable-next-line no-useless-computed-key
          ["@media (max-width:959.95px)"]: {
            transform: "rotate(90deg)",
          },
        },
      },

      MUIDataTableBodyCell: {
        root: {
          padding: "3px 5px",
        },
        stackedHeader:{
          [theme.breakpoints.down("sm")]: {
            color:theme.palette.label.listView.color,
            fontSize:"0.875rem !important",
           
          }     
        }
      },
      MuiTableRow: {
        root: {
          // eslint-disable-next-line no-useless-computed-key
          [theme.breakpoints.down("sm")]: {
            position: "relative",
            margin: "10px auto 10px auto !important",
            display: "block",
            width: "95% !important",
          },
        },
      },
      MUIDataTable:{
        responsiveBase:{
          [theme.breakpoints.down("sm")]: {
            background:theme.palette.background.listView
          }
        }
      },
      MUIDataTableBodyRow:{
        responsiveStacked:{
          border:"none !important"
        }
      },
      MuiCheckbox:{
        root:{
        "& svg":{
          width: "0.8em",
          height: "0.8em",
        },
      }
      },
      MUIDataTableToolbar:{
        width: "100px",
        // actions:{
        // position:"relative",
        // top:"10px",
        // textAlign: "left"
        // }
      },
      MUIDataTableSearch:{
        main:{
          width:"670px",
          padding:"0px",
          margin:"0px",
        }
      },
      MuiToolbar: {
        root: {
          padding: "0px",
          fontFamily: "Poppins",
          // width:"10%",
          // left:"820px",
        },
        // gutters: {
        //   paddingLeft:5,
        //   paddingRight: 5,
        //   //eslint-disable-next-line no-useless-computed-key
        //   ["@media (min-width:600px)"]: {
        //     paddingLeft:5,
        //     paddingRight: 5,
        //   }
        // },
        
      },
      MUIDataTablePagination:{
        root:{
          overflow:"visible",
        },
        navContainer:{
          display:"inline"
        },
      },
      MuiTable: {
        root: {
          borderCollapse: "Seperate",
        },
      },
    },
  });
};