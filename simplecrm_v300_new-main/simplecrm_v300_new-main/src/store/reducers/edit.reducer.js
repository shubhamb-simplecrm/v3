import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  editViewTabData: {},
  editViewLoading: false,
  submitEditViewLoading: false,
  editViewError: null,
  editInOutBoundEmailData: {},
  editInOutBoundEmailLoading: false,
  editInOutBoundEmailError: null,
  initialValues: {},
  enumFieldOption: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Edit view data reducer cases
    case actionTypes.EDIT_VIEW_REQUEST:
      return { ...state, editViewLoading: true };

    case actionTypes.EDIT_VIEW_SUCCESS:
      return {
        ...state,
        editViewError: null,
        editViewLoading: false,
        enumFieldOption: {},
        editViewTabData: {
          ...state.editViewTabData,
          [action.tab]: action.payload,
        },
      };

    case actionTypes.EDIT_VIEW_FAILURE:
      return {
        ...state,
        editViewLoading: false,
        editViewError: action.error,
      };

    case actionTypes.SUBMIT_EDIT_VIEW_REQUEST:
      return { ...state, submitEditViewLoading: true };

    case actionTypes.SUBMIT_EDIT_VIEW_SUCCESS:
      return {
        ...state,
        editViewError: null,
        submitEditViewLoading: false,
      };

    case actionTypes.SUBMIT_EDIT_VIEW_FAILURE:
      return {
        ...state,
        submitEditViewLoading: false,
        editViewError: action.error ? action.error : null,
      };
    // Edit in/ outbound email data reducer cases
    case actionTypes.EDIT_INOUTBOUNDEMAIL_REQUEST:
      return { ...state, editInOutBoundEmailLoading: true };

    case actionTypes.EDIT_INOUTBOUNDEMAIL_SUCCESS:
      return {
        ...state,
        editInOutBoundEmailError: null,
        editInOutBoundEmailLoading: false,
        editInOutBoundEmailData: {
          ...state.editInOutBoundEmailData,
          ["inoutboundemail"]: action.payload,
        },
      };

    case actionTypes.EDIT_INOUTBOUNDEMAIL_FAILURE:
      return {
        ...state,
        editInOutBoundEmailLoading: false,
        editInOutBoundEmailError: action.error,
      };
    case actionTypes.SAVE_INITIAL_VALUES:
      return {
        ...state,
        initialValues: action.initialValues,
      };
    case actionTypes.STORE_ENUM_FIELD_OPTION: {
      return {
        ...state,
        enumFieldOption: { ...state.enumFieldOption, ...action.payload },
      };
    }
    default:
      return state;
  }
};
