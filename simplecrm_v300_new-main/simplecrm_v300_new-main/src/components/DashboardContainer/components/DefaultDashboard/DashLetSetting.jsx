import React from "react";
import {
  LBL_CONFIRM_DELETE_DASHLET_TITLE,
  LBL_CONFIRM_NO,
  LBL_CONFIRM_YES,
  LBL_DASHLET_EDIT_BUTTON,
  LBL_DASHLET_REMOVE_BUTTON,
  LBL_DASHLET_REMOVE_SUCCESS,
  LBL_DASHLET_REMOVE_TITLE,
  SOMETHING_WENT_WRONG,
} from "../../../../constant";

import { Alert } from "../../..";
import { removeDashLetAction } from "../../../../store/actions/dashboard.actions";
import { toast } from "react-toastify";
import { pathOr, isNil } from "ramda";
import { useDispatch } from "react-redux";
import DashLetEditDialog from "./DashLetEditDialog";

const DashLetSetting = (props) => {
  const {
    dashLetSelectedAction,
    handleOnCloseDashLetAction,
    title,
    dashLetData,
    dashboardData,
    handleOnDashLetEditStatus,
  } = props;
  const dispatch = useDispatch();

  const deleteDashLet = () => {
    let payload = {
      category: "module",
      dashlet_module: pathOr("HomeApp", ["module"], dashboardData),
      current_tab: pathOr(null, ["current_tab"], dashboardData),
      dashlet_id: pathOr(null, ["id"], dashLetData),
    };

    dispatch(removeDashLetAction(payload))
      .then(function (res) {
        if (res.ok) {
          toast(LBL_DASHLET_REMOVE_SUCCESS);
        } else {
          toast(SOMETHING_WENT_WRONG);
        }
        handleOnCloseDashLetAction(handleOnCloseDashLetAction);
      })
      .catch((e) => {
        toast(SOMETHING_WENT_WRONG);
        handleOnCloseDashLetAction();
      })
      .finally(() => {
        handleOnCloseDashLetAction();
      });
  };

  return (
    <>
      {dashLetSelectedAction == LBL_DASHLET_EDIT_BUTTON && (
        <DashLetEditDialog
          dialogOpenStatus={!isNil(dashLetSelectedAction)}
          handleCloseDialog={handleOnCloseDashLetAction}
          dashLetData={dashLetData}
          dashboardData={dashboardData}
          handleOnDashLetEditStatus={handleOnDashLetEditStatus}
        />
      )}
      {dashLetSelectedAction == LBL_DASHLET_REMOVE_BUTTON && (
        <Alert
          title={LBL_DASHLET_REMOVE_TITLE}
          msg={LBL_CONFIRM_DELETE_DASHLET_TITLE}
          open={!isNil(dashLetSelectedAction)}
          agreeText={LBL_CONFIRM_YES}
          disagreeText={LBL_CONFIRM_NO}
          handleClose={handleOnCloseDashLetAction}
          onAgree={deleteDashLet}
        />
      )}
    </>
  );
};

export default DashLetSetting;
