import React, { useEffect, useState } from "react";
import StudioBreadCrumb from "./components/BreadCrumb";
import CustomList from "./components/CustomList";
import { Grid } from "@material-ui/core";
import DefaultModuleView from "./DefaultModuleView.jsx";
import TabView from "./TabView.jsx";
import {
  LBL_FIELD_MANAGER,
  LBL_LAYOUT_MANAGER,
  LBL_RELATIONSHIP_MANAGER,
  LBL_SEARCH_MODULE_PLACEHOLDER,
  LBL_SUBPANEL_MANAGER,
} from "@/constant";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getModuleList,
  setSelectedParameter,
} from "@/store/actions/studio.actions";
import { Skeleton } from "..";
import DefaultModuleList from "./DefaultModuleList";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import useStyles from "./styles";
import { useIsMobileView } from "@/hooks/useIsMobileView";

const StudioView = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  useEffect(() => {
    dispatch(getModuleList());
  }, []);

  return (
    <div className={classes.root}>
      <StudioBreadCrumb />
      <ContentContainer />
    </div>
  );
};

const ContentContainer = () => {
  const { module } = useParams();
  const moduleListLoading = useSelector(
    (state) => state.studio?.moduleListLoading,
  );
  const moduleList = useSelector((state) => state.studio?.moduleList);
  if (moduleListLoading) {
    return <Skeleton />;
  }
  return module ? (
    <ManagerContainer moduleList={moduleList} />
  ) : (
    <DefaultModuleList data={moduleList} />
  );
};

const ManagerContainer = ({ moduleList }) => {
  const dispatch = useDispatch();
  const { module, manager } = useParams();
  const history = useHistory();
  const [collapseModuleList, setCollapseModuleList] = useState(true);
  const [value, setValue] = useState(0);
  const handleHideModuleList = () => {
    setCollapseModuleList(!collapseModuleList);
  };
  const handleOnManagerClick = (newValue, managerName) => {
    setValue(newValue);
    history.push(
      `/app/studio/${module}/${managerName}${
        managerName === LBL_LAYOUT_MANAGER
          ? `/editView`
          : managerName === LBL_RELATIONSHIP_MANAGER
            ? `/addRelationship`
            : managerName === LBL_FIELD_MANAGER
              ? `/addField`
              : ""
      }`,
    );
    dispatch(setSelectedParameter(null));
  };
  useEffect(() => {
    if (manager === LBL_LAYOUT_MANAGER) {
      setValue(1);
    } else if (manager === LBL_RELATIONSHIP_MANAGER) {
      setValue(2);
    } else if (manager === LBL_SUBPANEL_MANAGER) {
      setValue(3);
    } else {
      setValue(0);
    }
  }, []);

  const isMobile = useIsMobileView("xs");

  return (
      <Grid container lg={12} md={12} sm={12} xs={12}>
        <Grid
          lg={collapseModuleList ? false : 2}
          md={collapseModuleList ? false : 3}
          sm={collapseModuleList ? false : 3}
          xs={collapseModuleList ? false : 12}
          style={{
            borderRight: "1px solid #dedede",
          }}
        >
          <CustomList
            data={moduleList}
            handleHideModuleList={handleHideModuleList}
            collapseModuleList={collapseModuleList}
            placeHolder={LBL_SEARCH_MODULE_PLACEHOLDER}
          />
        </Grid>
        <Grid
          item
          lg={collapseModuleList ? false : 10}
          md={collapseModuleList ? false : 9}
          sm={collapseModuleList ? false : 9}
          xs={collapseModuleList ? false : false}
          style={{
            display: collapseModuleList ? "block" : isMobile ? "none" : "block",
            width: collapseModuleList ? "calc(100% - 3.3rem)" : ""   
          }}
        >
          {manager ? (
            <TabView
              value={value}
              handleOnManagerClick={handleOnManagerClick}
            />
          ) : (
            <DefaultModuleView handleOnManagerClick={handleOnManagerClick} />
          )}
        </Grid>
      </Grid>
  );
};

export default StudioView;