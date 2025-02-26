import React, { useMemo, useRef, useState } from "react";
import useComposeViewData from "./hooks/useComposeViewData";
import CustomDialog from "@/components/SharedComponents/CustomDialog";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
} from "@material-ui/core";
import PostAddIcon from "@material-ui/icons/PostAdd";
import useStyles from "./styles";
import CustomFormInput from "../CustomFormInput";
import { isEmpty, isNil, pathOr } from "ramda";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import CustomCircularProgress from "../SharedComponents/CustomCircularProgress";
import {
  LBL_CLOSE_BUTTON_TITLE,
  LBL_COMPOSE_VALIDATION_MSG,
  LBL_EMAIL_COMPOSE_ADD_BCC,
  LBL_EMAIL_COMPOSE_ADD_CC,
  LBL_EMAIL_COMPOSE_ATTACH_DOCUMENTS,
  LBL_EMAIL_COMPOSE_ATTACH_FILES,
  LBL_EMAIL_COMPOSE_BCC,
  LBL_EMAIL_COMPOSE_CC,
  LBL_EMAIL_COMPOSE_FORM_TITLE,
  LBL_EMAIL_COMPOSE_RELATED_TO,
  LBL_EMAIL_COMPOSE_SEND_BUTTON,
  LBL_EMAIL_SAVE_DRAFT,
  LBL_MAXIMIZE,
  LBL_MINIMIZE,
  LBL_REPLACE_EMAIL_BODY_MSG,
  LBL_WARNING_TITLE,
} from "@/constant";
import DescriptionIcon from "@material-ui/icons/Description";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CloseIcon from "@material-ui/icons/Close";
import { truncate, validateFile } from "@/common/utils";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import { Alert } from "..";
import useCommonUtils from "@/hooks/useCommonUtils";
import { toast } from "react-toastify";

const documentsField = {
  field_key: "documents",
  name: "documents",
  label: "Attach Documents",
  type: "relate",
  comment: "Add Documents",
  module: "Documents",
  icon: "template-add",
};

const ComposeEmail = ({ open = false, handleClose }) => {
  const classes = useStyles();
  const isMobileViewCheck = useIsMobileView();
  const attachmentRef = useRef(null);
  const { emailLoading, formValues, sendLoading, actions, layoutData } =
    useComposeViewData((state) => ({
      emailLoading: state.emailLoading,
      formValues: state.formValues,
      sendLoading: state.sendLoading,
      actions: state.actions,
      layoutData: state.layoutData,
    }));
  const isSendDisabled =
    sendLoading ||
    isEmpty(formValues?.to_addrs_names) ||
    isEmpty(formValues?.from_addr_name);
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };
  const renderFooterContent = useMemo(() => {
    return (
      <Grid container justifyContent="space-between" alignItems="center">
        <EmailToolbar attachmentRef={attachmentRef} />
        <Tooltip
          title={LBL_COMPOSE_VALIDATION_MSG}
          disableFocusListener={!isSendDisabled}
          disableTouchListener={!isSendDisabled}
          disableHoverListener={!isSendDisabled}
        >
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              className={classes.sendBtn}
              disabled={isSendDisabled}
              onClick={() => actions.sendEmail(handleClose)}
            >
              <span className={classes.sendText}>
                {LBL_EMAIL_COMPOSE_SEND_BUTTON}
              </span>
              {sendLoading ? (
                <CustomCircularProgress size={16} />
              ) : (
                <SendIcon className={classes.smallIcon} />
              )}
            </Button>
          </Grid>
        </Tooltip>
      </Grid>
    );
  }, [isSendDisabled]);
  return (
    <CustomDialog
      isDialogOpen={open}
      titleStyle={{
        padding: "8px 16px",
      }}
      fullScreen={isMobileViewCheck ? true : false}
      PaperProps={{
        style: {
          borderRadius: "8px",
          color: "#0071d2",
        },
      }}
      isLoading={emailLoading}
      bodyContent={<ComposeEmailBody attachmentRef={attachmentRef} />}
      bottomActionContent={renderFooterContent}
      title={
        <DialogTitle
          classes={classes}
          handleExpandClick={handleExpandClick}
          isExpanded={isExpanded}
          handleClose={handleClose}
        />
      }
      maxWidth={!isExpanded ? "md" : "lg"}
    />
  );
};

