import React, { useRef, useState } from "react";
import {
  useTheme,
  InputAdornment,
  ButtonGroup,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Box,
  Divider,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import CloseIcon from "@material-ui/icons/Close";
import Close from "@material-ui/icons/Close";
import AttachFile from "@material-ui/icons/AttachFile";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import TheatersIcon from "@material-ui/icons/Theaters";
import SearchIcon from "@material-ui/icons/Search";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PostAddOutlinedIcon from "@material-ui/icons/PostAddOutlined";
import LinkIcon from "@material-ui/icons/Link";
import FormInput from "../../../FormInput";
import { MuiThemeProvider } from "@material-ui/core/styles";
import useStyles, { getMuiTheme } from "./styles";
import { clone, isEmpty, isNil } from "ramda";
import { toast } from "react-toastify";
import SpeedDials from "./SpeedDials";
import { pathOr } from "ramda";
import CircularProgress from "@material-ui/core/CircularProgress";
import FileViewerComp from "../../../FileViewer/FileViewer";
import { useSelector } from "react-redux";
import {
  LBL_EMAIL_COMPOSE_ADD_BCC,
  LBL_EMAIL_COMPOSE_ADD_CC,
  LBL_EMAIL_COMPOSE_ATTACH_DOCUMENTS,
  LBL_EMAIL_COMPOSE_ATTACH_FILES,
  LBL_EMAIL_COMPOSE_BCC,
  LBL_EMAIL_COMPOSE_CC,
  LBL_EMAIL_COMPOSE_FORM_TITLE,
  LBL_EMAIL_COMPOSE_FROM,
  LBL_EMAIL_COMPOSE_RELATED_TO,
  LBL_EMAIL_COMPOSE_SELECT_EMAIL_TEMPLATE,
  LBL_EMAIL_COMPOSE_SELECT_FROM_CRM,
  LBL_EMAIL_COMPOSE_SEND_BUTTON,
  LBL_EMAIL_COMPOSE_SUBJECT,
  LBL_EMAIL_COMPOSE_TO,
  LBL_EMAIL_DOCUMENTS_ATTACH_SUCCESS,
  LBL_EMAIL_FILE_ATTACHED,
} from "../../../../constant";
import Scrollbars from "react-custom-scrollbars";
import useCommonUtils from "@/hooks/useCommonUtils";
import { validateFile } from "@/common/utils";

const EmailForm = ({
  initialValues,
  setInitialValues,
  onChange,
  metaData,
  modalState,
  handleClose,
  emailSubmitLoader,
  attachedFiles,
  setAttachedFiles,
  attachedNotes,
  setAttachedNotes,
  attachedDocuments,
  setAttachedDocuments,
  handleSubmit,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const { maxUploadLimit, minUploadLimit } = useCommonUtils();

  const [openCC, setOpenCC] = useState(false);
  const [openBCC, setOpenBCC] = useState(false);
  const [openRelateTo, setOpenRelateTo] = useState(false);
  const [openRelateCC, setOpenRelateCC] = useState(false);
  const [openRelateBCC, setOpenRelateBCC] = useState(false);
  const [openRelatedTo, setOpenRelatedTo] = useState(
    initialValues && initialValues.parent_type,
  );
  const [fullscreen, setFullscreen] = useState(false);
  const config = useSelector((state) => state?.config?.config);
  const [previewFile, setPreviewFile] = useState({
    open: false,
    filename: "",
    filepath: "",
  });

  const site_url = pathOr("", ["site_url"], config);

  const handleChange = (field, val) => {
    onChange(field, val);
  };

  const handleAttach = () => {
    fileInputRef.current.click();
  };

  const validateAndChange = (files, e) => {
    let prevFiles = clone(attachedFiles);
    let error = null;
    let errorFiles = [];
    Object.entries(files).map((file, key) => {
      error = validateFile(file[1], maxUploadLimit, null, minUploadLimit);
      if (error) {
        errorFiles.push(file[1].name);
      } else {
        prevFiles.push(file[1]);
      }
    });
    if (error) {
      let fileNames = errorFiles.map((fileName, i) => (
        <p key={i}>
          {i + 1}. {fileName}
        </p>
      ));
      const errorMsg = (
        <p>
          {error}: <br /> {fileNames}
        </p>
      );
      toast(errorMsg);
    }
    if (JSON.stringify(prevFiles) === JSON.stringify(attachedFiles)) {
      return;
    }
    toast(LBL_EMAIL_FILE_ATTACHED);
    setAttachedFiles(prevFiles);
    const timeout = setTimeout(() => {
      const timeline1 = document.getElementById("attachmentContainer");
      timeline1.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 1000);
  };
  const deleteAttachment = (type, key) => {
    let data = clone(
      type === "note"
        ? attachedNotes
        : type === "file"
          ? attachedFiles
          : attachedDocuments,
    );
    data.splice(key, 1);
    if (type === "file") setAttachedFiles(data);
    if (type === "document") setAttachedDocuments(data);
    if (type === "note") setAttachedNotes(data);
  };
  const addDocument = (files) => {
    let prevFiles = clone(attachedDocuments);
    prevFiles.push(files);
    setAttachedDocuments(prevFiles);
    toast(LBL_EMAIL_DOCUMENTS_ATTACH_SUCCESS);
    const timeout = setTimeout(() => {
      const timeline1 = document.getElementById("attachmentContainer");

      timeline1.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 1000);
  };
  const renderFromOptions = () => {
    let optionsToRender = [];
    for (let optionKey in metaData[0].attributes[1][0].options) {
      optionsToRender.push(
        <MenuItem key={optionKey} value={optionKey}>
          <span>{metaData[0].attributes[1][0].options[optionKey]}</span>
        </MenuItem>,
      );
    }
    return optionsToRender;
  };
  const setEmails = (type, val) => {
    let tempValue = pathOr({}, ["selectedRecords"], val);
    tempValue = Object.values(tempValue);
    if (Array.isArray(val?.idsArr)) {
      tempValue = tempValue.map((item) =>
        pathOr("", ["attributes", "email1"], item),
      );
      tempValue = tempValue.length
        ? tempValue.filter((item) => !isEmpty(item))
        : [];
      tempValue = tempValue.toString();
    }
    setOpenRelateTo(false);
    setOpenRelateCC(false);
    setOpenRelateBCC(false);
    setInitialValues({
      ...initialValues,
      [type]: initialValues[type]
        ? initialValues[type] + ", " + tempValue
        : tempValue,
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    let isFormValid = true;
    let emailObj = {
      to_addrs_names: { label: "To", value: initialValues.to_addrs_names },
      cc_addrs_names: { label: "CC", value: initialValues.cc_addrs_names },
      bcc_addrs_names: { label: "BCC", value: initialValues.bcc_addrs_names },
    };
    Object.entries(emailObj).map(([key, emailValue = ""]) => {
      if (!isEmpty(emailValue?.value)) {
        const emails = emailValue?.value.split(",");
        emails.map((email) => {
          const emailPattern =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailPattern.test(emailValue?.value)) {
            toast(
              `The address ${email} in the ${emailValue.label} field was not recognized. Please make sure that all addresses are properly formed.`,
            );
            isFormValid = false;
          }
        });
      }
    });
    if (isFormValid) {
      handleSubmit(initialValues);
    }
  };
  const handleSaveDraft = () => {
    let data = clone(initialValues);
    data.send = "0";
    handleSubmit(data);
  };

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const handleShowPreviewFile = (e, key, module = "Documents") => {
    if (!e || e === 0) {
      return;
    }
    // I've kept this example simple by using the first image instead of multiple
    let arr = e.value.split(".");
    let ext = arr[arr.length - 1].toUpperCase();
    let furl = `${site_url}/index.php?entryPoint=customDownload&id=${e.id}&type=${module}`;
    setPreviewFile({
      open: true,
      filename: e.val,
      filepath: furl,
      filetype: ext,
    });
  };

  return (
    <>
      {modalState ? (
        <MuiThemeProvider theme={getMuiTheme(theme)}>
          <Paper
            className={classes.composeBox}
            elevation={1}
            //style={{width: (!fullscreen)?`50vw`:`${isSidebarOpened?80:90}vw`,minHeight: (!fullscreen)?"70vh":"90vh",}}
            style={{ width: !fullscreen ? `50vw` : `60vw` }}
          >
            <Box className={classes.composeHeader}>
              <Typography variant="subtitle1" gutterBottom>
                {LBL_EMAIL_COMPOSE_FORM_TITLE}
              </Typography>
              <Box style={{ flexGrow: 1 }}></Box>
              {window.innerWidth < 995.95 ? null : (
                <Button
                  className={classes.fullscreenBtn}
                  onClick={() => setFullscreen(!fullscreen)}
                >
                  {!fullscreen ? <FullscreenIcon /> : <FullscreenExitIcon />}
                </Button>
              )}
              <Button
                className={classes.closePopupBtn}
                onClick={() => handleClose()}
              >
                <CloseIcon />
              </Button>
            </Box>
            <Scrollbars style={{ height: "85vh" }}>
              <form onSubmit={onSubmit} noValidate autoComplete="off">
                <Box className={classes.composeBody}>
                  <Box>
                    <FormControl style={{ display: "flex", width: "100%" }}>
                      <InputLabel>{LBL_EMAIL_COMPOSE_FROM}</InputLabel>
                      <Select
                        onChange={(e) =>
                          handleChange("from_addr_name", e.target.value)
                        }
                        fullWidth
                        style={{ textAlign: "left", zIndex: 999 }}
                        className={classes.inputField}
                        name="from_addr_name"
                        value={
                          !isEmpty(initialValues.inbound_email_id)
                            ? initialValues.inbound_email_id
                            : ""
                        }
                        //value={pathOr(initialValues.inbound_email_id?initialValues.inbound_email_id:'',[0],Object.keys(pathOr([{[initialValues.inbound_email_id?initialValues.inbound_email_id:'']:""}],[0,"attributes",1,0,"options"],metaData)))}
                      >
                        {renderFromOptions()}
                      </Select>
                    </FormControl>

                    <TextField
                      label={LBL_EMAIL_COMPOSE_TO}
                      className={classes.textArea}
                      onChange={(e) =>
                        handleChange("to_addrs_names", e.target.value)
                      }
                      name="to_addrs_names"
                      value={
                        initialValues.to_addrs_names
                          ? initialValues.to_addrs_names
                          : ""
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            {openRelateTo ? (
                              <SpeedDials
                                hidden={openRelateTo}
                                handleClose={() => setOpenRelateTo(false)}
                                type="to"
                                setEmails={(val) =>
                                  setEmails("to_addrs_names", val)
                                }
                              />
                            ) : (
                              ""
                            )}

                            <Tooltip title={LBL_EMAIL_COMPOSE_SELECT_FROM_CRM}>
                              <Button
                                onClick={() => setOpenRelateTo(!openRelateTo)}
                                className={classes.inputAdornmentBtn}
                              >
                                <SearchIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title={LBL_EMAIL_COMPOSE_ADD_CC}>
                              <Button
                                onClick={() => setOpenCC(!openCC)}
                                className={classes.inputAdornmentBtn}
                              >
                                {LBL_EMAIL_COMPOSE_CC}
                              </Button>
                            </Tooltip>
                            <Tooltip title={LBL_EMAIL_COMPOSE_ADD_BCC}>
                              <Button
                                onClick={() => setOpenBCC(!openBCC)}
                                className={classes.inputAdornmentBtn}
                              >
                                {LBL_EMAIL_COMPOSE_BCC}
                              </Button>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {openCC || initialValues["cc_addrs_names"] ? (
                      <TextField
                        id="cc"
                        label={LBL_EMAIL_COMPOSE_CC}
                        className={classes.textArea}
                        onChange={(e) =>
                          handleChange("cc_addrs_names", e.target.value)
                        }
                        name="cc_addrs_names"
                        value={
                          initialValues.cc_addrs_names
                            ? initialValues.cc_addrs_names
                            : ""
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              {openRelateCC ? (
                                <SpeedDials
                                  hidden={openRelateCC}
                                  type="cc"
                                  setEmails={(val) =>
                                    setEmails("cc_addrs_names", val)
                                  }
                                />
                              ) : (
                                ""
                              )}
                              <Tooltip
                                title={LBL_EMAIL_COMPOSE_SELECT_FROM_CRM}
                              >
                                <Button
                                  onClick={() => setOpenRelateCC(!openRelateCC)}
                                  className={classes.inputAdornmentBtn}
                                >
                                  <SearchIcon />
                                </Button>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                      />
                    ) : null}
                    {openBCC || initialValues["bcc_addrs_names"] ? (
                      <TextField
                        id="bcc"
                        label={LBL_EMAIL_COMPOSE_BCC}
                        className={classes.textArea}
                        onChange={(e) =>
                          handleChange("bcc_addrs_names", e.target.value)
                        }
                        name="bcc_addrs_names"
                        value={
                          initialValues.bcc_addrs_names
                            ? initialValues.bcc_addrs_names
                            : ""
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              {openRelateBCC ? (
                                <SpeedDials
                                  hidden={openRelateBCC}
                                  type="bcc"
                                  setEmails={(val) =>
                                    setEmails("bcc_addrs_names", val)
                                  }
                                />
                              ) : (
                                ""
                              )}
                              <Tooltip
                                title={LBL_EMAIL_COMPOSE_SELECT_FROM_CRM}
                              >
                                <Button
                                  onClick={() =>
                                    setOpenRelateBCC(!openRelateBCC)
                                  }
                                  className={classes.inputAdornmentBtn}
                                >
                                  <SearchIcon />
                                </Button>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                      />
                    ) : null}

                    <TextField
                      style={{ marginTop: 10 }}
                      label={LBL_EMAIL_COMPOSE_SUBJECT}
                      className={classes.textArea}
                      onChange={(e) => handleChange("name", e.target.value)}
                      value={initialValues.name ? initialValues.name : ""}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title={LBL_EMAIL_COMPOSE_RELATED_TO}>
                              <IconButton
                                onClick={() => setOpenRelatedTo(!openRelatedTo)}
                              >
                                <PostAddOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {openRelatedTo ||
                    (initialValues && initialValues.parent_type) ? (
                      <div style={{ margin: 8 }}>
                        <FormInput
                          variant="outlined"
                          field={metaData[0].attributes[0][1]}
                          // initialValues={initialValues}
                          value={
                            initialValues.parent ? initialValues.parent : null
                          }
                          onChange={(val) => {
                            handleChange("parent_name", val);
                          }}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </Box>

                  <Divider light />
                  <FormInput
                    height={window.innerWidth < 767 ? "35vh" : "40vh"}
                    field={{ type: "wysiwyg", name: "description", value: "" }}
                    // initialValues={initialValues}
                    value={
                      initialValues.description ? initialValues.description : ""
                    }
                    onChange={(val) => {
                      handleChange("description", val);
                    }}
                    toolbar={{
                      options: [
                        "inline",
                        "blockType",
                        "fontSize",
                        "fontFamily",
                        "list",
                        "textAlign",
                        "colorPicker",
                        "link",
                        "history",
                      ],
                      inline: { inDropdown: true },
                      list: { inDropdown: true },
                      textAlign: { inDropdown: true },
                      link: { inDropdown: true },
                    }}
                    toolbarCustomButtons={[]}
                    module={"Emails"}
                  />
                  <Divider light />
                  <Box
                    className={classes.composeAttachments}
                    id="attachmentContainer"
                  >
                    {attachedFiles && attachedFiles.length > 0 ? (
                      <>
                        {attachedFiles.map((file, key) => (
                          <Tooltip title={file.name}>
                            <ButtonGroup
                              className={classes.attachments}
                              variant="contained"
                              color="primary"
                            >
                              <Button
                                size="small"
                                color="primary"
                                variant="outlined"
                                className={classes.attachmentBtn}
                              >
                                <AttachFile />
                                {truncate(file.name, 15)}
                              </Button>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                className={classes.attachmentIconBtn}
                                onClick={() => deleteAttachment("file", key)}
                              >
                                <Close />
                              </Button>
                            </ButtonGroup>
                          </Tooltip>
                        ))}
                      </>
                    ) : (
                      ""
                    )}
                    {attachedDocuments && attachedDocuments.length > 0 ? (
                      <>
                        {attachedDocuments.map((file, key) => (
                          <Tooltip title={file.value}>
                            <ButtonGroup
                              className={classes.attachments}
                              variant="contained"
                              color="primary"
                            >
                              <Button
                                size="small"
                                color="primary"
                                variant="outlined"
                                className={classes.attachmentBtn}
                              >
                                <LinkIcon />
                                {truncate(file.value, 15)}
                              </Button>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                className={classes.attachmentIconBtn}
                                onClick={() => handleShowPreviewFile(file, key)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </Button>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                className={classes.attachmentIconBtn}
                                onClick={() =>
                                  deleteAttachment("document", key)
                                }
                              >
                                <Close />
                              </Button>
                            </ButtonGroup>
                          </Tooltip>
                        ))}
                      </>
                    ) : (
                      ""
                    )}
                    {attachedNotes && attachedNotes.length > 0 ? (
                      <>
                        {attachedNotes.map((file, key) => (
                          <Tooltip title={file.value}>
                            <ButtonGroup
                              className={classes.attachments}
                              variant="contained"
                              color="primary"
                            >
                              <Button
                                size="small"
                                color="primary"
                                variant="outlined"
                                className={classes.attachmentBtn}
                              >
                                <LinkIcon />
                                {truncate(file.value, 15)}
                              </Button>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                className={classes.attachmentIconBtn}
                                onClick={() =>
                                  handleShowPreviewFile(file, key, "Notes")
                                }
                              >
                                <VisibilityIcon fontSize="small" />
                              </Button>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                className={classes.attachmentIconBtn}
                                onClick={() => deleteAttachment("note", key)}
                              >
                                <Close />
                              </Button>
                            </ButtonGroup>
                          </Tooltip>
                        ))}
                      </>
                    ) : null}
                  </Box>
                </Box>
                <Divider light />
                <Box className={classes.composeFooter}>
                  <Button
                    className={classes.sendButton}
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={
                      emailSubmitLoader ||
                      isNil(initialValues.from_addr_name) ||
                      isEmpty(initialValues.from_addr_name) ||
                      ![
                        initialValues.to_addrs_names,
                        initialValues.cc_addrs_names,
                        initialValues.bcc_addrs_names,
                      ].some((v) => !isNil(v) && !isEmpty(v))
                    }
                    startIcon={
                      emailSubmitLoader && <CircularProgress size={16} />
                    }
                  >
                    {LBL_EMAIL_COMPOSE_SEND_BUTTON}
                  </Button>

                  <Tooltip title={LBL_EMAIL_COMPOSE_ATTACH_FILES}>
                    <IconButton onClick={handleAttach}>
                      <AttachFileIcon />
                      <input
                        type="file"
                        accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*"
                        style={{ display: "none" }}
                        multiple={true}
                        onChange={(e) => validateAndChange(e.target.files, e)}
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        className={classes.fileInput}
                        ref={fileInputRef}
                      />
                    </IconButton>
                  </Tooltip>

                  <FormInput
                    field={{ type: "relate" }}
                    // initialValues={initialValues}
                    value=""
                    isIconBtn={true}
                    btnIcon={<LinkIcon />}
                    module="Documents"
                    view="ComposeEmail"
                    tooltipTitle={LBL_EMAIL_COMPOSE_ATTACH_DOCUMENTS}
                    onChange={(val) => {
                      addDocument(val);
                    }}
                  />

                  <FormInput
                    field={metaData[0].attributes[0][0]}
                    // initialValues={initialValues}
                    value={
                      initialValues.description ? initialValues.description : ""
                    }
                    module="EmailTemplates"
                    isIconBtn={true}
                    btnIcon={<TheatersIcon />}
                    onChange={(val) => {
                      handleChange("emails_email_templates_name", val);
                    }}
                    tooltipTitle={LBL_EMAIL_COMPOSE_SELECT_EMAIL_TEMPLATE}
                  />

                  {/* {
                  <Tooltip title={LBL_EMAIL_SAVE_DRAFT}>
                    <IconButton onClick={() => handleSaveDraft()}>
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                } */}
                  {
                    // <Tooltip title="Disregard Draft">
                    //   <IconButton>
                    //     <DeleteIcon />
                    //   </IconButton>
                    // </Tooltip>
                  }
                </Box>
              </form>
            </Scrollbars>
          </Paper>
          {previewFile.open ? (
            <FileViewerComp
              previewFile={previewFile}
              setPreviewFile={setPreviewFile}
            />
          ) : (
            ""
          )}
        </MuiThemeProvider>
      ) : (
        ""
      )}
    </>
  );
};

// EmailForm.propTypes = {
//   className: PropTypes.string
// };

export default EmailForm;