import { CircularProgress } from "@material-ui/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SOMETHING_WENT_WRONG } from "@/constant";
import useStyles from "./styles";
import RelateFieldDialogSearchForm from "./components/relate-field-dialog-search-form";
import RelateFieldDialogListView from "./components/relate-field-dialog-listview";
import { getRelateFieldData } from "@/store/actions/module.actions";
import { toast } from "react-toastify";
import { pathOr } from "ramda";
import CustomDialog from "@/components/SharedComponents/CustomDialog";
import { useIsMobileView } from "@/hooks/useIsMobileView";
function RelateFieldDialog(props) {
  const {
    module,
    fieldMetaObj,
    onChange,
    view = null,
    isDialogVisible,
    toggleDialogVisibility,
    moduleMetaData,
    customProps = {},
  } = props;
  const {
    multiSelect = false,
    filterPayload = {},
    listViewOnly = false,
  } = customProps;
  const classes = useStyles();
  const isMobileViewCheck = useIsMobileView();
  const [loading, setLoading] = useState(false);
  const [dialogLayout, setDialogLayout] = useState({});
  const [searchFormFieldsMeta, setSearchFormFieldsMeta] = useState({});
  const [filterQuery, setFilterQuery] = useState("");
  const [listViewPageNum, setListViewPageNum] = useState(1);
  const [selectedRecordListView, setSelectedRecordListView] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [listViewSortOption, setListViewSortOption] = useState({
    name: "date_entered",
    direction: "desc",
  });
  let [ACLAccess, setACLAccess] = useState({});
  const currentSelectedModule = useMemo(
    () =>
      pathOr(
        pathOr("", ["currentModule"], moduleMetaData),
        ["module"],
        fieldMetaObj,
      ),
    [fieldMetaObj],
  );
  const handleClose = () => {
    toggleDialogVisibility();
  };
  const fetchRelateFieldData = useCallback(
    async (
      pageNum = 1,
      filterQuery = "",
      sort = "-date_entered",
      pageSize = 20,
      reportsTo = null,
    ) => {
      if (isDialogVisible) {
        try {
          setLoading(true);
          const res = await getRelateFieldData(
            currentSelectedModule,
            pageSize,
            pageNum,
            sort,
            filterQuery,
            reportsTo,
          );
          setErrorMessage(pathOr("", ["data", "errors", "detail"], res));
          if (res.ok) {
            const moduleLabel = pathOr(
              "",
              ["data", "data", "module_label"],
              res,
            );
            const module = pathOr("", ["data", "data", "module"], res);
            const tempSearchFormLayout = pathOr(
              [],
              ["data", "data", "templateMeta", "searchview"],
              res,
            );
            setACLAccess(
              pathOr({}, ["data", "data", "templateMeta", "ACLAccess"], res),
            );
            const tempListViewMetaData = pathOr([], ["data", "meta"], res);
            const tempListViewData = pathOr(
              [],
              ["data", "data", "templateMeta", "listview"],
              res,
            );
            tempListViewData["meta"] = tempListViewMetaData;
            const tempSearchFormFieldMeta = {};
            tempSearchFormLayout?.forEach(
              (field) => (tempSearchFormFieldMeta[field.field_key] = field),
            );
            setDialogLayout({
              searchFormLayout: tempSearchFormLayout,
              listViewData: tempListViewData,
              moduleLabel: moduleLabel,
              module: module,
            });
            setSearchFormFieldsMeta(tempSearchFormFieldMeta);
          } else {
            handleClose();
            toast(
              pathOr(SOMETHING_WENT_WRONG, ["data", "errors", "detail"], res),
            );
          }
          setLoading(false);
        } catch (ex) {
          setLoading(false);
          toast(SOMETHING_WENT_WRONG);
        }
      }
    },
    [currentSelectedModule, isDialogVisible],
  );
  const searchData = useCallback(
    (pageNum, filterQuery = {}, sort = "-date_entered") => {
      if (sort) {
        const sortOptionObj = {};
        if (sort.startsWith("-")) {
          sortOptionObj["name"] = sort.substring(1);
          sortOptionObj["direction"] = "desc";
        } else {
          sortOptionObj["name"] = sort;
          sortOptionObj["direction"] = "asc";
        }
        setListViewSortOption(sortOptionObj);
      }
      setFilterQuery(filterQuery);
      setListViewPageNum(pageNum);
      fetchRelateFieldData(pageNum, filterQuery, sort);
    },
    [fetchRelateFieldData],
  );
  const handleConfirmMultiSelectedRecord = useCallback((selectedRecords) => {
    onChange(selectedRecords);
    toggleDialogVisibility();
  }, []);

  useEffect(() => {
    let sortStr = "";
    if (listViewSortOption) {
      sortStr = listViewSortOption?.name;
      if (listViewSortOption?.direction == "desc") {
        sortStr = "-".sortStr;
      }
    }
    searchData(1, filterPayload, sortStr);
  }, [searchData]);

  return (
    <>
      <CustomDialog
        isDialogOpen={isDialogVisible}
        handleCloseDialog={handleClose}
        fullScreen={isMobileViewCheck}
        isLoading={loading}
        bodyContent={
          <div className={classes.dialogContent}>
            {!listViewOnly && (
              <RelateFieldDialogSearchForm
                searchFormLayout={dialogLayout?.searchFormLayout}
                setFilterQuery={setFilterQuery}
                searchData={searchData}
                searchFormFieldsMeta={searchFormFieldsMeta}
                module={dialogLayout?.module}
                ACLAccess={ACLAccess}
              />
            )}
            {loading ? (
              <div className={classes.progressWrapper}>
                <CircularProgress />
              </div>
            ) : (
              <RelateFieldDialogListView
                module={currentSelectedModule}
                listViewData={dialogLayout?.listViewData}
                view={view}
                multiSelect={multiSelect}
                filterQuery={filterQuery}
                searchData={searchData}
                onChange={onChange}
                toggleDialogVisibility={toggleDialogVisibility}
                field={fieldMetaObj}
                listViewPageNum={listViewPageNum}
                setListViewPageNum={setListViewPageNum}
                handleConfirmMultiSelectedRecord={
                  handleConfirmMultiSelectedRecord
                }
                selectedRecordListView={selectedRecordListView}
                setSelectedRecordListView={setSelectedRecordListView}
                listViewSortOption={listViewSortOption}
                setListViewSortOption={setListViewSortOption}
                errorMessage={errorMessage}
              />
            )}
          </div>
        }
        title={dialogLayout?.moduleLabel}
        maxWidth={"lg"}
      />
    </>
  );
}

export default RelateFieldDialog;