const ComposeEmailBody = ({ attachmentRef }) => {
  return (
    <>
      <EmailFromInputComponent />
      <EmailToInputComponent />
      <EmailToSubjectComponent />
      <EmailToDescriptionComponent />
      <EmailAttachmentComponent attachmentRef={attachmentRef} />
    </>
  );
};

const DialogTitle = ({
  classes,
  handleExpandClick,
  isExpanded,
  handleClose = () => {},
}) => {
  const isMobileViewCheck = useIsMobileView();
  const { formValues, actions } = useComposeViewData((state) => ({
    formValues: state.formValues,
    actions: state.actions,
  }));
  const onClose = () => {
    actions.resetFormValues();
    handleClose();
  };
  return (
    <div className={classes.heading}>
      <Typography className={classes.title}>
        {LBL_EMAIL_COMPOSE_FORM_TITLE}
      </Typography>
      <div>
        {isMobileViewCheck ? null : (
          <>
            <Tooltip title={LBL_EMAIL_SAVE_DRAFT}>
              <IconButton
                className={classes.titleIcon}
                onClick={() => {
                  actions.addToDraft(formValues);
                  handleClose("draft");
                }}
              >
                <ExpandMoreIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title={isExpanded ? LBL_MINIMIZE : LBL_MAXIMIZE}>
              <IconButton
                className={classes.titleIcon}
                onClick={handleExpandClick}
              >
                {isExpanded ? (
                  <FullscreenExitIcon color="primary" />
                ) : (
                  <FullscreenIcon color="primary" />
                )}
              </IconButton>
            </Tooltip>
          </>
        )}
        <Tooltip title={LBL_CLOSE_BUTTON_TITLE}>
          <IconButton className={classes.titleIcon} onClick={onClose}>
            <CloseIcon color="primary" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

const EmailFromInputComponent = () => {
  const { fieldData, actions, formValues } = useComposeViewData((state) => ({
    fieldData: state.layoutData?.from_addr_name,
    actions: state.actions,
    formValues: state.formValues,
  }));
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  let [value, setValue] = useState(null);
  const toggleAlert = (val) => {
    setIsAlertOpen(!isAlertOpen);
    if (val) {
      setValue(val);
    }
  };
  const handleOnChange = (isBodyReset) => {
    actions.handleOnChange(fieldData?.name, value, {}, isBodyReset);
    toggleAlert(null);
  };
  return (
    <>
      <Alert
        title={LBL_WARNING_TITLE}
        msg={LBL_REPLACE_EMAIL_BODY_MSG}
        open={isAlertOpen}
        handleClose={toggleAlert}
        onAgree={() => handleOnChange(true)}
        onDisagree={() => handleOnChange(false)}
      />
      <CustomInputWrapper
        control={null}
        fieldMetaObj={fieldData}
        onChange={(val) => {
          if (val) {
            toggleAlert(val);
          } else {
            actions.handleOnChange(fieldData?.name, "");
          }
        }}
      />
    </>
  );
};

const EmailToInputComponent = () => {
  const classes = useStyles();
  const { layoutData, formValues, actions } = useComposeViewData((state) => ({
    layoutData: state.layoutData,
    formValues: state.formValues,
    actions: state.actions,
  }));
  const fieldMetaObj = pathOr({}, ["to_addrs_names"], layoutData);
  const [emailButtonsState, setEmailButtonsState] = useState({
    CCButtonVisible: false,
    BCCButtonVisible: false,
  });
  const handleOnButtonState = (buttonType) => {
    setEmailButtonsState((v) => {
      v[buttonType] = !v[buttonType];
      return { ...v };
    });
  };

  return (
    <>
      <CustomInputWrapper
        control={null}
        fieldMetaObj={fieldMetaObj}
        isGroupedOptions={true}
        onChange={(value) => {
          actions.handleOnChange(
            fieldMetaObj?.name,
            value.value,
            value.options,
          );
        }}
      />
      <div className={classes.toButtons}>
        <Tooltip title={LBL_EMAIL_COMPOSE_ADD_CC}>
          <span onClick={() => handleOnButtonState("CCButtonVisible")}>
            {LBL_EMAIL_COMPOSE_CC}
          </span>
        </Tooltip>
        <Tooltip title={LBL_EMAIL_COMPOSE_ADD_BCC}>
          <span onClick={() => handleOnButtonState("BCCButtonVisible")}>
            {LBL_EMAIL_COMPOSE_BCC}
          </span>
        </Tooltip>
      </div>
      {!!emailButtonsState?.CCButtonVisible ||
      !isEmpty(formValues?.cc_addrs_names) ? (
        <CustomInputWrapper
          control={null}
          isGroupedOptions={true}
          fieldMetaObj={fieldMetaObj?.cc_addrs_names}
          onChange={(value) => {
            actions.handleOnChange(
              fieldMetaObj?.cc_addrs_names?.name,
              value.value,
              value.options,
            );
          }}
        />
      ) : null}
      {!!emailButtonsState?.BCCButtonVisible ||
      !isEmpty(formValues?.bcc_addrs_names) ? (
        <CustomInputWrapper
          control={null}
          isGroupedOptions={true}
          fieldMetaObj={fieldMetaObj?.bcc_addrs_names}
          onChange={(value) => {
            actions.handleOnChange(
              fieldMetaObj?.bcc_addrs_names?.name,
              value.value,
              value.options,
            );
          }}
        />
      ) : null}
    </>
  );
};

const EmailToSubjectComponent = () => {
  const { formValues, layoutData } = useComposeViewData((state) => ({
    formValues: state.formValues,
    layoutData: state.layoutData,
  }));
  const fieldMetaObj = pathOr({}, ["name"], layoutData);
  const [emailRelateState, setEmailRelateState] = useState(
    !isEmpty(formValues?.[fieldMetaObj?.relateField?.name]?.parent_id),
  );
  const handleOnButtonState = () => {
    setEmailRelateState((v) => !v);
  };
  const classes = useStyles();
  return (
    <Box>
      <CustomInputWrapper
        control={null}
        fieldMetaObj={fieldMetaObj}
        customProps={{
          field: {
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  <ButtonGroup>
                    <Tooltip title={LBL_EMAIL_COMPOSE_RELATED_TO}>
                      <IconButton
                        size="small"
                        onClick={handleOnButtonState}
                        className={classes.btn}
                        style={{ position: "relative", left: "30px" }}
                      >
                        <AssignmentIcon />
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                </InputAdornment>
              ),
            },
          },
        }}
        value={formValues?.[fieldMetaObj?.name]}
      />
      {emailRelateState ? (
        <CustomInputWrapper
          control={null}
          fieldMetaObj={fieldMetaObj?.relateField}
        />
      ) : null}
    </Box>
  );
};

