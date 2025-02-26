import React from "react";
import useStyles from "./../styles";
import { isEmpty, isNil, pathOr } from "ramda";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useFilePreviewer } from "../../../context/FilePreviewContext";
import { IconButton } from "@/components/SharedComponents/IconButton";
import { getFileExtension } from "@/common/utils";
import { LBL_NO_FILE_MSG } from "@/constant";

export const FileLabel = (props) => {
  const { listDataLabel, formData, fieldValue, moduleName, customArgs } = props;
  const classes = useStyles();
  const { tableMeta } = customArgs;
  const disableIcon = isEmpty(fieldValue) || isNil(fieldValue);
  const { onFileDialogStateChange } = useFilePreviewer();
  const recordId = pathOr(
    "",
    [pathOr("", ["rowIndex"], tableMeta), "id"],
    formData,
  );
  const ACLAccess = pathOr(
    "",
    [pathOr("", ["rowIndex"], tableMeta), "attributes", "ACLAccess"],
    formData,
  );
  const fileName = pathOr(
    fieldValue,
    [pathOr("", ["rowIndex"], tableMeta), "attributes", "filename"],
    formData,
  );
  let requestURL = `/index.php?entryPoint=customDownload&id=${recordId}&type=${moduleName}&field_id=${listDataLabel?.name}`;
  const handleShowFilePreview = (inputFileName, inputFileURL) => {
    onFileDialogStateChange(
      true,
      {
        fileName: inputFileName,
        filePath: inputFileURL,
        fileType: getFileExtension(inputFileName),
      },
      true,
    );
  };
  return (
    <IconButton
      tooltipTitle={disableIcon ? LBL_NO_FILE_MSG : fileName}
      fontSize="small"
      onClick={() => handleShowFilePreview(fileName, requestURL)}
      disabled={!ACLAccess?.download || disableIcon}
      color={"secondary"}
    >
      <VisibilityIcon />
    </IconButton>
  );
};
