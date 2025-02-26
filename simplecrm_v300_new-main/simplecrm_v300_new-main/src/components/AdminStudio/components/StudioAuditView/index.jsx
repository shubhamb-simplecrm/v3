import { CircularProgress } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import useStyles from "./styles";
import { toast } from "react-toastify";
import { pathOr, isEmpty } from "ramda";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import AuditSearchView from "./components/AuditSearchView";
import AuditListView from "./components/AuditListView";
import { getRelateFieldData } from "@/store/actions/module.actions";
import CustomDialog from "@/components/SharedComponents/CustomDialog";
import { SOMETHING_WENT_WRONG } from "@/constant";
import { useSelector } from "react-redux";
function StudioAuditView(props) {
  const { isDialogVisible, toggleDialogVisibility } = props;
  const classes = useStyles();
  const { module } = useParams();
  const auditModule = "scrm_studio_audit";
  const moduleList = useSelector((state) => state.layout.moduleList);
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
  const handleClose = () => {
    toggleDialogVisibility();
  };
  const fetchRelateFieldData = useCallback(
    async (
      pageNum = 1,
      filterQuery = [],
      sort = "-date_entered",
      pageSize = 20,
      reportsTo = null,
    ) => {
      let defaultQuery = {
        "filter[module][eq]": moduleList[module],
        "filter[sort_column][eq]": "date_entered",
        "filter[sort_order][eq]": "desc",
      };
      if (typeof filterQuery === "string") {
        filterQuery = defaultQuery;
      } else {
        if (isEmpty(filterQuery)) {
          defaultQuery = {
            "filter[sort_column][eq]": "date_entered",
            "filter[sort_order][eq]": "desc",
          };
        }
        if (!moduleList[module]) {
          defaultQuery = {
            "filter[view_name][multi]": "dropdowns",
          };
        }
        filterQuery = Object.assign(defaultQuery, filterQuery);
      }
      if (!moduleList[module]) {
        let defaultQuery = {
          "filter[view_name][multi]": "dropdowns",
        };
        filterQuery = Object.assign(defaultQuery, filterQuery);
      }

      if (isDialogVisible) {
        try {
          setLoading(true);
          const res = await getRelateFieldData(
            auditModule,
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
    [module, isDialogVisible],
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

  useEffect(() => {
    let sortStr = "";
    if (listViewSortOption) {
      sortStr = listViewSortOption?.name;
      if (listViewSortOption?.direction == "desc") {
        sortStr = "-".sortStr;
      }
    }
    searchData(1, "", sortStr);
  }, [searchData]);

  return (
    <CustomDialog
      isDialogOpen={isDialogVisible}
      handleCloseDialog={handleClose}
      fullScreen={isMobileViewCheck}
      isLoading={loading}
      bodyContent={
        <div className={classes.dialogContent}>
          <AuditSearchView
            searchFormLayout={dialogLayout?.searchFormLayout}
            searchData={searchData}
            searchFormFieldsMeta={searchFormFieldsMeta}
          />

          {loading ? (
            <div className={classes.progressWrapper}>
              <CircularProgress />
            </div>
          ) : (
            <AuditListView
              auditModule={auditModule}
              listViewData={dialogLayout?.listViewData}
              filterQuery={filterQuery}
              searchData={searchData}
              listViewPageNum={listViewPageNum}
              setListViewPageNum={setListViewPageNum}
              selectedRecordListView={selectedRecordListView}
              setSelectedRecordListView={setSelectedRecordListView}
              listViewSortOption={listViewSortOption}
              setListViewSortOption={setListViewSortOption}
              errorMessage={errorMessage}
            />
          )}
        </div>
      }
      title={`Studio ${moduleList[module] ?? ""} Audit`}
      maxWidth={"lg"}
    />
  );
}

export default StudioAuditView;
