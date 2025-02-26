import React, { useRef, Fragment, useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { AttachFile } from "@material-ui/icons";
import useStyles from "./styles";
import { isEmpty, isNil, pathOr } from "ramda";
import { useSelector } from "react-redux";
import {
  LBL_REQUIRED_FIELD,
  LBL_UPLOAD_BUTTON_TITLE,
  LBL_UPLOAD_REMOVE_BUTTON,
} from "../../../constant";
import Compressor from "compressorjs";
import useCommonUtils from "@/hooks/useCommonUtils";
import { validateFile } from "@/common/utils";

const FileUpload = ({
  field,
  onChange,
  errors = {},
  value = [],
  small = false,
  variant = "outlined",
}) => {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const fileField = useRef(null);
  const tempFileName =
    field.type == "file"
      ? pathOr("", [0, "name"], value)
      : pathOr(value, ["name"], value);
  // error resolve, causing issue is field types(file, image) have different responses
  const [fileName, setFileName] = useState(tempFileName);
  const [TextValue, setTextValue] = useState(false);
  const { maxUploadLimit, minUploadLimit } = useCommonUtils();

  useEffect(() => {
    const data = getFieldLabel();
    if (data.props.children[0] === fileName) {
      setTextValue(true);
    } else {
      setTextValue(false);
    }
  }, [fileName]);

  let iserror = errors[field.name] ? true : false;
  const getFieldLabel = () => {
    if (typeof fileName === "string" && fileName !== "") {
      return (
        <span className={classes.fileName}>
          {fileName}{" "}
          {field.required || errors[field.name] === LBL_REQUIRED_FIELD
            ? "*"
            : ""}
        </span>
      );
    } else {
      return (
        <>
          <span>
            {!!field.label ? field.label : "Choose File"}
            {field.required === "true" ||
            errors[field.name] === LBL_REQUIRED_FIELD
              ? "*"
              : ""}
          </span>
          <AttachFile />
        </>
      );
    }
  };

  const validateAndChange = async (file) => {
    setError(null);
    const filename = file?.name;
    const dotIndex = filename.lastIndexOf(".");
    let namePart = filename.substring(0, dotIndex).replace(/\./g, "_");
    if (isEmpty(namePart) || isNil(namePart)) {
      const currentDate = new Date().toJSON().slice(0, 10);
      namePart = currentDate;
    }
    const extensionPart = filename.substring(dotIndex);
    const replacedFilename = namePart + extensionPart;
    const blob = file.slice(0, file.size, file.type);
    const inputFile = new File([blob], replacedFilename, { type: file.type });
    setFileName(inputFile.name);
    let err = validateFile(file, maxUploadLimit, file?.type, minUploadLimit);
    if (err) {
      setError([...error, err]);
      return;
    }
    if (inputFile?.size > 1048576) {
      const r = new Compressor(inputFile, {
        quality: 0.7,
        success(result) {
          onChange(result);
        },
        error(err) {},
      });
    } else {
      onChange(inputFile);
    }
  };

  const removeFile = () => {
    setFileName("");
    onChange("");
    setError(null);
    delete errors[field.name];
    fileField.current.value = null;
  };

  useEffect(() => {
    const newFileName =
      field.type == "file"
        ? pathOr("", [0, "name"], value)
        : pathOr(pathOr(value, [0, "name"], value), ["name"], value);
    if (fileName !== newFileName) {
      setFileName(newFileName);
    }
  }, [value]);

  return (
    <Fragment>
      <Button
        className={iserror ? classes.errorFile : ""}
        variant="outlined"
        component="label"
        id={field.name}
        name={field.name}
        size={small ? "small" : "large"}
        color="primary"
        fullWidth
        disabled={
          errors[field.name] == "ReadOnly" || fileName !== "" ? true : false
        }
      >
        {getFieldLabel()}
        <input
          type="file"
          error={iserror}
          required={!TextValue ? true : false}
          name={field.name}
          variant={variant}
          // helperText={errors[field.name] ? errors[field.name] : null}
          style={{ display: "none" }}
          onChange={(e) => validateAndChange(e.target.files[0])}
          ref={fileField}
        />
      </Button>
      {fileName !== "" ? (
        <span className={classes.removeBtn} onClick={() => removeFile()}>
          {LBL_UPLOAD_REMOVE_BUTTON}
        </span>
      ) : null}
      {error && <span className={classes.error}>{error}</span>}
      <span className={classes.error}>
        {errors[field.name] && errors[field.name] !== "ReadOnly"
          ? errors[field.name]
          : null}
      </span>
    </Fragment>
  );
};

export default FileUpload;
