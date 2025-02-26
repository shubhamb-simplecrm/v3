import React, { useState } from "react";
import CustomDialog from "../../../SharedComponents/CustomDialog";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_DOWNLOAD_IMPORT_TEMPLATE_BUTTON_TITLE,
  LBL_DOWNLOAD_INPROGRESS,
  LBL_UPLOAD_FORM_DESCRIPTION,
  LBL_UPLOAD_FORM_REQUIRED,
  LBL_UPLOAD_FORM_TITLE,
  LBL_UPLOAD_OPTION_CREATE_AND_UPDATE_RECORD,
  LBL_UPLOAD_OPTION_CREATE_RECORD,
  LBL_UPLOAD_REVERT_IMPORT_BUTTON,
  LBL_UPLOAD_TOTAL_RECORD_CREATED,
  LBL_UPLOAD_TOTAL_RECORD_DUPLICATE,
  LBL_UPLOAD_TOTAL_RECORD_ERROR,
  LBL_UPLOAD_TOTAL_RECORD_UPDATED,
  LBL_UPLOAD_VIEW_RECORDS_WITH_DUPLICATES,
  LBL_UPLOAD_VIEW_RECORDS_WITH_ERRORS,
  LBL_UPLOAD_WHAT_WOULD_LIKE_TO_DO,
  SOMETHING_WENT_WRONG,
} from "../../../../constant";
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import useStyles from "./styles";
import InfoIcon from "@material-ui/icons/Warning";
import ErrorIcon from "@material-ui/icons/Error";
import { toast } from "react-toastify";
import {
  importRecords,
  importRecordsRevert,
  massUpdate,
} from "../../../../store/actions/module.actions";
import { isEmpty, isNil, pathOr } from "ramda";
import FormInput from "../../../FormInput";
import { getBase64 } from "../../../../common/utils";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Close";
import GetAppIcon from "@material-ui/icons/GetApp";
import { Button } from "../../../SharedComponents/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import { useFilePreviewer } from "../../../../context/FilePreviewContext";
import { useListViewState } from "../../../../customStrore/useListViewState";

