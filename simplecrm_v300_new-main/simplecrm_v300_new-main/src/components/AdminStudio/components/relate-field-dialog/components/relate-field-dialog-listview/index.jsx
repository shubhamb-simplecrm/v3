import {
  Button,
  Link as MuiLink,
  MuiThemeProvider,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import clsx from "clsx";
import MUIDataTable from "mui-datatables";
import { isEmpty, isNil, pathOr, trim } from "ramda";
import React, { useState } from "react";

import VisibilityIcon from "@material-ui/icons/Visibility";
import EnvUtils from "../../../../../../../common/env-utils";
import {
  LBL_NO_RECORDS_FOUND_MESSAGE,
  LBL_PLEASE_WAIT_WHILE_DATA_LOADING,
  LBL_TABLE_DISPLAY_ROWS_TITLE,
  LBL_TABLE_PAGE_NEXT_TITLE,
  LBL_TABLE_PAGE_PREVIOUS_TITLE,
  LBL_TABLE_PER_PAGE_TITLE,
  LBL_TABLE_SORT_TITLE,
} from "../../../../../../../constant";
import CustomFooter from "./components/CustomFooter";
import { ListViewOption } from "./listview-options";
import useStyles, { getMuiTheme } from "./styles";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import FileViewerComp from "../../../../../../FileViewer/FileViewer";
import { withStyles } from "@material-ui/styles";
import parse from "html-react-parser";
const MuiCustomLink = withStyles({
  root: {
    "&[disabled]": {
      cursor: "default",
      "&:hover": {
        textDecoration: "none",
      },
    },
  },
})(MuiLink);
const RelateFieldDialogListView = (props) => {
  const {
    module,
    multiSelect = false,
    listViewData,
    view,
    filterQuery,
    searchData,
    onChange,
    toggleDialogVisibility,
    field,
    listViewPageNum,
    handleConfirmMultiSelectedRecord,
    selectedRecordListView,
    setSelectedRecordListView,
    listViewSortOption,
    errorMessage,
  } = props;
  const theme = useTheme();
  const classes = useStyles();
  const [previewFile, setPreviewFile] = useState({
    open: false,
    filename: "",
    filepath: "",
  });
  const { config } = useSelector((state) => state.config);
  const site_url = pathOr("", ["site_url"], config);
  const listDataLabels = pathOr([], ["datalabels"], listViewData);
  const listData = pathOr([], ["data"], listViewData);
  const listMetaData = pathOr([], ["meta"], listViewData);
  const setSelectedRecordIndexes = listData
    ?.map((row, index) => {
      const selectedRecordsArr = pathOr([], ["idsArr"], selectedRecordListView);
      if (selectedRecordsArr.includes(row.id)) {
        return index;
      }
    })
    .filter((e) => e !== undefined);
  const handleSelectChange = (
    currentRowsSelected = null,
    allRowsSelected = null,
    rowsSelected = null,
  ) => {
    const tempSelectedRecordObj = {
      idsArr: [],
      selectedRecords: {},
    };
    if (!isEmpty(currentRowsSelected)) {
      // to check if any record uncheck in listview
      if (
        currentRowsSelected.length == 1 &&
        !rowsSelected.includes(currentRowsSelected[0]["index"])
      ) {
        const selectRecordId = pathOr(
          "",
          [currentRowsSelected[0]["index"], "id"],
          listData,
        );
        if (!isEmpty(selectRecordId)) {
          setSelectedRecordListView((v) => {
            if (v?.selectedRecords.hasOwnProperty(selectRecordId)) {
              delete v?.selectedRecords[selectRecordId];
            }
            const removingIdIndex = v?.idsArr?.indexOf(selectRecordId);

            if (removingIdIndex > -1) {
              v?.idsArr?.splice(removingIdIndex, 1);
            }
            return { ...v };
          });
        }
      } else {
        rowsSelected.forEach((indexSelected) => {
          const selectedRecordData = pathOr({}, [indexSelected], listData);
          const filteredSelectedRecordData = {
            id: selectedRecordData?.id,
            type: selectedRecordData?.type,
            attributes: selectedRecordData?.attributes,
          };
          const selectedRecordId = pathOr("", ["id"], selectedRecordData);
          if (!isEmpty(selectedRecordId)) {
            tempSelectedRecordObj["idsArr"].push(selectedRecordId);
            tempSelectedRecordObj["selectedRecords"][selectedRecordId] =
              filteredSelectedRecordData;
          }
        });
        setSelectedRecordListView((v) => {
          v["selectedRecords"] = {
            ...v["selectedRecords"],
            ...tempSelectedRecordObj["selectedRecords"],
          };

          let prevSelectedIds = pathOr([], ["idsArr"], v);
          let allSelectedRecordIds = [
            ...prevSelectedIds,
            ...tempSelectedRecordObj["idsArr"],
          ];
          let uniqueAllSelectedRecordIds = [...new Set(allSelectedRecordIds)];
          v["idsArr"] = uniqueAllSelectedRecordIds;
          return { ...v };
        });
      }
    }
  };
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  const handleShowPreviewFile = (fname, url) => {
    let arr = fname.split(".");
    let ext = arr[arr.length - 1].toUpperCase();
    setPreviewFile({
      open: true,
      filename: fname,
      filepath: url,
      filetype: ext,
    });
  };

  const handleOnTableChange = (action, tableState) => {
    switch (action) {
      case "changePage":
        if (tableState.sortOrder.hasOwnProperty("name")) {
          let directionToSort =
            tableState.sortOrder.direction === "desc"
              ? `-${tableState.sortOrder.name}`
              : tableState.sortOrder.name;
          changePageOrSort(tableState.page, directionToSort);
          break;
        }
        changePageOrSort(tableState.page);
        break;
      case "sort":
        if (tableState.sortOrder.direction === "desc") {
          changePageOrSort(tableState.page, `-${tableState.sortOrder.name}`);
          break;
        }
        changePageOrSort(tableState.page, tableState.sortOrder.name);
        break;
      default:
        tableState.announceText = module;
        handleTableChange(action, tableState);
    }
  };

  const handleTableChange = (action, tableState) => {
    let tableCont = document.getElementsByClassName(tableState.announceText);
    if (tableCont[0] && tableCont[0].children[2]) {
      let table = tableCont[0].children[2].children[0];
      if (tableState.curExpandedRows) {
        let nodetr = table.children[2].querySelector(
          "#MUIDataTableBodyRow-" + tableState.curExpandedRows[0].index,
        );
        if (!nodetr) {
          nodetr = table.children[2].querySelector(
            "#MUIDataTableBodyRow-RelateListViewTable-" +
              tableState.curExpandedRows[0].index,
          );
        }
        if (nodetr) {
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
                Array.from(svgElement.classList).filter((v) =>
                  v.startsWith(cls),
                ),
              );
            }
          }
        }
      }
    }
  };
  const changePageOrSort = (page, sort) => {
    searchData(page, filterQuery, sort);
  };
  const columns = listDataLabels.map((it) => {
    if (it.name === "name" || it.name === "document_name") {
      return {
        ...it,
        options: {
          setCellProps: (value) => {
            return {
              className: clsx({
                [classes.NameCell]: true,
              }),
            };
          },
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            const id = listData[tableMeta["rowIndex"]]?.id;
            return (
              <Typography>
                <MuiCustomLink
                  className={classes.link}
                  // disabled={multiSelect}
                  onClick={() => {
                    if (!multiSelect) {
                      toggleDialogVisibility();
                      if (field.field_key === "aos_products") {
                        onChange({
                          id,
                          value,
                          rowData: listData[tableMeta["rowIndex"]],
                        });
                      } else if (module === "EmailTemplates") {
                        onChange({
                          id,
                          value: pathOr(
                            "",
                            [tableMeta["rowIndex"], "attributes", "subject"],
                            listData,
                          ),
                          email_template: pathOr(
                            "",
                            [tableMeta["rowIndex"], "attributes", "body_html"],
                            listData,
                          ),
                        });
                      } else {
                        let outputValue = value;
                        const firstNameValue = pathOr(
                          null,
                          [tableMeta["rowIndex"], "attributes", "first_name"],
                          listData,
                        );
                        const lastNameValue = pathOr(
                          null,
                          [tableMeta["rowIndex"], "attributes", "last_name"],
                          listData,
                        );
                        if (!isNil(firstNameValue) && !isNil(lastNameValue)) {
                          outputValue =
                            `${firstNameValue} ${lastNameValue}`.trim();
                        }
                        onChange({
                          id,
                          value: outputValue,
                          email:
                            listData[tableMeta["rowIndex"]].attributes &&
                            listData[tableMeta["rowIndex"]].attributes.email1
                              ? listData[tableMeta["rowIndex"]].attributes
                                  .email1
                              : "",
                          rowData: listData[tableMeta["rowIndex"]],
                        });
                      }
                    }
                  }}
                  variant="body2"
                >
                  {value}
                </MuiCustomLink>
              </Typography>
            );
          },
        },
      };
    } else if (it.type === "file") {
      const url = new URL(EnvUtils.getValue("REACT_APP_BASE_URL"));
      const baseUrl = `${url.protocol}//${url.hostname}`;
      return {
        ...it,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            let furl = `${site_url}/index.php?entryPoint=customDownload&id=${
              listData[tableMeta["rowIndex"]].id
            }&type=${module}&field_id=${it.name}`;
            return value ? (
              <Typography>
                <VisibilityIcon
                  fontSize="small"
                  style={{
                    margin: "-1vh",
                    marginLeft: "1vh",
                    marginRight: "1vw",
                    cursor: "pointer",
                  }}
                  onClick={() => handleShowPreviewFile(value, furl)}
                />
                <Tooltip title={value}>
                  <MuiCustomLink
                    disabled={multiSelect}
                    className={classes.link}
                    onClick={() => {
                      saveAs(furl, listData[tableMeta["rowIndex"]].filename);
                      toast("Download is in progress...");
                    }}
                    variant="body2"
                  >
                    {truncate(value, 20) ||
                      truncate(
                        listData[tableMeta["rowIndex"]].document_name,
                        20,
                      ) ||
                      ""}
                  </MuiCustomLink>
                </Tooltip>
              </Typography>
            ) : (
              ""
            );
          },
        },
      };
    } else if (it.name === "last_rev_create_date") {
      return {
        ...it,
        options: {
          sort: false,
        },
      };
    } else if (
      it.type === "date" ||
      it.type === "datetime" ||
      it.type === "datetimecombo"
    ) {
      return {
        ...it,
        options: {
          customBodyRender: (value, tableMeta, updateValue) =>
            parse(`<span>${value}</span>`),
        },
      };
    }
    return it;
  });

  return (
    <>
      <MuiThemeProvider theme={getMuiTheme(theme, module)}>
        <MUIDataTable
          columns={columns}
          data={listData.map((it) => it.attributes)}
          options={ListViewOption({
            tableId: `relateFieldTable-${module}-${field.name}`,
            responsive: "vertical",
            filter: false,
            download: false,
            print: false,
            viewColumns: false,
            selectableRows: multiSelect ? true : false,
            rowsSelected: setSelectedRecordIndexes,
            page: listViewPageNum,
            count: pathOr(0, ["total-records"], listMetaData),
            sortOrder: listViewSortOption,
            search: false,
            rowsPerPage: 20,
            fixedHeader: true,
            serverSide: true,
            rowsPerPageOptions: [20],
            textLabels: {
              body: {
                noMatch: false ? (
                  LBL_PLEASE_WAIT_WHILE_DATA_LOADING
                ) : (
                  <div style={{ padding: "10px 5px 10px 5px" }}>
                    <Alert variant="outlined" severity="warning">
                      {errorMessage
                        ? errorMessage
                        : LBL_NO_RECORDS_FOUND_MESSAGE}
                    </Alert>
                  </div>
                ),
                toolTip: LBL_TABLE_SORT_TITLE,
              },
              pagination: !isNil(listMetaData["total-records"]) && {
                next: LBL_TABLE_PAGE_NEXT_TITLE,
                previous: LBL_TABLE_PAGE_PREVIOUS_TITLE,
                rowsPerPage: LBL_TABLE_PER_PAGE_TITLE,
                displayRows: LBL_TABLE_DISPLAY_ROWS_TITLE,
              },
            },
            expandableRows: window.innerWidth < 995.95,
            onRowExpansionChange: (currentRowsExpanded) => {
              var nodetr = document.getElementById(
                "MUIDataTableBodyRow-" + currentRowsExpanded[0].index,
              );
              if (!nodetr) {
                nodetr = document.getElementById(
                  `MUIDataTableBodyRow-relateFieldTable-${module}-${field.name}-` +
                    currentRowsExpanded[0].index,
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
                    Array.from(svgElement.classList).filter((v) =>
                      v.startsWith(cls),
                    ),
                  );
                }
              }
            },
            renderExpandableRow: (rowData, rowMeta) => {},
            onRowSelectionChange: handleSelectChange,
            // customToolbar: () => {
            //   return view === "calendar" ? (
            //     <Button
            //       className={classes.btn}
            //       style={{ float: "left" }}
            //       color="primary"
            //       variant="outlined"
            //     // onClick={() => multiSelectRecords(["clear"])}
            //     >
            //       Clear
            //     </Button>
            //   ) : null;
            // },
            customToolbarSelect: (
              selectedRows,
              displayData,
              setSelectedRows,
            ) => {
              return (
                <Button
                  className={classes.btn}
                  color="primary"
                  variant="outlined"
                  onClick={() =>
                    handleConfirmMultiSelectedRecord(selectedRecordListView)
                  }
                >
                  Select
                </Button>
              );
            },
            onTableChange: handleOnTableChange,
            customFooter: (
              count,
              page,
              rowsPerPage,
              changeRowsPerPage,
              changePage,
              textLabels,
            ) => {
              return (
                <CustomFooter
                  count={count}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  changeRowsPerPage={changeRowsPerPage}
                  changePage={changePage}
                  textLabels={textLabels}
                  totalRecords={
                    listMetaData["total-records"]
                      ? listMetaData["total-records"]
                      : 0
                  }
                  listViewMetaData={listMetaData}
                />
              );
            },
          })}
        />
      </MuiThemeProvider>
      {previewFile.open ? (
        <FileViewerComp
          previewFile={previewFile}
          setPreviewFile={setPreviewFile}
        />
      ) : null}
    </>
  );
};

export default RelateFieldDialogListView;
