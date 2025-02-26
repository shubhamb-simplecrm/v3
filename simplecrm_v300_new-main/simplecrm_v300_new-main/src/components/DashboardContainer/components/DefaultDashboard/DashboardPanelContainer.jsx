import React, { memo, useMemo } from "react";
import { isEmpty, isNil, pathOr } from "ramda";
import NoRecord from "../../../NoRecord";
import { AORCharts, Chart } from "../../..";
import DashLetListViewContainer from "./DashLetListViewContainer";

const DashboardPanelContainer = (props) => {
  const {
    dashLetId,
    dashLetModule,
    fieldConfigurationData,
    dashLetTableData,
    currentDashboardTab,
    getDashLetCardData,
    handlePageChange,
    dashLetPage,
  } = props;
  
  const ReportTableData = useMemo(() => {
    let rChart = pathOr([], ["report_chart", "chart"], dashLetTableData);
    let reportId = pathOr(null, ["report_id"], dashLetTableData);
    if (!!reportId) {
      return (
        <>
          <DashLetChartsContainer
            reportChartDataList={rChart}
            reportId={reportId}
            currentDashboardTab={currentDashboardTab}
          />
          <DashLetReportContainer
            dashLetId={dashLetId}
            dashLetTableData={dashLetTableData}
            dashLetModule={dashLetModule}
            currentDashboardTab={currentDashboardTab}
            getDashLetCardData={getDashLetCardData}
            dashLetPage={dashLetPage}
            handlePageChange={handlePageChange}
          />
        </>
      );
    } else {
      return <NoRecord view="dashlet_report" subpanel_module="" module="" />;
    }
  }, [dashLetTableData, getDashLetCardData]);

  if (isNil(dashLetTableData)) return null;

  if (dashLetModule === "AOR_Reports") {
    return ReportTableData;
  }

  if (dashLetModule === "SF_Sales_Forecast" && !isEmpty(dashLetTableData)) {
    return (
      <Chart
        name={dashLetTableData?.name}
        dataJson={JSON.stringify(pathOr([], ["data"], dashLetTableData))}
      />
    );
  }

  return (
    <DashLetListViewContainer
      dashLetId={dashLetId}
      dashLetModule={dashLetModule}
      currentDashboardTab={currentDashboardTab}
      getDashLetCardData={getDashLetCardData}
      dashLetTableData={dashLetTableData}
      FCData={fieldConfigurationData}
      dashLetPage={dashLetPage}
      handlePageChange={handlePageChange}
    />
  );
};

const DashLetChartsContainer = memo(({ reportChartDataList, reportId }) => {
  // const classes = useStyles();
  return reportChartDataList.map((chartData, key) => (
    <AORCharts
      key={chartData.id}
      chartId={chartData.id}
      chartType={chartData.type}
      dataJson={chartData}
      reportId={reportId}
      height="400px"
      width="100%"
      view="Dashlet"
    />
  ));
});

const DashLetReportContainer = memo((props) => {
  const {
    dashLetTableData,
    dashLetId,
    dashLetModule,
    currentDashboardTab,
    getDashLetCardData,
    dashLetPage,
    handlePageChange,
  } = props;
  const chartReportsOnly = pathOr([], ["onlyCharts"], dashLetTableData);
  let isGroupReports = parseInt(
    pathOr(false, ["report_data", "is_group_data"], dashLetTableData),
  );
  const groupReportData = pathOr(
    [],
    ["report_data", "group_outer_block"],
    dashLetTableData,
  );

  const nonGroupReportData = pathOr(
    [],
    ["report_data", "group_outer_block", "group_data"],
    dashLetTableData,
  );
  if (chartReportsOnly) return null;
  return isGroupReports ? (
    <DashLetGroupReportContainer
      dashLetId={dashLetId}
      dashLetModule={dashLetModule}
      currentDashboardTab={currentDashboardTab}
      groupReportData={groupReportData}
      getDashLetCardData={getDashLetCardData}
      dashLetPage={dashLetPage}
      handlePageChange={handlePageChange}
    />
  ) : (
    <DashLetListViewContainer
      dashLetId={dashLetId}
      dashLetModule={nonGroupReportData.module}
      currentDashboardTab={currentDashboardTab}
      getDashLetCardData={getDashLetCardData}
      dashLetTableData={nonGroupReportData}
      dashLetPage={dashLetPage}
      handlePageChange={handlePageChange}
    />
  );
});

const DashLetGroupReportContainer = memo((props) => {
  const {
    dashLetId,
    dashLetModule,
    groupReportData,
    currentDashboardTab,
    getDashLetCardData,
    dashLetPage,
    handlePageChange,
  } = props;
  return groupReportData.map((reportData, reportIndex) => {
    const reportGroupData = pathOr({}, ["group_data"], reportData);
    const reportGroupModule = pathOr({}, ["group_data", "module"], reportData);
    const tableTitle = pathOr("", ["display_label"], reportData);
    const titleKey = pathOr("", ["display_value"], reportData);
    return (
      <DashLetListViewContainer
        key={"reportTable-" + reportIndex}
        dashLetId={dashLetId}
        dashLetModule={reportGroupModule}
        currentDashboardTab={currentDashboardTab}
        dashLetTableData={reportGroupData}
        getDashLetCardData={getDashLetCardData}
        tableTitle={tableTitle}
        titleKey={titleKey}
        dashLetPage={dashLetPage}
        handlePageChange={handlePageChange}
      />
    );
  });
});

export default DashboardPanelContainer;
