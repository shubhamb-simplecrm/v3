import * as actionTypes from "../actions/actionTypes";
import { clone } from "ramda";
const INITIAL_STATE = {
  detailViewTabData: {},
  detailViewLoading: false,
  detailBPMLoading: false,
  detailBPMError: false,
  detailViewError: null,
  detailViewGroupTabData: {},
  detailGroupViewLoading :[],
  detailFilterViewData :[],
  detailViewReportLoading:false,
  detailViewReportFilterLoading: false,
  detailViewReportError:null,
  reportFilterData:null
  
};


export default (state = INITIAL_STATE, action) => {
  let prevData = [];
  switch (action.type) {
    case actionTypes.BPM_UPDATE_REQUEST:
      return { ...state, detailBPMLoading: true };      
    case actionTypes.BPM_UPDATE_SUCCESS:
    return {
        ...state,
        detailBPMError: null,
        detailBPMLoading: false,
        detailViewTabData: {
          ...state.detailViewTabData,
          [action.tab]: action.payload,
        },
      };
    // Detail view data reducer cases
    case actionTypes.DETAIL_VIEW_REQUEST:
      return { ...state, detailViewLoading: true };
    
    case actionTypes.DETAIL_VIEW_FILTER_REQUEST:
        return { ...state, detailViewReportLoading: true };
      
    case actionTypes.DETAIL_GROUP_VIEW_REQUEST:
        state.detailGroupViewLoading=[];
        return { 
          ...state, 
          detailGroupViewLoading:{
            [action.cnt]: true 
          }
        };        
    case actionTypes.DETAIL_VIEW_FILTER_SUCCESS:
      return {
        ...state,
        detailViewReportLoading: false,
        detailFilterViewData: {
          ...state.detailFilterViewData,
          [action.tab]: action.payload,
        },
      };
      
    case actionTypes.DETAIL_VIEW_SUCCESS:
      return {
        ...state,
        detailViewError: null,
        detailViewLoading: false,
        detailViewTabData: {
          ...state.detailViewTabData,
          [action.tab]: action.payload,
        },
      };
      
      case actionTypes.REPORT_DETAIL_VIEW_REQUEST:
      return { ...state, detailViewReportLoading: true };

      case actionTypes.REPORT_DETAIL_VIEW_FILTER_REQUEST:
      return { ...state, detailViewReportFilterLoading: true };

      case actionTypes.REPORT_DETAIL_VIEW_FILTER_SUCCESS:
      return {
        ...state,
        detailViewReportFilterLoading: false,
        detailViewTabData: {
          ...state.detailViewTabData,
          [action.tab]: action.payload,
        },
      };

      case actionTypes.REPORT_DETAIL_VIEW_SUCCESS:
      return {
        ...state,
        detailViewError: null,
        detailViewReportFilterLoading: false,
        detailViewLoading: false,
        detailViewTabData: {
          ...state.detailViewTabData,
          [action.tab]: action.payload,
        },
      };

      case actionTypes.DETAIL_GROUP_VIEW_SUCCESS:
        prevData = clone(state.detailViewTabData);
        let m = action.tab;
        prevData[m].data.templateMeta.report_data.group_outer_block[action.cnt] = action.payload.data.templateMeta.report_data.group_outer_block;
        state.detailViewTabData=[];
        return {
          ...state,
          detailViewError: null,
          detailViewLoading: false,
          detailViewTabData: prevData,
          detailViewGroupTabData: {
            ...state.detailViewGroupTabData,
            [action.tab]: action.payload,
          },
          detailGroupViewLoading:{
            [action.cnt]: false 
          }
        };
      

      case actionTypes.DETAIL_VIEW_FAILURE:
        return {
          ...state,
          detailViewLoading: false,
          detailViewError: action.error,
        };
      case actionTypes.REPORT_DETAIL_VIEW_FAILURE:
        return {
          ...state,
          detailViewReportLoading: false,
          detailViewReportError: action.error,
        };
      case actionTypes.SET_REPORT_FILTER_DATA:
        return {
          ...state,
          reportFilterData: action.payload,
        };

    default:
      return state;
  }
};
