import { Chip, Tooltip, CircularProgress } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { isEmpty, isNil } from "ramda";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getBase64 } from "../../../../../common/utils";
import { SOMETHING_WENT_WRONG } from "../../../../../constant";
import { createOrEditRecordAction } from "../../../../../store/actions/edit.actions";
import { deleteRecordFromModule } from "../../../../../store/actions/module.actions";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";

const FileListItem = ({
  file,
  onClick,
  fileIndex,
  onChange = null,
  isInitialValue = false,
  allUploadedFiles = [],
  fetchSubPanelListViewData,
}) => {
  const { id, name, fileContent, isFileUploaded } = file;
  const [loading, setLoading] = useState(false);
  const [fileId, setFileId] = useState(id);
  useEffect(() => {
    if (isFileUploaded || !isNil(id)) return;
    try {
      setLoading(true);
      getBase64(fileContent).then((base64File) => {
        uploadFile(base64File, name).then((apiResponse) => {
          setLoading(false);
          if (apiResponse) {
            const id = apiResponse.id;
            allUploadedFiles[fileIndex] = {
              ...allUploadedFiles[fileIndex],
              id,
              isFileUploaded: true,
            };
            if (!isEmpty(allUploadedFiles)) {
              const isAllFileUploaded = allUploadedFiles.every((file, i) => {
                if (!file.hasOwnProperty("isFileUploaded")) {
                  if (
                    file.hasOwnProperty("id") &&
                    !isEmpty(file.id) &&
                    !isNil(file.id)
                  )
                    return true;
                }
                return file?.isFileUploaded;
              });
              if (isAllFileUploaded) {
                const fileIds = allUploadedFiles.map((file) => ({
                  id: file.id,
                  name: file.name,
                  // isFileUploaded: true,
                }));
                if (!isInitialValue) {
                  onChange(fileIds);
                }
              }
            }
            setFileId(id);
          }
        });
      });
    } catch (e) {
      setLoading(false);
      toast(SOMETHING_WENT_WRONG);
    }
  }, []);
  console.log("loading", loading);
  const removeFile = async (recordId) => {
    try {
      const res = await deleteRecordFromModule("Documents", recordId);
      if (res.ok) {
        const filteredFiles = allUploadedFiles.filter(
          (file) => file.id != recordId,
        );
        if (!isInitialValue) {
          onChange(filteredFiles);
        } else {
          fetchSubPanelListViewData();
        }
        toast(res.ok ? res.data.meta.message : res.data.errors.detail);
      }
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
    }
  };

  const uploadFile = async (fileContent, fileName) => {
    let requestData = {
      data: {
        type: "Documents",
        attributes: {
          status_id: "Active",
          filename: [fileContent],
          document_name: fileName,
          revision: "1",
        },
      },
    };
    try {
      let res = await createOrEditRecordAction(
        requestData,
        LAYOUT_VIEW_TYPE?.createView,
      );
      if (res && res?.ok) {
        return res.data.data;
      }
      return null;
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
    }
  };

  return !loading ? (
    <Tooltip title={name}>
      <Chip
        label={name}
        icon={<AttachFileIcon />}
        variant="outlined"
        sx={{ maxWidth: 200 }}
        onDelete={() => removeFile(fileId)}
        onClick={() => onClick(name, fileId, "file")}
      />
    </Tooltip>
  ) : (
    <CircularProgress />
  );
};

export default FileListItem;
