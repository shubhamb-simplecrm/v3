import React, { useState } from "react";
import MuiTablePagination from "@material-ui/core/TablePagination";
import { TableCell, useTheme, TableRow, TableFooter } from "@material-ui/core";
import useStyles from "./styles";
import { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { pathOr } from "ramda";

const CustomFooterSearch = (props) => {
  const theme = useTheme();
  const {
    count,
    totalRecords,
    textLabels,
    rowsPerPage,
    page,
    relateFieldData,
  } = props;

  const flag = pathOr("", ["meta", "last_page"], relateFieldData);
  const totalCountRecord = pathOr(
    "",
    ["meta", "pagination_string"],
    relateFieldData,
  );
  const paginationString = pathOr(
    "",
    ["meta", "pagination_string"],
    relateFieldData,
  );
  
  const handleRowChange = (event) => {
  };
  const handlePageChange = (_, page) => {
    props.changePage(page);
  };

  const footerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    padding: "0px 24px 0px 24px",
  };
  
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <TableFooter>
        <TableRow>
          <TableCell style={footerStyle} colSpan={1000}>
            <MuiTablePagination
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              labelDisplayedRows={({ from, to, count }) => {
                return `${paginationString}`;
              }}
              backIconButtonProps={{
                disabled: page == 0,
                "aria-label": textLabels.previous,
                size: "medium",
              }}
              nextIconButtonProps={{
                disabled: flag === true,
                "aria-label": textLabels.next,
                size: "medium",
              }}
              rowsPerPageOptions={[]}
              onChangePage={handlePageChange}
            />
          </TableCell>
        </TableRow>
      </TableFooter>
    </MuiThemeProvider>
  );
};

export default CustomFooterSearch;
