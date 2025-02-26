import React from "react";
import useStyles from "./../styles";
import { pathOr } from "ramda";
import { Link } from "react-router-dom";
export const RelateLabel = (props) => {
  const { listDataLabel, viewName, fieldValue, module, customArgs, formData } =
    props;
  const { tableMeta, ACLAccessObj } = customArgs;
  const classes = useStyles();
  const idName = pathOr("", ["id_name"], listDataLabel);
  const parentType = pathOr("", ["module"], listDataLabel);
  const parentId = pathOr(
    "",
    [pathOr("", ["rowIndex"], tableMeta), "attributes", idName],
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
