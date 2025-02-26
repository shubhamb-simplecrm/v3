import React from "react";
import useStyles from "./../styles";
import blankImage from "./../../../assets/blank-image.jpg";
import useCommonUtils from "../../../hooks/useCommonUtils";
import { pathOr } from "ramda";
export const ImageLabel = (props) => {
  const { listDataLabel, formData, fieldValue, moduleName, customArgs } = props;
  const { tableMeta, ACLAccessObj } = customArgs;
  const classes = useStyles();
  const { siteUrl } = useCommonUtils();
  const recordId = pathOr(
    "",
    [pathOr("", ["rowIndex"], tableMeta), "id"],
    formData,
  );

  let imageUrl = `${siteUrl}/index.php?entryPoint=customDownload&id=${recordId}_${listDataLabel.name}&type=${moduleName}`;
  return (
    <img
      src={imageUrl}
      className={classes.photo}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = blankImage;
      }}
    />
  );
};
