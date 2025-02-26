import React, { useCallback, useEffect, useState, Fragment } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { pathOr } from "ramda";

import {
  getListView,
  setSelectedModule,
  deleteRecordFromModule,
  getFilterConfig,
} from "../../store/actions/module.actions";
import {
  Error,
  // ListView,
  Alert,
  ErrorBoundary,
  Skeleton,
  Calendar,
} from "../../components";
import { toast } from "react-toastify";

import { Mail } from "../../components/Emails";
import {
  LBL_CONFIRM_DELETE_RECORD_TITLE,
  LBL_CONFIRM_DELETE_TITLE,
  LBL_CONFIRM_NO,
  LBL_CONFIRM_YES,
  SOMETHING_WENT_WRONG,
} from "../../constant";
import { useLayoutState } from "../../customStrore/useLayoutState";
import { useIsMobileView } from "../../hooks/useIsMobileView";
const Email = () => {
  const [alertVisible, setAlertVisibility] = useState(false);

  const { toggleFilterState, toggleFilterLockState } = useLayoutState(
    (state) => state.actions,
  );
  const [recordId, setRecordId] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const dispatch = useDispatch();
  // const { module } = useParams();
  const module = "Emails";
  const history = useHistory();

  const { listViewLoading, listViewError, listViewTabData, selectedModule } =
    useSelector((state) => state.modules);
  const { sidebarLinks } = useSelector((state) => state.layout);
  const config = useSelector((state) => state.config);

  const appliedFilter = pathOr(
    {},
    ["data", "templateMeta", "UserPreference", "params"],
    useSelector((state) => state.modules.listViewTabData[module]),
  );
  if (appliedFilter?.deleted) {
    delete appliedFilter.deleted;
  }

  const ACLAccess = pathOr(
    [],
    ["data", "templateMeta", "ACLAccess"],
    useSelector((state) => state.modules.listViewTabData[module]),
  );
  const datalabels = pathOr(
    [],
    ["data", "templateMeta", "datalabels"],
    useSelector((state) => state.modules.listViewTabData[module]),
  );

  const listViewMeta = pathOr({}, [module, "meta"], listViewTabData);
  const listViewWhere = pathOr(
    {},
    ["data", "templateMeta", "where"],
    useSelector((state) => state.modules.listViewTabData[module]),
  );
  const sortBy = pathOr(
    "",
    ["data", "templateMeta", "sort"],
    useSelector((state) => state.modules.listViewTabData[module]),
  );
  const sortOrder = pathOr(
    "",
    ["data", "templateMeta", "sortOrder"],
    useSelector((state) => state.modules.listViewTabData[module]),
  );
  const rowsPerPage = pathOr(
    20,
    ["config", "list_max_entries_per_page"],
    config,
  );
  const isListViewFilterOpen = pathOr(
    "",
    ["data", "templateMeta", "isListViewFilterOpen"],
    useSelector((state) => state.modules.listViewTabData[module]),
  );
  const folderData = pathOr(
    "",
    ["data", "templateMeta", "folder_details"],
    useSelector((state) => state.modules.listViewTabData[module]),
  );
  const selectedFolder = pathOr(
    "",
    ["data", "templateMeta", "selected_folder"],
    useSelector((state) => state.modules.listViewTabData[module]),
  );
  const data = pathOr(
    [],
    ["data", "templateMeta", "data"],
    useSelector((state) => state.modules.listViewTabData[module]),
  );
  const fieldConfigurator = pathOr(
    [],
    [
      "data",
      "templateMeta",
      "FieldConfigursion",
      "data",
      "JSONeditor",
      "dynamicLogic",
      "fields",
    ],
    useSelector((state) => state.modules.listViewTabData[module]),
  );
  // isListViewFilterOpen
  const dateFormat = pathOr(undefined, ["config", "datef"], config);
  const [lastListViewSort, setLastListViewSort] = useState({
    name: sortBy,
    direction: sortOrder,
  });
  let isMobileViewCheck = useIsMobileView();
  const [isSortingFieldChange, setIsSortingFieldChange] = useState(false);
  const getListViewData = useCallback(() => {
    if (module !== "Calendar") {
      module &&
        dispatch(getListView(module, 0, rowsPerPage)).then((res) => {
          const isListViewFilterOpenFlag = pathOr(
            "off",
            ["data", "templateMeta", "isListViewFilterOpen"],
            res,
          );
        });
      module && dispatch(setSelectedModule(module));
    }
  }, [module, isListViewFilterOpen]);
  const fetchFilterConfig = useCallback(() => {
    if (module) {
      dispatch(getFilterConfig(module));
    }
  }, [dispatch, module]);

  useEffect(() => {
    getListViewData();
  }, [module]);
  useEffect(() => {
    setPageNo(0);
    setLastListViewSort({ name: sortBy, direction: sortOrder });
  }, [module]);
  useEffect(() => {
    if (isSortingFieldChange) {
      fetchFilterConfig();
      setIsSortingFieldChange(false);
    }
  }, [listViewTabData]);

  const confirmDeletion = (id) => {
    setAlertVisibility(true);
    setRecordId(id);
  };

  const deleteRecord = async () => {
    setAlertVisibility(!alertVisible);
    try {
      const res = await deleteRecordFromModule(module, recordId);
      toast(res.ok ? res.data.meta.message : res.data.errors.detail);
      dispatch(
        getListView(
          module,
          pageNo,
          rowsPerPage,
          "",
          listViewWhere.length ? listViewWhere : "",
        ),
      );
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
    }
  };

  if (
    listViewLoading &&
    !Object.keys(listViewTabData).length &&
    !Object.keys(listViewMeta).length
  ) {
    return <Skeleton />;
  }

  if (listViewError && module !== "Calendar") {
    //return <h3>{listViewError}</h3>;
    return <Error description={listViewError} view="ListView" title="Error" />;
  }

  const moduleLabel = pathOr("", ["attributes", module, "label"], sidebarLinks);
  // console.log(selectedModule + "----" + module + "=======" + pageNo)
  return (
    <ErrorBoundary>
      {module === "Calendar" ? (
        <Calendar module={module} />
      ) : (
        <>
          <Mail
            ACLAccess={ACLAccess}
            dataLabels={datalabels}
            data={data}
            module={module}
            moduleLabel={moduleLabel}
            isLoading={listViewLoading}
            meta={listViewMeta}
            dateFormat={dateFormat}
            folderDetails={folderData}
            selectedFolder={selectedFolder}
            listViewWhere={listViewWhere}
            page={pageNo}
            sortBy={sortBy}
            sortOrder={sortOrder}
            lastListViewSort={lastListViewSort}
            rowsPerPage={rowsPerPage}
            setPageNo={setPageNo}
            changePageOrSort={(pageNo, sort = "") => (
              setPageNo(pageNo),
              setLastListViewSort({}),
              dispatch(
                getListView(
                  module,
                  pageNo,
                  rowsPerPage,
                  sort,
                  listViewWhere.length ? listViewWhere : "",
                  selectedFolder,
                ),
              ).then((res) => {
                //setListViewMeta(pathOr([], ['data','meta'], res));
                //setData(pathOr([], ['data', 'data','templateMeta','data'], res));
              })
            )}
          />
          <Alert
            title={LBL_CONFIRM_DELETE_TITLE}
            msg={LBL_CONFIRM_DELETE_RECORD_TITLE}
            open={alertVisible}
            agreeText={LBL_CONFIRM_YES}
            disagreeText={LBL_CONFIRM_NO}
            handleClose={() => setAlertVisibility(!alertVisible)}
            onAgree={deleteRecord}
          />
        </>
      )}
    </ErrorBoundary>
  );
};

export default Email;
