import { isEmpty, isNil } from "ramda";
import React from "react";
import { useEmailState } from "../../useEmailState";
import { EmailList, EmailToolbar } from "./components";
import EmailNoRecords from "../../EmailNoRecords";
import { LBL_EMAIL_NO_FOLDER_DES, LBL_EMAIL_NO_RECORD_DES } from "@/constant";

const EmailListLayout = () => {
  const { listData, filterObj, listViewLoading, selectedParentFolderId } =
    useEmailState((state) => ({
      listData: state.listData,
      filterObj: state.filterObj,
      listViewLoading: state.listViewLoading,
      selectedParentFolderId: state.selectedParentFolderId,
    }));
  if (
    (isEmpty(listData) || isNil(listData)) &&
    isEmpty(filterObj) &&
    !listViewLoading
  ) {
    return (
      <EmailNoRecords
        message={
          isEmpty(selectedParentFolderId)
            ? LBL_EMAIL_NO_FOLDER_DES
            : LBL_EMAIL_NO_RECORD_DES
        }
      />
    );
  }
  return (
    <>
      <EmailToolbar />
      <EmailList />
    </>
  );
};

export default EmailListLayout;
