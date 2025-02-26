import * as actionTypes from "../actions/actionTypes";
import { api } from "../../common/api-utils";
import { pathOr } from "ramda";
import { SOMETHING_WENT_WRONG } from "../../constant";

const getError = (res) => pathOr(SOMETHING_WENT_WRONG, ["data", "errors", "detail"], res);
const getCalendarListViewRequest = () => ({
  type: actionTypes.CALENDAR_LIST_VIEW_REQUEST,
});
const getCalendarListViewSuccess = (payload, tab) => ({
  type: actionTypes.CALENDAR_LIST_VIEW_SUCCESS,
  payload,
  tab,
});

const getCalendarListViewFailure = (error) => ({
  type: actionTypes.CALENDAR_LIST_VIEW_FAILURE,
  error,
});

export const getCalendarListView = (
  start_range_date_start,
  end_range_date_start,
  calendarType,
  userData = []
) => async (dispatch) => {
  try {
    dispatch(getCalendarListViewRequest());
    let offset = '';
    let userDataCondition='';
    let userDataType='';
     if(userData.toString()!==''){

      userDataCondition=`&userData[]=${userData.toString()}`;
    }else if(userData.toString()==='clear'){
    userDataCondition=`&resetuserlist=1`;
    }
    if(calendarType){
      userDataType= `&calendarType=${calendarType}`;
    }

    let url = `/V8/calendarlayout/calendarview/1?startdate=${start_range_date_start}&enddate=${end_range_date_start}${userDataType}${userDataCondition}`;
  
    const res = await api.get(url);
    if (res.ok) {
      dispatch(getCalendarListViewSuccess(res.data, 'Calendar'));
      return res.data;
    }
    return dispatch(getCalendarListViewFailure(getError(res)));
  } catch (e) {
    dispatch(getCalendarListViewFailure(e));
  }
};
