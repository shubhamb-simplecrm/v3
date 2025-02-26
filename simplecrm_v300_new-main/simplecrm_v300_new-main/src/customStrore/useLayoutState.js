import { createWithEqualityFn as create } from 'zustand/traditional'
const initialState = {
  mobileRightSidebarState: false,
  rightSidebarState: {
    drawerState: false,
    selectedOption: null,
    customData: null,
  },
  sideBarState: false,
};

export const useLayoutState = create((set, get) => ({
  ...initialState,
  actions: {
    changeRightSideBarState: (inputValue = null) =>
      set((state) => {
        let responseData = {};
        if (typeof inputValue == "function") {
          responseData = inputValue(get().rightSidebarState);
        } else if (typeof inputValue == "object") {
          responseData = { ...inputValue };
        }

        if (!responseData?.hasOwnProperty("drawerState")) {
          responseData["drawerState"] = state?.rightSidebarState?.drawerState;
        }
        if (!responseData?.hasOwnProperty("selectedOption")) {
          responseData["selectedOption"] =
            state?.rightSidebarState?.selectedOption;
        }
        if (!responseData?.hasOwnProperty("customData")) {
          responseData["customData"] = state?.rightSidebarState?.customData;
        }
        state["rightSidebarState"] = {
          drawerState: responseData?.drawerState,
          selectedOption: responseData?.drawerState
            ? responseData?.selectedOption
            : null,
          customData: responseData?.drawerState
            ? responseData?.customData
            : null,
        };

        return { ...state };
      }),
    toggleSideBar: (value = null) =>
      set((state) => {
        if (typeof value == "boolean") {
          state.sideBarState = value;
        } else {
          state.sideBarState = !state.sideBarState;
        }
        return { ...state };
      }),
    toggleMobileRightSideBar: (value = null) =>
      set((state) => {
        if (typeof value == "boolean") {
          state.mobileRightSidebarState = value;
        } else {
          state.mobileRightSidebarState = !state.mobileRightSidebarState;
        }
        if (!state.mobileRightSidebarState) {
          state.rightSidebarState = {
            drawerState: false,
            selectedOption: null,
            customData: null,
          };
        }
        return { ...state };
      }),
    resetStore: () => set((state) => ({ ...initialState })),
  },
}));