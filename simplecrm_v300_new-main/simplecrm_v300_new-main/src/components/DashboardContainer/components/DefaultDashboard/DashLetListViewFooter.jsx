import React from "react";
import MuiTablePagination from "@material-ui/core/TablePagination";
import { TableCell, TableRow, TableFooter } from "@material-ui/core";
import { pathOr } from "ramda";

const DashLetListViewFooter = (props) => {
  const { count, textLabels, rowsPerPage, page, metaData, changePage } = props;
  const last_page = pathOr(true, ["last_page"], metaData);
  const pagination = pathOr("", ["pagination_string"], metaData);

  const handlePageChange = (_, page) => {
    changePage(page);
  };

  const footerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    padding: "0px 24px 0px 24px",
  };

  return (
    <TableFooter>
      <TableRow>
        <TableCell style={footerStyle} colSpan={1000}>
          <MuiTablePagination
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={textLabels.rowsPerPage}
            labelDisplayedRows={({ from, to, count }) => {
              return count ? `${pagination ? pagination : `${from}-${to} of ${count}`}` : null;
            }}
            backIconButtonProps={{
              disabled: page == 0,
              "aria-label": textLabels.previous,
              size: "medium",
            }}
            nextIconButtonProps={{
              disabled: last_page,
              "aria-label": textLabels.next,
              size: "medium",
            }}
            rowsPerPageOptions={[]}
            onPageChange={handlePageChange}
          />
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

export default DashLetListViewFooter;
