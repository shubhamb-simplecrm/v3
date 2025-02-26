import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { pathOr, clone, isNil } from "ramda";
import { Dialog, useTheme } from "@material-ui/core";
import { toast } from "react-toastify";
import { EmailForm } from "../";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { submitEmailCreateView } from "../../../../store/actions/emails.actions";
import {
  LBL_EMAIL_SEND_FAILED,
  LBL_EMAIL_SEND_SUCCESS,
  SOMETHING_WENT_WRONG,
} from "../../../../constant";
import { isEmpty } from "ramda";

const QuickComposeEmail = ({
  subject = "",
  body = "",
  to_addrs_names,
  cc_addrs_names,
  bcc_addrs_names,
  handleClose,
  parent_name = [],
  modalState,
  attachments = [],
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const currentTheme = useTheme();
  const fullScreen = useMediaQuery(currentTheme.breakpoints.down("sm"));
  const [initialValues, setInitialValues] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [attachedDocuments, setAttachedDocuments] = useState([]);
  const [attachedNotes, setAttachedNotes] = useState([]);
  const {
    emailCreateViewLoading,
    emailCreateViewError,
    emailCreateViewTabData,
    emailSubmitLoader,
  } = useSelector((state) => state.emails);
  const [data, setData] = useState(
    pathOr(
      [],
      ["data", "templateMeta", "data"],
      emailCreateViewTabData["Emails"],
    ),
  );
  let getAttachemnt = pathOr(
    null,
    ["data", "templateMeta", "attachment"],
    emailCreateViewTabData["Emails"],
  );
  let attachment =
    getAttachemnt && getAttachemnt.fileid
      ? [{ value: getAttachemnt.filename, email: "", id: getAttachemnt.fileid }]
      : [];
  let fromFields = pathOr(
    [],
    ["data", "templateMeta", "fromFields"],
    emailCreateViewTabData["Emails"],
  );
  useEffect(() => {
    data.length &&
      data[0].attributes.map((row) => {
        row.map((col) => {
          if (col?.value) {
            initialValues[col.name] = col.value;
          }
          if (col.name === "from_addr_name") {
            if (!isEmpty(col.options)) {
              const inBoundEmailId = Object.keys(col.options)[0];
              const fromAddr = Object.values(col.options)[0];
              initialValues["from_addr"] = fromAddr;
              initialValues["inbound_email_id"] = col?.value
                ? col.value
                : inBoundEmailId;
            } else {
              initialValues["from_addr"] = "";
              initialValues["inbound_email_id"] = "";
            }
          } else {
            initialValues[col.name] = col.value || "";
          }
        });
      });
    for (var i = 0; i < 10; i++) {
      initialValues["documentId" + i] = "";
    }
    if (attachments?.length) {
      attachments.map((attachedDoc, docNo) => {
        attachedNotes.push(attachedDoc);
        initialValues["noteId" + docNo] = attachedDoc.id || "";
      });
      setAttachedNotes(attachedNotes);
    }
    if (attachment[0]) {
      let prevFiles = clone(attachedDocuments);
      prevFiles.push(attachment[0]);
      setAttachedDocuments(prevFiles);
    }
    initialValues["name"] = initialValues["name"]
      ? initialValues["name"]
      : subject || "";
    initialValues["to_addrs_names"] = initialValues["to_addrs_names"]
      ? initialValues["to_addrs_names"]
      : to_addrs_names || "";
    initialValues["cc_addrs_names"] = initialValues["cc_addrs_names"]
      ? initialValues["cc_addrs_names"]
      : cc_addrs_names || "";
    initialValues["bcc_addrs_names"] = initialValues["bcc_addrs_names"]
      ? initialValues["bcc_addrs_names"]
      : bcc_addrs_names || "";
    initialValues["parent_name"] = initialValues["parent_name"]
      ? initialValues["parent_name"]
      : parent_name.parent_name || "";
    initialValues["emails_email_templates_name"] = initialValues[
      "emails_email_templates_name"
    ]
      ? initialValues["emails_email_templates_name"]
      : "";
    initialValues["email_attachment"] = [];
    initialValues["emails_email_templates_idb"] = "";
    initialValues["parent"] = parent_name || {
      parent_name: "",
      parent_type: "",
      parent_id: "",
    };
    initialValues["parent_type"] = parent_name.parent_type || "";
    initialValues["parent_id"] = parent_name.parent_id || "";
    initialValues["type"] = "out";
    initialValues["send"] = "1";
    initialValues["refer_action"] = "ComposeView";
    initialValues["description"] = initialValues["description"] =
      !isEmpty(body) && !isNil(body)
        ? body
        : initialValues["description"] || initialValues["description_html"];
    initialValues["description"] = initialValues["description"] || body;
    initialValues["dummy_attachment"] = attachment[0]
      ? [attachment[0].id] || []
      : [];
    setInitialValues({ ...initialValues, initialValues });
  }, [data]);
  useEffect(() => {
    attachedDocuments.length &&
      attachedDocuments.map((document, docNo) => {
        initialValues["documentId" + docNo] = document.id || "";
      });
  }, [attachedDocuments]);
  useEffect(() => {
    let allFiles = [];
    attachedFiles.map((file) => {
      getBase64(file).then((data) => allFiles.push(data));
    });
    initialValues["email_attachment"] = allFiles;
  }, [attachedFiles]);

  const getBase64 = (file, cb) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve({ file_name: file.name, file_content: reader.result });
      reader.onerror = (error) => reject(error);
    });
  };
  if (emailCreateViewLoading) {
  }
  if (emailCreateViewError) {
    return <h3>{emailCreateViewError && ""}</h3>;
  }
  const onChange = (field, val) => {
    switch (field) {
      case "from_addr_name":
        setInitialValues({
          ...initialValues,
          inbound_email_id: val,
          ["from_addr"]: data[0].attributes[1][0].options[val],
        });
        break;

      case "emails_email_templates_name":
        setInitialValues({
          ...initialValues,
          description: val.email_template,
          emails_email_templates_name: val.value,
          emails_email_templates_idb: val.id,
          name: isEmpty(val.value)
            ? subject
            : (subject.match(/\[CASE.*?\]/)?.[0]??"") + " " + val.value.trim(),
        });
        break;

      case "parent_name":
        setInitialValues({
          ...initialValues,
          parent: val,
          parent_id: val.parent_id,
          parent_name: val.parent_name,
          parent_type: val.parent_type,
        });
        break;
      case "description":
        initialValues[field] = val;
        setInitialValues(initialValues);
        break;
      default:
        setInitialValues({ ...initialValues, [field]: val });
        break;
    }
  };
  const onSubmit = () => {
    var params = JSON.stringify({ attribute: initialValues });
    try {
      dispatch(submitEmailCreateView(params, id)).then(function (res) {
        if (res && res.ok) {
          handleClose();
          toast(
            pathOr(
              LBL_EMAIL_SEND_SUCCESS,
              ["data", "data", "discription"],
              res,
            ),
          );
        } else {
          toast(
            pathOr(LBL_EMAIL_SEND_FAILED, ["data", "data", "discription"], res),
          );
        }
      });
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
    }
  };
  return (
    <>
      {/* Render Email quick create in a dialog box like other actions */}
      <Dialog
        fullScreen={fullScreen}
        maxWidth={"md"}
        open={modalState}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {!emailCreateViewLoading && data.length ? (
          <EmailForm
            modalState={modalState}
            handleSubmit={onSubmit}
            emailSubmitLoader={emailSubmitLoader}
            handleClose={handleClose}
            onChange={onChange}
            metaData={data}
            initialValues={initialValues}
            setInitialValues={setInitialValues}
            attachedFiles={attachedFiles}
            setAttachedFiles={setAttachedFiles}
            attachedNotes={attachedNotes}
            setAttachedNotes={setAttachedNotes}
            attachedDocuments={attachedDocuments}
            setAttachedDocuments={setAttachedDocuments}
          />
        ) : (
          ""
        )}
      </Dialog>
    </>
  );
};

export default QuickComposeEmail;
