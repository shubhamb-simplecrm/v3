import React, { useRef, Fragment, useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import useStyles from "./styles";
import { isEmpty } from "ramda";
import { LBL_MAX_FILE_UPLOAD_LIMIT } from "../../../constant";
import FileItemList from "./components/file-item-list";
import Compressor from "compressorjs";
import { toast } from "react-toastify";
import useCommonUtils from "@/hooks/useCommonUtils";
import { validateFile } from "@/common/utils";

const FileUploadMultiple = ({
  field,
  onChange,
  errors = {},
  value = [],
  small = false,
  variant = "outlined",
  module,
}) => {
  const classes = useStyles();
  const [error, setError] = useState([]);
  const [files, setFiles] = useState([]);
  const fileField = useRef(null);

  // error resolve, causing issue is field types(file, image) have different responses
  const { maxUploadLimit, minUploadLimit } = useCommonUtils();
  let iserror = errors[field.name] ? true : false;
  const maxFileUploadLimit = 5;
  const compressImages = (file) => {
    let imageTypeArr = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    let tempCompressFile = file;
    if (file && file?.type && imageTypeArr.includes(file?.type)) {
      if (file?.size > 1048576) {
        new Compressor(file, {
          quality: 0.7,
          success(result) {
            tempCompressFile = result;
          },
          error(err) {},
        });
      }
    }
    return tempCompressFile;
  };
  const validateAndChange = async (inputFiles) => {
    const fileArr = Array.from(inputFiles);
    if (isEmpty(fileArr)) return;
    if ([...files, ...fileArr].length > maxFileUploadLimit) {
      toast(LBL_MAX_FILE_UPLOAD_LIMIT);
      return;
    }
    const tempFiles = [];
    let err = null;
    fileArr.forEach(async (file) => {
      err = validateFile(file, maxUploadLimit, file?.type, minUploadLimit);
      if (err) {
        setError([...error, err]);
        return;
      }
      // file only compress if file size is more than 1MB of size.
      const compressFile = compressImages(file);

      const responseObj = {
        id: null,
        name: compressFile.name,
        fileContent: compressFile,
        isFileUploaded: false,
        isNewFile: true,
      };
      tempFiles.push(responseObj);
    });
    if (!err) {
      // use slice function to add file upload limit
      setFiles([...files, ...tempFiles]);
    }
  };

  useEffect(() => {
    setFiles(value);
  }, [value]);

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: 10,
        }}
      >
        <Button
          className={iserror ? classes.errorFile : ""}
          variant="outlined"
          component="label"
          id={field.name}
          name={field.name}
          size={small ? "small" : "large"}
          color="primary"
          disabled={files.length >= maxFileUploadLimit}
        >
          Upload Documents
          <input
            type="file"
            error={iserror}
            name={field.name}
            variant={variant}
            style={{ display: "none" }}
            onChange={(e) => validateAndChange(e.target.files)}
            ref={fileField}
            multiple
          />
        </Button>
      </div>
      <FileItemList module={module} files={files} onChange={onChange} />
    </Fragment>
  );
};

export default FileUploadMultiple;
