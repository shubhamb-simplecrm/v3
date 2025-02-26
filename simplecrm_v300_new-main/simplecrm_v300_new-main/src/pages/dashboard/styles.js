import { createMuiTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({}));

export const getMuiTheme = (theme) => {
  return createMuiTheme({
    ...theme,
    overrides: {
      MUIDataTable: {
        responsiveBase: {
          [theme.breakpoints.down("sm")]: {
            background: theme.palette.background.listView,
          },
        },
      },
      //row horizontal everything collapse
      MuiTableCell: {
        root: {
          fontFamily: "Poppins",
          background: theme.palette.primary.listview,
          [theme.breakpoints.down("sm")]: {
            display: "table",
            width: "100% !important",
            border: "none",
          },
        },
      },
      //expanded by deafult and arrow and heading collapse
      MUIDataTableSelectCell: {
        fixedLeft: {
          ["@media (max-width:959.95px)"]: {
            borderWidth: theme.brdrWidth,
            borderColor: "#ffffff",
            borderStyle: "solid",
            backgroundColor: theme.palette.primary.listview,
            padding: 5,
            display: "block",
          },
          ["@media (max-width:1099.95px)"]: {
            position: "relative",
          },
        },
        fixedHeader: {
          ["@media (max-width:1099.95px)"]: {
            position: "relative",
          },
        },
        root: {
          ["@media (max-width:959.95px)"]: {
            "& div": {
              justifyContent: "space-between",
              flexDirection: "row-reverse",
              paddingRight: "15px",
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
      //expanded left column grey in mobile view
      MUIDataTableBodyCell: {
        root: {
          padding: "5px",
          borderCollapse: "initial",
        },
        stackedHeader: {
          [theme.breakpoints.down("sm")]: {
            color: theme.palette.label.listView.color,
            fontSize: "0.875rem !important",
          },
        },
      },
      //row heading vertical collapse
      MuiTableRow: {
        root: {
          [theme.breakpoints.down("sm")]: {
            position: "relative",
            margin: "10px auto 10px auto !important",
            display: "block",
            width: "95% !important",
          },
        },
      },
      //removes row top and bottom border
      MUIDataTableBodyRow: {
        responsiveStacked: {
          border: "none !important",
        },
      },
      MuiCardContent: {
        root: {
          boxShadow: "none !important",
        },
      },
      MuiTab: {
        root: {
          textTransform: "none",
          padding: "0px",
          margin: "0px",
        },
      },
    },
  });
};
