import React, { useCallback, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { pathOr } from "ramda";
import {
  getDetailView,
  getReportsDetailView,
  getEmailsDetailView,
} from "../../store/actions/detail.actions";
import { Error, DetailView, ErrorBoundary } from "../../components";
import { Box, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import SkeletonShell from "../../components/Skeleton/index";
import { Mail } from "../../components/Emails";
const Detail = () => {
  const dispatch = useDispatch();
  const { module, id, uid, msgno } = useParams();
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [value, setValue] = useState(0);
  const [reportFilter, setReportFilter] = useState({});
  const [isSubpanelUpdated, setIsSubpanelUpdated] = useState(false);
  const {
    detailFilterViewData,
    detailViewTabData,
    detailViewError,
    detailViewLoading,
  } = useSelector((state) => state.detail);

  const config = useSelector((state) => state.config);

  const subpanels = pathOr(
    [],
    [module, "data", "templateMeta", "subpanels", "subpanel_tabs"],
    detailViewTabData,
  );
  const recordName = pathOr(
    [],
    [module, "data", "templateMeta", "recordInfo", "record_name"],
    detailViewTabData,
  );
  const recordInfo = pathOr(
    [],
    [module, "data", "templateMeta", "recordInfo"],
    detailViewTabData,
  );

  const is_fav = pathOr(
    0,
    [module, "data", "templateMeta", "recordInfo", "is_fav"],
    detailViewTabData,
  );
  const actionButtons = pathOr(
    [],
    [module, "data", "templateMeta", "recordInfo", "actionbuttons"],
    detailViewTabData,
  );
  const folderDetails = pathOr(
    null,
    [module, "data", "templateMeta", "folder_details"],
    detailViewTabData,
  );

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

  const getDetailViewData = useCallback(() => {
    if (module == "AOR_Reports") {
      module &&
        dispatch(
          getReportsDetailView(module, id, pageNo, "", 20, reportFilter),
        );
    } else if (module === "Emails") {
      let folderFlag = folderDetails ? "no" : "yes";
      module &&
        dispatch(getEmailsDetailView(module, "", msgno, uid, id, folderFlag));
    } else {
      module && dispatch(getDetailView(module, id));
    }
    if (isSubpanelUpdated) {
      setValue(value);
      setIsSubpanelUpdated(false);
    }
  }, [dispatch, module, id, pageNo, isSubpanelUpdated]);
  useEffect(() => {
    setValue(0);
  }, [module]);
  useEffect(() => {
    getDetailViewData();
  }, [getDetailViewData]);

  if (
    detailViewLoading &&
    (!Object.keys(detailViewTabData).length ||
      !Object.keys(detailFilterViewData).length)
  ) {
    return <SkeletonShell layout="DetailView" />;
  }

  if (detailViewError) {
    return (
      <Error description={detailViewError} view="EditView" title="Error" />
    );
  }
  return (
    <ErrorBoundary>
      {module != "Emails" ? (
        <DetailView
          data={detailViewTabData[module]}
          subpanels={subpanels}
          module={module}
          recordId={id}
          recordName={recordName}
          recordInfo={recordInfo}
          currentTheme={config.themeConfig.currentTheme}
          is_fav={is_fav}
          actionButtons={actionButtons}
          setIsSubpanelUpdated={setIsSubpanelUpdated}
          value={value}
          setValue={setValue}
        />
      ) : (
        <Mail
          view="DetailView"
          ACLAccess={""}
          dataLabels={""}
          data={[]}
          viewEmailData={detailViewTabData[module]}
          module={module}
          moduleLabel={""}
          isLoading={false}
          meta={[]}
          dateFormat={[]}
          folderDetails={folderDetails ?? []}
          selectedFolder={[]}
          listViewWhere={[]}
          page={pageNo}
          sortBy={""}
          sortOrder={""}
          lastListViewSort={""}
          rowsPerPage={""}
          setPageNo={setPageNo}
          changePageOrSort={(pageNo, sort = "") => {}}
        />
      )}
    </ErrorBoundary>
  );
};

export default Detail;
