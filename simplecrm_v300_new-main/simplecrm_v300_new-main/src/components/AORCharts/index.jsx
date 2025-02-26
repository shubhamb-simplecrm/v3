import c3 from "c3";
import "c3/c3.min.css";
import * as d3 from "d3";
// import D3Funnel from 'd3-funnel/dist/d3-funnel.js';
import "./styles.css";
import useStyles from "./styles";
import { useSelector } from "react-redux";
import React, { useState, useEffect, useCallback } from "react";
import { FunnelChart } from "react-funnel-pipeline";
import "react-funnel-pipeline/dist/index.css";
import { Typography } from "@material-ui/core";
import { isEmpty, isNil, pathOr } from "ramda";
import { FaIcon } from "..";
import { LBL_NO_DATA, LBL_NO_DATA_AVAILABLE } from "../../constant";
import RelateFieldDialog from "../CustomFormInput/components/RelateField/components/relate-field-dialog";
function extractLastBracketValue(input) {
  const regex = /\(([^)]+)\)(?!.*\()/;
  const match = input.match(regex);

  if (match) {
    if (input.endsWith("()")) {
      return input.slice(0, -2);
    }
    return match[1];
  }
  return input;
}
const AOR_Charts = ({
  chartId,
  reportId,
  chartType,
  dataJson,
  layoutIsChanged,
  view = "ReportDetailView",
}) => {
  const [chartJsonData, setChartJsonData] = useState(dataJson);
  const [isDialogVisibleState, setIsDialogVisibleState] = useState(null);
  const [chartName, setChartName] = useState("");
  const [chartIdStr, setChartIdStr] = useState("chart_" + chartId);
  const currentTheme = useSelector(
    (state) => state?.config?.themeConfig?.currentTheme,
  );
  const classes = useStyles();
  const toggleDialogVisibility = () => {
    setIsDialogVisibleState(null);
  };

  const generateChart = useCallback(() => {
    let chartJson = {};
    setChartIdStr("chart_" + chartId);
    setChartName(dataJson.name);
    dataJson = dataJson.data;
    switch (chartType) {
      case "stacked_bar":
      case "grouped_bar":
        let groups = dataJson.groups ? [dataJson.groups] : null;
        if (chartType === "grouped_bar") {
          groups = [[]];
        }
        chartJson = {
          title: { show: false, text: dataJson.chartName },
          bindto: "#" + chartIdStr,
          padding: { right: 10, bottom: 10 },
          data: {
            columns: dataJson.columns,
            type: "bar",
            colors: dataJson.colors,
            groups,
            order: null,
            stack: {
              normalize: false,
            },
            onclick: (d, el) => {
              // dataJson["categories"][d.x]
              const payload = {
                [`filter[${dataJson.xFieldName}][eq]`]:
                  dataJson["categories"][d.x],
                [`filter[${dataJson.groupField}][eq]`]: d.name,
                // [`filter[${dataJson.xFieldName}][eq]`]: d.name,
                chart_id: chartId,
                report_id: reportId,
              };
            },
          },
          transition: {
            duration: 0,
          },
          bar: {
            width: {
              ratio: 0.9, // this makes bar width 50% of length between ticks
            },
          },
          axis: {
            x: {
              type: "category",
              categories: dataJson.categories,
              label: {
                text: dataJson.xName,
                position: "outer-center", //outer-middle
              },
              tick: {
                rotate: 40,
                multiline: false,
                culling: {
                  max: 0, // the number of tick texts will be adjusted to less than this value
                },
              },
            },
            y: {
              label: {
                text: dataJson.yName,
                position: "outer-middle",
              },
              tick: {
                rotate: 55,
                format: function (x) {
                  return "" + d3.format(".2s")(x);
                },
              },
            },
          },
          legend: {
            show: true,
          },
          grid: {
            focus: {
              show: false,
            },
            y: {
              lines: [{ value: 0 }],
            },
          },
          tooltip: {
            format: {
              value: function (value, ratio, id) {
                var format = function (value) {
                  return dataJson.currency_symbol + d3.format(",")(value);
                };
                return format(value);
              },
            },
          },
        };

        break;
      case "gauge":
        chartJson = {
          bindto: "#gaugechart" + dataJson.randomId,
          data: {
            columns: [["Sales Target", dataJson.sales_target]],
            type: "gauge",
            empty: { label: { text: LBL_NO_DATA_AVAILABLE } },
          },
          tooltip: {
            format: {
              title: function (d) {
                return "Sales Target";
              },
              value: d3.format(","),
            },
          },
          gauge: {
            max: dataJson.max,
          },
          color: {
            pattern: ["#FF0000", "#F97600", "#F6C600", "#60B044"],
            threshold: {
              values: dataJson.color_value,
            },
          },
        };
        break;
      case "line":
        chartJson = {
          padding: { right: 10, bottom: 10 },
          title: {
            show: false,
            text: dataJson.chartName,
          },
          bindto: "#" + chartIdStr,
          data: {
            columns:
              dataJson.columns && dataJson.columns.length > 0
                ? [dataJson.columns]
                : "",
            type: "spline",
          },
          axis: {
            x: {
              label: {
                text: dataJson.xName,
                position: "outer-center",
              },
              type: "category",
              categories: dataJson.categories,

              tick: {
                rotate: 45,
              },
              padding: { top: 50, bottom: 20 },
            },
            y: {
              label: {
                text: dataJson.yName,
                position: "outer-middle",
              },
              tick: {
                rotate: 45,
                format: function (x) {
                  return dataJson.currency_symbol
                    ? dataJson.currency_symbol + " " + d3.format(".2s")(x)
                    : x;
                },
              },
            },
          },
          grid: {
            x: {
              show: false,
            },
            y: {
              show: false,
            },
          },
          tooltip: {
            format: {
              value: function (value, ratio, id) {
                var format = function (value) {
                  return dataJson.currency_symbol + d3.format(",")(value);
                };
                return format(value);
              },
            },
          },
          legend: {
            show: false,
          },
        };
        break;
      case "pie":
        chartJson = {
          padding: {
            right: 10,
            bottom: 10,
          },
          title: {
            text: dataJson.chartName,
          },
          bindto: "#" + chartIdStr,
          data: {
            type: "pie",
            columns: dataJson.columns,
            colors: dataJson.colors,
          },
          grid: {
            focus: { show: false },
          },
        };
        break;
      case "bar":
        chartJson = {
          legend: {
            show: false,
          },
          title: {
            show: false,
            text: dataJson.chartName,
          },
          bindto: "#" + chartIdStr,
          data: {
            type: "bar",
            colors: dataJson.colors,
            json: dataJson.json,
            groups: [dataJson.groups && dataJson.groups[0]],
            keys: {
              x: "indicator",
              value: dataJson.keys,
            },
            onclick: (d, el) => {
              if (
                isNil(chartJsonData?.report_module) ||
                isEmpty(chartJsonData?.report_module)
              )
                return null;

              const payload = {
                [`filter[${chartJsonData.xFieldName}][eq]`]:
                  extractLastBracketValue(d.name),
                chart_id: chartId,
                report_id: reportId,
              };
              // setIsDialogVisibleState({
              //   filterPayload: payload,
              //   reportModule: chartJsonData?.report_module,
              //   listViewOnly: true,
              // });
              // console.log(
              //   "payload",
              //   d,
              //   chartId,
              //   dataJson,
              //   new URLSearchParams(payload).toString(),
              //   payload,
              //   chartJson,
              // );
              // console.log(JSON.parse(JSON.stringify(chartJson)));
            },
          },
          axis: {
            x: {
              type: "category",
              label: {
                text: dataJson.xName,
                position: "outer-center",
              },
              tick: {
                rotate: 44,
                multiline: false,
                culling: {
                  max: 0,
                },
              },
            },
            y: {
              label: {
                text: dataJson.yName,
                position: "outer-middle",
              },
              tick: {
                format: function (x) {
                  return dataJson.currency_symbol + d3.format(".2s")(x);
                },
              },
            },
          },
          grid: {
            focus: { show: false },
          },
          tooltip: {
            format: {
              value: function (value, ratio, id) {
                var format = function (value) {
                  return dataJson.currency_symbol + d3.format(",")(value);
                };
                return format(value);
              },
            },
          },
        };
        break;
      default:
        chartJson = dataJson;
    }
    if (
      chartJson.hasOwnProperty("data") &&
      !chartJson["data"].hasOwnProperty("onclick")
    ) {
      chartJson["data"]["onclick"] = (d, el) => {
        const payload = {
          [`filter[${dataJson.xFieldName}][eq]`]: d.name,
          chart_id: chartId,
          report_id: reportId,
        };
        // console.log(
        //   "payload",
        //   d,
        //   chartId,
        //   dataJson,
        //   new URLSearchParams(payload).toString(),
        //   payload,
        //   chartJson,
        // );
        // console.log(JSON.parse(JSON.stringify(chartJson)));
      };
    }
    if (
      chartType !== "funnel" &&
      chartJson.data &&
      (chartJson.data.columns || chartJson.data.json)
    ) {
      chartJson["data"]["columns"] =
        chartJson.data.columns &&
        chartJson.data.columns.filter(function (x) {
          return x !== undefined;
        });
      try {
        const chart = c3.generate(chartJson);
      } catch (error) {}
    }
    setChartJsonData(chartJson);
  }, [dataJson, layoutIsChanged]);
  useEffect(() => {
    generateChart();
  }, [generateChart]);
  return (
    <div
      className={currentTheme === "dark" ? "inverted" : null}
      style={{ width: "100%", margin: "0 auto" }}
    >
      {chartType === "funnel" ? (
        <div className={classes.chartBox} id={chartIdStr}>
          <FunnelChart
            data={pathOr([], ["data"], chartJsonData)}
            pallette={[
              "#3366CC",
              "#109618",
              "#FF9900",
              "#DC3912",
              "#990099",
              "#3B3EAC",
              "#0099C6",
              "#DD4477",
              "#66AA00",
              "#B82E2E",
              "#316395",
              "#994499",
              "#22AA99",
              "#AAAA11",
              "#6633CC",
              "#E67300",
              "#8B0707",
              "#329262",
              "#5574A6",
              "#3B3EAC",
            ]}
            title={chartJsonData.chartName}
            showValues={true}
            showNames={true}
            getRowStyle={() => {
              return { margin: "0px" };
            }}
            getRowNameStyle={(row) => {
              return { fontSize: "10px" };
            }}
            getRowValueStyle={(row) => {
              return { fontSize: "9px" };
            }}
            getToolTip={(row) => {
              return parseInt(row.value);
            }}
          >
            {LBL_NO_DATA}
          </FunnelChart>
        </div>
      ) : (
        <div
          key={chartIdStr}
          className={classes.chartBox}
          data-type={chartType}
          id={chartIdStr}
          style={{
            height:
              view === "ReportDetailView" &&
              (pathOr(null, ["data", "columns"], chartJsonData) ||
                pathOr(null, ["data", "json"], chartJsonData))
                ? 400
                : "100%",
          }}
        >
          <Typography align="center">{chartName}</Typography>
          <Typography align="center"></Typography>
          <Typography align="center">
            <FaIcon
              icon={"fas fa-exclamation-triangle"}
              className={classes.noData}
              size="7x"
            />
          </Typography>
          <Typography align="center" color="textSecondary">
            {LBL_NO_DATA}
          </Typography>
        </div>
      )}
      {!!isDialogVisibleState && (
        <RelateFieldDialog
          fieldMetaObj={{}}
          onChange={null}
          view={null}
          isDialogVisible={isDialogVisibleState}
          toggleDialogVisibility={toggleDialogVisibility}
          moduleMetaData={{ currentModule: isDialogVisibleState.reportModule }}
          customProps={isDialogVisibleState}
        />
      )}
    </div>
  );
};

export default AOR_Charts;
