import React, { memo, useEffect, useState } from "react";
import { isEmpty, isNil, pathOr } from "ramda";
import MUIDataTable from "mui-datatables";
import NoRecord from "../../../NoRecord";
import parse from "html-react-parser";
import {
  LBL_CLOSE_CONFIRM_MESSAGE,
  LBL_WARNING_TITLE,
  LBL_CONFIRM_NO,
  LBL_CONFIRM_YES,
  LBL_TABLE_DISPLAY_ROWS_TITLE,
  LBL_TABLE_PAGE_NEXT_TITLE,
  LBL_TABLE_PAGE_PREVIOUS_TITLE,
  LBL_TABLE_PER_PAGE_TITLE,
  LBL_TABLE_SORT_TITLE,
} from "../../../../constant";
import DashLetListViewFooter from "./DashLetListViewFooter";
import { toast } from "react-toastify";
import { Chip, Typography, useTheme } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { formatDate, truncateString } from "../../../../common/utils";
import { useSelector } from "react-redux";
import { getFilteredData } from "./listview-metadata";
import { NumericFormat } from "react-number-format";
import { Alert } from "../../..";
import useStyles from "./styles";
import clsx from "clsx";
import FileViewerComp from "../../../FileViewer/FileViewer";
import CloseIcon from "@material-ui/icons/Close";
import DetailViewDialogContainer from "./DetailViewDialogContainer";
import { closeActivity } from "../../../../store/actions/subpanel.actions";
import Scrollbars from "react-custom-scrollbars";
import useCommonUtils from "@/hooks/useCommonUtils";
import { IconButton } from "@/components/SharedComponents/IconButton";
import Link from "@/components/SharedComponents/Link";
import { PhoneString } from "@/components/FormComponents";
const DashLetListViewContainer = (props) => {
  const {
    dashLetTableData,
    dashLetModule,
    dashLetId,
    currentDashboardTab,
    tableTitle = "",
    titleKey = "",
    FCData = {},
    getDashLetCardData,
    dashLetPage,
    handlePageChange,
  } = props;
  const config = useSelector((state) => state.config);
  const dateFormat = pathOr(undefined, ["config", "datef"], config);
  const site_url = pathOr("", ["config", "site_url"], config);
  const dashLetSortMeta = pathOr(
    { name: "date_entered", direction: "asc" },
    ["sortOption"],
    dashLetTableData,
  );
  const statusBackground = pathOr(
    [],
    ["config", "fields_background", dashLetModule],
    config,
  );

  let statusField = Object.keys(statusBackground);
  const classes = useStyles();
  const [previewFile, setPreviewFile] = useState({
    open: false,
    filename: "",
    filepath: "",
  });
  const currentTheme = useTheme();
  const { dashletViewRowPerPage } = useCommonUtils();
  const [detailViewDialogVisibility, setDetailViewDialogVisibility] = useState({
    open: false,
    id: null,
    module: null,
  });
  const [alertVisible, setAlertVisibility] = useState(false);
  const [activityRecord, setActivityRecord] = useState("");
  const [listViewDataObj, setListViewDataObj] = useState({
    listViewRowsPerPage:
      dashLetModule == "AOR_Reports" ? 20 : dashletViewRowPerPage,
    listViewColumns: pathOr([], ["datalabels"], dashLetTableData),
    listViewData: pathOr([], ["data"], dashLetTableData),
    listViewTotalRecords: parseInt(
      pathOr(
        pathOr(0, ["totalrecords"], dashLetTableData),
        ["totalRecords"],
        dashLetTableData,
      ),
    ),
    listViewMetaData: pathOr({}, ["paginationdata"], dashLetTableData),
  });
  const [responsive, setResponsive] = useState(
    dashLetModule === "AOR_Reports" ? "standard" : "vertical",
  );
  const options = {
    responsive,
    // tableBodyHeight,
    // tableBodyMaxHeight,
    tableId: `DashletListViewTable-${dashLetId}`,
    filter: false,
    download: false,
    serverSide: true,
    count: listViewDataObj?.listViewTotalRecords,
    rowsPerPage: listViewDataObj?.listViewRowsPerPage,
    page: dashLetPage,
    fixedHeader: true,
    fixedSelectColumn: true,
    search: false,
    print: false,
    viewColumns: false,
    selectableRowsHeader: false,
    rowsPerPageOptions: [listViewDataObj?.listViewRowsPerPage],
    selectableRows: false,
    sortOrder: dashLetSortMeta,
    textLabels: {
      body: {
        noMatch: <NoRecord view="dashlet_no_data" subpanel_module="" />,
        toolTip: LBL_TABLE_SORT_TITLE,
      },
      pagination: {
        next: LBL_TABLE_PAGE_NEXT_TITLE,
        previous: LBL_TABLE_PAGE_PREVIOUS_TITLE,
        rowsPerPage: LBL_TABLE_PER_PAGE_TITLE,
        displayRows: LBL_TABLE_DISPLAY_ROWS_TITLE,
      },
    },
    onTableChange: (action, tableState) => {
      switch (action) {
        case "changePage":
          if (tableState.sortOrder.hasOwnProperty("name")) {
            changePageOrSort(
              tableState.page,
              tableState.sortOrder.name,
              tableState.sortOrder.direction,
            );
            break;
          }
          changePageOrSort(tableState.page);
          break;
        case "sort":
          changePageOrSort(
            tableState.page,
            tableState.sortOrder.name,
            tableState.sortOrder.direction,
          );
          break;

        default:
          tableState.announceText = dashLetModule;
      }
      if (tableState.curExpandedRows) {
        var nodetr = document.getElementById(
          "MUIDataTableBodyRow-" +
            pathOr("", ["curExpandedRows", 0, "index"], tableState),
        );
        if (!nodetr) {
          nodetr = document.getElementById(
            `MUIDataTableBodyRow-DashletListViewTable-${dashLetId}-` +
              pathOr("", ["curExpandedRows", 0, "index"], tableState),
          );
        }
        if (nodetr) {
          var svgElement = nodetr.querySelector("svg");
          svgElement.classList.add("MUIDataTableSelectCell-expanded");
        }
      }
    },
    expandableRows:
      dashLetModule != "AOR_Reports" && window.innerWidth < 995.95,
    onRowExpansionChange: (currentRowsExpanded) => {
      var nodetr = document.getElementById(
        "MUIDataTableBodyRow-" + currentRowsExpanded[0].index,
      );
      if (!nodetr) {
        nodetr = document.getElementById(
          `MUIDataTableBodyRow-DashletListViewTable-${dashLetId}-` +
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
            Array.from(svgElement.classList).filter((v) => v.startsWith(cls)),
          );
        }
      }
    },
    renderExpandableRow: (rowData, rowMeta) => {},
    customFooter:
      isNil(listViewDataObj?.listViewMetaData) ||
      isEmpty(listViewDataObj?.listViewMetaData)
        ? null
        : (
            count,
            page,
            rowsPerPage,
            changeRowsPerPage,
            changePage,
            textLabels,
            data,
          ) => {
            return (
              <DashLetListViewFooter
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                changeRowsPerPage={changeRowsPerPage}
                changePage={changePage}
                textLabels={textLabels}
                metaData={listViewDataObj?.listViewMetaData}
              />
            );
          },
  };
  const handleCloseDialog = () => {
    setDetailViewDialogVisibility({
      open: false,
      id: null,
      module: null,
    });
  };
  const handleOnDetailViewDialogOpen = (recordId, module) => {
    setDetailViewDialogVisibility({
      open: true,
      id: recordId,
      module: module,
    });
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

  const changePageOrSort = async (
    inputPageNo,
    sortBy = null,
    sortOrder = null,
  ) => {
    let offset = inputPageNo * listViewDataObj?.listViewRowsPerPage;
    const payload = {
      sortBy: sortBy,
      sortOrder: sortOrder,
      offset: offset,
      group_value: titleKey,
      category: "dashlet",
    };
    handlePageChange(inputPageNo);
    getDashLetCardData(currentDashboardTab, dashLetId, payload);
  };

  const confirmCloseActivity = (module, recordData) => {
    setAlertVisibility(true);
    setActivityRecord({
      payload: {
        type: dashLetModule,
        attributes: {
          status: dashLetModule === "Tasks" ? "Completed" : "Held",
          assigned_user_name: {
            id: recordData?.assigned_user_id,
            name: recordData?.assigned_user_name,
          },
        },
        id: recordData?.id,
      },
    });
  };

  const closeActivityMethod = async () => {
    setAlertVisibility(!alertVisible);
    try {
      var submitData = {
        data: {
          ...activityRecord.payload,
        },
      };
      let data = JSON.stringify(submitData);
      const res = await closeActivity(data);
      if (res.data.data.id) {
        changePageOrSort(dashLetPage);
        setTotalRecords(totalRecords - 1);
        toast(LBL_CLOSED);
      }
    } catch (e) {
      toast(e);
    }
  };

  const getFilteredDataLabels = () => {
    return [
      ...listViewDataObj.listViewColumns
        .filter((it) => it.name)
        .map((dl) => {
          let columnData = { ...dl, options: {} };
          if (
            statusField &&
            statusField.length > 0 &&
            statusField.some((item) => dl.name === item)
          ) {
            columnData["options"] = {
              filter: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                let option = dl.options
                  ? Object.keys(dl.options).find(
                      (key) => dl.options[key] === value,
                    )
                  : value;
                let optionBgColor = `${pathOr(
                  "",
                  [dl.name, option, "background_color"],
                  statusBackground,
                )}`;
                let statusStyle = {};

                if (currentTheme.palette.type === "dark") {
                  statusStyle = {
                    color: optionBgColor,
                    fontWeight: "bolder",
                    background: "transparent",
                    border: "1px solid",
                  };
                } else {
                  statusStyle = {
                    color: optionBgColor,
                    background: optionBgColor + "20",
                    border: "none",
                  };
                }

                return value && optionBgColor ? (
                  <Chip
                    size="small"
                    className={classes.statusBg}
                    style={statusStyle}
                    label={value}
                  />
                ) : (
                  value
                );
              },
            };
          } else if (dl.name === "document_name") {
            columnData["options"] = {
              setCellProps: (value) => {
                return {
                  className: clsx({
                    [classes.NameCell]: true,
                  }),
                };
              },
              filter: false,
              sort: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                const id =
                  dashLetModule === "AOR_Reports"
                    ? pathOr(
                        "",
                        [
                          "listViewData",
                          tableMeta["rowIndex"],
                          "attributes",
                          "id",
                        ],
                        listViewDataObj,
                      )
                    : pathOr(
                        "",
                        ["listViewData", tableMeta["rowIndex"], "id"],
                        listViewDataObj,
                      );
                return (
                  <Typography>
                    {id !== "" ? (
                      <Link
                        onClick={() =>
                          handleOnDetailViewDialogOpen(id, dashLetModule)
                        }
                        className={classes.link}
                        variant="body2"
                      >
                        {value}
                      </Link>
                    ) : (
                      value
                    )}
                  </Typography>
                );
              },
            };
          } else if (dl.type === "text" || dl.type === "wysiwyg") {
            columnData["options"] = {
              filter: false,
              sort: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                return parse(value);
              },
            };
          } else if (dl.type === "file" || dl.type === "image") {
            columnData["options"] = {
              filter: false,
              sort: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                let furl = `${site_url}/index.php?entryPoint=customDownload&id=${
                  listViewDataObj.listViewData[tableMeta["rowIndex"]].id
                }&type=${dashLetModule}&field_id=${dl.name}`;
                let downloadAcl = pathOr(
                  0,
                  [
                    "listViewData",
                    tableMeta["rowIndex"],
                    "aclaccess",
                    "download",
                  ],
                  listViewDataObj,
                );
                return value ? (
                  <Typography>
                    <Link
                      disabled={!downloadAcl}
                      onClick={
                        !downloadAcl
                          ? null
                          : () => {
                              saveAs(
                                furl,
                                listViewDataObj.listViewData[
                                  tableMeta["rowIndex"]
                                ].filename,
                              );
                              toast("Download is in progress...");
                            }
                      }
                      variant="body2"
                    >
                      {truncateString(value, 20) ||
                        truncate(
                          listViewDataObj.listViewData[tableMeta["rowIndex"]]
                            .document_name,
                          20,
                        ) ||
                        ""}
                    </Link>

                    <IconButton
                      tooltipTitle={value}
                      fontSize="small"
                      onClick={() => handleShowPreviewFile(value, furl)}
                      disabled={!downloadAcl}
                      color={"secondary"}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Typography>
                ) : (
                  ""
                );
              },
            };
          } else if (dl.name === "name") {
            columnData["options"] = {
              setCellProps: (value) => {
                return {
                  className: clsx(
                    dashLetModule != "AOR_Reports"
                      ? {
                          [classes.NameCell]: true,
                        }
                      : {},
                  ),
                };
              },
              filter: false,
              sort: dashLetModule === "AOR_Reports" ? false : true,
              customBodyRender: (value, tableMeta, updateValue) => {
                const id =
                  dashLetModule === "AOR_Reports"
                    ? pathOr(
                        "",
                        [
                          "listViewData",
                          tableMeta["rowIndex"],
                          "attributes",
                          "id",
                        ],
                        listViewDataObj,
                      )
                    : pathOr(
                        "",
                        ["listViewData", tableMeta["rowIndex"], "id"],
                        listViewDataObj,
                      );

                return dashLetModule === "AOR_Reports" && dl.link == "1" ? (
                  <Link
                    onClick={() =>
                      handleOnDetailViewDialogOpen(value.id, value.module)
                    }
                    className={classes.link}
                    variant="body2"
                  >
                    {value.value}
                  </Link>
                ) : (
                  <Typography>
                    {id !== "" ? (
                      <Link
                        onClick={() =>
                          handleOnDetailViewDialogOpen(id, dashLetModule)
                        }
                        className={classes.link}
                        variant="body2"
                      >
                        {value}
                      </Link>
                    ) : (
                      value
                    )}
                  </Typography>
                );
              },
            };
          } else if (dl.type === "relate") {
            columnData["options"] = {
              filter: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                const ss = dl.id_name;
                const parent_id =
                  listViewDataObj.listViewData[tableMeta["rowIndex"]][ss];
                const parent_type = dl.module;
                return dashLetModule === "AOR_Reports" && dl.link == "1" ? (
                  <Link
                    onClick={() =>
                      handleOnDetailViewDialogOpen(value.id, value.module)
                    }
                    className={classes.link}
                    variant="body2"
                  >
                    {value.value}
                  </Link>
                ) : (
                  <Typography>
                    <Link
                      onClick={() =>
                        handleOnDetailViewDialogOpen(parent_id, parent_type)
                      }
                      className={classes.link}
                      variant="body2"
                    >
                      {value}
                    </Link>
                  </Typography>
                );
              },
            };
          } else if (dl.type === "parent") {
            columnData["options"] = {
              filter: false,
              sort: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                const parent_id =
                  listViewDataObj.listViewData[tableMeta["rowIndex"]].parent_id;
                const parent_type =
                  listViewDataObj.listViewData[tableMeta["rowIndex"]]
                    .parent_type;
                return dashLetModule === "AOR_Reports" && dl.link == "1" ? (
                  <Link
                    onClick={() =>
                      handleOnDetailViewDialogOpen(value.id, value.module)
                    }
                    className={classes.link}
                    variant="body2"
                  >
                    {value.value}
                  </Link>
                ) : (
                  <Typography>
                    <Link
                      onClick={() =>
                        handleOnDetailViewDialogOpen(parent_id, parent_type)
                      }
                      className={classes.link}
                      variant="body2"
                    >
                      {value}
                    </Link>
                  </Typography>
                );
              },
            };
          } else if (
            dl.type === "date" ||
            dl.type === "datetime" ||
            dl.type === "datetimecombo"
          ) {
            columnData["options"] = {
              customBodyRender: (value, tableMeta, updateValue) =>
                dashLetModule === "AOR_Reports" && dl.link == "1" ? (
                  <Link
                    onClick={() =>
                      handleOnDetailViewDialogOpen(value.id, value.module)
                    }
                    className={classes.link}
                    variant="body2"
                  >
                    {formatDate(value.value, dateFormat)}
                  </Link>
                ) : (
                  formatDate(value, dateFormat)
                ),
              sort: dashLetModule === "AOR_Reports" ? false : true,
            };
          } else if (dl.type === "decimal") {
            columnData["options"] = {
              customBodyRender: (value, tableMeta, updateValue) =>
                dashLetModule === "AOR_Reports" && dl.link == "1" ? (
                  <Link
                    onClick={() =>
                      handleOnDetailViewDialogOpen(value.id, value.module)
                    }
                    className={classes.link}
                    variant="body2"
                  >
                    <NumericFormat
                      value={value.value}
                      displayType={"text"}
                      thousandSeparator={true}
                      decimalSeparator="."
                      decimalScale={2}
                    />
                  </Link>
                ) : (
                  <NumericFormat
                    value={value}
                    displayType={"text"}
                    thousandSeparator={true}
                    decimalSeparator="."
                    decimalScale={2}
                  />
                ),
              sort: dashLetModule === "AOR_Reports" ? false : true,
            };
          } else if (dl.type === "phone") {
            columnData["options"] = {
              customBodyRender: (value, tableMeta, updateValue) => (
                <PhoneString field={dl} value={value} />
              ),
            };
          } else if (dl.name === "action_c") {
            columnData["options"] = {
              customBodyRenderLite: (dataIndex, rowIndex) => (
                <IconButton
                  aria-label="delete"
                  className={classes.margin}
                  size="small"
                  onClick={() => alert("Edit")}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              ),
              sort: dashLetModule === "AOR_Reports" ? false : true,
            };
          } else if (dl.name === "set_complete") {
            columnData["options"] = {
              sort: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                const OpenStatus =
                  dashLetModule === "Tasks" ? "Completed" : "Held";
                return ["Tasks", "Meetings", "Calls"].includes(dashLetModule) &&
                  listViewDataObj.listViewData[tableMeta["rowIndex"]].status !==
                    OpenStatus ? (
                  <IconButton
                    aria-label="delete"
                    className={classes.margin}
                    size="small"
                    onClick={() =>
                      confirmCloseActivity(
                        dashLetModule,
                        listViewDataObj.listViewData[tableMeta["rowIndex"]],
                      )
                    }
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                ) : null;
              },
            };
          } else if (dl.name === "assigned_user_id") {
            columnData["options"] = {
              sort: false,
            };
          } else {
            columnData["options"] = {
              sort: dashLetModule === "AOR_Reports" ? false : true,
              customBodyRender: (value, tableMeta, updateValue) => {
                return dashLetModule === "AOR_Reports" && dl.link == "1" ? (
                  <Link
                    onClick={() =>
                      value &&
                      value.module &&
                      value.id &&
                      handleOnDetailViewDialogOpen(value.id, value.module)
                    }
                    className={classes.link}
                    variant="body2"
                  >
                    {pathOr("", ["value"], value)}
                  </Link>
                ) : (
                  <span style={{ wordWrap: "break-word" }}>{value}</span> || ""
                );
              },
            };
          }
          if (dashLetModule == "Emails") {
            columnData["options"]["sort"] = false;
          }
          return columnData;
        }),
    ];
  };

  useEffect(() => {
    setListViewDataObj({
      listViewRowsPerPage:
        dashLetModule == "AOR_Reports" ? 20 : dashletViewRowPerPage,
      listViewColumns: pathOr([], ["datalabels"], dashLetTableData),
      listViewData: pathOr([], ["data"], dashLetTableData),
      listViewTotalRecords: parseInt(
        pathOr(
          pathOr(0, ["totalrecords"], dashLetTableData),
          ["totalRecords"],
          dashLetTableData,
        ),
      ),
      listViewMetaData: pathOr({}, ["paginationdata"], dashLetTableData),
    });
  }, [dashLetTableData]);

  return (
    <>
      <Alert
        title={LBL_WARNING_TITLE}
        msg={LBL_CLOSE_CONFIRM_MESSAGE}
        open={alertVisible}
        agreeText={LBL_CONFIRM_YES}
        disagreeText={LBL_CONFIRM_NO}
        handleClose={() => setAlertVisibility(!alertVisible)}
        onAgree={closeActivityMethod}
      />
      <Scrollbars>
        {isEmpty(listViewDataObj.listViewData) ? (
          <NoRecord view="dashlet_no_data" subpanel_module="" />
        ) : (
          <MUIDataTable
            className={classes.dataTableStyle}
            title={tableTitle ? tableTitle : ""}
            data={getFilteredData(
              listViewDataObj.listViewData,
              listViewDataObj.listViewColumns,
              FCData,
              dashLetModule,
            )}
            columns={getFilteredDataLabels()}
            options={options}
          />
        )}
      </Scrollbars>
      {previewFile.open ? (
        <FileViewerComp
          previewFile={previewFile}
          maxWidth={"lg"}
          setPreviewFile={setPreviewFile}
        />
      ) : null}
      {detailViewDialogVisibility.open ? (
        <DetailViewDialogContainer
          selectedRecordId={detailViewDialogVisibility.id}
          selectedRecordModule={detailViewDialogVisibility.module}
          dialogOpenStatus={detailViewDialogVisibility.open}
          handleCloseDialog={handleCloseDialog}
          calenderView={true}
        />
      ) : null}
    </>
  );
};

export default memo(DashLetListViewContainer);