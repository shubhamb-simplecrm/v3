import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { pathOr } from "ramda";
import { useDispatch, useSelector } from "react-redux";
import { getEmailsDetailView } from "../../store/actions/detail.actions";
import { getListView } from "../../store/actions/module.actions";
import { EmailFolders, EmailList, EmailDetails } from "./components";
import { Error, SkeletonShell } from "../../components";
import { QuickComposeEmail } from "./components";
import { getEmailCreateView } from "../../store/actions/emails.actions";
import EmailSettings from "./components/EmailSettings";

import { useHistory } from "react-router-dom";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    overflow: "hidden",
    transition: theme.transitions.create("transform", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    "@media (max-width: 780px)": {
      "& $emailFolders, & $emailList, & $emailDetails": {
        flexBasis: "100%",
        width: "100%",
        maxWidth: "none",
        flexShrink: "0",
        transition: "transform .5s ease",
        transform: "translateX(0)",
      },
    },
  },
  openFolder: {
    "@media (max-width: 780px)": {
      "& $emailFolders, & $emailList, & $emailDetails": {
        transform: "translateX(-100%)",
      },
    },
  },
  emailFolders: {
    flexBasis: 250,
    flexShrink: 0,
    flexGrow: 0,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  emailList: {
    flexGrow: 1,
    minHeight: "100vh",
    background: theme.palette.background.paper,
  },
  emailDetails: {
    flexGrow: 1,
    background: theme.palette.background.paper,
  },
}));

