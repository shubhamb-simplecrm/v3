import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import FormatListBulletedTwoToneIcon from "@material-ui/icons/FormatListBulletedTwoTone";
import ListAltTwoToneIcon from "@material-ui/icons/ListAltTwoTone";
import EditViewLayout from "./EditViewLayout";
import PopupLayout from "./PopupLayout";
import ListViewLayout from "./ListViewLayout";
import DashboardTwoToneIcon from "@material-ui/icons/DashboardTwoTone";
import LaunchIcon from "@material-ui/icons/Launch";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useDispatch } from "react-redux";
import {
  getLayoutData,
  setSelectedParameter,
} from "@/store/actions/studio.actions";
import useStyles from "./styles";
import clsx from "clsx";
import { Skeleton } from "@/components";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { useSelector } from "react-redux";
import {
  LBL_DASHLET_VIEW,
  LBL_DASHLET_VIEW_LABEL,
  LBL_DETAIL_VIEW,
  LBL_DETAIL_VIEW_LABEL,
  LBL_EDIT_VIEW,
  LBL_EDIT_VIEW_LABEL,
  LBL_FILTER_VIEW,
  LBL_FILTER_VIEW_LABEL,
  LBL_LIST_VIEW,
  LBL_LIST_VIEW_LABEL,
  LBL_POPUP_VIEW,
  LBL_POPUP_VIEW_LABEL,
  LBL_SELECT_VIEW,
} from "@/constant";
import { useIsMobileView } from "@/hooks/useIsMobileView";

const LayoutManager = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { module, view } = useParams();
  const selectedView = useSelector((state) => state.studio?.selectedParameter);
  const [tabData, setTabData] = useState({
    [LBL_DETAIL_VIEW]: {},
    [LBL_POPUP_VIEW]: {},
    [LBL_LIST_VIEW]: {},
    [LBL_EDIT_VIEW]: {},
    [LBL_FILTER_VIEW]: {},
    [LBL_DASHLET_VIEW]: {},
  });
  const [isLoading, setIsLoading] = useState(null);
  const toggleLoadingState = () => {
    setIsLoading(true);
  };
  const handleGetData = () => {
    setIsLoading(true);
    dispatch(
      getLayoutData({
        module: module,
        view: view,
        view_package: "",
      }),
    ).then((res) => {
      if (res?.ok) {
        setTabData({ ...tabData, [view]: res.data.data });
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };
  const renderLayout = () => {
    switch (view) {
      case LBL_EDIT_VIEW:
      case LBL_DETAIL_VIEW:
        return (
          <EditViewLayout
            data={tabData[view]}
            onClickRestoreDefault={handleGetData}
          />
        );
      case LBL_POPUP_VIEW:
      case LBL_DASHLET_VIEW:
        return (
          <PopupLayout
            data={tabData[view]}
            handleGetData={handleGetData}
            selectedView={selectedView}
          />
        );
      case LBL_LIST_VIEW:
      case LBL_FILTER_VIEW:
        return (
          <ListViewLayout
            data={tabData[view]}
            handleGetData={handleGetData}
            selectedView={selectedView}
          />
        );
      default:
        return;
    }
  };

  useEffect(() => {
    if (view == LBL_LIST_VIEW) {
      dispatch(setSelectedParameter(LBL_LIST_VIEW_LABEL));
    } else if (view == LBL_FILTER_VIEW) {
      dispatch(setSelectedParameter(LBL_FILTER_VIEW_LABEL));
    } else if (view == LBL_DASHLET_VIEW) {
      dispatch(setSelectedParameter(LBL_DASHLET_VIEW_LABEL));
    } else if (view == LBL_POPUP_VIEW) {
      dispatch(setSelectedParameter(LBL_POPUP_VIEW_LABEL));
    } else if (view == LBL_DETAIL_VIEW) {
      dispatch(setSelectedParameter(LBL_DETAIL_VIEW_LABEL));
    } else if (view == LBL_EDIT_VIEW) {
      dispatch(setSelectedParameter(LBL_EDIT_VIEW_LABEL));
    } else {
      dispatch(setSelectedParameter(LBL_EDIT_VIEW_LABEL));
    }
    handleGetData();
  }, [view, module]);

  return (
    <Grid container lg={12} md={12} sm={12}>
      <Grid item className={classes.grid} lg={2} md={12} sm={12}>
        <ViewList toggleLoadingState={toggleLoadingState} />
      </Grid>
      {isLoading ? (
        <Skeleton layout={"Studio"} />
      ) : (
        <Grid
          item
          lg={view === LBL_LIST_VIEW || view === LBL_FILTER_VIEW ? 10 : 10}
          md={view === LBL_LIST_VIEW || view === LBL_FILTER_VIEW ? 12 : 12}
          sm={view === LBL_LIST_VIEW || view === LBL_FILTER_VIEW ? 12 : 12}
          className={
            view === LBL_EDIT_VIEW || view === LBL_DETAIL_VIEW
              ? classes.grid1
              : classes.grid2
          }
        >
          
          
          {view ? (
            renderLayout()
          ) : (
            <p className={classes.noDataText}>{LBL_SELECT_VIEW}</p>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default LayoutManager;

export const ViewList = ({ toggleLoadingState }) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { module, manager, view } = useParams();

  const isTabMd = useIsMobileView("md");
  const isTabSm = useIsMobileView("sm");

  const viewArr = [
    {
      name: LBL_EDIT_VIEW,
      label: LBL_EDIT_VIEW_LABEL,
      icon: <EditTwoToneIcon className={classes.viewIcon} />,
    },
    {
      name: LBL_DETAIL_VIEW,
      label: LBL_DETAIL_VIEW_LABEL,
      icon: <ListAltTwoToneIcon className={classes.viewIcon} />,
    },
    {
      name: LBL_LIST_VIEW,
      label: LBL_LIST_VIEW_LABEL,
      icon: <FormatListBulletedTwoToneIcon className={classes.viewIcon} />,
    },
    {
      name: LBL_DASHLET_VIEW,
      label: LBL_DASHLET_VIEW_LABEL,
      icon: <DashboardTwoToneIcon className={classes.viewIcon} />,
    },
    {
      name: LBL_POPUP_VIEW,
      label: LBL_POPUP_VIEW_LABEL,
      icon: <LaunchIcon className={classes.viewIcon} />,
    },
    {
      name: LBL_FILTER_VIEW,
      label: LBL_FILTER_VIEW_LABEL,
      icon: <FilterListIcon className={classes.viewIcon} />,
    },
  ];
  const handleOnClickOption = (selectedOption) => {
    if (selectedOption.name == view) return null;
    toggleLoadingState();
    dispatch(setSelectedParameter(selectedOption.label));
    history.push(`/app/studio/${module}/${manager}/${selectedOption.name}`);
  };
  return (
    <div
      className={clsx({
        [classes.defaultContainer]: !(isTabSm || isTabMd),
        [classes.tabContainer]: (isTabSm || isTabMd),
      })}
    >
      {viewArr.map((item) => {
        return (
          <div
            key={item.name}
            className={clsx({
              [classes.viewBox]: !(isTabSm || isTabMd) ,
              [classes.tabViewBox]: (isTabSm || isTabMd),
            } , {
              [classes.highlightedBlock]: view === item.name,
              [classes.block]: view != item.name,
            })}
            onClick={() => handleOnClickOption(item)}
          >
            {item.icon}
            <p className={classes.listLabel}>{item.label}</p>
          </div>
        );
      })}
    </div>
  );
};