import React, { useState, memo } from "react";
import MUIDataTable from "mui-datatables";
import {
  CircularProgress,
  Menu,
  MenuItem,
  Button,
  useTheme,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import useStyles from "./styles";
import { getMuiTheme } from "./styles";
import { options } from "./listview-options";
import { formatDate } from "../../common/utils";
import { NumericFormat } from "react-number-format";
import { pathOr } from "ramda";

const ReportDataView = ({
  dataLabels,
  data,
  isLoading,
  changePageOrSort,
  onDelete,
  onEdit,
  meta,
  listViewWhere,
  page,
  dateFormat,
}) => {
  const { spinner, link } = useStyles();
  const [selectedRecord, setSelectedRecords] = useState([]);
  const [selectedRecordIndex, setSelectedRecordIndexes] = useState([]);
  const [where, setFilterQuery] = useState(listViewWhere);
  const [selectAll, setSelectAll] = useState(false);
  const currentTheme = useTheme();
  const [selectedRecordLength, setselectedRecordLength] = useState(
    selectAll ? "All " : selectedRecord.length,
  );

  const handleSelectAllChange = (event) => {
    const selectedRecordsId = [];
    const selectedRecordsIndex = [];
    setSelectAll(event.target.checked);
    event.target.checked &&
      data.forEach((feed, i) => {
        selectedRecordsId.push(data.id);
        selectedRecordsIndex.push(i);
      });
    setSelectedRecords(selectedRecordsId);
    setSelectedRecordIndexes(selectedRecordsIndex);
    setselectedRecordLength(selectAll ? "All " : selectedRecord.length);
  };

  const handleSelectChange = (
    currentRowsSelected = null,
    allRowsSelected = null,
    rowsSelected = null,
  ) => {
    setSelectAll(false);
    if (currentRowsSelected.length === 0) {
      data.forEach((feed, i) => {
        var indexselectedRecord = selectedRecord.indexOf(feed.id);
        var indexselectedIndex = selectedRecordIndex.indexOf(i);
        if (indexselectedRecord !== -1) {
          selectedRecord.splice(indexselectedRecord, 1);
        }
        if (indexselectedIndex !== -1) {
          selectedRecordIndex.splice(indexselectedIndex, 1);
        }
      });
    } else {
      currentRowsSelected.forEach((feed, i) => {
        if (selectedRecord.some((item) => data[feed.index].id === item)) {
          var indexselectedRecord = selectedRecord.indexOf(data[feed.index].id);
          var indexselectedIndex = selectedRecordIndex.indexOf(feed.index);
          if (indexselectedRecord !== -1) {
            selectedRecord.splice(indexselectedRecord, 1);
          }
          if (indexselectedIndex !== -1) {
            selectedRecordIndex.splice(indexselectedIndex, 1);
          }
        } else {
          selectedRecord.push(data[feed.index].id);
          selectedRecordIndex.push(feed.index);
        }
      });
    }
    setselectedRecordLength(selectAll ? "All " : selectedRecord.length);
  };

  const getFilteredDataLabels = () => {
    return [
      ...dataLabels
        .filter((it) => it.name)
        .map((dl) => {
          if (dl.name === "name") {
            return {
              ...dl,
              options: {
                filter: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return dl.link == "1" ? (
                    <Link
                      to={`/app/detailview/${value.module}/${value.id}`}
                      className={link}
                      variant="body2"
                    >
                      {value.value}
                    </Link>
                  ) : (
                    value
                  );
                },
                sort: false,
              },
            };
          } else if (
            dl.type === "date" ||
            dl.type === "datetime" ||
            dl.type === "datetimecombo"
          ) {
            return {
              ...dl,
              options: {
                customBodyRender: (value, tableMeta, updateValue) =>
                  dl.link == "1" ? (
                    <Link
                      to={`/app/detailview/${value.module}/${value.id}`}
                      className={link}
                      variant="body2"
                    >
                      formatDate(value, dateFormat)
                    </Link>
                  ) : (
                    formatDate(value, dateFormat)
                  ),

                sort: false,
              },
            };
          } else if (dl.type === "currency" || dl.type === "decimal") {
            return {
              ...dl,
              options: {
                customBodyRender: (value, tableMeta, updateValue) =>
                  dl.link == "1" ? (
                    <Link
                      to={`/app/detailview/${value.module}/${value.id}`}
                      className={link}
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
                sort: false,
              },
            };
          } else if (dl.name === "action_c") {
            return {
              ...dl,
              options: {
                customBodyRenderLite: (dataIndex, rowIndex) => (
                  <Button
                    variant="outlined"
                    onClick={() => onEdit(data[dataIndex].id)}
                  >
                    edit
                  </Button>
                ),
                sort: false,
              },
            };
          } else {
            return {
              ...dl,
              options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return dl.link == "1" ? (
                    <Link
                      to={`/app/detailview/${pathOr(
                        "",
                        ["module"],
                        value,
                      )}/${pathOr("", ["id"], value)}`}
                      className={link}
                      variant="body2"
                    >
                      {pathOr("", ["value"], value)}
                    </Link>
                  ) : (
                    value
                  );
                },
              },
            };
          }
        }),
    ];
  };

  const getFilteredData = () =>
    data.map((item) => {
      //for lead score
      if (
        item.attributes.lead_scoring_c &&
        item.attributes.lead_scoring_c != null &&
        typeof item.attributes.lead_scoring_c == "string"
      ) {
        let tmp = document.createElement("SPAN");
        tmp.innerHTML = item.attributes.lead_scoring_c;
        item.attributes.lead_scoring_c = tmp.textContent || tmp.innerText || "";
        //item.attributes.lead_scoring_c = <Chip variant="primary" size="small" label={tmp.textContent || tmp.innerText || ""} />;
      }
      if (
        item.attributes.opportunities_scoring_c &&
        item.attributes.opportunities_scoring_c != null &&
        typeof item.attributes.opportunities_scoring_c == "string"
      ) {
        let tmp = document.createElement("SPAN");
        tmp.innerHTML = item.attributes.opportunities_scoring_c;
        item.attributes.opportunities_scoring_c =
          tmp.textContent || tmp.innerText || "";
        //item.attributes.opportunities_scoring_c = <Chip variant="primary" size="small" label={tmp.textContent || tmp.innerText || ""} />;
      }

      return item.attributes;
    });

  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <MUIDataTable
        title={
          <h3>
            {isLoading && <CircularProgress size={24} className={spinner} />}
          </h3>
        }
        data={getFilteredData()}
        columns={getFilteredDataLabels()}
        options={options(
          meta,
          page,
          changePageOrSort,
          isLoading,
          handleSelectChange,
          selectedRecordIndex,
          selectAll,
          handleSelectAllChange,
          selectedRecord,
          selectedRecordLength,
          setSelectedRecords,
          setSelectedRecordIndexes,
          setselectedRecordLength,
          where,
          setSelectAll,
        )}
        download={false}
      />
    </MuiThemeProvider>
  );
};

export default memo(ReportDataView);
