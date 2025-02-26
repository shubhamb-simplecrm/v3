import {
  FIELD_LIST_CONTAINER,
  FIELD_LIST_ITEM,
  PANEL,
  ROW,
} from "./layout-manager-constants";
import { clone, equals, isEmpty, pathOr } from "ramda";
import { immer } from "zustand/middleware/immer";
import { customAlphabet } from "nanoid";
import { getPanelRowIndex, reorder } from "./layout-manager-utils";
import { devtools } from "zustand/middleware";
import { toast } from "react-toastify";
import { SOMETHING_WENT_WRONG } from "@/constant";
import { api } from "@/common/api-utils";
import { createWithEqualityFn } from "zustand/traditional";

const initialState = {
  panelLayoutData: {},
  availableField: [],
  isDetailViewSync: false,
  layoutRequiredFields: [],
  isSubmitLoading: false,
  isSaveDisable: false,
};

const getRandomId = (length = 21) => {
  const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);
  return nanoid(length);
};

export const useLayoutManageState = createWithEqualityFn(
  devtools(
    immer((set, get) => ({
      ...initialState,
      actions: {
        changeFieldListData: (inputArgs) => {
          return set((v) => {
            if (typeof inputArgs == "function") {
              v.availableField = inputArgs(clone(get()));
            } else {
              v.availableField = inputArgs;
            }
          });
        },
        changePanelLayoutData: (inputArgs) =>
          set((v) => {
            if (typeof inputArgs == "function") {
              v = inputArgs(clone(get()));
            } else {
              v = inputArgs;
            }
            return { ...v };
          }),
        addPanel: (index) =>
          set((v) => {
            const oldPanel = pathOr([], ["panelLayoutData", "data"], v);
            const panelLength = oldPanel.length;
            const newPanelId = `LBL_EDITVIEW_PANEL_${getRandomId(7)}`;
            const temp = {
              id: newPanelId,
              label: `Panel ${panelLength}`,
              children: {
                containerId: `container-${newPanelId}`,
                type: ROW,
                panelCollapsed: false,
              },
            };
            oldPanel.splice(index + 1, 0, temp);
            v.panelLayoutData.data = oldPanel;
          }),
        removePanel: (index) =>
          set((v) => {
            const oldPanel = pathOr([], ["panelLayoutData", "data"], get());
            const rowList = pathOr([], [index, "children", "data"], oldPanel);
            const rowFieldsList = rowList.reduce((_, c) => {
              const fields = pathOr([], ["children", "data"], c);
              return [..._, ...fields];
            }, []);
            const filteredPanelList = oldPanel.filter((item, i) => i != index);
            v.availableField = [...rowFieldsList, ...v.availableField];
            v.panelLayoutData.data = filteredPanelList;
          }),
        addRow: (panelIndex, rowIndex) =>
          set((state) => {
            const panelId = pathOr(
              null,
              ["panelLayoutData", "data", panelIndex, "id"],
              state,
            );
            const newRowId = `row_${getRandomId(7)}`;
            const emptyAddRowObj = {
              id: newRowId,
              children: {
                containerId: `fieldContainer-${panelId}-${newRowId}`,
                type: FIELD_LIST_ITEM,
                data: [],
              },
            };
            const oldRowList = pathOr(
              [],
              ["panelLayoutData", "data", panelIndex, "children", "data"],
              state,
            );
            oldRowList.push(emptyAddRowObj);
            state.panelLayoutData.data[panelIndex].children.data = oldRowList;
          }),
        removeRow: (panelIndex, rowIndex) =>
          set((v) => {
            const oldRow = pathOr(
              [],
              ["panelLayoutData", "data", panelIndex, "children", "data"],
              v,
            );
            const rowFieldsList = pathOr(
              [],
              [rowIndex, "children", "data"],
              oldRow,
            );
            const filteredRowList = oldRow.filter((item, i) => i != rowIndex);
            v.availableField = [...rowFieldsList, ...v.availableField];
            v.panelLayoutData.data[panelIndex]["children"]["data"] =
              filteredRowList;
          }),
        removeRowField: (containerId, index) =>
          set((v) => {
            const panelItems = clone(
              pathOr([], ["panelLayoutData", "data"], get()),
            );
            const { panelIndex, rowIndex, panelId, rowId } = getPanelRowIndex(
              panelItems,
              {
                droppableId: containerId,
              },
            );
            const oldRowFields = pathOr(
              [],
              [panelIndex, "children", "data", rowIndex, "children", "data"],
              panelItems,
            );
            const removedField = oldRowFields[index];

            oldRowFields.splice(index, 1);
            v.availableField = [removedField, ...v.availableField];
            v.panelLayoutData.data[panelIndex]["children"]["data"][rowIndex][
              "children"
            ]["data"] = oldRowFields;
          }),
        changePanelName: (panelIndex, panelName) =>
          set((v) => {
            const oldPanel = pathOr(
              [],
              ["panelLayoutData", "data", panelIndex],
              v,
            );
            oldPanel["label"] = panelName.toUpperCase();
            v.panelLayoutData.data[panelIndex] = oldPanel;
          }),
        changePanelIsCollapseState: (panelIndex, collapseValue) =>
          set((v) => {
            const oldPanel = pathOr(
              [],
              ["panelLayoutData", "data", panelIndex],
              v,
            );
            oldPanel["panelCollapsed"] = !!collapseValue;
            v.panelLayoutData.data[panelIndex] = oldPanel;
          }),
        toggleDetailViewSyncOption: () =>
          set((v) => {
            v.isDetailViewSync = !v.isDetailViewSync;
          }),
        onLayoutSubmit: async ({ module, view }, onSuccessCallback) => {
          set({ isSubmitLoading: true });
          const payload = {
            module: module,
            view: view,
            view_package: "",
            sync_detail_and_edit: get().isDetailViewSync,
            layoutData: get().panelLayoutData,
          };
          try {
            const res = await api.post(
              `/V8/studio/saveEditViewLayout`,
              payload,
            );
            if (res && res.ok) {
              toast(res.data.data.message);
              onSuccessCallback();
            } else {
              toast(SOMETHING_WENT_WRONG);
            }
            set({ isSubmitLoading: false });
          } catch (e) {
            set({ isSubmitLoading: false });
            toast(SOMETHING_WENT_WRONG);
          }
        },
        onLayoutDragChange: (result) =>
          set((state) => {
            const { source, destination, type } = result;
            if (!destination) {
              return;
            }
            const sourceIndex = pathOr(null, ["source", "index"], result);
            const destIndex = pathOr(null, ["destination", "index"], result);
            const sourceDroppableId = pathOr(
              null,
              ["source", "droppableId"],
              result,
            );
            const destDroppableId = pathOr(
              null,
              ["destination", "droppableId"],
              result,
            );
            const draggableId = pathOr(null, ["draggableId"], result);
            switch (true) {
              // reorder panels
              case type === PANEL:
                // To reorder Panels
                if (sourceDroppableId == destDroppableId) {
                  const panelItems = pathOr(
                    [],
                    ["panelLayoutData", "data"],
                    state,
                  );
                  const newOrderedPanels = reorder(
                    panelItems,
                    sourceIndex,
                    destIndex,
                  );
                  state.panelLayoutData.data = newOrderedPanels;
                }
                break;
              case type == ROW:
                // reorder row in same panel
                if (sourceDroppableId == destDroppableId) {
                  const panelItems = pathOr(
                    [],
                    ["panelLayoutData", "data"],
                    state,
                  );
                  const { panelIndex, rowIndex, panelId } = getPanelRowIndex(
                    panelItems,
                    { droppableId: destDroppableId },
                  );
                  const panelItem = pathOr([], [panelIndex], panelItems);
                  const rowItems = pathOr([], ["children", "data"], panelItem);
                  const newOrderedRows = reorder(
                    rowItems,
                    sourceIndex,
                    destIndex,
                  );
                  panelItems[panelIndex]["children"]["data"] = newOrderedRows;
                  state.panelLayoutData.data = panelItems;
                } else {
                  // reorder row in different panel
                  const panelItems = pathOr(
                    [],
                    ["panelLayoutData", "data"],
                    state,
                  );
                  const {
                    panelIndex: sourcePanelIndex,
                    panelId: sourcePanelId,
                  } = getPanelRowIndex(panelItems, {
                    droppableId: sourceDroppableId,
                  });

                  const { panelIndex: destPanelIndex, panelId: destPanelId } =
                    getPanelRowIndex(panelItems, {
                      droppableId: destDroppableId,
                    });
                  const sourceRowItems = pathOr(
                    [],
                    [sourcePanelIndex, "children", "data"],
                    panelItems,
                  );
                  const destRowItems = pathOr(
                    [],
                    [destPanelIndex, "children", "data"],
                    panelItems,
                  );
                  destRowItems.splice(
                    destIndex,
                    0,
                    sourceRowItems[sourceIndex],
                  );
                  sourceRowItems.splice(sourceIndex, 1);
                  panelItems[sourcePanelIndex]["children"]["data"] =
                    sourceRowItems;
                  panelItems[destPanelIndex]["children"]["data"] = destRowItems;
                  state.panelLayoutData.data = panelItems;
                }
                break;
              case type == FIELD_LIST_ITEM:
                if (
                  sourceDroppableId == destDroppableId &&
                  destDroppableId != FIELD_LIST_CONTAINER
                ) {
                  const panelItems = pathOr(
                    [],
                    ["panelLayoutData", "data"],
                    state,
                  );
                  const { panelIndex, rowIndex, panelId } = getPanelRowIndex(
                    panelItems,
                    { droppableId: destDroppableId },
                  );
                  const panelItem = pathOr([], [panelIndex], panelItems);
                  const rowFieldItems = pathOr(
                    [],
                    ["children", "data", rowIndex, "children", "data"],
                    panelItem,
                  );

                  const newOrderedRowFields = reorder(
                    rowFieldItems,
                    sourceIndex,
                    destIndex,
                  );
                  panelItems[panelIndex]["children"]["data"][rowIndex][
                    "children"
                  ]["data"] = newOrderedRowFields;
                  state.panelLayoutData.panelLayoutData = panelItems;
                } else if (sourceDroppableId == FIELD_LIST_CONTAINER) {
                  const panelItems = clone(
                    pathOr([], ["panelLayoutData", "data"], state),
                  );
                  const fieldItems = pathOr([], ["availableField"], state);
                  const {
                    panelIndex: destPanelIndex,
                    rowIndex: destRowIndex,
                    panelId: destPanelId,
                    rowId: destRowId,
                  } = getPanelRowIndex(panelItems, {
                    droppableId: destDroppableId,
                  });

                  const destRowFieldItems = pathOr(
                    [],
                    [
                      destPanelIndex,
                      "children",
                      "data",
                      destRowIndex,
                      "children",
                      "data",
                    ],
                    panelItems,
                  );
                  if (destRowFieldItems.length < 2) {
                    const draggedField = pathOr(
                      {},
                      ["availableField", sourceIndex],
                      state,
                    );
                    if (!isEmpty(draggedField)) {
                      panelItems[destPanelIndex]["children"]["data"][
                        destRowIndex
                      ]["children"]["data"].splice(destIndex, 0, draggedField);
                      fieldItems.splice(sourceIndex, 1);
                      // changeFieldListData(fieldItems);
                    }
                  }
                  state.availableField = fieldItems;
                  state.panelLayoutData.data = panelItems;
                } else if (sourceDroppableId !== destDroppableId) {
                  const panelItems = clone(
                    pathOr([], ["panelLayoutData", "data"], state),
                  );
                  const {
                    panelIndex: destPanelIndex,
                    rowIndex: destRowIndex,
                    panelId: destPanelId,
                    rowId: destRowId,
                  } = getPanelRowIndex(panelItems, {
                    droppableId: destDroppableId,
                  });
                  const {
                    panelIndex: sourcePanelIndex,
                    rowIndex: sourceRowIndex,
                    panelId: sourcePanelId,
                    rowId: sourceRowId,
                  } = getPanelRowIndex(panelItems, {
                    droppableId: sourceDroppableId,
                  });
                  const sourceDragField = pathOr(
                    [],
                    [
                      sourcePanelIndex,
                      "children",
                      "data",
                      sourceRowIndex,
                      "children",
                      "data",
                      sourceIndex,
                    ],
                    panelItems,
                  );
                  const destRowFieldItems = pathOr(
                    [],
                    [
                      destPanelIndex,
                      "children",
                      "data",
                      destRowIndex,
                      "children",
                      "data",
                    ],
                    panelItems,
                  );
                  if (
                    destRowFieldItems.length < 2 &&
                    !isEmpty(sourceDragField)
                  ) {
                    panelItems[destPanelIndex]["children"]["data"][
                      destRowIndex
                    ]["children"]["data"].push(sourceDragField);
                    panelItems[sourcePanelIndex]["children"]["data"][
                      sourceRowIndex
                    ]["children"]["data"].splice(sourceIndex, 1);
                  }
                  state.panelLayoutData.data = panelItems;
                }
                break;
              default:
                break;
            }
          }),
        resetStore: () => set((state) => ({ ...initialState })),
      },
    })),
  ),
  equals,
  // { name: "useLayoutManageState" },
);
