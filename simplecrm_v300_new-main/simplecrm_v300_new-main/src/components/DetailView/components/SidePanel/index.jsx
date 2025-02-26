import React, { useState, useMemo } from "react";
import { pathOr } from "ramda";
import "./styles";
import { SidePanelHeader } from "./components/SidePanelHeader";
import { SidePanelBody } from "./components/SidePanelBody";
import useFetchActivities from "./hooks/useFetchActivities";

const SidePanel = ({
  module,
  recordId,
  recordName,
  activitiesTabList,
  isSubpanelActive,
  setIsSubpanelUpdated,
  recordInfo,
  data = {}
}) => {
  const [tabValue, setTabValue] = useState(() =>
    activitiesTabList?.hasOwnProperty("History")
  ? "History" : activitiesTabList?.hasOwnProperty("similarTickets") ? "Similar Tickets"
  : Object.keys(activitiesTabList)[0],
  );
  const [pageNum, setPageNum] = useState(1);
  const [loader, setLoader] = useState(false);

  const payload = useMemo(() => {
    const subpanel = pathOr("", [tabValue, "rel_module"], activitiesTabList);
    const subpanel_module = pathOr(
      "",
      [tabValue, "module_name"],
      activitiesTabList,
    );
    return {
      module: module,
      id: recordId,
      subpanel,
      subpanel_module,
      recordName: recordInfo.record_name,
      data,
      url: pathOr("", [tabValue, "api"], activitiesTabList)
    };
  }, [module, recordId, tabValue, recordInfo, data, activitiesTabList]);

  const { isLoading, error, activityList, hasMore, onRefreshState } =
    useFetchActivities(pageNum, payload);

  const handleOnTabChange = (_, value) => {
    setTabValue(value);
    setLoader(false);
    setPageNum(1);
  };
  const handleOnTabRefresh = (e) => {
    setPageNum(1);
    onRefreshState(e);
  };

  return (
    <>
      {!isSubpanelActive ? (
        <SidePanelHeader
          tabValue={tabValue}
          onTabChange={handleOnTabChange}
          onTabRefresh={handleOnTabRefresh}
          tabList={activitiesTabList}
          loading={isLoading}
          pageNum={pageNum}
          setPageNum={setPageNum}
          module={module}
        />
      ) : null}

      <SidePanelBody
        tabValue={tabValue}
        isLoading={isLoading}
        error={error}
        activityList={activityList}
        hasMore={hasMore}
        onTabRefresh={handleOnTabRefresh}
        setPageNum={setPageNum}
        loader={loader}
        setLoader={setLoader}
        setIsSubpanelUpdated={setIsSubpanelUpdated}
        recordName={recordName}
        recordId={recordId}
      />
    </>
  );
};

export default SidePanel;
