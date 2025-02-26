import React, { useCallback, useState } from "react";
import { Alert } from "@/components";
import {
  LBL_CONFIRM_DELETE_DESCRIPTION,
  LBL_CONFIRM_DELETE_RECORDS_DESCRIPTION,
  LBL_CONFIRM_DELETE_RECORD_TITLE,
  LBL_CONFIRM_DELETE_TITLE,
  LBL_RECORD_DELETED,
  SOMETHING_WENT_WRONG,
} from "@/constant";
import { massDeleteActionRecords } from "@/store/actions/listview.actions";
import { toast } from "react-toastify";
import { pathOr } from "ramda";

const MassDeleteDialog = ({
  dialogStatus,
  onClose,
  currentModule,
  selectedRowIdList,
  isAllRowSelected,
  onListStateChange,
  customListDataOptions,
  pageNo,
}) => {
  const listMetaData = pathOr({}, ["listMetaData"], customListDataOptions);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const handleDeleteRecords = useCallback(() => {
    setFormSubmitLoading(true);
    let selectedRecordsIds = isAllRowSelected ? ["All"] : selectedRowIdList;
    const requestPayload = {
      action: "delete",
      data: {
        type: currentModule,
        id: selectedRecordsIds,
      },
    };

    massDeleteActionRecords(requestPayload)
      .then((res) => {
        if (res.ok) {
          toast(LBL_RECORD_DELETED);
          onListStateChange({
            pageNo: isAllRowSelected
              ? 1
              : listMetaData?.["records-on-this-page"] ==
                    selectedRowIdList.length && pageNo != 1
                ? pageNo - 1
                : pageNo,
            withAppliedFilter: true,
            withSelectedRecords: false,
          });
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
  }, [selectedRowIdList, isAllRowSelected]);

  return (
    <Alert
      title={LBL_CONFIRM_DELETE_RECORD_TITLE}
      msg={LBL_CONFIRM_DELETE_RECORDS_DESCRIPTION}
      agreeText={"Delete"}
      disagreeText={"Cancel"}
      agreeButtonProps={{
        style: {
          backgroundColor: formSubmitLoading ? "grey" : "#D70040",
          color: "white",
        },
      }}
      open={dialogStatus}
      handleClose={onClose}
      onAgree={handleDeleteRecords}
      loading={formSubmitLoading}
    />
  );
};

export default MassDeleteDialog;
