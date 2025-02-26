import React from "react";
import useStyles from "./../styles";
import { pathOr } from "ramda";
import { Link } from "react-router-dom";
export const ParentLabel = (props) => {
  const { viewName, formData, fieldValue, moduleName, customArgs } = props;
  const { tableMeta, ACLAccessObj } = customArgs;
  const classes = useStyles();

  const parentId = pathOr(
    "",
    [pathOr("", ["rowIndex"], tableMeta), "attributes", "parent_id"],
    formData,
  );
  const parentType = pathOr(
    "",
    [pathOr("", ["rowIndex"], tableMeta), "attributes", "parent_type"],
    formData,
  );
  return (
    <Link
      to={`/app/detailview/${parentType}/${parentId}`}
      className={classes.link}
      // component="button"
      variant="body2"
    >
      {fieldValue}
    </Link>
  );
};
