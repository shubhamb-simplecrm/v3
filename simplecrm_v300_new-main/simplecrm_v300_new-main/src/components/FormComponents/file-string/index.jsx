import React from "react";
import useStyles from "./styles";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import {
  checkMaskingCondition,
  getFileExtension,
  truncate,
} from "../../../common/utils";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { LBL_DOWNLOAD_INPROGRESS } from "../../../constant";
import { useFilePreviewer } from "@/context/FilePreviewContext";
import useCommonUtils from "@/hooks/useCommonUtils";
import { IconButton } from "@/components/SharedComponents/IconButton";
import { pathOr } from "ramda";
import Link from "@/components/SharedComponents/Link";
const FileString = ({
  value,
  module,
  recordId,
  field_id,
  fieldConfiguratorData = {},
  recordInfo = {},
}) => {
  const { onFileDialogStateChange } = useFilePreviewer();
  const classes = useStyles();
  const { siteUrl } = useCommonUtils();
  const downloadACL = pathOr(0, ["ACLAccess", "download"], recordInfo);
  let furl = `${siteUrl}/index.php?entryPoint=customDownload&id=${recordId}&type=${module}&field_id=${field_id}`;
  const handleShowPreviewFile = (fname, url) => {
    onFileDialogStateChange(
      true,
      {
        fileName: fname,
        filePath: url,
        fileType: getFileExtension(fname),
      },
      true,
    );
  };

  const valueData = checkMaskingCondition(
    fieldConfiguratorData,
    { [field_id]: value },
    "masking",
  );
  value = valueData[field_id];

  return (
    <>
      <Link
        className={classes.fileNameLinkTxt}
        disabled={!downloadACL}
        onClick={
          !downloadACL
            ? null
            : () => {
                saveAs(furl, value);
                toast(LBL_DOWNLOAD_INPROGRESS);
              }
        }
        variant="body2"
        id={field_id}
      >
        {truncate(value, 20)}
      </Link>

      {value ? (
        <IconButton
          tooltipTitle={value}
          fontSize="small"
          onClick={() => handleShowPreviewFile(value, furl)}
          disabled={!downloadACL}
          color={"secondary"}
        >
          <VisibilityIcon />
        </IconButton>
      ) : (
        ""
      )}
    </>
  );
};

export default FileString;
