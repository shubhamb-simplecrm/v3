import { LBL_NO_RECORDS_FOUND, LBL_PLEASE_WAIT_WHILE_DATA_LOADING, LBL_TABLE_DISPLAY_ROWS_TITLE, LBL_TABLE_PAGE_NEXT_TITLE, LBL_TABLE_PAGE_PREVIOUS_TITLE, LBL_TABLE_PER_PAGE_TITLE, LBL_TABLE_SORT_TITLE } from "../../constant";

export const options = (meta, page, changePageOrSort, loading) => ({
  filter: false,
  download: false,
  responsive: "standard",
  serverSide: true,
  count: meta,
  rowsPerPage: 20,
  page,
  fixedHeader: true,
  fixedSelectColumn: true,
  search: false,
  print: false,
  viewColumns: false,
  selectableRows: false,
  onTableChange: (action, tableState) => {
    switch (action) {
      case "changePage":
        if (tableState.sortOrder.hasOwnProperty("name")) {
          let directionToSort =
            tableState.sortOrder.direction === "desc"
              ? `-${tableState.sortOrder.name}`
              : tableState.sortOrder.name;
          changePageOrSort(tableState.page + 1, directionToSort);
          break;
        }
        tableState.page = tableState.page + 1;
        changePageOrSort(tableState.page);
        break;
      case "sort":
        if (tableState.sortOrder.direction === "desc") {
          changePageOrSort(
            tableState.page + 1,
            `-${tableState.sortOrder.name}`,
          );
          break;
        }
        changePageOrSort(tableState.page + 1, tableState.sortOrder.name);
        break;
      default:
    }
  },
  textLabels: {
    body: {
      noMatch: loading ? LBL_PLEASE_WAIT_WHILE_DATA_LOADING : LBL_NO_RECORDS_FOUND,
      toolTip: LBL_TABLE_SORT_TITLE,
    },
    pagination: {
      next: LBL_TABLE_PAGE_NEXT_TITLE,
      previous: LBL_TABLE_PAGE_PREVIOUS_TITLE,
      rowsPerPage: LBL_TABLE_PER_PAGE_TITLE,
      displayRows: LBL_TABLE_DISPLAY_ROWS_TITLE,
    },
  },
  rowsPerPageOptions:[]
});
