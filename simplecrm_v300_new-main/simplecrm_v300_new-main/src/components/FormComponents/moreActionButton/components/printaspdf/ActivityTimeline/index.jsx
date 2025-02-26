import React, { useState, useCallback, useEffect, useRef } from "react";
import { getSubpanelListViewData } from "@/store/actions/subpanel.actions";
import { pathOr } from "ramda";
import ActivityCard from "./ActivityCard";

const ActivityTimeline = ({
  module,
  subpanel,
  subpanel_module,
  record,
  setLoading,
}) => {
  const componentRef = useRef();

  const [relateFieldData, setRelateFieldData] = useState({});

  const fetchSupanelListViewData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getSubpanelListViewData(
        module,
        subpanel,
        subpanel_module,
        record,
        100,
        1,
      );
      if (res.ok) {
        setRelateFieldData(res.data.data);
        // setRelateFieldMeta(res?.data?.meta);
      }
      setLoading(false);
    } catch (ex) {
      setLoading(false);
    }
  }, [module, subpanel, subpanel_module, record]);
  useEffect(() => {
    fetchSupanelListViewData();
  }, [fetchSupanelListViewData]);
  const renderActivity = () => {
    let data = pathOr(
      [],
      ["templateMeta", "data", "subpanel_tabs", 0, "listview", "data", 0],
      relateFieldData,
    );
    if (data && data.length > 0) {
      return data.map((item) => (
        <ActivityCard item={item} ref={componentRef} />
      ));
    }
    return null;
  };
  return <>{renderActivity()}</>;
};

export default ActivityTimeline;
