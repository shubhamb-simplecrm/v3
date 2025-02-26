import React from "react";
import MuiTablePagination from "@material-ui/core/TablePagination";
import {
  TableCell,
  useTheme,
  TableRow,
  TableFooter,
  IconButton,
} from "@material-ui/core";
import { pathOr } from "ramda";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
const footerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  padding: "0px 24px 0px 24px",
};
const CustomListViewFooter = (props) => {
  const { count, textLabels, rowsPerPage, page, listViewMetaData, changePage } =
    props;
  const isLastPage = pathOr("", ["last_page"], listViewMetaData);
  const paginationString = pathOr("", ["pagination_string"], listViewMetaData);

  const handlePageChange = (_, page) => {
    changePage(page);
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
              return `${paginationString}`;
            }}
            // backIconButtonProps={{
            //   disabled: page == 1,
            //   "aria-label": textLabels.previous,
            //   size: "medium",
            // }}
            // nextIconButtonProps={{
            //   disabled: isLastPage,
            //   "aria-label": textLabels.next,
            //   size: "medium",
            // }}
            ActionsComponent={(props) => (
              <TablePaginationActions {...props} isLastPage={isLastPage} />
            )}
            rowsPerPageOptions={[]}
            onPageChange={handlePageChange}
            isLastPage={isLastPage}
          />
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};
const TablePaginationActions = (props) => {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange, isLastPage } = props;

  function handleFirstPageButtonClick(event) {
    onPageChange(event, 1);
  }

  function handleBackButtonClick(event) {
    onPageChange(event, page - 1);
  }

  function handleNextButtonClick(event) {
    onPageChange(event, page + 1);
  }

  function handleLastPageButtonClick(event) {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  }
  return (
    <div
      style={{
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
      }}
    >
      {/* <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 1}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton> */}
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 1}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={isLastPage}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      {/* <IconButton
        onClick={handleLastPageButtonClick}
        disabled={isLastPage || true}
        // disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton> */}
    </div>
  );
};
export default CustomListViewFooter;
