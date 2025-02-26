import React, { useState } from "react";
import useStyles from "./styles";
import CustomColumnChooser from "@/components/SharedComponents/CustomColumnChooser";
import { toast } from "react-toastify";
import { api } from "@/common/api-utils";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useSelector } from "react-redux";
import { LBL_SELECT_FIELD } from "@/constant";
import { useIsMobileView } from "@/hooks/useIsMobileView";

const ListViewLayout = ({ data, handleGetData }) => {
  const classes = useStyles();
  const isTabMd = useIsMobileView("md");
  const isTabSm = useIsMobileView("sm");
  const { module, view } = useParams();
  const title = (view.charAt(0).toUpperCase() + view.slice(1)).replace(
    /([a-z])([A-Z])/g,
    "$1 $2",
  );
  const selectedView = useSelector((state) => state.studio?.selectedParameter);
  const [tabData, setTabData] = useState(data.columnData);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const columnLabel = data.columnLabel;
  const handleSubmit = async () => {
    setFormSubmitLoading(true);
    let columns = {};
    Object.values(tabData).map((columnData, index) => {
      columns[`group_${index}`] = Object.keys(columnData);
    });
    let payload = {
      module: module,
      view: view.toLowerCase(),
      columns: columns,
    };
    try {
      let res = [];
      if (view === "listView") {
        res = await api.post(`/V8/studio/saveListViewLayout`, payload);
      } else if (view === "searchView") {
        res = await api.post(`/V8/studio/saveFilterLayout`, payload);
      }
      if (res && res.ok) {
        toast(res.data.data.message);
        handleGetData();
        setFormSubmitLoading(false);
      }
    } catch (e) {
      setFormSubmitLoading(false);
      toast(SOMETHING_WENT_WRONG);
    }
  };

  return (
    <div
      style={{
        height: isTabMd || isTabSm ? "65vh" : "",
        overflow: isTabMd || isTabSm ? "scroll" : "",
        padding: isTabMd || isTabSm ? "0px 5px 0px 8px" : "",
      }}
    >
      <p className={classes.heading}>
        {LBL_SELECT_FIELD} <b>{title}:</b>
      </p>
      <CustomColumnChooser
        formSubmitLoading={formSubmitLoading}
        tabsFieldData={tabData}
        setTabsFieldData={setTabData}
        tabsHeadingLabel={columnLabel}
        handleSubmit={handleSubmit}
        handleRestoreDefault={handleGetData}
      />
    </div>
  );
};

export default ListViewLayout;