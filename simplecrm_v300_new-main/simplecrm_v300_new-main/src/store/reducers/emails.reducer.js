import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  emailCreateViewTabData: {},
  emailCreateViewLoading: false,
  emailCreateViewError: null,
  emailSubmitLoader:false,
  emailTestTabData: {},
  emailTestLoading: false,
  emailTestSuccess:false,
  emailTestError: null,
  emailTestSubmitLoader:false,

};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Edit view data reducer cases
    case actionTypes.EMAIL_CREATE_VIEW_REQUEST:
      return { ...state, emailCreateViewLoading: true,emailSubmitLoader:false, };

    case actionTypes.EMAIL_CREATE_VIEW_SUCCESS:
      return {
        ...state,
        emailCreateViewError: null,
        emailCreateViewLoading: false,
        emailCreateViewTabData: {
          ...state.emailCreateViewTabData,
          [action.tab]: action.payload,
        },
        emailSubmitLoader:false,
      };

    case actionTypes.EMAIL_CREATE_VIEW_FAILURE:
      return {
        ...state,
        emailCreateViewLoading: false,
        emailCreateViewError: action.error,
        emailSubmitLoader:false,
      };


    case actionTypes.SUBMIT_EMAIL_CREATE_VIEW_REQUEST:
      return { ...state, emailCreateViewLoading: null , emailSubmitLoader:true,};

    case actionTypes.SUBMIT_EMAIL_CREATE_VIEW_SUCCESS:
      return {
        ...state,
        emailCreateViewError: null,
        emailCreateViewLoading: false,
        emailSubmitLoader:true,
      };

    case actionTypes.SUBMIT_EMAIL_CREATE_VIEW_FAILURE:
      return {
        ...state,
        emailCreateViewLoading: false,
        emailCreateViewError: action.error ? action.error : null,
        emailSubmitLoader:false,
      };

    case actionTypes.EMAIL_TEST_REQUEST:
      return { ...state, emailTestLoading: true,emailTestSubmitLoader:false, };

    case actionTypes.EMAIL_TEST_SUCCESS:
      return {
        ...state,
        emailTestError: null,
        emailTestLoading: false,
        emailTestTabData: {
          ...state.emailTestTabData,
          [action.tab]: action.payload,
        },
        emailTestSubmitLoader:false,
      };

    case actionTypes.EMAIL_TEST_FAILURE:
      return {
        ...state,
        emailTestLoading: false,
        emailTestError: action.error,
        emailTestSubmitLoader:false,
      };

    default:
      return state;
  }
};
