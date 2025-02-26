import React, { useCallback, useState } from "react";
import { Box } from "@material-ui/core";
import useStyles from "./../styles";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_CONFIRM_DELETE_RECORDS_DESCRIPTION,
  LBL_CONFIRM_DELETE_RECORD_TITLE,
  LBL_DELETE_BUTTON_TITLE,
  LBL_EDIT_BUTTON_TITLE,
  SOMETHING_WENT_WRONG,
} from "@/constant";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Alert } from "@/components";
import { IconButton } from "@/components/SharedComponents/IconButton";
import { pathOr } from "ramda";
import { deleteRecordFromModule } from "@/store/actions/listview.actions";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Customer360 from "@/components/Customer360";

export const ListActionOption = (props) => {
  const classes = useStyles();
  const [delateAlertDialogStatus, setDelateAlertDialogStatus] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [c360DialogStatus, setC360DialogStatus] = useState(false);
  const { viewName, formData, fieldValue, moduleName, customArgs } = props;
  const {
    tableMeta,
    ACLAccessObj,
    allowC360ModulesList,
    onListStateChange,
    pageNo,
  } = customArgs;

  const recordId = pathOr(
    "",
    [pathOr("", ["rowIndex"], tableMeta), "id"],
    formData,
  );
  const recordData = pathOr(
    "",
    [pathOr("", ["rowIndex"], tableMeta)],
    formData,
  );
  const tableData = pathOr(pathOr("", ["tableMeta", "tableData"], customArgs));

  const handleOnDeleteAlertOpen = useCallback(() => {
    setDelateAlertDialogStatus(true);
  }, []);
  const handleOnDeleteAlertClose = useCallback(() => {
    setDelateAlertDialogStatus(false);
  }, []);
  const handleOnC360Open = useCallback(() => {
    setC360DialogStatus(true);
  }, []);
  const handleOnC360Close = useCallback(() => {
    setC360DialogStatus(false);
  }, []);

  const handleOnDeleteRecord = useCallback(() => {
    setSubmitLoading(true);
    deleteRecordFromModule(moduleName, recordId)
      .then((res) => {
        setSubmitLoading(false);
        handleOnDeleteAlertClose();
        toast(res.ok ? res.data.meta.message : res.data.errors.detail);
        onListStateChange({
          pageNo:
            tableMeta?.tableData?.length > 1
              ? pageNo
              : pageNo > 1
                ? pageNo - 1
                : 1,
          withSavePageNo: tableMeta?.tableData?.length > 1 ? true : false,
          withAppliedFilter: true,
          withSelectedRecords: false,
        });
      })
      .catch(() => {
        setSubmitLoading(false);
        handleOnDeleteAlertClose();
        toast(SOMETHING_WENT_WRONG);
      });
  }, []);

  return (
    <Box className={classes.buttonGroupRoot}>
      {moduleName !== "AOR_Reports" && (
        <IconButton
          tooltipTitle={LBL_EDIT_BUTTON_TITLE}
          to={`/app/editview/${moduleName}/${recordId}`}
          component={Link}
          // className={classes.btnSpacing}
          disabled={!ACLAccessObj?.edit}
          classes={{ disabled: classes.disabledButton }}
        >
          <EditIcon fontSize="inherit" />
        </IconButton>
      )}
      <IconButton
        tooltipTitle={LBL_DELETE_BUTTON_TITLE}
        component={"div"}
        className={classes.btnSpacing}
        onClick={handleOnDeleteAlertOpen}
        disabled={!ACLAccessObj?.delete}
        classes={{ disabled: classes.disabledButton }}
      >
        <DeleteIcon fontSize="inherit" />
      </IconButton>
      {allowC360ModulesList &&
        Object.keys(allowC360ModulesList).includes(moduleName) && (
          <IconButton
            className={classes.btnSpacing}
            onClick={handleOnC360Open}
            classes={{ disabled: classes.disabledButton }}
          >
            <VisibilityIcon fontSize="inherit" />
          </IconButton>
        )}
      <Alert
        title={LBL_CONFIRM_DELETE_RECORD_TITLE}
        msg={LBL_CONFIRM_DELETE_RECORDS_DESCRIPTION}
        agreeButtonProps={{
          style: {
            backgroundColor: submitLoading ? "grey" : "#D70040",
            color: "white",
          },
        }}
        agreeText={LBL_DELETE_BUTTON_TITLE}
        disagreeText={LBL_CANCEL_BUTTON_TITLE}
        open={delateAlertDialogStatus}
        handleClose={handleOnDeleteAlertClose}
        onDisagree={handleOnDeleteAlertClose}
        onAgree={handleOnDeleteRecord}
        loading={submitLoading}
      />
      {recordData && c360DialogStatus ? (
        <Customer360
          relData={recordData}
          open={c360DialogStatus}
          handleClose={handleOnC360Close}
        />
      ) : null}
    </Box>
  );
};
