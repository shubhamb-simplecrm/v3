import React, { useEffect, useCallback, memo } from "react";
import { useModuleViewDetail } from "../../hooks/useModuleViewDetail";
import { useListViewState } from "../../customStrore/useListViewState";
import useCommonUtils from "../../hooks/useCommonUtils";
import { Error, Skeleton } from "../../components";
import { useIsMobileView } from "../../hooks/useIsMobileView";
import ListViewDataTable from "../../components/ListViewDataTable";

const Module = () => {
  const metaObj = useModuleViewDetail();
  const { currentModule, currentModuleLabel, currentView } = metaObj;
  const { getListViewData } = useListViewState((state) => state.actions);
  const { getListViewRowPerPage } = useCommonUtils();
  let isMobileViewCheck = useIsMobileView();
  const { listViewLoading, listViewError, modulePageNo } = useListViewState(
    (state) => ({
      listViewLoading: state.listViewLoading,
      listViewError: state.listViewError,
      modulePageNo: state.modulePageNo,
    }),
  );

  useEffect(() => {
    currentModule &&
      getListViewData(currentModule, {
        pageNo: modulePageNo[currentModule] || 1,
        pageSize: getListViewRowPerPage,
        isMobileView: isMobileViewCheck,
        isInitCall: true,
      });
  }, [currentModule]);

  if (listViewLoading) {
    return <Skeleton />;
  }

  if (listViewError && currentModule !== "Calendar") {
    return (
      <Error
        description={listViewError}
        view="ListView"
        title="Error"
        callback={() =>
          getListViewData(currentModule, {
            filterOption: { "filter[reset][eq]": true },
            isInitCall: true,
          })
        }
      />
    );
  }

  if (listViewLoading) {
    return <Skeleton />;
  }

  return <ListViewContainer currentModule={currentModule} />;
};

const ListViewContainer = memo(({ currentModule }) => {
  const { currentListViewState, withFilterRefresh, isFilterLockApplied } =
    useListViewState((state) => ({
      currentListViewState: state.currentListViewState,
      withFilterRefresh: state.withFilterRefresh,
      isFilterLockApplied: state.isFilterLockApplied,
    }));
  const { isListViewTableFixed } = useCommonUtils();
  const selectedRowsList = useListViewState((state) => state.selectedRowsList);
  const { changeTableState, onRowSelectionChange } = useListViewState(
    (state) => state.actions,
  );

  const {
    listData,
    listDataLabels,
    moduleACLAccess,
    fieldConfigurationObj,
    listViewFields,
    requiredFieldObj,
    listMetaData,
    pageRowSize,
    sortOptions,
    pageNo,
    selectedRowRecordData,
    saveSearchOptionList,
    isFilterApplied,
    innerListViewLoading,
    listViewFilterPreference,
    savedSearchId,
    basicSearchField,
  } = currentListViewState;

  const onListStateChange = useCallback((inputObj) => {
    changeTableState(inputObj);
  }, []);

  return (
    <ListViewDataTable
      title={""}
      loading={innerListViewLoading}
      currentModule={currentModule}
      listData={listData}
      listColumnLabels={listDataLabels}
      fieldConfigurationOptions={{
        fieldConfigurationObj,
        listViewFields,
      }}
      listViewOptions={{
        tableId: "ListViewTable",
        fixedHeader: true,
        fixedSelectColumn: true,
        tableBodyHeight: isListViewTableFixed ? "calc(100vh - 14rem)" : "100%",
        tableBodyMaxHeight: isListViewTableFixed
          ? "calc(100vh - 14rem)"
          : "100%",
        pageRowSize: pageRowSize,
        pageNo: pageNo,
        sortOptions: sortOptions,
        selectedRowsList,
        onRowSelectionChange,
      }}
      customListDataOptions={{
        onListStateChange,
        listMetaData,
        moduleACLAccess,
        requiredImportFieldObj: requiredFieldObj,
        selectedRowRecordData,
        saveSearchOptionList,
        isFilterApplied,
        listViewFilterPreference,
        savedSearchId,
        withFilterRefresh,
        isFilterLockApplied,
        basicSearchField,
      }}
    />
  );
});

export default Module;