const importFieldsObj = {
  fileUpload: {
    field_key: "fileUpload",
    name: "fileUpload",
    label: "File",
    type: "file",
  },
  importFileType: {
    field_key: "importFileType",
    name: "importFileType",
    label: LBL_UPLOAD_WHAT_WOULD_LIKE_TO_DO,
    type: "radioenum",
    options: {
      create: LBL_UPLOAD_OPTION_CREATE_RECORD,
      update: LBL_UPLOAD_OPTION_CREATE_AND_UPDATE_RECORD,
    },
  },
};
export const ImportFile = ({
  dialogOpenStatus,
  onClose,
  currentModule,
  requiredImportFieldObj,
  onListStateChange,
}) => {
  const classes = useStyles();
  const { onFileDialogStateChange } = useFilePreviewer();
  const { changeTableState } = useListViewState((state) => state.actions);
  const [formInitialValue, setFormInitialValue] = useState({
    importFileType: "create",
  });
  const [revertImportLoading, setRevertImportLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [errorsArr, setErrorsArr] = useState([]);
  const handleFormChange = (field, value) => {
    if (field.name == "fileUpload") {
      if (!isEmpty(value)) {
        getBase64(value).then((data) => {
          setFormInitialValue((v) => ({ ...v, [field.name]: [data] }));
        });
      } else {
        setFormInitialValue((v) => ({
          ...v,
          [field.name]: [{ name: "", file_content: "" }],
        }));
      }
    } else {
      setFormInitialValue((v) => ({ ...v, [field.name]: value }));
    }
  };
  const handleRevertImportedRecord = async () => {
    setRevertImportLoading(true);
    let payload = {
      data: {
        type: currentModule,
        import_type: formInitialValue["importFileType"],
        attributes: {},
      },
    };
    let res = await importRecordsRevert(payload);
    if (res && res.ok) {
      onListStateChange({
        pageNo: 1,
        withAppliedFilter: true,
      });

      toast(pathOr(SOMETHING_WENT_WRONG, ["data", "data", "message"], res));
      setRevertImportLoading(false);
      onClose();
    } else {
      setRevertImportLoading(false);
      toast(SOMETHING_WENT_WRONG);
    }
  };
  const handleOnSubmit = async () => {
    setFormLoading(true);
    let payload = {
      data: {
        type: currentModule,
        import_type: formInitialValue["importFileType"],
        attributes: {
          name: [
            {
              file_name: pathOr(
                null,
                ["fileUpload", 0, "name"],
                formInitialValue,
              ),
              file_content: pathOr(
                null,
                ["fileUpload", 0, "file_content"],
                formInitialValue,
              ),
            },
          ],
        },
      },
    };
    let res = await importRecords(payload);
    if (res.ok) {
      if (res.data.data.status === "failed") {
        toast(res?.data?.data?.message || SOMETHING_WENT_WRONG);
        setResponseData(null);
        parseErrorsArr(null);
      } else {
        setResponseData(res.data.data);
        parseErrorsArr(res.data.data.data);
      }
      setFormLoading(false);
    } else {
      setFormLoading(false);
      toast(SOMETHING_WENT_WRONG);
    }
  };

  const isUploadDisable = () => {
    let isDisable = false;
    const fileContent = pathOr(
      "",
      ["fileUpload", 0, "file_content"],
      formInitialValue,
    );
    const importType = pathOr("", ["importFileType"], formInitialValue);
    if (isEmpty(fileContent) || isEmpty(importType)) {
      isDisable = true;
    }
    return isDisable || formLoading;
  };

  const handleFileViewerChange = (inputFileName) => {
    inputFileName = inputFileName.replace("upload://import/", "");
    let fileArr = inputFileName.split(".");
    let fileExt = fileArr[fileArr.length - 1].toUpperCase();
    let currentDate = Date.now();
    let requestPayload = {
      entryPoint: "customDownload",
      id: "ImportErrors",
      type: "import",
      tempName: inputFileName,
      isTempFile: 1,
      changeUrlFlag: currentDate,
    };
    let urlSearchParams = new URLSearchParams(requestPayload);
    const requestURL = `/index.php?${urlSearchParams.toString()}`;
    onFileDialogStateChange(true, {
      fileName: inputFileName,
      filePath: requestURL,
      fileType: fileExt,
    });
  };

  const parseErrorsArr = (inputErrors) => {
    if (isNil(inputErrors)) {
      setErrorsArr([]);
    } else {
      setErrorsArr([
        {
          label: LBL_UPLOAD_TOTAL_RECORD_CREATED,
          value: inputErrors?.createdCount,
          fileVisibleIcon:
            inputErrors.createdCount >= 1 ? (
              <Button
                label={LBL_UPLOAD_REVERT_IMPORT_BUTTON}
                startIcon={<SettingsBackupRestoreIcon />}
                color="primary"
                onClick={handleRevertImportedRecord}
              />
            ) : null,
        },
        {
          label: LBL_UPLOAD_TOTAL_RECORD_UPDATED,
          value: inputErrors.updatedCount,
          fileVisibleIcon: null,
        },
        {
          label: LBL_UPLOAD_TOTAL_RECORD_ERROR,
          value: inputErrors.errorCount,
          fileVisibleIcon:
            inputErrors.errorCount >= 1 ? (
              <Button
                label={LBL_UPLOAD_VIEW_RECORDS_WITH_ERRORS}
                startIcon={<VisibilityIcon />}
                color="primary"
                onClick={() => handleFileViewerChange(inputErrors?.errorFile)}
              />
            ) : null,
        },
        {
          label: LBL_UPLOAD_TOTAL_RECORD_DUPLICATE,
          value: inputErrors.dupeCount,
          fileVisibleIcon:
            inputErrors.dupeCount >= 1 ? (
              <Button
                label={LBL_UPLOAD_VIEW_RECORDS_WITH_DUPLICATES}
                startIcon={<VisibilityIcon />}
                color="primary"
                onClick={() => handleFileViewerChange(inputErrors?.dupeFile)}
              />
            ) : null,
        },
      ]);
    }
  };
  const handleClose = () => {
    onListStateChange({
      pageNo: 1,
      withAppliedFilter: true,
      withSelectedRecords: false,
    });
    onClose();
  };
  const handleOnImportAgainBtn = () => {
    setErrorsArr([]);
    setFormInitialValue({ importFileType: "create" });
  };

  return (
    <CustomDialog
      isDialogOpen={dialogOpenStatus}
      handleCloseDialog={onClose}
      backdropClickPreventClose={true}
      title={LBL_UPLOAD_FORM_TITLE}
      // fullScreen={true}
      bodyContent={
        <ImportFileBody
          currentModule={currentModule}
          requiredImportFieldObj={requiredImportFieldObj}
          handleFormChange={handleFormChange}
          formInitialValue={formInitialValue}
          responseData={responseData}
          errorsArr={errorsArr}
        />
      }
      bottomActionContent={
        <Box className={classes.buttonGroupRoot}>
          {isEmpty(errorsArr) ? (
            <Button
              label={formLoading ? "Saving..." : LBL_UPLOAD_FORM_TITLE}
              startIcon={
                formLoading ? <CircularProgress size={16} /> : <SaveIcon />
              }
              disabled={isUploadDisable()}
              onClick={handleOnSubmit}
            />
          ) : (
            <Button
              label={"Upload Again"}
              // startIcon={
              //   formLoading ? <CircularProgress size={16} /> : <SaveIcon />
              // }
              // disabled={isUploadDisable()}
              onClick={handleOnImportAgainBtn}
            />
          )}

          <Button
            label={LBL_CANCEL_BUTTON_TITLE}
            startIcon={<CancelIcon />}
            disabled={formLoading}
            onClick={handleClose}
          />
        </Box>
      }
    />
  );
};

const ImportFileBody = ({
  currentModule,
  requiredImportFieldObj,
  handleFormChange,
  formInitialValue,
  responseData,
  errorsArr,
}) => {
  const classes = useStyles();
  const requiredFieldStr =
    requiredImportFieldObj && !isEmpty(requiredImportFieldObj)
      ? Object.values(requiredImportFieldObj).join(", ")
      : "";

  const downloadSampleFile = async () => {
    const payload = {
      action: "export_sample",
      data: {
        type: currentModule,
        id: [],
        attributes: [],
      },
    };
    toast(LBL_DOWNLOAD_INPROGRESS);
    massUpdate(payload)
      .then((res) => {
        if (res.ok) {
          let content = pathOr(false, ["data", "data", "data", "data"], res);
          if (content) {
            let fileName = pathOr(
              currentModule,
              ["data", "data", "data", "module"],
              res,
            );
            let csvContent = "data:text/csv;charset=utf-8," + content;
            let encodedUri = encodeURI(csvContent);
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", fileName + ".csv");
            document.body.appendChild(link);
            link.click();
          }
        } else {
          toast(SOMETHING_WENT_WRONG);
        }
      })
      .catch((e) => {
        toast(SOMETHING_WENT_WRONG);
      });
  };

  return (
    <Box padding={"10px"}>
      <Alert
        severity="info"
        icon={<InfoIcon fontSize="inherit" />}
        style={{
          margin: 10,
        }}
      >
        {LBL_UPLOAD_FORM_DESCRIPTION}
      </Alert>

      {!isEmpty(requiredFieldStr) && (
        <Alert
          severity="info"
          icon={<InfoIcon fontSize="inherit" />}
          style={{
            margin: 10,
          }}
        >
          {`${LBL_UPLOAD_FORM_REQUIRED} ${requiredFieldStr}`}
        </Alert>
      )}
      <Button
        className={classes.importChildContainer}
        label={LBL_DOWNLOAD_IMPORT_TEMPLATE_BUTTON_TITLE}
        variant="outlined"
        startIcon={<GetAppIcon />}
        onClick={downloadSampleFile}
      />
      {isEmpty(errorsArr) ? (
        <ImportFormContainer
          formInitialValue={formInitialValue}
          handleFormChange={handleFormChange}
        />
      ) : (
        <ImportErrorsContainer errorsArr={errorsArr} />
      )}
    </Box>
  );
};

const ImportFormContainer = ({ formInitialValue, handleFormChange }) => {
  const classes = useStyles();

  return (
    <Box className={classes.importChildContainer}>
      {Object.values(importFieldsObj).map((field) => (
        <div className={classes.fieldSpacing}>
          <FormInput
            field={field}
            onChange={(value) => handleFormChange(field, value)}
            value={formInitialValue[field?.name]}
            isRow={false}
          />
        </div>
      ))}
    </Box>
  );
};

const ImportErrorsContainer = ({ errorsArr }) => {
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Record Import Status</TableCell>
            <TableCell align="center">Count</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {errorsArr.map((error) => (
            <TableRow key={error?.label}>
              <TableCell component="th" scope="row">
                {error?.label}
              </TableCell>
              <TableCell align="center">{error?.value}</TableCell>
              <TableCell align="center">{error?.fileVisibleIcon}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
