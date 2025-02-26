import React from "react";
import MuiTablePagination from "@material-ui/core/TablePagination";
import { TableCell, TableRow, TableFooter } from "@material-ui/core";
import { pathOr } from "ramda";

export const CustomFooter = (props) => {
  const { count, textLabels, rowsPerPage, page, relateFieldMeta } = props;
  const last_page = pathOr("", ["last_page"], relateFieldMeta);
  const pagination = pathOr("", ["pagination_string"], relateFieldMeta);

  const handlePageChange = (_, page) => {
    props.changePage(page);
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
            labelDisplayedRows={({ from, to, count }) => {
              return `${pagination}`;
            }}
            backIconButtonProps={{
              disabled: page == 0,
              "aria-label": textLabels.previous,
              size: "medium",
            }}
            nextIconButtonProps={{
              disabled: last_page === true,
              "aria-label": textLabels.next,
              size: "medium",
            }}
            rowsPerPageOptions={[]}
            onChangePage={handlePageChange}
          />
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

export default CustomFooter;
