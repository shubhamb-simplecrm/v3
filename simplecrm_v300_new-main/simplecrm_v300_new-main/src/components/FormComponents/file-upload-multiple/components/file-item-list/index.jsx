import React, { useState, memo, useEffect, useCallback } from "react";
import useStyles from "./styles";
import { isEmpty, pathOr } from "ramda";
import { useSelector } from "react-redux";
import FileListItem from "../file-item-tile";
import FileViewerComp from "../../../../FileViewer/FileViewer";
import { CircularProgress, Divider } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { getSubpanelListViewData } from "../../../../../store/actions/subpanel.actions";
const FileItemList = ({ module, files, onChange }) => {
  const classes = useStyles();
  const [previewFile, setPreviewFile] = useState({
    open: false,
    filename: "",
    filepath: "",
  });
  const { id } = useParams();
  const [initialFiles, setInitialFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { config } = useSelector((state) => state.config);
  const site_url = useSelector((state) => state.config.config.site_url);

  const handleShowPreviewFile = (fileName, recordId, field_id) => {
    let furl = `${site_url}/index.php?entryPoint=customDownload&id=${recordId}&type=Documents&field_id=${field_id}`;
    let arr = fileName.split(".");
    let ext = arr[arr.length - 1].toUpperCase();
    setPreviewFile({
      open: true,
      filename: fileName,
      filepath: furl,
      filetype: ext,
    });
  };
  const fetchSubPanelListViewData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getSubpanelListViewData(
        module,
        "documents",
        "Documents",
        id,
        50,
        1,
        // listViewMeta.page + 1,
      );
      if (res.ok) {
        let initialData = pathOr(
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
        );
        initialData = initialData?.map((v) => ({
          name: pathOr("", ["document_name"], v),
          id: pathOr("", ["id"], v),
          isFileUploaded: true,
          isNewFile: false,
        }));
        setInitialFiles(initialData);
      }
      setLoading(false);
    } catch (ex) {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    if (id) {
      fetchSubPanelListViewData();
    }
  }, []);

  const listFilesElements = !isEmpty(files)
    ? files?.map((file, iFile) => (
        <FileListItem
          key={`${file.name}-${iFile}`}
          fileIndex={iFile}
          file={file}
          onClick={handleShowPreviewFile}
          allUploadedFiles={files}
          onChange={onChange}
        />
      ))
    : null;

  const initialFilesListElements = loading ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </div>
  ) : !isEmpty(initialFiles) ? (
    initialFiles?.map((file, iFile) => (
      <FileListItem
        key={file.name}
        fileIndex={iFile}
        file={file}
        onClick={handleShowPreviewFile}
        isInitialValue={true}
        allUploadedFiles={initialFiles}
        recordId={id}
        fetchSubPanelListViewData={fetchSubPanelListViewData}
      />
    ))
  ) : null;

  return (
    <>
      <div className={classes.root}>{listFilesElements}</div>
      <div>
        <Divider className={classes.list_divider} />
      </div>
      <div className={classes.root}>{initialFilesListElements}</div>
      {previewFile.open ? (
        <FileViewerComp
          previewFile={previewFile}
          setPreviewFile={setPreviewFile}
        />
      ) : null}
    </>
  );
};

export default memo(FileItemList);
