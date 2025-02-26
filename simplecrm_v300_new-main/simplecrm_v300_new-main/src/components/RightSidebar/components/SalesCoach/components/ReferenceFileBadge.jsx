import { truncate } from "@/common/utils";
import { useFilePreviewer } from "@/context/FilePreviewContext";
import { Chip } from "@material-ui/core";

import DescriptionIcon from "@material-ui/icons/Description";

const ReferenceFileBadge = ({ fileName, fileId, modelMetaData }) => {
  const { onFileDialogStateChange } = useFilePreviewer();
  let furl = `${modelMetaData?.base_url}/download-file?document_id=${fileId}&user_id=${modelMetaData.user_id}`;

  const handleShowPreviewFile = (fname, url) => {
    let arr = fname.split(".");
    let ext = arr[arr.length - 1].toUpperCase();
    onFileDialogStateChange(
      true,
      {
        fileName: fname,
        filePath: url,
        fileType: ext,
      },
      false,
    );
  };
  return (
    <Chip
      style={{
        marginTop: 3,
        marginBottom: 3,
      }}
      onClick={() => handleShowPreviewFile(fileName, furl)}
      deleteIcon={<DescriptionIcon />}
      label={truncate(fileName, 40)}
      clickable
      color="primary"
      onDelete={() => handleShowPreviewFile(fileName, furl)}
      variant="outlined"
    />
  );
};
export default ReferenceFileBadge;
