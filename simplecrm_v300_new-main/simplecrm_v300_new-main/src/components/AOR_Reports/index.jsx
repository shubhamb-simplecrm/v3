import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { pathOr } from "ramda";
import { getReportsDetailView } from "../../store/actions/detail.actions";
import {
  ErrorBoundary,
  ReportDataView,
  AORCharts,
  AORConditions,
} from "../../components";
import { Box, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import useAccordianStyles from "../../components/DetailView/styles";
import useStyles from "../../components/ControlledAccordions/styles";
import PropTypes from "prop-types";

import Skeleton from "@material-ui/lab/Skeleton";
import { LBL_REPORT_CHARTS, LBL_REPORT_FILTER } from "../../constant";

const AORReportDetail = (props) => {
  let pageNo = 0;
  const classes = useStyles();
  const classes1 = useAccordianStyles();
  const dispatch = useDispatch();
  const { module, id } = useParams();
  const [layoutIsChanged, setLayoutIsChanged] = useState(true);
  const [filterValues, setFilterValues] = useState("");
  const [reportFilter, setReportFilter] = useState([]);

  const { detailViewReportFilterLoading, detailGroupViewLoading } = useSelector(
    (state) => state.detail,
  );

  const is_group_array = pathOr(
    [],
    ["data", "templateMeta", "report_data"],
    props.data,
  );
  const report_data_outer = pathOr(
    [],
    ["data", "templateMeta", "report_data", "group_outer_block"],
    props.data,
  );

  const [report_charts, setreport_charts] = useState(
    pathOr([], ["data", "templateMeta", "report_chart", "chart"], props.data),
  );

  const handleSubmitReportFilter = (reportFilterData) => {
    let parameter_id = [];
    let parameter_field = [];
    let parameter_operator = [];
    let parameter_type = [];
    let parameter_value = [];

    for (var key in reportFilterData) {
      let data = pathOr({}, [key], reportFilterData);
      // if data is null get the exisitng set data from report_filter
      data.parameter_id = data.parameter_id
        ? data.parameter_id
        : reportFilter[key].id;
      data.parameter_field = data.parameter_field
        ? data.parameter_field
        : reportFilter[key].field;
      data.parameter_operator = data.parameter_operator
        ? data.parameter_operator
        : reportFilter[key].condition_line[0].FieldOperator.value;
      data.parameter_type = data.parameter_type
        ? data.parameter_type
        : reportFilter[key].condition_line[0].FieldType.value;
      data.parameter_value = data.parameter_value
        ? data.parameter_value
        : reportFilter[key].condition_line[0].ModuleFieldType.value;

      //replace ^ mark for multi select fields value
      //data.parameter_value = data.parameter_value.replace(/\^/g, "");
      if (
        data.parameter_type === "Multi" &&
        Array.isArray(data.parameter_value)
      ) {
        data.parameter_value = data.parameter_value.join();
      }

      parameter_id.push(data.parameter_id);
      parameter_field.push(data.parameter_field);
      parameter_operator.push(data.parameter_operator);
      parameter_type.push(data.parameter_type);
      parameter_value.push(data.parameter_value);
      let report_filterData = reportFilter[key];

      report_filterData.condition_line[0].FieldOperator.value =
        data.parameter_operator;
      report_filterData.condition_line[0].FieldType.value = data.parameter_type;
      report_filterData.condition_line[0].ModuleFieldType.value =
        data.parameter_value;

      reportFilter[key] = report_filterData;
    }

    let modifiedFilterData = {
      parameter_id: parameter_id,
      parameter_field: parameter_field,
      parameter_operator: parameter_operator,
      parameter_type: parameter_type,
      parameter_value: parameter_value,
    };
    setFilterValues(modifiedFilterData);
    dispatch(
      getReportsDetailView(
        module,
        id,
        pageNo,
        "",
        20,
        "",
        modifiedFilterData,
        1,
        true,
      ),
    );
    setLayoutIsChanged(true);
  };

  useEffect(() => {
    setLayoutIsChanged(true);
    setreport_charts(
      pathOr([], ["data", "templateMeta", "report_chart", "chart"], props.data),
    );
  }, []);

  useEffect(() => {
    setLayoutIsChanged(true);
    setReportFilter(
      pathOr([], ["data", "templateMeta", "report_filter"], props.data),
    );
    setreport_charts(
      pathOr([], ["data", "templateMeta", "report_chart", "chart"], props.data),
    );
  }, [props.data]);

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography component={"span"}>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  if (is_group_array.is_group_data == "0") {
    return (
      <ErrorBoundary>
        <div className={classes1.root} style={{ marginTop: 10 }}>
          {reportFilter && reportFilter.length > 0 ? (
            <Accordion
              className={classes.accordionBox}
              key={"filter"}
              defaultExpanded
              style={{ width: "100%" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={"panelfilterbh-content"}
                id={"panelfilterbh-content"}
                className={classes.headerBackground}
                style={{ width: "100%" }}
              >
                {LBL_REPORT_FILTER}
              </AccordionSummary>
              <AccordionDetails style={{ width: "100%" }}>
                <AORConditions
                  data={reportFilter}
                  module={module}
                  handleSubmit={handleSubmitReportFilter}
                />
              </AccordionDetails>
            </Accordion>
          ) : (
            ""
          )}
          {report_charts && report_charts.length > 0 ? (
            <Accordion
              className={classes.accordionBox}
              key={"filter"}
              defaultExpanded
              style={{ width: "100%" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={"panelfilterbh-content"}
                id={"panelfilterbh-content"}
                className={classes.headerBackground}
                style={{ width: "100%" }}
              >
                {LBL_REPORT_CHARTS}
              </AccordionSummary>
              {report_charts.map((chartData, key) => (
                <AccordionDetails style={{ width: "100%" }}>
                  <AORCharts
                    chartId={chartData.id}
                    chartType={chartData.type}
                    dataJson={chartData}
                    setLayoutIsChanged={setLayoutIsChanged}
                    layoutIsChanged={layoutIsChanged}
                  />
                </AccordionDetails>
              ))}
            </Accordion>
          ) : (
            ""
          )}
          <Accordion
            className={classes.accordionBox}
            key={report_data_outer.display_value}
            defaultExpanded
            style={{ width: "100%" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={
                "panel" + report_data_outer.display_value + "bh-content"
              }
              id={"panel" + report_data_outer.display_value + "bh-content"}
              className={classes.headerBackground}
              style={{ width: "100%" }}
            >
              <Typography
                className={classes.text}
                weight="light"
                variant="subtitle2"
                component={"span"}
              >
                {report_data_outer.display_label}
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ width: "100%" }}>
              {detailViewReportFilterLoading ? (
                <Skeleton
                  animation="wave"
                  width="100%"
                  style={{ margin: 10 }}
                  variant="rect"
                  height={118}
                />
              ) : (
                <ReportDataView
                  style={{ width: "100%" }}
                  dataLabels={report_data_outer.group_data.datalabels}
                  data={report_data_outer.group_data.data}
                  module={module}
                  moduleLabel={report_data_outer.display_label}
                  changePageOrSort={(pageNo, reportFilter) => {
                    dispatch(
                      getReportsDetailView(
                        module,
                        id,
                        pageNo,
                        "",
                        20,
                        "",
                        filterValues,
                        0,
                        true,
                      ),
                    );
                  }}
                  isLoading={detailViewReportFilterLoading}
                  meta={report_data_outer.group_data.totalrecords}
                  listViewWhere={""}
                  page={parseInt(report_data_outer.group_data.nextPage)}
                  dateFormat={""}
                />
              )}
            </AccordionDetails>
          </Accordion>
        </div>
      </ErrorBoundary>
    );
  } else {
    return (
      <ErrorBoundary>
        <div className={classes1.root} style={{ marginTop: 10 }}>
          {report_charts && report_charts.length > 0 ? (
            <Accordion
              className={classes.accordionBox}
              key={"filter"}
              defaultExpanded
              style={{ width: "100%" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={"panelfilterbh-content"}
                id={"panelfilterbh-content"}
                className={classes.headerBackground}
                style={{ width: "100%" }}
              >
                {LBL_REPORT_CHARTS}
              </AccordionSummary>
              {report_charts.map((chartData, key) => (
                <AccordionDetails style={{ width: "100%" }}>
                  <AORCharts
                    chartId={chartData.id}
                    chartType={chartData.type}
                    dataJson={chartData}
                    setLayoutIsChanged={setLayoutIsChanged}
                    layoutIsChanged={layoutIsChanged}
                  />
                </AccordionDetails>
              ))}
            </Accordion>
          ) : (
            ""
          )}
          {report_data_outer.map((tab, key) => (
            <Accordion
              className={classes.accordionBox}
              key={tab.display_value}
              defaultExpanded
              style={{ width: "100%" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={"panel" + tab.display_value + "bh-content"}
                id={"panel" + tab.display_value + "bh-content"}
                className={classes.headerBackground}
                style={{ width: "100%" }}
              >
                <Typography
                  component={"span"}
                  className={classes.text}
                  weight="light"
                  variant="subtitle2"
                >
                  {tab.display_label}
                </Typography>
              </AccordionSummary>
              <AccordionDetails style={{ width: "100%" }}>
                <ReportDataView
                  style={{ width: "100%" }}
                  dataLabels={tab.group_data.datalabels}
                  data={tab.group_data.data}
                  module={module}
                  moduleLabel={tab.display_label}
                  changePageOrSort={(pageNo, sort = null) => {
                    dispatch(
                      getReportsDetailView(
                        module,
                        id,
                        pageNo,
                        tab.display_label,
                        20,
                        sort,
                        filterValues,
                        key,
                      ),
                    );
                  }}
                  isLoading={detailGroupViewLoading[key]}
                  meta={tab.group_data.totalrecords}
                  listViewWhere={""}
                  page={parseInt(tab.group_data.nextPage)}
                  dateFormat={""}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </ErrorBoundary>
    );
  }
};
export default AORReportDetail;
