import React from "react";
import MuiTablePagination from "@material-ui/core/TablePagination";
import { pathOr } from "ramda";

const CustomFooter = (props) => {
  const {
    count,
    textLabels,
    rowsPerPage,
    page,
    changePage,
    listViewMetaData,
    totalRecords,
  } = props;
  const last_page = pathOr("", ["last_page"], listViewMetaData);
  const pagination = pathOr("", ["pagination_string"], listViewMetaData);
  const handlePageChange = (_, page) => {
    changePage(page);
  };
  if (count > 0) {
    return (
      <MuiTablePagination
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        labelDisplayedRows={({ from, to, count }) => {
          return `${pagination}`;
        }}
        backIconButtonProps={{
          disabled: page == 1,
          "aria-label": textLabels.previous,
          size: "medium",
        }}
        nextIconButtonProps={{
          disabled: last_page,
          "aria-label": textLabels.next,
          size: "medium",
        }}
        rowsPerPageOptions={[]}
        onChangePage={handlePageChange}
      />
    );
  }
};

export default CustomFooter;
