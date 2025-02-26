import React, { useState } from "react";
import CustomList from "../CustomList";
import { Grid } from "@material-ui/core";
import {
  LBL_NO_RELATIONSIP_FOR_SUBPANEL,
  LBL_SEARCH_SUBPANEL_PLACEHOLDER,
  LBL_SELECT_FIELD_FOR,
  LBL_SELECT_SUBPANEL,
  LBL_SUBPANEL,
  SOMETHING_WENT_WRONG,
} from "../../../../constant";
import CustomColumnChooser from "../../../SharedComponents/CustomColumnChooser";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getLayoutData,
  setSelectedParameter,
} from "@/store/actions/studio.actions";
import { Skeleton } from "@/components";
import useStyles from "./styles";
import { useEffect } from "react";
import { api } from "@/common/api-utils";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { isEmpty, isNil, pathOr } from "ramda";
import { LBL_LIST } from "@/constant/language/en_us";

const SubpanelManager = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const { module, manager, view } = useParams();
  const subpanelViewData = useSelector(
    (state) => state.studio?.subpanelViewData,
  );
  const [tabData, setTabData] = useState({});
  const [fieldDataLoading, setFieldDataLoading] = useState(null);
  const [columnLabel, setColumnLabel] = useState(null);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [selectedSubpanel, setSelectedSubpanel] = useState({
    name: view
      ? view
      : subpanelViewData?.listData && !fieldDataLoading
        ? subpanelViewData?.listData[0]?.name
        : "",
    label: view
      ? view
      : subpanelViewData?.listData && !fieldDataLoading
        ? subpanelViewData?.listData[0]?.label
        : "",
  });

  const getSubpanelColumns = (
    params = {
      module: module,
      subpanel_name: view ? view : selectedSubpanel.name,
      view: "ListView",
      view_package: "",
    },
  ) => {
    history.push(
      `/app/studio/${module}/${manager}/${view ?? selectedSubpanel.name}`,
    );
    if (
      !isEmpty(subpanelViewData?.listData) &&
      !isNil(subpanelViewData?.listData)
    ) {
      subpanelViewData?.listData.map((item) => {
        if (item.name === selectedSubpanel["name"]) {
          setSelectedSubpanel({ ...selectedSubpanel, label: item.label });
          dispatch(setSelectedParameter(item.label));
        }
      });
      setFieldDataLoading(true);
      dispatch(getLayoutData(params)).then((response) => {
        if (response.ok) {
          setTabData(response.data.data.columnData);
          setColumnLabel(response.data.data.columnLabel);
          setFieldDataLoading(false);
        } else {
          setFieldDataLoading(false);
        }
      });
    }
  };

  const handleRestoreDefault = () => {
    getSubpanelColumns();
  };

  const handleSubmit = async () => {
    setFormSubmitLoading(true);
    let columns = {};
    Object.values(tabData).map((columnData, index) => {
      columns[`group_${index}`] = Object.keys(columnData);
    });
    let payload = {
      module: module,
      view: "listview",
      subpanel_name: selectedSubpanel["name"],
      columns: columns,
      subpanel_title: selectedSubpanel["label"],
    };
    try {
      const res = await api.post(`/V8/studio/saveSubpanelLayout`, payload);
      if (res && res.ok) {
        toast(res.data.data.message);
        getSubpanelColumns();
        setFormSubmitLoading(false);
      }
    } catch (e) {
      setFormSubmitLoading(false);
      toast(SOMETHING_WENT_WRONG);
    }
  };

  useEffect(() => {
    getSubpanelColumns();
  }, [subpanelViewData, selectedSubpanel["name"]]);

  return !isEmpty(pathOr([], ["listData"], subpanelViewData)) ? (
    <Grid container lg={12} md={12} className={classes.margin}>
      <Grid item lg={3} md={3} sm={3} className={classes.border}>
        <CustomList
          placeHolder={LBL_SEARCH_SUBPANEL_PLACEHOLDER}
          data={subpanelViewData?.listData ? subpanelViewData?.listData : {}}
          fieldList={true}
          handleGetData={(subpanel, subpanelLabel) =>
            setSelectedSubpanel({ name: subpanel, label: subpanelLabel })
          }
        />
      </Grid>
      {view ? (
        <Grid item lg={6} md={9} sm={9} className={classes.editLayout}>
          {fieldDataLoading ? (
            <Skeleton layout={"Studio"} />
          ) : (
            <>
              <p className={classes.heading}>
                {LBL_SELECT_FIELD_FOR}{" "}
                <b>
                  {selectedSubpanel["label"]} {LBL_SUBPANEL}
                </b>
                :
              </p>
              <CustomColumnChooser
                formSubmitLoading={formSubmitLoading}
                tabsFieldData={tabData ? tabData : {}}
                setTabsFieldData={setTabData}
                tabsHeadingLabel={columnLabel}
                handleRestoreDefault={handleRestoreDefault}
                handleSubmit={handleSubmit}
              />
            </>
          )}
        </Grid>
      ) : (
        <Grid item lg={9} md={9} sm={9} className={classes.noDataText}>
          {LBL_SELECT_SUBPANEL}
        </Grid>
      )}
    </Grid>
  ) : (
    <p className={classes.noDataText}>{LBL_NO_RELATIONSIP_FOR_SUBPANEL}</p>
  );
};

export default SubpanelManager;