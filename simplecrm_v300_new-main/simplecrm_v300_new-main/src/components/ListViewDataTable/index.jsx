import {
  Button,
  ButtonGroup,
  Checkbox,
  Grid,
  MuiThemeProvider,
  Radio,
  useTheme,
  Grow,
  Popper,
  MenuItem,
  MenuList,
  Paper,
  Badge,
  Backdrop,
  Divider,
  Typography,
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import parse from "html-react-parser";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import useStyles, { getMuiTheme } from "./styles";
import {
  checkInitGroupValidate,
  checkMaskingCondition,
} from "../../common/utils";
import { isEmpty, isNil, pathOr } from "ramda";
import { LAYOUT_VIEW_TYPE } from "../../common/layout-constants";
import {
  getFieldDataLabel,
  handleSelectChange,
  recordSelectOptionsKeys,
  recordSelectOptionsObj,
  getDefaultOption,
} from "./listview-utils";
import CustomToolbar from "./components/CustomToolbar";
import {
  LBL_TABLE_DISPLAY_ROWS_TITLE,
  LBL_TABLE_PAGE_NEXT_TITLE,
  LBL_TABLE_PAGE_PREVIOUS_TITLE,
  LBL_TABLE_PER_PAGE_TITLE,
  LBL_TABLE_SORT_TITLE,
} from "../../constant";
import CustomListViewFooter from "./components/CustomListViewFooter";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import useCommonUtils from "@/hooks/useCommonUtils";
import { NoRecord, SearchingRecord, Skeleton, SkeletonShell } from "..";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import "./styles.css";

function ListViewDataTable(props) {
  const {
    title = null,
    currentModule,
    listData = [],
    listColumnLabels = [],
    fieldConfigurationOptions = {
      fieldConfigurationObj: {},
      listViewFields: {},
    },
    customListDataOptions = {},
    listViewOptions = {},
    loading,
  } = props;
  const { onListStateChange = null } = customListDataOptions;
  const classes = useStyles();
  const isMobile = useIsMobileView();
  const currentTheme = useTheme();
  const { allowC360ModulesList } = useCommonUtils();
  const selectedRowsList = pathOr({}, ["selectedRowsList"], listViewOptions);
  const pageNo = pathOr(1, ["pageNo"], listViewOptions);
  const getListData = useMemo(() => {
    const listViewFields = pathOr(
      {},
      ["listViewFields"],
      fieldConfigurationOptions,
    );
    const fieldConfigurationObj = pathOr(
      {},
      ["fieldConfigurationObj"],
      fieldConfigurationOptions,
    );
    // if listview data is empty
    if (!Array.isArray(listData)) return [];

    // if listview data without field configuration
    if (isEmpty(listViewFields) && !isEmpty(fieldConfigurationObj)) {
      return listData.map((list) => {
        let recordFormValues = pathOr({}, ["attributes"], list);
        return recordFormValues;
      });
    }

    //  listview data with field configuration
    return listData.map((list) => {
      let recordFormValues = pathOr({}, ["attributes"], list);
      // const getFCErrorResponse = checkInitGroupValidate(
      //   listViewFields,
      //   recordFormValues,
      //   fieldConfigurationObj,
      //   true,
      //   {},
      //   ["visible"],
      //   listViewFields,
      // );
      // const recordErrors = pathOr({}, ["errors"], getFCErrorResponse);
      // Object.keys(listViewFields).map((item) => {
      //   if (recordErrors[item] === "InVisible") {
      //     recordFormValues[item] = "";
      //   }
      // });
      const fieldsToFormat = ["text", "wysiwyg"];
      Object.entries(recordFormValues).forEach(([row, val]) => {
        if (
          fieldsToFormat.includes(listViewFields?.[row]?.type) &&
          typeof val === "string"
        ) {
          recordFormValues[row] = parse(val);
        }
      });

      recordFormValues = checkMaskingCondition(
        fieldConfigurationObj,
        recordFormValues,
        "masking",
        listViewFields,
      );
      return recordFormValues;
    });
  }, [listData, fieldConfigurationOptions]);

  const getDataColumns = useMemo(() => {
    const columnList = [
      getFieldDataLabel(
        { label: "Action", name: "action", type: "action" },
        currentModule,
        listData,
        LAYOUT_VIEW_TYPE.listView,
        {
          ...customListDataOptions,
          allowC360ModulesList,
          onListStateChange,
          pageNo,
        },
        classes,
      ),
    ];

    listColumnLabels
      .filter((it) => it?.name)
      .forEach((listDataLabel) => {
        columnList.push(
          getFieldDataLabel(
            listDataLabel,
            currentModule,
            listData,
            LAYOUT_VIEW_TYPE.listView,
            {
              ...customListDataOptions,
              allowC360ModulesList,
              onListStateChange,
            },
            classes,
          ),
        );
      });
    return columnList;
  }, [listColumnLabels, listData, currentModule, onListStateChange, classes]);
  const handleTableStateChange = (
    action,
    tableState,
    shouldCustomFooterShow = true,
  ) => {
    switch (action) {
      case "sort":
        onListStateChange({
          pageNo: 1,
          sortOptionObj: tableState.sortOrder,
          withFilterRefresh: true,
          withAppliedFilter: true,
        });
        break;
      case "changePage":
        onListStateChange({
          pageNo: tableState.page + (!!shouldCustomFooterShow ? 0 : 1),
          withFilterRefresh: true,
          withAppliedFilter: true,
        });
        break;
      default:
        break;
    }

    if (tableState.curExpandedRows) {
      var nodetr = document.getElementById(
        "MUIDataTableBodyRow-" +
          pathOr("", ["curExpandedRows", 0, "index"], tableState),
      );
      if (!nodetr) {
        nodetr = document.getElementById(
          "MUIDataTableBodyRow-ListViewTable-" +
            pathOr("", ["curExpandedRows", 0, "index"], tableState),
        );
      } else {
        var svgElement = nodetr.querySelector("svg");
        svgElement.classList.add("MUIDataTableSelectCell-expanded");
      }
    }
  };
  const listOptions = useMemo(() => {
    const isListEmpty = isEmpty(listData);
    const getSelectedRowIndexList = () => {
      const indexList = [];
      if (selectedRowsList.hasOwnProperty("all")) {
        Array.apply(null, Array(listData?.length)).forEach(function (_, i) {
          indexList.push(i);
        });
      } else {
        listData?.forEach((v, i) => {
          let recordId = pathOr(null, ["id"], v);
          if (Object.keys(selectedRowsList).includes(recordId))
            indexList.push(i);
        });
      }
      return indexList;
    };
    const tableBodyHeight = isMobile
      ? "100%"
      : pathOr("100%", ["tableBodyHeight"], listViewOptions);
    const tableBodyMaxHeight = isMobile
      ? "100%"
      : pathOr("100%", ["tableBodyMaxHeight"], listViewOptions);
    const paginationString = pathOr(
      null,
      ["listMetaData", "pagination_string"],
      customListDataOptions,
    );
    const lastPageFlag = pathOr(
      null,
      ["listMetaData", "last_page"],
      customListDataOptions,
    );
    const shouldCustomFooterShow =
      !isNil(paginationString) && !isNil(lastPageFlag);
    const totalCount = pathOr(
      -1,
      ["listMetaData", "total-records"],
      customListDataOptions,
    );

    return {
      ...getDefaultOption(),
      ...listViewOptions,
      tableBodyHeight,
      tableBodyMaxHeight,
      tableId: pathOr(null, ["tableId"], listViewOptions),
      rowsSelected: getSelectedRowIndexList(),
      selectableRowsHeader: !isEmpty(listData),
      selectableRows: "multiple",
      responsive: "vertical",
      rowsPerPageOptions: [],
      rowsPerPage: pathOr(10, ["pageRowSize"], listViewOptions),
      page:
        pathOr(1, ["pageNo"], listViewOptions) -
        (!!shouldCustomFooterShow ? 0 : 1),
      sortOptions: pathOr({}, ["sortOptions"], listViewOptions),
      count: shouldCustomFooterShow ? -1 : totalCount,
      textLabels: {
        body: {
          noMatch: <NoRecord />,
          toolTip: LBL_TABLE_SORT_TITLE,
        },
        pagination: {
          next: LBL_TABLE_PAGE_NEXT_TITLE,
          previous: LBL_TABLE_PAGE_PREVIOUS_TITLE,
          rowsPerPage: LBL_TABLE_PER_PAGE_TITLE,
          displayRows: LBL_TABLE_DISPLAY_ROWS_TITLE,
        },
      },
      onTableChange: (...a) =>
        handleTableStateChange(...a, shouldCustomFooterShow),
      onRowSelectionChange: (
        currentRowsSelected,
        allRowsSelected,
        rowsSelected,
      ) =>
        handleSelectChange(
          currentRowsSelected,
          rowsSelected,
          selectedRowsList,
          listData,
          listViewOptions?.onRowSelectionChange,
        ),
      customToolbar: () => (
        <CustomToolbar
          customListDataOptions={customListDataOptions}
          currentModule={currentModule}
          selectedRowsList={selectedRowsList}
          isListEmpty={isListEmpty}
          listViewOptions={listViewOptions}
          onRowSelectionChange={listViewOptions?.onRowSelectionChange}
        />
      ),
      customFooter:
        shouldCustomFooterShow &&
        ((
          count,
          page,
          rowsPerPage,
          changeRowsPerPage,
          changePage,
          textLabels,
        ) => (
          <CustomListViewFooter
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            changeRowsPerPage={changeRowsPerPage}
            changePage={changePage}
            textLabels={textLabels}
            listViewMetaData={customListDataOptions?.listMetaData}
          />
        )),
      expandableRows: window.innerWidth < 995.95,
      onRowExpansionChange: (currentRowsExpanded) => {
        var nodetr = document.getElementById(
          "MUIDataTableBodyRow-" + currentRowsExpanded[0].index,
        );
        if (!nodetr) {
          nodetr = document.getElementById(
            `MUIDataTableBodyRow-${pathOr(
              null,
              ["tableId"],
              listViewOptions,
            )}-${currentRowsExpanded[0].index}`,
          );
        }
        var svgElement = nodetr.querySelector("svg");
        var nodetd = nodetr.children;
        for (var i = 1; i < nodetd.length; i++) {
          if (
            nodetd[i].style.display === "" ||
            nodetd[i].style.display === "none"
          ) {
            nodetd[i].style.display = "block";
            svgElement.classList.add("MUIDataTableSelectCell-expanded");
          } else if (nodetd[i].style.display === "block") {
            nodetd[i].style.display = "none";
            let cls = "MUIDataTableSelectCell-expanded";
            svgElement.classList.remove.apply(
              svgElement.classList,
              Array.from(svgElement.classList).filter((v) => v.startsWith(cls)),
            );
          }
        }
      },
      renderExpandableRow: (rowData, rowMeta) => {},
    };
  }, [
    customListDataOptions,
    handleTableStateChange,
    listViewOptions,
    handleSelectChange,
    selectedRowsList,
    isMobile,
  ]);

  return (
    <div>
      {loading && (
        <Backdrop className={classes.backdrop} open={loading}>
          <SkeletonShell layout="listView" display />
        </Backdrop>
      )}

      <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
        <MUIDataTable
          title={title}
          className={classes.listDataTable}
          data={getListData}
          columns={getDataColumns}
          options={listOptions}
          components={{
            Checkbox: (props) => (
              <CustomCheckbox
                {...props}
                onRowSelectionChange={listViewOptions?.onRowSelectionChange}
                selectedRowsList={selectedRowsList}
              />
            ),
          }}
        />
      </MuiThemeProvider>
    </div>
  );
}

export const CustomCheckbox = memo(
  ({ onRowSelectionChange, selectedRowsList, ...props }) => {
    const isMobileView = useIsMobileView();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const isSelectAll = selectedRowsList?.hasOwnProperty("all");
    const handleMenuItemClick = (event, key) => {
      if (recordSelectOptionsKeys?.select_all == key) {
        onRowSelectionChange({ all: {} }, null, null);
      } else if (recordSelectOptionsKeys?.deselect_all == key) {
        onRowSelectionChange({}, null, null);
      }
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };
    const isOptionDisable = (optionKey) => {
      if (
        recordSelectOptionsKeys.deselect_all == optionKey &&
        isEmpty(selectedRowsList)
      ) {
        return true;
      } else if (
        recordSelectOptionsKeys.select_all == optionKey &&
        isSelectAll
      ) {
        return true;
      }
      return false;
    };

    if (props["data-description"] === "row-select-header") {
      return (
        <>
          {isMobileView ? (
            <Checkbox
              {...props}
              checked={isSelectAll}
              color="primary"
              onClick={(e) => {
                handleMenuItemClick(
                  e,
                  isEmpty(selectedRowsList) ? "select_all" : "deselect_all",
                );
              }}
              indeterminate={!isSelectAll && !isEmpty(selectedRowsList)}
            />
          ) : (
            <Badge
              badgeContent={
                isSelectAll ? "all" : Object.keys(selectedRowsList).length
              }
              color="secondary"
              fullWidth
            >
              <ButtonGroup
                variant="outlined"
                color="primary"
                ref={anchorRef}
                aria-label="split button"
                style={{
                  minWidth: 0,
                }}
              >
                <Button
                  style={{
                    minWidth: 30,
                    padding: 0,
                  }}
                  // onClick={(e) => e.()}
                  // disabled={true}
                >
                  <Checkbox
                    {...props}
                    indeterminate={!isSelectAll && !isEmpty(selectedRowsList)}
                    disabled={isSelectAll}
                  />
                </Button>

                <Button
                  color="primary"
                  size="small"
                  aria-controls={open ? "split-button-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-label="select merge strategy"
                  aria-haspopup="menu"
                  onClick={handleToggle}
                  style={{
                    minWidth: 30,
                    padding: 0,
                  }}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
            </Badge>
          )}

          <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{ zIndex: 9999 }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="split-button-menu">
                          {Object.entries(recordSelectOptionsObj).map(
                            ([optionKey, optionLbl], index) => (
                              <MenuItem
                                key={optionKey}
                                disabled={isOptionDisable(optionKey)}
                                // selected={optionKey === recordSelectedType}
                                onClick={(event) =>
                                  handleMenuItemClick(event, optionKey)
                                }
                              >
                                {optionLbl}
                              </MenuItem>
                            ),
                          )}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Grid>
          </Grid>
        </>
      );
    } else if (props["data-description"] === "row-select") {
      return <Checkbox {...props} disabled={isSelectAll} />;
    } else {
      return null;
    }
  },
);

export default ListViewDataTable;