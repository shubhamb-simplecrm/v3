import React, { memo, useEffect, useState } from "react";
import { Button, Grid } from "@material-ui/core";
import {
  LBL_DETAIL_VIEW,
  LBL_RESTORE_DEFAULT_BUTTON_TITLE,
  LBL_SAVE_BUTTON_TITLE,
  LBL_SAVE_INPROGRESS,
} from "@/constant";
import AlertDialog from "@/components/Alert";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import SaveIcon from "@material-ui/icons/Save";
import CustomCircularProgress from "@/components/SharedComponents/CustomCircularProgress";
import LayoutContainer from "./LayoutContainer";
import { useLayoutManageState } from "./useLayoutManageState";
import { pathOr } from "ramda";
import { FormInput } from "@/components";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Alert } from "@material-ui/lab";
import { useCallback } from "react";

const isRequiredFieldLayout = () => {
  const panelList = pathOr(
    [],
    ["panelLayoutData", "data"],
    useLayoutManageState.getState(),
  );
  const layoutRequiredFields = pathOr(
    [],
    ["layoutRequiredFields"],
    useLayoutManageState.getState(),
  );
  const fieldList = panelList
    .reduce((_, p) => {
      const rowList = pathOr([], ["children", "data"], p);
      const rowFieldsList = rowList.reduce((_, r) => {
        const fields = pathOr([], ["children", "data"], r);
        return [..._, ...fields];
      }, []);
      return [..._, ...rowFieldsList];
    }, [])
    .map((v) => v?.id);
  const outputData = { status: false, missingFields: [] };
  outputData.status = !layoutRequiredFields?.every((v) => {
    if (fieldList?.includes(v)) {
      return true;
    }
    outputData?.missingFields.push(v);
    return false;
  });
  return outputData;
};
const EditViewLayout = ({ data, onClickRestoreDefault }) => {
  const { isSaveDisable, changePanelLayoutData, onLayoutDragChange } =
    useLayoutManageState((state) => ({
      changePanelLayoutData: state.actions.changePanelLayoutData,
      onLayoutDragChange: state.actions.onLayoutDragChange,
      isSaveDisable: state.isSaveDisable,
    }));
  const { view } = useParams();

  useEffect(() => {
    changePanelLayoutData({
      panelLayoutData: pathOr({}, ["layout"], data),
      availableField: pathOr([], ["fields", "available_fields"], data),
      isDetailViewSync: pathOr([], ["syncDetailEditViews"], data),
      layoutRequiredFields: pathOr([], ["required_fields"], data),
      isSaveDisable:
        view == LBL_DETAIL_VIEW && pathOr([], ["disable_layout"], data),
    });
  }, [data]);

  return (
    <>
      <HeadingContainer
        isSaveDisable={isSaveDisable}
        onClickRestoreDefault={onClickRestoreDefault}
      />
      <LayoutContainer
        isSaveDisable={isSaveDisable}
        onLayoutDragChange={onLayoutDragChange}
      />
    </>
  );
};

const HeadingContainer = memo(({ onClickRestoreDefault, isSaveDisable }) => {
  const {
    isDetailViewSync,
    onLayoutSubmit,
    toggleDetailViewSyncOption,
    isSubmitLoading,
  } = useLayoutManageState((state) => ({
    isSubmitLoading: state.isSubmitLoading,
    isDetailViewSync: state.isDetailViewSync,
    toggleDetailViewSyncOption: state.actions.toggleDetailViewSyncOption,
    onLayoutSubmit: state.actions.onLayoutSubmit,
  }));
  const [alertStatusState, setAlertStatusState] = useState({
    status: false,
    missingFields: [],
  });
  const { module, view } = useParams();

  const handleOnSubmit = useCallback(() => {
    const alertState = isRequiredFieldLayout();
    if (alertState.status) {
      setAlertStatusState(alertState);
    } else {
      handleOnFormSubmit();
    }
  }, []);

  const handleOnFormSubmit = useCallback(async () => {
    setAlertStatusState({ status: false, missingFields: [] });
    onLayoutSubmit({ module, view }, onClickRestoreDefault);
  }, [module, view, onLayoutSubmit, onClickRestoreDefault]);

  return (
    <>
      <AlertDialog
        msg={`The following required fields are missing from the layout: ${alertStatusState.missingFields}`}
        title="Are you sure you wish to continue?"
        open={alertStatusState.status}
        onAgree={handleOnFormSubmit}
        handleClose={() =>
          setAlertStatusState({ status: false, missingFields: [] })
        }
      />
      <Grid
        container
        lg={12}
        md={12}
        sm={12}
        // style={{
        //   paddingBottom: "20px",
        // }}
      >
        {isSaveDisable && (
          <Grid item lg={12} md={12} sm={12}>
            <Alert severity="warning">
              This DetailView is sync'd with the corresponding EditView. Fields
              and field placement in this DetailView reflect the fields and
              field placement in the EditView. Changes to the DetailView cannot
              be saved or deployed within this page. Make changes or un-sync the
              layouts in the EditView.
            </Alert>
          </Grid>
        )}
        <Grid item lg={12} md={12} sm={12}>
          <Grid
            container
            lg={12}
            md={12}
            sm={12}
            style={{ padding: "8px", justifyContent: "space-between" }}
            alignItems="center"
          >
            <Grid item sm={3}>
              <p
                style={{
                  margin: "0px",
                  color: "rgb(89,94,114,0.9)",
                  fontSize: "0.9rem",
                  fontWeight: "bolder",
                }}
              >
                {view === "editView" ? "Edit" : "Detail"} View Layout
              </p>
            </Grid>
            <Grid
              item
              style={{
                display: "flex",
                whiteSpace: "nowrap",
                alignItems: "center",
                justifyContent: "right",
                gap: "5px",
              }}
            >
              {!isSaveDisable && view != LBL_DETAIL_VIEW && (
                <FormInput
                  field={{
                    field_key: "isDetailViewSync",
                    name: "isDetailViewSync",
                    type: "bool",
                    label: "Sync to Detail View",
                  }}
                  disabled={isSaveDisable}
                  fullWidth={false}
                  value={isDetailViewSync}
                  onChange={(v) => toggleDetailViewSyncOption()}
                />
              )}
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SettingsBackupRestoreIcon />}
                onClick={onClickRestoreDefault}
                disabled={isSaveDisable}
              >
                {LBL_RESTORE_DEFAULT_BUTTON_TITLE}
              </Button>
              <Button
                startIcon={
                  isSubmitLoading ? (
                    <CustomCircularProgress size={16} />
                  ) : (
                    <SaveIcon />
                  )
                }
                variant="contained"
                color="primary"
                size="small"
                disabled={isSubmitLoading || isSaveDisable}
                onClick={handleOnSubmit}
              >
                {isSubmitLoading ? LBL_SAVE_INPROGRESS : LBL_SAVE_BUTTON_TITLE}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
});

export default EditViewLayout;