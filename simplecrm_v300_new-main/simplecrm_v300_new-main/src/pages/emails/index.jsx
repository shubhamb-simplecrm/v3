import React, { useEffect } from "react";
import { Skeleton } from "../../components";
import Email from "@/components/Email";
import { useEmailState } from "@/components/Email/useEmailState";
import { isEmpty, isNil } from "ramda";

const Emails = () => {
  const { listViewLoading, folderData, emailActions } = useEmailState(
    (state) => ({
      listViewLoading: state.listViewLoading,
      folderData: state.folderData,
      emailActions: state.actions,
    }),
  );
  useEffect(() => {
    emailActions.getListViewData();
  }, []);

  if (listViewLoading && (isEmpty(folderData) || isNil(folderData))) {
    return <Skeleton />;
  }
  return <Email />;
};

export default Emails;
