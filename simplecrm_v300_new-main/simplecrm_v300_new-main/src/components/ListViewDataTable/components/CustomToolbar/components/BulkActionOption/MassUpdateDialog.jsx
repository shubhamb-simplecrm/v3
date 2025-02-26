import React, { memo, useCallback, useEffect, useState } from "react";
import CustomDialog from "../../../../../SharedComponents/CustomDialog";
import { Box, CircularProgress, Grid } from "@material-ui/core";
import useStyles from "./styles";
import {
  getMassUpdateForm,
  massUpdateActionRecords,
} from "../../../../../../store/actions/listview.actions";
import { FormInput, Skeleton } from "../../../../..";
import { isEmpty, pathOr } from "ramda";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_RECORD_UPDATED,
  LBL_SAVE_BUTTON_TITLE,
  SOMETHING_WENT_WRONG,
} from "../../../../../../constant";
import CancelIcon from "@material-ui/icons/Close";
import { Button } from "../../../../../SharedComponents/Button";
import SaveIcon from "@material-ui/icons/Save";
import { toast } from "react-toastify";
import { useIsMobileView } from "@/hooks/useIsMobileView";

const MassUpdateDialog = ({
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
  const getFormData = () => {
    setFormLoading(true);
    let payload = {
      isAllRowSelected: isAllRowSelected ? 1 : 0,
    };
    getMassUpdateForm(currentModule, payload)
      .then((res) => {
        if (res.ok) {
          setFormMetaData(
            pathOr([], ["data", "data", "templateMeta", "data"], res),
          );
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
  };
  const handleUpdateRecords = useCallback(() => {
    setFormSubmitLoading(true);
    let selectedRecordsIds = isAllRowSelected ? ["All"] : selectedRowIdList;
    const requestPayload = {
      action: "update",
      data: {
        type: currentModule,
        id: selectedRecordsIds,
        attributes: formInitialValues,
      },
    };

    let parentName = pathOr(
      null,
      ["data", "attributes", "parent_name"],
      requestPayload,
    );
    if (parentName) {
      delete requestPayload.data.attributes.parent_name;
      requestPayload.data.attributes = {
        ...requestPayload.data.attributes,
        ...parentName,
      };
    }
    massUpdateActionRecords(requestPayload)
      .then((res) => {
        if (res.ok) {
          toast(LBL_RECORD_UPDATED);
          onListStateChange({
            pageNo: 1,
            withAppliedFilter: true,
            withSelectedRecords: false,
          });
        } else {
          toast(res?.data?.errors?.detail);
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

  if (isEmpty(formMetaData)) return null;

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
          <MassUpdateBodyContainer
            formMetaData={formMetaData}
            formInitialValues={formInitialValues}
            handleFormValueChange={handleFormValueChange}
          />
        )
      }
      bottomActionContent={
        <Box className={classes.buttonGroupRoot}>
          <Button
            label={formSubmitLoading ? "Saving..." : LBL_SAVE_BUTTON_TITLE}
            startIcon={
              formSubmitLoading ? <CircularProgress size={16} /> : <SaveIcon />
            }
            disabled={formSubmitLoading}
            // disabled={isUploadDisable()}
            onClick={handleUpdateRecords}
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

const MassUpdateBodyContainer = memo(
  ({ formMetaData, handleFormValueChange, formInitialValues }) => {
    const classes = useStyles();

    return (
      <Box classes={classes.perSectionWrapper}>
        <Grid container spacing={2}>
          {formMetaData &&
            formMetaData.map((field) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={field.field_key}>
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
                  />
                </Grid>
              );
            })}
        </Grid>
      </Box>
    );
  },
);

export default MassUpdateDialog;
