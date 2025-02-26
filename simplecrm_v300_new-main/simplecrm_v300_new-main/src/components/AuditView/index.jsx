import React, { useState, useCallback, useEffect } from "react";
import {
  MuiThemeProvider,
  useTheme,
} from "@material-ui/core";
import { pathOr } from "ramda";
import parse from "html-react-parser";
import MUIDataTable from "mui-datatables";
import { toast } from "react-toastify";
import { getAuditViewData } from "../../store/actions/module.actions";
import { NoRecord, Skeleton } from "../../components";
import {
  SOMETHING_WENT_WRONG,
  LBL_NO_ACTION_FOUND,
  LBL_CHANGE_LOG,
  LBL_TABLE_SORT_TITLE,
  LBL_TABLE_PAGE_NEXT_TITLE,
  LBL_TABLE_PAGE_PREVIOUS_TITLE,
  LBL_TABLE_PER_PAGE_TITLE,
  LBL_TABLE_DISPLAY_ROWS_TITLE,
} from "../../constant";
import { Alert } from "@material-ui/lab";
import CustomDialog from "../SharedComponents/CustomDialog";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import { getMuiTheme } from "./styles";

const AuditView = ({ module, record, modalVisible, toggleModalVisibility }) => {
  const theme = useTheme();
  const [auditViewData, setAuditViewData] = useState({});
  const isMobileViewCheck = useIsMobileView();
  const [listViewMeta, setListViewMeta] = useState({
    page: 0,
  });
  const [loading, setLoading] = useState(false);
  const onClose = () => {
    toggleModalVisibility(false);
  };
  let popupTitle = pathOr(LBL_CHANGE_LOG, ["data", "title"], auditViewData);
  const fetchAuditViewData = useCallback(async () => {
    if (modalVisible) {
      try {
        setLoading(true);
        const res = await getAuditViewData(module, record);
        if (res.ok) {
          setAuditViewData(res.data);
        }
        setLoading(false);
      } catch (ex) {
        setLoading(false);
        toast(SOMETHING_WENT_WRONG);
      }
    }
  }, [module, record, modalVisible]);

  const renderListView = () => {
    let data = pathOr(
      [],
      ["data", "templateMeta", "listview", "data"],
      auditViewData,
    );

    let columnList = pathOr(
      [],
      ["data", "templateMeta", "listview", "datalabels"],
      auditViewData,
    )
      .filter((it) => it?.name)
      .map((listDataLabel) => ({
        ...listDataLabel,
        options: { filter: false, sort: false },
      }));

    let auditedTitle = pathOr(
      [],
      ["data", "templateMeta", "listview", "auditedFields", "title"],
      auditViewData,
    );
    let auditedFields = pathOr(
      "",
      ["data", "templateMeta", "listview", "auditedFields", "fields"],
      auditViewData,
    );
    auditedFields = auditedFields?.split(",")?.join(", ") ?? "";
    const changePageOrSort = async (page, sort) => {
      try {
        setListViewMeta({ page });
        const res = await getAuditViewData(module, record, 20, page + 1, sort);
        setAuditViewData(res.data);
      } catch (e) {}
    };

    return (
      <>
        <Alert severity="info">
          {auditedTitle} - {auditedFields}
        </Alert>
        <MUIDataTable
          data={data.map((it) => {
            let dataRow = {};
            Object.entries(it.attributes).forEach(([row, val]) => {
              dataRow[row] = <pre style={{fontFamily:"Poppins"}}>{parse(val.replace(/\n+$/, ""))}</pre>;
            });
            return dataRow;
          })}
          columns={data.length > 0 ? columnList : []}
          options={{
            elevation: 0,
            filter: false,
            download: false,
            print: false,
            viewColumns: false,
            selectableRows: false,
            page: listViewMeta["page"],
            count: pathOr(0, ["meta", "total-records"], auditViewData),
            pagination:
              pathOr([], ["meta", "total-records"], auditViewData) > 0
                ? true
                : false,
            search: false,
            rowsPerPage: 20,
            fixedHeader: true,
            serverSide: true,
            rowsPerPageOptions: [20],
            textLabels: {
              body: {
                noMatch: loading ? "" : <NoRecord view="subpanel" />,
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
                    changePageOrSort(
                      tableState.page,
                      `-${tableState.sortOrder.name}`,
                    );
                    break;
                  }
                  changePageOrSort(tableState.page, tableState.sortOrder.name);

                  break;
                default:
                  console.log(LBL_NO_ACTION_FOUND);
              }
            },
          }}
        />
      </>
    );
  };
  useEffect(() => {
    fetchAuditViewData();
  }, [fetchAuditViewData]);

  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <CustomDialog
        isDialogOpen={modalVisible}
        handleCloseDialog={onClose}
        fullScreen={isMobileViewCheck}
        title={popupTitle}
        bodyContent={loading ? <Skeleton /> : renderListView()}
      />
    </MuiThemeProvider>
  );
};

export default AuditView;
