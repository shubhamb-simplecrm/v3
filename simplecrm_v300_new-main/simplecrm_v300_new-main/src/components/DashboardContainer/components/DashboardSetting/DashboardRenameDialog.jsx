import React, { useState } from "react";
import CustomDialog from "../../../SharedComponents/CustomDialog";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_DASHBOARD_ENTER_NAME,
  LBL_SAVE_BUTTON_TITLE,
} from "../../../../constant";
import FormInput from "../../../FormInput";
import { Button } from "../../../SharedComponents/Button";
import CustomCircularProgress from "../../../SharedComponents/CustomCircularProgress";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import useStyles from "./styles";
import { Box } from "@material-ui/core";
import { isEmpty, pathOr } from "ramda";
import { useDispatch } from "react-redux";
import { renameDashboardTabAction } from "../../../../store/actions/dashboard.actions";
const renameFieldObj = {
  field_key: "rename_field",
  label: LBL_DASHBOARD_ENTER_NAME,
};
const DashboardRenameDialog = (props) => {
  const {
    dialogOpenStatus,
    handleCloseDialog,
    dashboardIndex,
    selectedTabData,
  } = props;
  const classes = useStyles();
  const currentPageTitle = pathOr("", ["pageTitle"], selectedTabData);
  const [fieldValue, setFieldValue] = useState(currentPageTitle);
  const [loading, setLoading] = useState(false);
  const [isValidName, setIsValidName] = useState(false);
  const dispatch = useDispatch();
  const handleValueChange = (value) => {
    if (!isEmpty(value) && currentPageTitle != value) {
      setIsValidName(true);
    } else {
      setIsValidName(false);
    }
    setFieldValue(value);
  };
  const handleRenameSave = (e) => {
    setLoading(true);
    const payload = { dashName: fieldValue };
    dispatch(renameDashboardTabAction(dashboardIndex, payload))
      .then(function (res) {
        if (res && res.ok) {
          setLoading(false);
          handleCloseDialog();
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <CustomDialog
      isDialogOpen={dialogOpenStatus}
      handleCloseDialog={handleCloseDialog}
      title={"Dashboard Rename"}
      maxWidth={"sm"}
      bodyContent={
        <div>
          <FormInput
            field={renameFieldObj}
            value={fieldValue}
            onChange={handleValueChange}
          />
        </div>
      }
      bottomActionContent={
        <Box className={classes.buttonGroupRoot}>
          <Button
            label={loading ? "Saving..." : LBL_SAVE_BUTTON_TITLE}
            startIcon={
              loading ? <CustomCircularProgress size={16} /> : <SaveIcon />
            }
            disabled={!isValidName || loading}
            onClick={handleRenameSave}
          />
          <Button
            label={LBL_CANCEL_BUTTON_TITLE}
            startIcon={<CancelIcon />}
            disabled={loading}
            onClick={handleCloseDialog}
          />
        </Box>
      }
    />
  );
};

export default DashboardRenameDialog;
