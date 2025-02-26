import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";
import { equals } from "ramda";

const initialState = {
  formState: {},
  formMetaData: {},
};

export const useFormStore = createWithEqualityFn(
  immer(
    devtools((set, get) => ({
      ...initialState,
      actions: {
        setInitStateData: (formId, formState = {}, formMetaData = {}) => {
          set((state) => {
            state.formState[formId] = {
              fieldState: {},
              panelState: {},
              ...formState,
            };
            state.formMetaData[formId] = {
              fieldData: {},
              panelData: {},
              ...formMetaData,
            };
          });
        },
        changeFieldStates: (formId, fieldStateArr) => {
          set((state) => {
            state.formState[formId].fieldState = {
              ...state.formState[formId].fieldState,
              ...fieldStateArr,
            };
          });
        },
        changeFieldPanel: (formId, panelStateArr) => {
          set((state) => {
            state.formState[formId].panelState = {
              ...state.formState[formId].panelState,
              ...panelStateArr,
            };
          });
        },
        changeFormFieldData: (formId, fieldKey, fieldData) => {
          set((state) => {
            state.formMetaData[formId].fieldData[fieldKey] =
              typeof fieldData == "function"
                ? fieldData(state.formMetaData[formId].fieldData[fieldKey])
                : {
                    ...state.formMetaData[formId].fieldData[fieldKey],
                    ...fieldData,
                  };
          });
        },
        changeFormPanelState: (formId, panelKey, panelState) => {
          set((state) => {
            state.formMetaData[formId].panelData.panelState[panelKey] =
              panelState;
          });
        },
        resetStore: () => set(() => initialState),
      },
    })),
  ),
  equals,
);
