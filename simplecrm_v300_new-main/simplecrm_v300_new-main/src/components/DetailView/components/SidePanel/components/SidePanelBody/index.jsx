import React, { useCallback, useRef, useState } from "react";
import SidePanelCard from "../SidePanelCard/SidePanelCard";
import { isEmpty, pathOr } from "ramda";
import NoRecord from "../../../../../NoRecord/index";
import {
  Box,
  CircularProgress,
  IconButton,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import DetailViewDialogContainer from "@/components/DashboardContainer/components/DefaultDashboard/DetailViewDialogContainer";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import CustomDialog from "@/components/SharedComponents/CustomDialog";
import { useEmailState } from "@/components/Email/useEmailState";
import {
  EmailBody,
  EmailDetailHeader,
  EmailDetailToolbar,
} from "@/components/Email/components/EmailDetailView";
import CloseIcon from "@material-ui/icons/Close";
import SidePanelTicketCard from "../SidePanelTicketCard/SidePanelTicketCard";
import { useReactToPrint } from "react-to-print";

const parseEventCardObject = (inputObj, tabValue) => {
  let description = pathOr("", ["description_html"], inputObj);
  if (isEmpty(description)) description = pathOr("", ["description"], inputObj);
  const obj = {
    title: inputObj?.name || "[No Subject]",
    id: inputObj?.id ?? "",
    recordModule: inputObj?.object_image ?? "",
    status:
      (tabValue === "Activities" || tabValue === "History") &&
      inputObj?.object_image != "Emails"
        ? (inputObj?.status ?? "")
        : inputObj?.object_image === "Emails"
          ? inputObj.email_type.charAt(0).toUpperCase() +
            inputObj.email_type.slice(1).toLowerCase()
          : "",
    assignedUser: inputObj?.assigned_user_name ?? "",
    description: description,
    emailBody: description,
    date:
      tabValue === "Activities" ? inputObj?.date_end : inputObj?.date_entered,
    dateLabel:
      tabValue === "Activities" ? (
        inputObj?.object_image === "Meetings" ||
        inputObj?.object_image === "Calls" ? (
          <span>End Date: </span>
        ) : (
          <span>Due Date: </span>
        )
      ) : inputObj.object_image === "Email" ? (
        ""
      ) : (
        <span>Date Created: </span>
      ),
    fromAddr: inputObj?.from_addr ?? "",
    toAddr: inputObj?.to_addrs ?? "",
    reply_to_addr: inputObj?.reply_to_addr ?? "",
    cc_addrs: inputObj?.cc_addrs ?? "",
    bcc_addrs: inputObj?.bcc_addrs ?? "",
    record_id: inputObj?.id ?? "",
    ACLAccess: {
      edit: inputObj?.ACLAccess?.edit ?? "",
      delete: inputObj?.ACLAccess?.delete ?? "",
      list: inputObj?.ACLAccess?.list ?? "",
      view: inputObj?.ACLAccess?.view ?? "",
      reply: inputObj?.ACLAccess?.reply ?? "",
      replyAll: inputObj?.ACLAccess?.replyall ?? "",
      forward: inputObj?.ACLAccess?.forward ?? "",
    },
  };
  return obj;
};

export const SidePanelBody = ({
  tabValue,
  isLoading,
  error,
  activityList,
  hasMore,
  setPageNum,
  onTabRefresh,
  loader,
  setLoader,
  setIsSubpanelUpdated,
  recordName,
  recordId,
}) => {
  const observer = useRef();
  const [showDetailViewDialog, setShowDetailViewDialog] = useState({
    open: false,
    id: null,
    record_module: null,
  });
  const handleOpenDetailViewDialog = (id, record_module) => {
    setShowDetailViewDialog({
      open: true,
      id: id,
      module: record_module,
    });
  };
  const handleCloseDetailViewDialog = () => {
    setShowDetailViewDialog({
      open: false,
      id: null,
      module: null,
    });
  };
  const isMobile = useIsMobileView("sm");
  const [openEmailDetailView, setOpenEmailDetailView] = useState(false);
  const renderEmailDetailViewDialog = (id) => {
    setOpenEmailDetailView(true);
    actions.getEmailDetailData(null, null, null, null, id);
  };
  const closeEmailDetailView = () => {
    setOpenEmailDetailView(false);
  };
  const { actions, detailLoading, detailData } = useEmailState((state) => ({
    actions: state.actions,
    detailLoading: state.detailLoading,
    detailData: state.detailData,
  }));
  const contentRef = React.useRef(null);
  const [printLoading, setPrintLoading] = useState(false);
  const handleOnBeforeGetContent = () => {
    setPrintLoading(true);
  };
  const handleAfterPrint = () => {
    setPrintLoading(false);
  };
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: detailData?.name ?? "",
    onBeforeGetContent: handleOnBeforeGetContent,
    onAfterPrint: handleAfterPrint,
  });
  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLoader(true);
          setPageNum((prev) => prev + 1);
        }
      });
      if (node && hasMore) {
        observer.current.observe(node);
      } else {
        observer.current.disconnect();
      }
    },
    [isLoading, hasMore],
  );

  return (
    <div
      style={{
        height: "calc(100% - 5vh)",
        overflow: "scroll",
      }}
    >
      {!!activityList &&
        activityList.map((item, index) => {
          return (
            <Box
              key={item.id}
              boxShadow={0}
              ref={
                activityList.length === index + 1
                  ? lastBookElementRef
                  : undefined
              }
            >
              {tabValue == "SimilarTickets" ? <SidePanelTicketCard
                tabValue={tabValue}
                item={item["node"]}
                onTabRefresh={onTabRefresh}
                setIsSubpanelUpdated={setIsSubpanelUpdated}
                loader={loader}
                handleOpenDetailViewDialog={handleOpenDetailViewDialog}
                renderEmailDetailViewDialog={renderEmailDetailViewDialog}
              /> :
                <SidePanelCard
                  tabValue={tabValue}
                  item={parseEventCardObject(item, tabValue)}
                  onTabRefresh={onTabRefresh}
                  setIsSubpanelUpdated={setIsSubpanelUpdated}
                  handleOpenDetailViewDialog={handleOpenDetailViewDialog}
                  renderEmailDetailViewDialog={renderEmailDetailViewDialog}
                />}
            </Box>
          );
        })}
      {isLoading && (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography
            variant="button"
            display="inline"
            align="center"
            gutterBottom
          >
            {loader ? (
              <span
                style={{
                  display: "flex",
                  color: "#0071d2",
                  alignItems: "center",
                  marginTop: "15px",
                }}
              >
                <CircularProgress size={18} style={{ marginRight: "5px" }} />
                <span>Loading ...</span>
              </span>
            ) : (
              <LinearProgress style={{ marginTop: "50px", width: "150px" }} />
            )}
          </Typography>
        </Box>
      )}
      {error && (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography
            variant="button"
            display="inline"
            align="center"
            gutterBottom
          >
            Error...
          </Typography>
        </Box>
      )}
      {!isLoading && isEmpty(activityList) && (
        <NoRecord view="subpanel" subpanel_module="" module="" />
      )}
      {!isLoading &&
        !hasMore &&
        activityList.length > 0 &&
        isEmpty(activityList) && (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography
              variant="button"
              display="inline"
              align="center"
              gutterBottom
            >
              No More Records
            </Typography>
          </Box>
        )}
      {showDetailViewDialog.open ? (
        <DetailViewDialogContainer
          dialogOpenStatus={showDetailViewDialog.open}
          selectedRecordId={showDetailViewDialog.id}
          selectedRecordModule={showDetailViewDialog.module}
          handleCloseDialog={handleCloseDetailViewDialog}
          calenderView={true}
          fullScreen={isMobile ? true : false}
        />
      ) : null}
      <CustomDialog
        isDialogOpen={openEmailDetailView}
        fullScreen={isMobile ? true : false}
        isLoading={detailLoading}
        style={{ paddingTop: "0px", minHeight: "500px" }}
        titleStyle={{ paddingBottom: "0px", paddingTop: "5px" }}
        bodyContent={
          <>
            <div ref={contentRef}>
              <EmailDetailHeader style={{ padding: "10px 15px 10px 15px" }} />
              <EmailBody />
            </div>
          </>
        }
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <EmailDetailToolbar
                printLoading={printLoading}
                handlePrint={handlePrint}
                showCompactMenu={true}
                parentData={{ recordName, recordId }}
              />
            </div>
            <IconButton size="small" onClick={closeEmailDetailView}>
              <CloseIcon />
            </IconButton>
          </div>
        }
      />
    </div>
  );
};
