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
import { useDispatch } from "react-redux";
import { addDashboardTabAction } from "../../../../store/actions/dashboard.actions";
import { isEmpty } from "ramda";
import { toast } from "react-toastify";
const addFieldObj = {
  field_key: "add_dashboard_field",
  label: LBL_DASHBOARD_ENTER_NAME,
};
const DashboardAddDialog = (props) => {
  const { dialogOpenStatus, handleCloseDialog } = props;
  const classes = useStyles();
  const [fieldValue, setFieldValue] = useState();
  const [isValidName, setIsValidName] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleValueChange = (value) => {
    if (!isEmpty(value)) {
      setIsValidName(true);
    } else {
      setIsValidName(false);
    }
    setFieldValue(value);
  };
  const handleAddSave = (e) => {
    setLoading(true);
    dispatch(addDashboardTabAction(fieldValue))
      .then((res) => {
        if (res.ok) {
          handleCloseDialog();
        } else {
          toast(res?.data?.errors?.detail)
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <CustomDialog
      isDialogOpen={dialogOpenStatus}
      handleCloseDialog={handleCloseDialog}
      title={"Add Dashboard"}
      maxWidth={"sm"}
      bodyContent={
        <div>
          <FormInput
            field={addFieldObj}
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
            onClick={handleAddSave}
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

export default DashboardAddDialog;
