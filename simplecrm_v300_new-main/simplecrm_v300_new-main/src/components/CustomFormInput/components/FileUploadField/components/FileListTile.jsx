import React, { useState, useEffect, memo } from "react";
import { CircularProgress, Tooltip, Chip } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { toast } from "react-toastify";
import { SOMETHING_WENT_WRONG } from "@/constant";
import { createOrEditRecordAction } from "@/store/actions/edit.actions";
import { deleteRecordFromModule } from "@/store/actions/module.actions";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";
import { pathOr } from "ramda";

const FileListTile = memo(
  ({
    file,
    onClick,
    fileIndex,
    handleMultiFileChanges,
    isInitialValue,
    allUploadedFiles,
    setFileData,
    formValues,
  }) => {
    const [loading, setLoading] = useState(false);
    const recordAssignUserFieldValue = pathOr(
      undefined,
      ["assigned_user_name"],
      formValues,
    );

    useEffect(() => {
      const uploadFileIfNeeded = async () => {
        if (file.id || !file.name) return;

        setLoading(true);
        try {
          const apiResponse = await uploadFile(file, file.name);
          if (apiResponse) {
            setLoading(false);
            allUploadedFiles[fileIndex] = {
              ...allUploadedFiles[fileIndex],
              id: apiResponse.id,
            };
            handleMultiFileChanges(allUploadedFiles);
          } else {
            throw new Error("Upload failed");
          }
        } catch (error) {
          setLoading(false);
          toast.error(SOMETHING_WENT_WRONG);
        }
      };

      uploadFileIfNeeded();
    }, [file, fileIndex, handleMultiFileChanges]);

    const uploadFile = async (file, fileName) => {
      // Assuming createOrEditRecordAction function handles the file upload
      const requestData = {
        data: {
          type: "Documents",
          attributes: {
            status_id: "Active",
            filename: [{ name: file?.name, file_content: file?.file_content }],
            document_name: fileName,
            revision: "1",
            assigned_user_name: recordAssignUserFieldValue,
          },
        },
      };
      try {
        const res = await createOrEditRecordAction(
          requestData,
          LAYOUT_VIEW_TYPE.quickCreateView,
        );

        if (res && res.ok) return res.data.data;
        return null;
      } catch (e) {
        toast.error(SOMETHING_WENT_WRONG);
        return null;
      }
    };

    const handleDelete = async () => {
      if (!file.id) return; // Skip if no ID present

      setLoading(true);
      try {
        const response = await deleteRecordFromModule("Documents", file.id);
        if (response.ok) {
          if (isInitialValue) {
            setFileData((prev) => {
              prev.files.splice(fileIndex, 1);
              return { ...prev };
            });
          } else {
            allUploadedFiles.splice(fileIndex, 1);
            handleMultiFileChanges(allUploadedFiles);
          }
          setLoading(false);
        } else {
          throw new Error("Deletion failed");
        }
      } catch (error) {
        setLoading(false);
        toast.error(SOMETHING_WENT_WRONG);
      }
    };

    return (
      <>
        {file.name && (
          <Chip
            label={file.name}
            icon={<AttachFileIcon />}
            variant="outlined"
            onClick={() => file?.id && onClick(file.name, file.id, "file")}
            onDelete={handleDelete}
            disabled={loading}
            color="primary"
            clickable={!loading}
          />
        )}
        {loading && <CircularProgress size={24} />}
      </>
    );
  },
);

export default FileListTile;
