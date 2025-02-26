import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Divider, List } from "@material-ui/core";
import { Scrollbars } from "react-custom-scrollbars";
import { EmailToolbar, EmailItem, EmailImport } from "./components";

import { pathOr } from "ramda";
import { SkeletonShell, Error } from "../../../";
import { toast } from "react-toastify";
import { markEmails } from "../../../../store/actions/emails.actions";
import { LBL_NO_RECORDS_FOUND } from "../../../../constant";
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    overflow: "hidden",
  },
  noRecord: {
    display: "table-cell",
    verticalAlign: "middle",
    textAlign: "center",
    width: "2%",
    height: "62vh",
    color: theme.grey[400],
  },
}));

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

const EmailList = (props) => {
  const {
    loader,
    emailRecords,
    setEmailRecords,
    onEmailOpen,
    onBack,
    className,
    setEmailSettingModal,
    meta,
    listViewWhere,
    page,
    sortBy,
    sortOrder,
    lastListViewSort,
    rowsPerPage,
    changePageOrSort,
    selectedFolder,
    selectedEmail,
    setSelectedEmail,
    module,
    ...rest
  } = props;

  const size = useWindowSize();
  const classes = useStyles();
  const [openEmailImportDialog, setOpenEmailImportDialog] = useState(false);
  const [listViewLoader, setListViewLoader] = useState(loader);

  const [selectedEmails, setSelectedEmails] = useState([]);

  const handleSelectAll = () => {
    setSelectedEmails(
      emailRecords.map((email) => email.attributes.uid || email.attributes.id),
    );
  };
  const handleDeselectAll = () => {
    setSelectedEmails([]);
  };

  const handleOpenEmailImportDialog = () => {
    setOpenEmailImportDialog(!openEmailImportDialog);
  };

  const handleToggleOne = (id) => {
    setSelectedEmails((selectedEmails) => {
      let newSelectedEmails = [...selectedEmails];
      if (newSelectedEmails.includes(id)) {
        return newSelectedEmails.filter((email) => email !== id);
      } else {
        newSelectedEmails.push(id);
        return newSelectedEmails;
      }
    });
  };
  const handleMassAction = async (type, isSingle = null) => {
    let submitData = {
      data: {
        type: "InboundEmail",
        attributes: { id: 1 },
      },
      folder_name: "INBOX",
      folder: "",
      inbound_email_record: selectedFolder ? selectedFolder : "",
      emailuid: isSingle ?? selectedEmails,
      marktype: type,
    };
    if (!isSingle) {
      setListViewLoader(true);
    }

    const res = await markEmails(submitData);
    if (res.ok) {
      setListViewLoader(false);
      if (res.data && res.data.data && res.data.data.message) {
        if (res.data.data.status && res.data.data.status === true) {
          emailRecords.map((email, key) => {
            if (selectedEmails.includes(email.attributes.uid)) {
              if (type === "unread" || type === "read") {
                emailRecords[key].attributes.status = type;
              }
              if (type === "unflagged") {
                emailRecords[key].attributes.flagged = 0;
              }
              if (type === "flagged") {
                emailRecords[key].attributes.flagged = 1;
              }
            }
          });
          setEmailRecords(emailRecords);
          handleDeselectAll();
          toast(res.data.data.message);
        } else {
          toast(res.data.data.message);
        }
      }
    }
  };

  useEffect(() => {
    setListViewLoader(loader);
  }, [loader]);

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <EmailToolbar
        onBack={onBack}
        onDeselectAll={handleDeselectAll}
        selectedFolder={selectedFolder}
        onSelectAll={handleSelectAll}
        selectedEmails={selectedEmails}
        setSelectedEmails={setSelectedEmails}
        setEmailSettingModal={setEmailSettingModal}
        selectedEmail={selectedEmail}
        setSelectedEmail={setSelectedEmail}
        meta={meta}
        listViewWhere={listViewWhere}
        page={page}
        sortBy={sortBy}
        sortOrder={sortOrder}
        lastListViewSort={lastListViewSort}
        rowsPerPage={rowsPerPage}
        changePageOrSort={changePageOrSort}
        handleOpenEmailImportDialog={handleOpenEmailImportDialog}
        setListViewLoader={setListViewLoader}
        listViewLoader={listViewLoader}
        handleMassAction={handleMassAction}
        emailRecords={emailRecords}
        setEmailRecords={setEmailRecords}
      />
      <Divider />
      {listViewLoader ? (
        <SkeletonShell layout="DetailView" />
      ) : (
        <Scrollbars autoHide autoHeight autoHeightMax={size.height - 73}>
          {emailRecords.length ? (
            <List disablePadding>
              {emailRecords.map((email) => (
                <EmailItem
                  email={email.attributes}
                  key={email.attributes.uid || email.attributes.id}
                  onOpen={onEmailOpen}
                  id={email.attributes.uid || email.attributes.id}
                  crmEmailId={pathOr("", ["attributes", "id"], email)}
                  onToggle={() =>
                    handleToggleOne(email.attributes.uid || email.attributes.id)
                  }
                  selected={selectedEmails.includes(
                    email.attributes.uid || email.attributes.id,
                  )}
                  handleMassAction={handleMassAction}
                />
              ))}
            </List>
          ) : (
            <div className={classes.noRecord}>
              <Error
                view="EmailListView"
                description={LBL_NO_RECORDS_FOUND}
                title=""
              />
            </div>
          )}
        </Scrollbars>
      )}
      {openEmailImportDialog ? (
        <EmailImport
          emailRecords={emailRecords}
          setEmailRecords={setEmailRecords}
          selectedEmails={selectedEmails}
          emailinbound={selectedFolder}
          openEmailImportDialog={openEmailImportDialog}
          setOpenEmailImportDialog={setOpenEmailImportDialog}
          module={module}
        />
      ) : null}
    </div>
  );
};

EmailList.propTypes = {
  className: PropTypes.string,
  emailRecords: PropTypes.array.isRequired,
  onBack: PropTypes.func,
  onOpen: PropTypes.func,
};

export default EmailList;
