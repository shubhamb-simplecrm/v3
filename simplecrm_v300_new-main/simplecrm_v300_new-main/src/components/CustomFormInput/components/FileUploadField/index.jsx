import React, { useRef, useState, useCallback, memo } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@material-ui/core";
import Compressor from "compressorjs";
import { AttachFile } from "@material-ui/icons";
import PropTypes from "prop-types";
import useStyles from "../styles";
import useCommonUtils from "@/hooks/useCommonUtils";
import clsx from "clsx";
import { LBL_UPLOAD_REMOVE_BUTTON } from "@/constant";
import { isEmpty, pathOr } from "ramda";
import FileItemList from "./components/FileItemList";
import Tooltip from "@/components/SharedComponents/Tooltip";
import { validateFile } from "@/common/utils";

const splitFilenameAndModified = (filename) => {
  const parts = filename.split(".");
  const extension = parts.pop();
  const baseName = parts.join("_");
  if (!!extension) {
    return `${baseName}.${extension}`;
  }
  return `${baseName}`;
};
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve({
        name: splitFilenameAndModified(file.name),
        file_content: reader.result,
      });
    reader.onerror = (error) => reject(error);
  });
};

const processFile = async (file, maxUploadLimit, onChange) => {
  if (
    ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type) &&
    file.size > 1048576
  ) {
    return new Promise((resolve) => {
      new Compressor(file, {
        quality: 0.7,
        success: (compressedFile) =>
          convertToBase64(compressedFile).then(onChange).then(resolve),
        error: () => convertToBase64(file).then(onChange).then(resolve),
      });
    });
  } else {
    return convertToBase64(file).then(onChange);
  }
};
const FileInputLabel = memo(({ fileName, classes = {} }) => (
  <>
    <span className={classes?.fileInputValue}>
      {!!fileName ? fileName : "Choose File"}
    </span>
    <AttachFile />
  </>
));

const FileUploadField = ({
  fieldMetaObj,
  onChange,
  value,
  size,
  variant,
  fullWidth,
  fieldState,
  moduleMetaData,
  customProps,
}) => {
  const classes = useStyles();
  const fileName = !!fieldMetaObj?.multi
    ? null
    : typeof Array.isArray(value)
      ? pathOr(null, [0, "name"], value)
      : pathOr(null, ["name"], value);
  const [validationError, setValidationError] = useState([]);
  const [multiFiles, setMultiFiles] = useState(value || []);
  const { maxUploadLimit, minUploadLimit } = useCommonUtils();

  const fileFieldRef = useRef(null);

  const handleFileChange = useCallback(
    async (event) => {
      const uploadedFiles = [];
      const uploadedValidationsErrors = [];
      const inputFiles = event.target.files;
      for (let file of inputFiles) {
        const fileValidationError = validateFile(
          file,
          maxUploadLimit,
          fieldMetaObj?.type,
          minUploadLimit,
        );
        if (fileValidationError) {
          uploadedValidationsErrors.push(fileValidationError);
          onChange([]);
        } else {
          await processFile(file, maxUploadLimit, (processedFile) => {
            uploadedFiles.push(processedFile);
          });
        }
      }
      if (uploadedValidationsErrors.length > 0) {
        setValidationError(uploadedValidationsErrors);
      } else {
        if (!!fieldMetaObj?.multi) {
          setMultiFiles((prev) => [...prev, ...uploadedFiles]);
        } else {
          onChange(uploadedFiles);
        }
        setValidationError([]);
      }
      fileFieldRef.current.value = null;
    },
    [maxUploadLimit, fieldMetaObj, onChange, value],
  );

  const removeFile = useCallback(() => {
    onChange(null);
    setValidationError([]);
    fileFieldRef.current.value = null;
  }, [onChange]);
  const handleMultiFileChanges = useCallback(
    (input) => {
      onChange(input);
      setValidationError([]);
      setMultiFiles([...input]);
      fileFieldRef.current.value = null;
    },
    [onChange, setMultiFiles],
  );
  return (
    <>
      <Tooltip title={fieldMetaObj.comment}>
        <FormControl
          error={!isEmpty(validationError) || !!fieldState?.error}
          required={fieldState?.required}
          size={size}
          variant={variant}
          fullWidth={fullWidth}
        >
          <InputLabel
            shrink={true}
            color="secondary"
            className={classes.fileInputLabel}
          >
            {fieldMetaObj?.label}
          </InputLabel>
          <Button
            className={clsx(
              classes.uploadButton,
              (!isEmpty(validationError) || !!fieldState?.error) &&
                classes.errorFile,
            )}
            variant="outlined"
            component="label"
            id={fieldMetaObj?.name}
            name={fieldMetaObj?.name}
            size={"medium"}
            // size={size}
            color="primary"
            fullWidth={fullWidth}
            disabled={fieldState.disabled}
          >
            <FileInputLabel classes={classes} fileName={fileName} />
            <input
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              ref={fileFieldRef}
              multiple={!!fieldMetaObj?.multi}
            />
          </Button>
          <FormHelperText className={classes.fileUploadHelperText}>
            {validationError.length > 0 && (
              <FormHelperText>{validationError.join(", ")}</FormHelperText>
            )}
            {fieldState?.helperText}
            {fileName && (
              <span className={classes.removeBtn} onClick={removeFile}>
                {LBL_UPLOAD_REMOVE_BUTTON}
              </span>
            )}
          </FormHelperText>
        </FormControl>
      </Tooltip>
      {fieldMetaObj?.multi && (
        <FileItemList
          files={multiFiles}
          onChange={onChange}
          customProps={customProps}
          moduleMetaData={moduleMetaData}
          handleMultiFileChanges={handleMultiFileChanges}
        />
      )}
    </>
  );
};
FileUploadField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  size: PropTypes.string,
  variant: PropTypes.string,
  fullWidth: PropTypes.bool,
  customProps: PropTypes.object,
};

FileUploadField.defaultProps = {
  onChange: () => {},
  value: null,
  size: "small",
  variant: "outlined",
  fullWidth: true,
};

export default FileUploadField;
