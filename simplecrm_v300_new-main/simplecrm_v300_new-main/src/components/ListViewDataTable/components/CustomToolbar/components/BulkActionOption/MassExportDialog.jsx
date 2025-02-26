import React, { memo, useCallback, useEffect, useState } from "react";
import CustomDialog from "../../../../../SharedComponents/CustomDialog";
import { Box, CircularProgress, Grid } from "@material-ui/core";
import useStyles from "./styles";
import {
  getExportLayout,
  massExportActionRecords,
} from "../../../../../../store/actions/listview.actions";
import { FormInput, Skeleton } from "../../../../..";
import { isEmpty, pathOr } from "ramda";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_EXPORT_INPROGRESS,
  LBL_EXPORT_SUCCESS_MESSAGE,
  SOMETHING_WENT_WRONG,
} from "../../../../../../constant";
import CancelIcon from "@material-ui/icons/Close";
import { Button } from "../../../../../SharedComponents/Button";
import SaveIcon from "@material-ui/icons/Save";
import { toast } from "react-toastify";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import { Alert } from "@material-ui/lab";

const MassExportDialog = ({
  dialogStatus,
  label,
  onClose,
  currentModule,
  selectedRowIdList,
  isAllRowSelected,
  onListStateChange,
}) => {
  const classes = useStyles();
  let isMobileViewCheck = useIsMobileView();
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [formMetaData, setFormMetaData] = useState(null);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [errors, setErrors] = useState({});
  const getFormData = () => {
    setFormLoading(true);
    getExportLayout(currentModule)
      .then((res) => {
        if (res.ok) {
          const formLayout = pathOr([], ["data", "data", "layout"], res);
          const formValues = {};
          const formErrorState = {};
          formLayout.forEach((field) => {
            if (field.name === "select_all_field") {
              formValues[field.name] = field?.value ?? false;
              if (!!formValues[field.name]) {
                formErrorState["field_selection"] = "ReadOnly";
              }
            } else {
              formValues[field.name] = field?.value ?? "";
            }
          });
          setFormInitialValues(formValues);
          setErrors(formErrorState);
          setFormMetaData(formLayout);
        } else {
          toast(
            pathOr(SOMETHING_WENT_WRONG, ["data", "errors", "detail"], res),
          );
          onClose();
        }
        setFormLoading(false);
      })
      .catch((e) => {
        toast(SOMETHING_WENT_WRONG);
        setFormLoading(false);
        onClose();
      });
  };
  const handleFormValueChange = (field, value) => {
    if (field.type === "relate") {
      setFormInitialValues((v) => ({
        ...v,
        [field.name]: value.value,
        [field.id_name]: value.id,
      }));
    } else {
      setFormInitialValues((v) => ({
        ...v,
        [field.field_key]: value,
      }));
    }
    if (field.name === "select_all_field") {
      setFormInitialValues((v) => ({
        ...v,
        field_selection: [],
      }));
      if (!!value) {
        setErrors((v) => {
          v["field_selection"] = "ReadOnly";
          return { ...v };
        });
      } else {
        setErrors((v) => {
          v["field_selection"] = undefined;
          return { ...v };
        });
      }
    }
  };

  const handleOnExportRecords = useCallback(() => {
    if (
      isEmpty(formInitialValues["field_selection"]) &&
      !formInitialValues["select_all_field"]
    ) {
      toast("Select Fields");
      return;
    }

    setFormSubmitLoading(true);
    let selectedRecordsIds = isAllRowSelected
      ? ["All", "where"]
      : selectedRowIdList;

    let requestPayload = {
      action: "export",
      data: {
        type: currentModule,
        id: selectedRecordsIds,
        fields: formInitialValues["field_selection"],
        exportFileFormat: formInitialValues["exportFileFormat"],
      },
    };

    toast(LBL_EXPORT_INPROGRESS);
    massExportActionRecords(requestPayload)
      .then((res) => {
        if (res.ok) {
          toast(LBL_EXPORT_SUCCESS_MESSAGE);
        } else {
          toast(res.data.errors.detail);
        }
        setFormSubmitLoading(false);
        onClose();
      })
      .catch((e) => {
        setFormSubmitLoading(false);
        toast(SOMETHING_WENT_WRONG);
        onClose();
      });
  }, [selectedRowIdList, isAllRowSelected, formInitialValues]);

  useEffect(() => {
    getFormData();
  }, [dialogStatus]);

  return (
    <CustomDialog
      isDialogOpen={dialogStatus}
      handleCloseDialog={onClose}
      fullScreen={isMobileViewCheck}
      title={label}
      bodyContent={
        formLoading ? (
          <Skeleton />
        ) : (
          <MassExportBodyContainer
            formMetaData={formMetaData}
            formInitialValues={formInitialValues}
            handleFormValueChange={handleFormValueChange}
            errors={errors}
          />
        )
      }
      bottomActionContent={
        <Box className={classes.buttonGroupRoot}>
          <Button
            label={formSubmitLoading ? "Exporting..." : "Export"}
            startIcon={
              formSubmitLoading ? <CircularProgress size={16} /> : <SaveIcon />
            }
            disabled={formSubmitLoading}
            // disabled={isUploadDisable()}
            onClick={handleOnExportRecords}
          />
          <Button
            label={LBL_CANCEL_BUTTON_TITLE}
            startIcon={<CancelIcon />}
            disabled={formSubmitLoading}
            onClick={onClose}
          />
        </Box>
      }
    />
  );
};

const MassExportBodyContainer = memo(
  ({ formMetaData, handleFormValueChange, formInitialValues, errors }) => {
    const classes = useStyles();

    return (
      <Box className={classes.perSectionWrapper}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
            <Alert severity="info">
              You can only export ListView Display and Hidden Columns.
            </Alert>
          </Grid>
          {formMetaData &&
            formMetaData.map((field) => {
              return (
                <Grid item xs={12} sm={12} md={12} key={field.field_key}>
                  <FormInput
                    field={field}
                    key={field.field_key}
                    value={
                      field.type === "relate"
                        ? pathOr(
                            "",
                            [field.field_key, field.field_key],
                            formInitialValues,
                          )
                        : pathOr("", [field.field_key], formInitialValues)
                    }
                    small={true}
                    onChange={(val) => handleFormValueChange(field, val)}
                    initialValues={formInitialValues}
                    errors={errors}
                  />
                </Grid>
              );
            })}
        </Grid>
      </Box>
    );
  },
);

export default MassExportDialog;
