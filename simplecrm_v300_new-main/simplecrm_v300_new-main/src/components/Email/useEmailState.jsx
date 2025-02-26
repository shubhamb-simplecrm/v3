import { createWithEqualityFn as create } from "zustand/traditional";
import { devtools } from "zustand/middleware";
import { isEmpty, isNil, pathOr } from "ramda";
import { LBL_ACTION_SUCCESSFUL, SOMETHING_WENT_WRONG } from "@/constant";
import { api } from "@/common/api-utils";
import { toast } from "react-toastify";

const initialState = {
  listData: [],
  detailData: {},
  listViewLoading: false,
  detailLoading: false,
  listViewError: null,
  folderData: [],
  listDataLabels: [],
  selectedRowsList: {},
  modulePageNo: {},
  pageNo: 1,
  rowsPerPage: 10,
  listMetaData: [],
  collapseSidebar: false,
  formValues: {},
  selectedFolderId: "",
  selectedFolderName: "",
  selectedParentFolderId: "",
  isDetailViewOpen: false,
  filterObj: {},
  detailViewFolderId: "",
  detailViewFolderName: "",
  detailViewEmailUID: "",
};

export const useEmailState = create(
  devtools(
    (set, get) => ({
      ...initialState,
      actions: {
        getListViewData: async (
          folderId = "",
          pageNo = 1,
          filterOption = get().filterObj,
        ) => {
          set({
            selectedRowsList: {},
            listViewLoading: true,
            listViewError: null,
            pageNo: pageNo,
            filterObj: filterOption,
          });
          if (get().selectedFolderId != folderId) {
            set({
              isDetailViewOpen: false,
              filterObj: {},
            });
          }
          let requestQueryParams = {
            page: {
              number: pageNo,
              size: get().rowsPerPage,
            },
          };

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

          requestQueryParams["moduleName"] = "Emails";
          if (folderId) {
            requestQueryParams["folders_id"] = folderId;
          }

          const response = await api.get(
            `/V8/Email/ListView`,
            requestQueryParams,
          );
          if (response.ok) {
            const selectedFolderId = pathOr(
              folderId,
              ["data", "data", "data", "additionalData", "selected_folder"],
              response,
            );
            const selectedFolderName = pathOr(
              folderId,
              ["data", "data", "data", "additionalData", "folder_name"],
              response,
            );
            const selectedParentFolder = pathOr(
              folderId,
              [
                "data",
                "data",
                "data",
                "additionalData",
                "selected_parent_folder",
              ],
              response,
            );
            const listData = pathOr(
              [],
              ["data", "data", "data", "listData"],
              response,
            );
            if (
              selectedFolderName &&
              !selectedFolderName.toLowerCase().includes("inbox")
            ) {
              listData.map((item, i) => {
                listData[i]["seen"] = true;
              });
            }
            const listDataLabels = pathOr(
              [],
              ["data", "data", "templateMeta", "datalabels"],
              response,
            );
            const folderData = pathOr(
              [],
              ["data", "data", "data", "folder_details"],
              response,
            );
            const listMetaData = pathOr([], ["data", "data", "meta"], response);

            set({
              ...get(),
              listData: listData,
              listViewLoading: false,
              listViewError: null,
              listDataLabels: listDataLabels,
              folderData: folderData,
              listMetaData: listMetaData,
              selectedFolderId: selectedFolderId,
              selectedParentFolderId: selectedParentFolder,
              selectedFolderName: selectedFolderName,
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
              selectedFolderId: folderId,
            }));
          }
        },
        onEmailDelete: (index = null) => {
          let listArr = {};
          listArr = get().listData.filter((_, i) => i !== index);
          if (index === "selected") {
            listArr = get().listData.filter(
              (value) => get().selectedRowsList[value.uid] != true,
            );
          }
          set((state) => {
            state.listData = listArr;
            return { ...state };
          });
        },
        onMassChangeEmailStatus: (action, status) => {
          let listArr = get().listData.map((email, index) => {
            if (get().selectedRowsList[email.uid]) {
              email = { ...email, [action]: status };
            }
            return email;
          });
          set((state) => {
            state.listData = listArr;
            // state.selectedRowsList = {};
            return { ...state };
          });
        },
        onChangeEmailStatus: (action, uid) => {
          let listArr = get().listData.map((email, i) => {
            if (email.uid == uid) {
              email = { ...email, [action]: !email[action] };
            }
            return email;
          });
          set((state) => {
            state.listData = listArr;
            return { ...state };
          });
        },
        toggleSideBar: (value = null) =>
          set((state) => {
            state.collapseSidebar = !state.collapseSidebar;
            return { ...state };
          }),
        toggleEmailDetail: (value = null) =>
          set((state) => {
            state.isDetailViewOpen = !state.isDetailViewOpen;
            return { ...state };
          }),
        changeTableState: async (customArgs) => {
          const {
            pageNo = get().pageNo,
            // pageSize = get().rowsPerPage,
            selectedFolderId = get().selectedFolderId,
            filterOption = {},
            sortOptionObj = {},
            withAppliedFilter = false,
            resetFilter = false,
            withSelectedRecords = true,
            // withFilterRefresh = false,
            withSavePageNo = false,
          } = customArgs;
          const requestPayload = {
            // pageNo,
            // pageSize,
            filterOption,
          };

          if (withAppliedFilter) {
            const inputObj = get().currentListViewState.filter;
            if (inputObj.hasOwnProperty("filter[reset][eq]")) {
              delete inputObj["filter[reset][eq]"];
            }
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
            // requestPayload["sort"] = sort;
          }

          if (resetFilter) {
            requestPayload["filterOption"] = {
              "filter[reset][eq]": true,
            };
          }
          // requestPayload["withFilterRefresh"] = withFilterRefresh;

          if (!withSelectedRecords) {
            get().actions.onRowSelectionChange([]);
          }

          const moduleName = "Emails";
          if (withSavePageNo) {
            requestPayload["pageNo"] = pathOr(
              1,
              ["modulePageNo", moduleName],
              get(),
            );
          }
          get().actions.getListViewData(
            selectedFolderId,
            pageNo,
            requestPayload.filterOption,
          );
        },
        onRowSelectionChange: (row) => {
          let selectedObj = {
            ...get().selectedRowsList,
            [row]: get().selectedRowsList[row] ? false : true,
          };
          if (row == "all") {
            get().listData.map((email) => {
              selectedObj = {
                ...selectedObj,
                [email.uid]: get().selectedRowsList["all"] ? false : true,
              };
            });
          }
          set({
            selectedRowsList: selectedObj,
          });
        },
        onEmailAction: async (actionType, uid = "") => {
          let payload = {
            moduleName: "Emails",
            actionType,
            uids: typeof uid != "object" ? [uid] : uid,
            mailID: get().selectedParentFolderId,
            folder_name: get().selectedFolderName,
          };
          if (actionType === "delete") {
            set({
              listViewLoading: true,
            });
          }
          const response = await api.get(`/V8/Email/Actions`, payload);
          if (response.ok) {
            if (actionType === "delete") {
              toast(
                pathOr(
                  LBL_ACTION_SUCCESSFUL,
                  ["data", "data", "message"],
                  response,
                ),
              );
              get().actions.getListViewData(
                get().selectedFolderId,
                get().pageNo,
              );
            }
          } else {
            toast(
              pathOr(
                SOMETHING_WENT_WRONG,
                ["data", "errors", "detail"],
                response,
              ),
            );
            set({
              listViewLoading: false,
            });
          }
        },
        getEmailDetailData: async (
          uid = "",
          msgno = "",
          seen = true,
          flagged = false,
          crmId = "",
        ) => {
          set({
            detailLoading: true,
            isDetailViewOpen: true,
            detailViewEmailUID: uid,
            detailViewFolderId: get().selectedParentFolderId,
            detailViewFolderName: get().selectedFolderName,
          });
          const payload = {
            moduleName: "InboundEmail",
            folder: "inbound",
            folder_name: get().detailViewFolderName,
            selectedFolderId: get().detailViewFolderId,
            uid,
            msgno,
            seen,
            flagged,
            crmId,
          };
          const response = await api.get(`/V8/Email/DetailView`, payload);
          if (response.ok) {
            let detailViewData = pathOr({}, ["data", "data"], response);
            if (!seen) {
              get().actions.onChangeEmailStatus("seen", uid);
            }
            set({
              detailData: detailViewData,
              detailLoading: false,
            });
          } else {
            set({
              listViewError: pathOr(
                SOMETHING_WENT_WRONG,
                ["data", "errors", "detail"],
                response,
              ),
              detailLoading: false,
              isDetailViewOpen: false,
              detailViewEmailUID: "",
              detailViewFolderId: "",
            });
          }
        },
        resetStore: () => set((state) => ({ ...initialState })),
      },
    }),
    { name: "Email Store" },
  ),
);
