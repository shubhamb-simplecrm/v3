import React, { useState, memo, useEffect, useCallback } from "react";
import useStyles from "../styles";
import { isEmpty, isNil, pathOr } from "ramda";
import FileListTile from "./FileListTile";
import { CircularProgress, Divider } from "@material-ui/core";
import { getSubpanelListViewData } from "@/store/actions/subpanel.actions";
import { useFilePreviewer } from "@/context/FilePreviewContext";

const FileItemList = ({
  moduleMetaData,
  files,
  onChange,
  handleMultiFileChanges,
  customProps = {},
}) => {
  const classes = useStyles();
  const { formValues = {}, attachmentFieldRelationship = null } = customProps;
  const { currentModule, recordId } = moduleMetaData;
  const { onFileDialogStateChange } = useFilePreviewer();
  const [fileData, setFileData] = useState({ files: [], loading: false });

  const handleShowPreviewFile = useCallback(
    (fileName, recordId, field_id) => {
      let requestURL = `/index.php?entryPoint=customDownload&id=${recordId}&type=Documents&field_id=${field_id}`;
      onFileDialogStateChange(
        true,
        {
          fileName: fileName,
          filePath: requestURL,
          // fileType: fileExt,
        },
        true,
      );
    },
    [onFileDialogStateChange],
  );

  const listFilesElements =
    !isEmpty(files) && Array.isArray(files)
      ? files?.map((file, iFile) => (
          <FileListTile
            key={`listFilesElements-${file.name}-${iFile}`}
            fileIndex={iFile}
            file={file}
            onClick={handleShowPreviewFile}
            allUploadedFiles={files}
            handleMultiFileChanges={handleMultiFileChanges}
            formValues={formValues}
          />
        ))
      : null;
  const initialFilesListElements = fileData?.loading ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </div>
  ) : !isEmpty(fileData?.files) ? (
    fileData?.files?.map((file, fileIndex) => (
      <FileListTile
        key={`initialFilesListElements-${file.name}-${fileIndex}`}
        fileIndex={fileIndex}
        file={file}
        onClick={handleShowPreviewFile}
        isInitialValue={true}
        allUploadedFiles={fileData?.files}
        fetchSubPanelListViewData={null}
        setFileData={setFileData}
        formValues={formValues}
      />
    ))
  ) : null;

  useEffect(() => {
    const fetchFiles = async () => {
      if (!recordId || isNil(attachmentFieldRelationship)) return;
      try {
        setFileData((prev) => ({ ...prev, loading: true }));
        const res = await getSubpanelListViewData(
          currentModule,
          attachmentFieldRelationship,
          "Documents",
          recordId,
          50,
          1,
        );
        if (res.ok) {
          const fetchedFiles = pathOr(
            [],
            [
              "data",
              "data",
              "templateMeta",
              "data",
              "subpanel_tabs",
              0,
              "listview",
              "data",
              0,
            ],
            res,
          ).map((file) => ({
            id: file.id,
            name: file.document_name,
            isFileUploaded: true,
            isNewFile: false,
          }));
          setFileData(({ files }) => ({
            files: [...files, ...fetchedFiles],
            loading: false,
          }));
        } else {
          throw new Error("Failed to fetch files");
        }
      } catch (error) {
        toast.error(SOMETHING_WENT_WRONG);
        setFileData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchFiles();
  }, [recordId, currentModule]);

  return (
    <>
      <div className={classes.root}>{listFilesElements}</div>
      <div>
        <Divider className={classes.list_divider} />
      </div>
      <div className={classes.root}>{initialFilesListElements}</div>
    </>
  );
};

export default memo(FileItemList);