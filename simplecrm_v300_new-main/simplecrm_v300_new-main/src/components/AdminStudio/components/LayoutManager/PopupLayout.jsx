import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import {
  LBL_LIST,
  LBL_POPUP_VIEW,
  LBL_SEARCH,
  LBL_SELECT_FIELD_FOR,
  SOMETHING_WENT_WRONG,
} from "../../../../constant";
import useStyles from "./styles";
import CustomColumnChooser from "@/components/SharedComponents/CustomColumnChooser";
import { toast } from "react-toastify";
import { api } from "@/common/api-utils";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useIsMobileView } from "@/hooks/useIsMobileView";

const PopupLayout = ({ data, handleGetData }) => {
  const classes = useStyles();
  const isTabMd = useIsMobileView("md");
  const isTabSm = useIsMobileView("sm");
  const { module, view } = useParams();
  const [listTabData, setListTabData] = useState(data?.listLayout?.columnData);
  const [searchTabData, setSearchTabData] = useState(
    data?.searchLayout?.columnData,
  );
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const listColumnLabel = data?.listLayout?.columnLabel;
  const searchColumnLabel = data?.searchLayout?.columnLabel;
  const title = (view.charAt(0).toUpperCase() + view.slice(1)).replace(
    /([a-z])([A-Z])/g,
    "$1 $2",
  );
  const handleSubmit = async () => {
    setFormSubmitLoading(true);
    let listLayout = {};
    Object.values(listTabData).map((columnData, index) => {
      listLayout[`group_${index}`] = Object.keys(columnData);
    });
    let searchLayout = {};
    Object.values(searchTabData).map((columnData, index) => {
      searchLayout[`group_${index}`] = Object.keys(columnData);
    });
    let payload = {
      module: module,
      searchLayout: searchLayout,
      listLayout: listLayout,
    };
    try {
      let res = [];
      if (view === LBL_POPUP_VIEW) {
        res = await api.post(`/V8/studio/savePopupLayout`, payload);
      } else if (view === "dashletView") {
        res = await api.post(`/V8/studio/saveDashletLayout`, payload);
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
    <Grid container direction="row" spacing={5}  className={`${isTabMd || isTabSm ? classes.mainContainer : ""}`}>
      <Grid
        item
        lg={view === LBL_POPUP_VIEW ? 6 : 7}
        md={view === LBL_POPUP_VIEW ? 12 : 12}
        sm={view === LBL_POPUP_VIEW ? 12 : 12}
        className={`${isTabMd || isTabSm ? classes.mobileView : classes.divider}`}
      >
        <p className={classes.heading}>
          {LBL_SELECT_FIELD_FOR}{" "}
          <b>
            {LBL_LIST} {title}
          </b>
          :
        </p>
        <CustomColumnChooser
          tabsFieldData={listTabData}
          setTabsFieldData={setListTabData}
          tabsHeadingLabel={listColumnLabel}
          hideActionButtons={true}
        />
      </Grid>
      <Grid
        item
        lg={view === LBL_POPUP_VIEW ? 6 : 5}
        md={view === LBL_POPUP_VIEW ? 12 : 12}
        sm={view === LBL_POPUP_VIEW ? 12 : 12}
        className={`${isTabMd || isTabSm ? classes.mobileView : ""}`}
      >
        <p className={classes.heading}>
          {LBL_SELECT_FIELD_FOR}{" "}
          <b>
            {LBL_SEARCH} {title}
          </b>
          :
        </p>
        <CustomColumnChooser
          formSubmitLoading={formSubmitLoading}
          tabsFieldData={searchTabData}
          setTabsFieldData={setSearchTabData}
          tabsHeadingLabel={searchColumnLabel}
          handleRestoreDefault={handleGetData}
          handleSubmit={handleSubmit}
        />
      </Grid>
    </Grid>
  );
};

export default PopupLayout;