const EmailToDescriptionComponent = () => {
  const isMobileViewCheck = useIsMobileView();
  const { layoutData } = useComposeViewData((state) => ({
    layoutData: state.layoutData,
  }));
  return (
    <CustomInputWrapper
      control={null}
      fieldMetaObj={layoutData?.email_description}
      height={isMobileViewCheck ? 500 : 300}
    />
  );
};

const CustomInputWrapper = ({ fieldMetaObj, onChange, ...rest }) => {
  const { formValues, actions } = useComposeViewData((state) => ({
    formValues: state.formValues,
    actions: state.actions,
  }));
  const defaultHandleChange = (value) => {
    actions.handleOnChange(fieldMetaObj?.name, value);
  };
  return (
    <Box p={0.5}>
      <CustomFormInput
        {...rest}
        value={formValues?.[fieldMetaObj?.name]}
        fieldMetaObj={fieldMetaObj}
        onChange={onChange ?? defaultHandleChange}
        fieldState={{
          disabled: fieldMetaObj?.disabled,
          required: fieldMetaObj?.required,
        }}
      />
    </Box>
  );
};

const EmailToolbar = (props) => {
  const { attachmentRef } = props;
  const { formValues, actions } = useComposeViewData((state) => ({
    formValues: state.formValues,
    actions: state.actions,
  }));
  const { maxUploadLimit, minUploadLimit } = useCommonUtils();
  const fileInputRef = useRef(null);

  const handleAttach = () => {
    fileInputRef.current.click();
  };

  const onChange = (fieldName, value) => {
    actions.handleOnChange(fieldName, [...formValues[fieldName], ...value]);
    setTimeout(() => {
      attachmentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 1000);
  };

  const getBase64 = (file, cb) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve({ file_name: file.name, file_content: reader.result });
      reader.onerror = (error) => reject(error);
    });
  };

  const addAttachment = async (files) => {
    let validFiles = {};
    let error = null;
    let errorFiles = [];

    Object.values(files).filter((file, i) => {
      const tempErr = validateFile(file, maxUploadLimit, null, minUploadLimit);
      error = tempErr ?? error;
      if (tempErr) {
        errorFiles.push(file.name);
      } else {
        validFiles[i] = file;
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
    validFiles = await Promise.all(Object.values(validFiles).map(getBase64));
    onChange("attachments", validFiles);
  };

  return (
    <Grid
      item
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <Tooltip title={LBL_EMAIL_COMPOSE_ATTACH_FILES}>
        <IconButton onClick={handleAttach}>
          <AttachFileIcon />
          <input
            type="file"
            accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*"
            style={{ display: "none" }}
            multiple={true}
            onChange={(e) => addAttachment(e.target.files)}
            onClick={(event) => {
              event.target.value = null;
            }}
            ref={fileInputRef}
          />
        </IconButton>
      </Tooltip>
      <CustomFormInput
        {...props}
        onChange={(value) => {
          let valueArr = [];
          Object.values(value.selectedRecords).map((record) => {
            valueArr.push({
              id: record?.id,
              file_name: pathOr("", ["attributes", "document_name"], record),
            });
          });
          onChange(documentsField.name, valueArr);
        }}
        control={null}
        fieldMetaObj={documentsField}
        customProps={{
          multiSelect: true,
          isIconBtn: true,
          btnIcon: <PostAddIcon />,
        }}
      />
    </Grid>
  );
};

const EmailAttachmentComponent = ({ attachmentRef }) => {
  const classes = useStyles();
  const { formValues, actions } = useComposeViewData((state) => ({
    formValues: state.formValues,
    actions: state.actions,
  }));

  const renderAttachments = (files = [], type = "") => {
    return files.map((file, index) => {
      return (
        <Tooltip title={file.file_name || file.filename}>
          <div className={classes.attachmentBox}>
            {type == "documents" ? (
              <DescriptionIcon className={classes.docIcon} />
            ) : (
              <AttachFileIcon className={classes.docIcon} />
            )}
            <span>{truncate(file.file_name || file.filename, 12)}</span>
            <CloseIcon
              color="action"
              onClick={() => {
                let value = files.filter((_, i) => i !== index);
                actions.handleOnChange(type, value);
              }}
              className={classes.smallIcon}
            />
          </div>
        </Tooltip>
      );
    });
  };

  return (
    <div className={classes.documentBox} ref={attachmentRef}>
      {isEmpty(formValues?.attachments)
        ? null
        : renderAttachments(formValues?.attachments, "attachments")}
      {isEmpty(formValues?.documents)
        ? null
        : renderAttachments(formValues?.documents, "documents")}
    </div>
  );
};

export default ComposeEmail;
