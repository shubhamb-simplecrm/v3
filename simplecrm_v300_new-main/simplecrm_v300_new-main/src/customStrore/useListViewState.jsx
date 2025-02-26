import { createWithEqualityFn as create } from "zustand/traditional";
import { devtools } from "zustand/middleware";
import { api } from "../common/api-utils";
import { isEmpty, isNil, pathOr } from "ramda";
import { SOMETHING_WENT_WRONG } from "../constant";

const initialState = {
  listViewData: {},
  listViewLoading: false,
  listViewError: null,
  currentListViewState: {
    moduleACLAccess: null,
    pageNo: 0,
    pageRowSize: 0,
    module: null,
    sort: null,
    sortOptions: {
      name: "",
      direction: "",
    },
    isFilterApplied: false,
    filter: null,
    fieldConfigurationObj: [],
    listData: [],
    listDataLabels: [],
    listMetaData: [],
    requiredFieldObj: {},
    listViewFilterPreference: {},
    saveSearchOptionList: {},
    innerListViewLoading: false,
    savedSearchId: null,
    isFilterLockApplied: false,
    basicSearchField: {},
  },
  selectedRowsList: [],
  modulePageNo: {},
  withFilterRefresh: false,
};

export const useListViewState = create(
  devtools(
    (set, get) => ({
      ...initialState,
      actions: {
        getListViewData: async (moduleName, customArgs) => {
          const {
            pageNo = 1,
            pageSize = 20,
            filterOption = {},
            sortOption = null,
            isMobileView = false,
            isInitCall = false,
            withFilterRefresh = false,
          } = customArgs;
          if (isInitCall) {
            set({
              selectedRowsList: [],
              listViewLoading: true,
              listViewError: null,
            });
          } else {
            set((state) => ({
              ...state,
              currentListViewState: {
                ...state.currentListViewState,
                innerListViewLoading: true,
              },
            }));
          }
          let requestQueryParams = {
            page: {
              number: pageNo,
              size: pageSize,
            },
          };
          // let CTIMobile = LocalStorageUtils.getValueByKey("CTI_mobile");
          // if (!isNil(CTIMobile) && !isEmpty(CTIMobile)) {
          //   requestQueryParams["filter"]["phone"]["lke"] = CTIMobile;
          //   LocalStorageUtils.clearValueByKey("CTI_mobile");
          // }

          if (!isNil(filterOption) && !isEmpty(filterOption)) {
            if (typeof filterOption == "object") {
              requestQueryParams = { ...requestQueryParams, ...filterOption };
            } else {
              const result = {};
              const params = new URLSearchParams(filterOption);
              for (const [key, value] of params) {
                result[key] = value;
              }
              requestQueryParams = { ...requestQueryParams, ...result };
            }
          }

          const response = await api.get(
            `/V8/layout/ListView/${moduleName}/1`,
            requestQueryParams,
          );
          if (response.ok) {
            // additionalData
            const additionalData = pathOr(
              {},
              ["data", "data", "templateMeta", "additionalData"],
              response,
            );
            const requiredFieldObj = pathOr(
              {},
              ["importRequiredFields"],
              additionalData,
            );
            const listViewFilterPreference = pathOr(
              {},
              ["listViewFilterPreference"],
              additionalData,
            );
            const saveSearchOptionList = pathOr(
              {},
              ["savedSearchOptions"],
              additionalData,
            );
            const savedSearchId = pathOr(
              null,
              ["savedSearchId"],
              additionalData,
            );
            const sortColumnName = pathOr("", ["sortColumn"], additionalData);
            const sortOrder = pathOr("", ["sortDirection"], additionalData);
            const moduleACLAccess = pathOr("", ["ACLAccess"], additionalData);
            const isFilterApplied = pathOr(
              false,
              ["isFilterApplied"],
              additionalData,
            );
            const isFilterLockApplied = pathOr(
              false,
              ["isFilterLockApplied"],
              additionalData,
            );
            const basicSearchField = pathOr(
              {},
              ["basicSearchField"],
              additionalData,
            );
            const fieldConfigurationObj = pathOr(
              [],
              [
                "data",
                "data",
                "templateMeta",
                "fieldConfiguration",
                "data",
                "JSONeditor",
                "dynamicLogic",
                "fields",
              ],
              response,
            );
            const listData = pathOr(
              [],
              ["data", "data", "templateMeta", "data"],
              response,
            );
            const listDataLabels = pathOr(
              [],
              ["data", "data", "templateMeta", "datalabels"],
              response,
            );
            const listMetaData = pathOr([], ["data", "meta"], response);
            Object.entries(listViewFilterPreference).forEach(([key, obj]) => {
              const temp = pathOr([], [0], Object.entries(obj));
              if ((key !== "deleted" || key !== "reset") && !isEmpty(temp)) {
                let operator = pathOr("", [0], temp);
                let value = pathOr("", [1], temp);
                const encodeInput = value.toString().trim();
                filterOption[`filter[${key}][${operator}]`] = encodeInput;
              }
            });
            set({
              ...get(),
              listViewLoading: false,
              listViewError: null,
              listViewData: response.data,
              isFilterLockApplied,
              filterOpenState: isMobileView ? false : isFilterLockApplied,
              currentListViewState: {
                basicSearchField,
                innerListViewLoading: false,
                moduleACLAccess: moduleACLAccess,
                pageNo: pageNo,
                pageRowSize: pageSize,
                module: moduleName,
                sort: sortOption,
                sortOptions: {
                  name: sortColumnName,
                  direction: sortOrder,
                },
                isFilterApplied,
                filter: filterOption,
                fieldConfigurationObj,
                listData,
                listDataLabels,
                listMetaData,
                saveSearchOptionList,
                get listViewFields() {
                  const fieldList = {};
                  if (Array.isArray(listDataLabels)) {
                    listDataLabels.forEach((dataLabel) => {
                      fieldList[dataLabel.name] = dataLabel;
                    });
                  }
                  return fieldList;
                },
                requiredFieldObj: requiredFieldObj,
                savedSearchId,
                listViewFilterPreference,
              },
              modulePageNo: {
                ...get().modulePageNo,
                [moduleName]: pageNo,
              },
              withFilterRefresh,
            });
          } else {
            set((state) => ({
              listViewLoading: false,
              listViewError: pathOr(
                SOMETHING_WENT_WRONG,
                ["data", "errors", "detail"],
                response,
              ),
              listViewData: pathOr(
                SOMETHING_WENT_WRONG,
                ["data", "errors", "detail"],
                response,
              ),
              currentListViewState: {
                ...state.currentListViewState,
                ...initialState.currentListViewState,
                module: moduleName,
                pageRowSize: pageSize,
                innerListViewLoading: false,
              },
            }));
          }
        },
        getFilterViewData: async (moduleName) => {
          const res = await api.get(`/V8/layout/Search/${moduleName}/1`);
          if (res.ok) {
          }
        },
        changeTableState: async (customArgs) => {
          const {
            pageNo = get().currentListViewState.pageNo,
            pageSize = get().currentListViewState.pageRowSize,
            filterOption = {},
            sortOptionObj = {},
            withAppliedFilter = false,
            resetFilter = false,
            withSelectedRecords = true,
            withFilterRefresh = false,
            withSavePageNo = false,
          } = customArgs;
          const requestPayload = {
            pageNo,
            pageSize,
            filterOption,
          };

          if (withAppliedFilter) {
            const inputObj = get().currentListViewState.filter;
            const removeFilterKeys = ["saved_search_name", "filter[reset][eq]"];
            removeFilterKeys.forEach((key) => {
              if (inputObj.hasOwnProperty(key)) {
                delete inputObj[key];
              }
            });
            requestPayload["filterOption"] = {
              ...inputObj,
              ...requestPayload["filterOption"],
            };
            requestPayload["sortOptionObj"] =
              get().currentListViewState.sortOptions;
          }
          if (!isEmpty(sortOptionObj)) {
            requestPayload["sortOption"] =
              sortOptionObj.direction == "desc"
                ? `-${sortOptionObj.name}`
                : sortOptionObj.name;
            requestPayload["filterOption"]["filter[sort_column][eq]"] =
              sortOptionObj.name;
            requestPayload["filterOption"]["filter[sort_order][eq]"] =
              sortOptionObj.direction;
          }
          const sortColumn = pathOr(
            "",
            ["filterOption", "filter[sort_column][eq]"],
            requestPayload,
          );
          const sortOrder = pathOr(
            "",
            ["filterOption", "filter[sort_order][eq]"],
            requestPayload,
          );

          if (!isEmpty(sortColumn)) {
            const sort = `${sortOrder == "desc" ? "-" : ""}${sortColumn}`;
            requestPayload["filterOption"]["sort"] = sort;
            requestPayload["sortOption"] = sort;
          }

          if (resetFilter) {
            requestPayload["filterOption"] = {
              "filter[reset][eq]": true,
            };
          }
          requestPayload["withFilterRefresh"] = withFilterRefresh;

          if (!withSelectedRecords) {
            get().actions.onRowSelectionChange([]);
          }

          const moduleName = get().currentListViewState.module;
          if (withSavePageNo) {
            requestPayload["pageNo"] = pathOr(
              1,
              ["modulePageNo", moduleName],
              get(),
            );
          }

          get().actions.getListViewData(moduleName, requestPayload);
        },
        onRowSelectionChange: (result) => {
          set({
            selectedRowsList: result,
          });
        },
        resetStore: () => set((state) => ({ ...initialState })),
      },
    }),
    { name: "ListView Store" },
  ),
);