const Mail = ({
  folderDetails,
  view = "ListView",
  viewEmailData = null,
  ACLAccess,
  dataLabels,
  data,
  module,
  moduleLabel,
  isLoading,
  meta,
  dateFormat,
  listViewWhere,
  page,
  setPageNo,
  sortBy,
  sortOrder,
  lastListViewSort,
  rowsPerPage,
  changePageOrSort,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { listViewLoading, listViewError, listViewTabData, selectedModule } =
    useSelector((state) => state.modules);
  const { detailFilterViewData } = useSelector((state) => state.detail);
  const { detailViewLoading } = useSelector((state) => state.detail);
  const { detailViewError } = useSelector((state) => state.detail);
  const { detailViewTabData } = useSelector((state) => state.detail);
  folderDetails = pathOr(
    folderDetails,
    ["data", "templateMeta", "folder_details"],
    listViewTabData[module],
  );
  let selectedFolder = pathOr(
    "",
    ["data", "templateMeta", "selected_folder"],
    listViewTabData[module],
  );
  const [openFolder, setOpenFolder] = useState(false);
  const [openFolderId, setOpenFolderId] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(
    pathOr("", ["data", "templateMeta"], viewEmailData),
  );
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailModal, setEmailModal] = useState({ visible: false, to: "" });
  const [emailSettingModal, setEmailSettingModal] = useState(false);
  const [value, setValue] = useState(null);
  const [emailRecords, setEmailRecords] = useState(data);
  const [id, setId] = useState("");
  const [uid, setUid] = useState("");
  const [msgno, setMsgno] = useState("");
  const [crmEmailId, setCrmEmailId] = useState("");
  const [isSubpanelUpdated, setIsSubpanelUpdated] = useState(false);

  const { emailCreateViewLoading } = useSelector((state) => state.emails);
  const [listViewMeta, setListViewMeta] = useState(meta);

  const handleFolderOpen = async (id) => {
    setSelectedEmail(null);
    setOpenFolder(true);
    setOpenFolderId(id);
    setPageNo(0);
    await dispatch(getListView(module, 0, rowsPerPage || 20, "", "", id)).then(
      (res) => {
        setEmailRecords(
          pathOr([], ["data", "data", "templateMeta", "data"], res),
        );
        setListViewMeta(pathOr([], ["data", "meta"], res));
      },
    );
  };

  const handleFolderClose = () => {
    setOpenFolder(false);
  };
  const handleComposeEmailPopup = (type, data) => {
    dispatch(getEmailCreateView()).then(function (res) {
      if (type === "reply") {
        setEmailModal({
          description_html: `<p></p><p></p><p></p><blockquote style="margin: 0px 0px 0px 0.8ex;border-left: 1px solid rgb(204, 204, 204);padding-left: 1ex;"><p>On ${
            data.date_sent_received || data.date_entered || ""
          }  ${data.from_addr_name || ""} wrote:</p> ${
            data.description_html || ""
          }</blockquote>`,
          to: data.from_addr_name || "",
          name: `${data.name || ""}`,
          parent_id: data.parent_id,
          parent_name: data.parent_name,
          parent_type: data.parent_type,
          cc: data.cc_addrs_names || "",
          bcc: data.bcc_addrs_names || "",
        });
      } else if (type === "replyAll") {
        setEmailModal({
          description_html: `<p></p><p></p><p></p><blockquote style="margin: 0px 0px 0px 0.8ex;border-left: 1px solid rgb(204, 204, 204);padding-left: 1ex;"><p>On ${
            data.date_sent_received || data.date_entered || ""
          }  ${data.from_addr_name || ""} wrote:</p> ${
            data.description_html || ""
          }</blockquote>`,
          to: data.from_addr_name || "",
          cc: data.cc_addrs_names || "",
          bcc: data.bcc_addrs_names || "",
          name: `${data.name || ""}`,
          parent_id: data.parent_id,
          parent_name: data.parent_name,
          parent_type: data.parent_type,
        });
      } else if (type === "forward") {
        setEmailModal({
          description_html: `<p></p><p></p><p></p><blockquote style="margin: 0px 0px 0px 0.8ex;border-left: 1px solid rgb(204, 204, 204);padding-left: 1ex;"><p>On ${
            data.date_sent_received || data.date_entered || ""
          }  ${data.from_addr_name || ""} wrote:</p> ${
            data.description_html || ""
          }</blockquote>`,
          to: "",
          name: `${data.name || ""}`,
          parent_id: data.parent_id,
          parent_name: data.parent_name,
          parent_type: data.parent_type,
        });
      } else {
        setEmailModal({
          description_html: "",
          to: "",
          parent_id: data.parent_id,
          parent_name: data.parent_name,
          parent_type: data.parent_type,
        });
      }

      setEmailModalVisible(!emailModalVisible);
    });
  };

  const handleEmailOpen = async (id, email, crmEmailId) => {
    setId(id);
    setMsgno(email.msgno);
    setUid(email.uid);
    setCrmEmailId(crmEmailId);
    await dispatch(
      getEmailsDetailView(
        "Emails",
        email.inbound_email_record,
        email.msgno,
        email.uid,
        crmEmailId,
        email.folder,
      ),
    ).then((res) => {
      let data = pathOr([], ["data", "data", "templateMeta"], res);
      setSelectedEmail(data);
      emailRecords.map((emailObj, key) => {
        if (email.uid === emailObj.attributes.uid) {
          emailRecords[key].attributes.status = "read";
        }
      });
    });
    setEmailRecords(emailRecords);
  };

  const handleEmailClose = () => {
    setSelectedEmail(null);
    if (!openFolderId) {
      history.push("/app/Emails");
    }
  };

  useEffect(() => {
    if (view === "ListView") {
      setSelectedEmail(null);
      setEmailRecords(emailRecords);
    }
  }, [emailRecords]);

  useEffect(() => {
    if (view === "ListView") {
      setSelectedEmail(null);
      setEmailRecords(data);
    }
  }, [data]);

  useEffect(() => {
    if (view === "ListView") {
      setSelectedEmail(null);
      setListViewMeta(listViewMeta);
    }
  }, [listViewMeta]);

  if (detailViewError) {
    return <Error description={detailViewError} title="Error" />;
  }

  return (
    <Box
      className={clsx({
        [classes.root]: true,
        [classes.openFolder]: openFolder,
      })}
      title="Mail"
    >
      <EmailFolders
        style={{
          display: window.innerWidth < 767 && selectedEmail ? "none" : "block",
        }}
        className={classes.emailFolders}
        onFolderOpen={handleFolderOpen}
        folderData={folderDetails}
        selectedFolder={selectedFolder}
        handleComposeEmailPopup={handleComposeEmailPopup}
        emailCreateViewLoading={emailCreateViewLoading}
      />
      {detailViewLoading &&
      (!Object.keys(detailViewTabData).length ||
        !Object.keys(detailFilterViewData).length) ? (
        <SkeletonShell layout="DetailView" />
      ) : (
        <>
          {selectedEmail ? (
            <EmailDetails
              className={classes.emailDetails}
              loader={<SkeletonShell layout="DetailView" />}
              email={selectedEmail}
              onEmailClose={handleEmailClose}
              handleComposeEmailPopup={handleComposeEmailPopup}
              emailCreateViewLoading={emailCreateViewLoading}
              setIsSubpanelUpdated={setIsSubpanelUpdated}
              setValue={setValue}
              value={value}
              selectedEmail={selectedEmail}
              setSelectedEmail={setSelectedEmail}
              onBack={handleFolderClose}
              onEmailOpen={handleEmailOpen}
              setEmailSettingModal={setEmailSettingModal}
              meta={listViewMeta}
              listViewWhere={listViewWhere}
              page={page}
              sortBy={sortBy}
              sortOrder={sortOrder}
              lastListViewSort={lastListViewSort}
              rowsPerPage={rowsPerPage}
              changePageOrSort={changePageOrSort}
              selectedFolder={selectedFolder}
            />
          ) : (
            ""
          )}
        </>
      )}
      {!selectedEmail ? (
        <EmailList
          loader={listViewLoading}
          className={classes.emailList}
          emailRecords={emailRecords}
          setEmailRecords={setEmailRecords}
          onBack={handleFolderClose}
          onEmailOpen={handleEmailOpen}
          setEmailSettingModal={setEmailSettingModal}
          selectedEmail={selectedEmail}
          setSelectedEmail={setSelectedEmail}
          meta={listViewMeta}
          listViewWhere={listViewWhere}
          page={page}
          sortBy={sortBy}
          sortOrder={sortOrder}
          lastListViewSort={lastListViewSort}
          rowsPerPage={rowsPerPage}
          changePageOrSort={changePageOrSort}
          selectedFolder={selectedFolder}
          module={module}
        />
      ) : (
        ""
      )}

      {emailModalVisible && !emailCreateViewLoading ? (
        <QuickComposeEmail
          subject={emailModal && emailModal.name ? emailModal.name : ""}
          body={
            emailModal && emailModal.description_html
              ? emailModal.description_html
              : ""
          }
          modalState={emailModalVisible}
          to_addrs_names={emailModal && emailModal.to ? emailModal.to : ""}
          cc_addrs_names={emailModal && emailModal.cc ? emailModal.cc : ""}
          bcc_addrs_names={emailModal && emailModal.bcc ? emailModal.bcc : ""}
          parent_name={{
            parent_name: emailModal.parent_name || "",
            parent_id: emailModal.parent_id || "",
            parent_type: emailModal.parent_type || "",
          }}
          handleClose={() => {
            setEmailModalVisible(!emailModalVisible);
          }}
        />
      ) : null}
      <EmailSettings
        open={emailSettingModal}
        handleClose={() => setEmailSettingModal(!emailSettingModal)}
      />
    </Box>
  );
};

export default Mail;