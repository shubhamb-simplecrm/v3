import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import DashboardPanelResize from "./DashboardPanelResize";
import DashLetCard from "../DashLetCard";
import { isEmpty, pathOr } from "ramda";
import IFrameContainer from "../../../SharedComponents/IFrameContainer";
import FaIcon from "../../../FaIcon";
import { Link } from "react-router-dom";
import DashboardPanelContainer from "./DashboardPanelContainer";
import DashLetSetting from "./DashLetSetting";
import { useSelector } from "react-redux";
import dashboardPlaceholderImg from "../../../../assets/dashboard-report.png";
import useStyles from "./styles";
import { Box } from "@material-ui/core";
import "./style.css";
import { SkeletonShell } from "@/components";
import { getDashLetDataAction } from "@/store/actions/dashboard.actions";

const DefaultDashboard = memo((props) => {
  const { panelData } = props;
  const isDashboardLayoutEditable = useSelector(
    (state) => state?.dashboard?.isDashboardLayoutEditable,
  );
  const dashboardLayoutObj = pathOr([], ["dashlets"], panelData);

  const renderDashLetLayoutContainer = () =>
    dashboardLayoutObj.map((dashLet) => (
      <div key={dashLet.id}>
        <DashLetContainer
          key={dashLet.id}
          dashLetData={dashLet}
          dashboardData={panelData}
          isDashboardLayoutEditable={isDashboardLayoutEditable}
        />
      </div>
    ));

  return isEmpty(dashboardLayoutObj) ? (
    <EmptyDashboardContainer />
  ) : (
    <DashboardPanelResize
      dashboardLayoutObj={dashboardLayoutObj}
      isDashboardLayoutEditable={isDashboardLayoutEditable}
    >
      {renderDashLetLayoutContainer()}
    </DashboardPanelResize>
  );
});
const DashLetContainer = (props) => {
  const { dashLetData, dashboardData, isDashboardLayoutEditable } = props;
  const [isDashLetEdited, setIsDashLetEdited] = useState(false);
  const [dashLetSelectedAction, setDashLetSelectedAction] = useState(null);
  const [dashLetTableMeta, setDashLetTableMeta] = useState(null);
  const [dashLetLoading, setDashLetLoading] = useState(false);
  const currentDashboardTab = pathOr(0, ["current_tab"], dashboardData);
  const dashLetId = pathOr("", ["data", "id"], dashLetData);
  const dashLetModule = pathOr("", ["data", "module"], dashLetData);
  const [dashLetTableData, setDashLetTableData] = useState(null);
  const [fieldConfigurationData, setFieldConfigurationData] = useState({});
  const [dashLetPage, setDashLetPage] = useState(0);

  const dashLetTitle = useMemo(() => {
    const dashLetModule = pathOr("", ["data", "module"], dashLetData);
    const dashLetReportId = pathOr("", ["report_id"], dashLetTableData);
    const reportTitle = pathOr(
      "",
      ["data", "data", "aor_report_name"],
      dashLetData,
    );
    const dashLetTitle = pathOr(
      pathOr("", ["data", "meta", "dashlet_title"], dashLetData),
      ["dashlet_title"],
      dashLetTableMeta,
    );
    return dashLetModule === "AOR_Reports" && !isEmpty(dashLetReportId) ? (
      <Link to={`/app/detailview/AOR_Reports/${dashLetReportId}`}>
        {dashLetTitle}
      </Link>
    ) : (
      dashLetTitle
    );
  }, [dashLetData, dashLetTableMeta]);

  const dashLetIcon = useMemo(
    () => (
      <FaIcon
        icon={pathOr(
          "fas fas fa-cube",
          ["data", "meta", "dashlet_icon"],
          dashLetData,
        )}
        size="1x"
      />
    ),
    [dashLetData],
  );
  const handlePageChange = useCallback((pageNo) => {
    setDashLetPage(pageNo);
  }, []);

  const handleOnDashletAction = (label) => {
    setDashLetSelectedAction(label);
  };
  const handleOnCloseDashLetAction = (e) => {
    setDashLetSelectedAction(null);
  };

  const handleOnDashLetEditStatus = useCallback(
    (status) => {
      if (status) getDashLetCardData(currentDashboardTab, dashLetId);
    },
    [currentDashboardTab, dashLetId],
  );
  const getDashLetCardData = useCallback(
    (tab, id, requestPayload = {}) => {
      setDashLetLoading(true);
      getDashLetDataAction(tab, id, requestPayload)
        .then((res) => {
          if (dashLetModule === "AOR_Reports") {
            const responseTableData = pathOr(
              {},
              ["data", 0, "data", "data"],
              res,
            );
            const responseTableMeta = pathOr(
              {},
              ["data", 0, "data", "meta"],
              res,
            );
            setDashLetTableData(responseTableData);
            setDashLetTableMeta(responseTableMeta);
          } else {
            const responseTableData = pathOr(
              {},
              ["data", "0", "data", "data"],
              res,
            );
            const responseTableMeta = pathOr(
              {},
              ["data", "0", "data", "meta"],
              res,
            );
            const responseFieldConfigurationData = pathOr(
              {},
              [
                "data",
                0,
                "data",
                "FieldConfigursion",
                "data",
                "JSONeditor",
                "dynamicLogic",
                "fields",
              ],
              res,
            );
            setFieldConfigurationData(responseFieldConfigurationData);
            setDashLetTableData(responseTableData);
            setDashLetTableMeta(responseTableMeta);
          }
          setDashLetLoading(false);
        })
        .catch((e) => {
          setDashLetLoading(false);
        });
    },
    [isDashLetEdited],
  );

  useEffect(() => {
    getDashLetCardData(currentDashboardTab, dashLetId);
  }, []);

  return (
    <>
      <DashLetCard
        dashLetData={dashLetData}
        title={dashLetTitle}
        icon={dashLetIcon}
        onActionClick={isDashboardLayoutEditable ? null : handleOnDashletAction}
        onRefreshClick={
          dashLetData?.data?.module === "Home" || isDashboardLayoutEditable
            ? null
            : () => {
                handleOnDashLetEditStatus(true);
                handlePageChange(0);
              }
        }
      >
        {dashLetLoading ? (
          <SkeletonShell layout="listView" display />
        ) : dashLetData?.data?.module === "Home" ? (
          <IFrameContainer url={pathOr("", ["rss_output"], dashLetTableData)} />
        ) : (
          <DashboardPanelContainer
            dashLetId={dashLetId}
            dashLetModule={dashLetModule}
            fieldConfigurationData={fieldConfigurationData}
            currentDashboardTab={currentDashboardTab}
            isDashLetEdited={isDashLetEdited}
            dashLetTableData={dashLetTableData}
            getDashLetCardData={getDashLetCardData}
            handlePageChange={handlePageChange}
            dashLetPage={dashLetPage}
          />
        )}
      </DashLetCard>
      {dashLetSelectedAction && (
        <DashLetSetting
          dashLetData={dashLetData}
          dashboardData={dashboardData}
          title={dashLetTitle}
          dashLetSelectedAction={dashLetSelectedAction}
          handleOnCloseDashLetAction={handleOnCloseDashLetAction}
          handleOnDashLetEditStatus={handleOnDashLetEditStatus}
        />
      )}
    </>
  );
};
const EmptyDashboardContainer = () => {
  const classes = useStyles();
  return (
    <Box className={classes.emptyDashboardStyle}>
      <img
        alt="complex"
        className={classes.emptyDashboardImageStyle}
        src={dashboardPlaceholderImg}
      />
    </Box>
  );
};

export default memo(DefaultDashboard);