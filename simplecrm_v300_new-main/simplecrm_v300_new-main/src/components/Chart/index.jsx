import c3 from "c3";
import "c3/c3.min.css";
import * as d3 from "d3";
// import D3Funnel from 'd3-funnel/dist/d3-funnel.js';
import "./styles.css";
import useStyles from "./styles";
import { useSelector } from "react-redux";
import React from "react";
import { Typography } from "@material-ui/core";
import { LBL_NO_DATA, LBL_NO_DATA_AVAILABLE } from "../../constant";

const Chart = ({ name, dataJson }) => {
  const currentTheme = useSelector(
    (state) => state.config.themeConfig?.currentTheme,
  );
  const classes = useStyles();
  let chartJson = {};
  let chartName = "";
  if (dataJson !== "No Data") {
    dataJson = JSON.parse(dataJson);
    if (dataJson) {
      chartName = dataJson.name;
      dataJson = dataJson.data;

      switch (name) {
        case "stacked":
        case "grouped":
        case "stacked_rotated":
          let groups = dataJson.groups ? { groups: dataJson.groups } : null;
          chartJson = {
            title: { show: false, text: dataJson.chartName },
            padding: {
              right: 20,
              bottom: 20,
            },
            bindto: "#stacked_" + dataJson.randomId,
            data: {
              columns: dataJson.columns,
              type: "bar",
              groups,
              order: null,
              stack: { normalize: false },
              empty: { label: { text: LBL_NO_DATA_AVAILABLE } },
            },

            color: {
              pattern: dataJson.pattern,
            },
            transition: {
              duration: 0,
            },
            bar: {
              width: { ratio: 0.9 },
            },
            axis: {
              x: {
                type: "category",
                categories: dataJson.categories,
                label: {
                  text: dataJson.xName,
                  position: "outer-middle",
                },
                tick: {
                  rotate: 40,
                  culling: {
                    max: dataJson.max,
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
                    if (dataJson.dashlet === true) {
                      return dataJson.currency_Symbol + d3.format(".2")(x);
                    } else {
                      return dataJson.currency_Symbol + d3.format("~s")(x);
                    }
                  },
                },
              },
              rotated: dataJson.rotation,
            },
            legend: {
              show: true,
            },
            grid: {
              focus: { show: false },
              y: { lines: [{ value: 0 }] },
            },
            tooltip: {
              format: {
                title: function (d) {
                  return dataJson.categories[d];
                },
                value: function (value, ratio, id) {
                  var format = function (value) {
                    return dataJson.currency_Symbol + d3.format(",")(value);
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
        case "line_chart":
        case "line_chart2":
          chartJson = {
            padding: {
              right: 20,
              bottom: 20,
            },
            bindto: "#line_" + dataJson.randomId,
            data: {
              columns: dataJson.columns,
              type: "spline",
              empty: { label: { text: LBL_NO_DATA_AVAILABLE } },
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
                  rotate: 30,
                },
                padding: { top: 50, bottom: 20 },
              },
              y: {
                label: {
                  text: dataJson.yName,
                  position: "outer-middle",
                },
              },
            },
          };
          break;
        case "SLA_BREACHED_TICKETS":
        case "SLA_BREACHED_TASKS":
          chartJson = {
            padding: {
              right: 20,
              bottom: 20,
            },
            bindto: "#line_" + dataJson.randomId,
            data: {
              columns: dataJson.columns,
              type: "spline",
              empty: { label: { text: LBL_NO_DATA_AVAILABLE } },
            },
            axis: {
              x: {
                type: "category",
                categories: dataJson.categories,
                label: {
                  text: dataJson.xName,
                  position: "outer-center",
                },
                tick: {
                  rotate: 30,
                  multiline: false,
                },
              },
              y: {
                label: {
                  text: dataJson.yName,
                  position: "outer-middle",
                },
              },
            },
          };
          break;
        case "CSAT_BY_TICKET_TYPE":
        case "ACTIVITY_BY_STATUS":
        case "TICKETS_BY_TYPE_BY_PRIORITY":
          chartJson = {
            padding: {
              right: 20,
              bottom: 20,
            },
            title: {
              show: false,
              text: dataJson.chartName,
            },
            bindto: "#stacked_" + dataJson.randomId,
            data: {
              columns: dataJson.columns,
              type: "bar",
              colors: dataJson.colors,
              order: null,
              stack: { normalize: false },
            },
            transition: { duration: 0 },
            bar: { width: { ratio: 0.9 } },
            axis: {
              rotated:
                name === "TICKETS_BY_TYPE_BY_PRIORITY"
                  ? false
                  : dataJson.rotated,
              x: {
                type: "category",
                categories: dataJson.categories,
                label: {
                  text: dataJson.xName,
                  position: dataJson.x_center,
                },
                tick: {
                  rotate: 40,
                  multiline: false,
                  culling: { max: dataJson.cullingmax },
                },
              },
              y: {
                label: {
                  text: dataJson.yName,
                  position: dataJson.y_center,
                },
                tick: {},
              },
            },
            legend: { show: true },
            zoom: { enabled: false },
            grid: {
              focus: { show: false },
              y: { lines: [{ value: 0 }] },
            },
            tooltip: {
              format: {
                title: function (d) {
                  return dataJson.categories[d];
                },
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
        case "AVERAGE_SENTIMENT_SCORE":
          chartJson = {
            padding: {
              right: 20,
              bottom: 20,
            },
            title: {
              text: dataJson.chartName,
            },
            bindto: "#pie_" + dataJson.randomId,
            data: {
              columns: dataJson.columns,
              type: "donut",
              colors: dataJson.colors,
            },
            grid: {
              focus: { show: false },
            },
          };
          break;
        case "TICKETS_BY_SOURCE":
          chartJson = {
            padding: {
              right: 20,
              bottom: 20,
            },
            title: {
              show: false,
              text: dataJson.text,
            },
            legend: {
              show: false,
            },
            bindto: "#bar_" + dataJson.randomId,
            data: {
              type: "bar",
              colors: dataJson.colors,
              json: dataJson.json,
              groups: [dataJson.groups],
              keys: {
                x: "indicator",
                value: dataJson.keys,
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
                  rotate: 40,
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
                tick: {},
              },
            },
            grid: {
              focus: { show: false },
            },
            tooltip: {
              format: {
                title: function (d) {
                  return dataJson.keys[d];
                },
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

      if (!chartJson) return null;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useEffect(() => {
        c3.generate(chartJson);
      }, [chartJson]);
    }
  }
  return (
    <div className={currentTheme === "dark" ? "inverted" : null}>
      <div key={name} className={classes.chartBox} id={chartName}>
        <Typography align="center">
          <i
            className={" fas fa-7x fa-exclamation-triangle " + classes.noData}
          ></i>
        </Typography>
        <Typography align="center" color="textSecondary">
          {LBL_NO_DATA}
        </Typography>
      </div>
    </div>
  );
};

export default Chart;
