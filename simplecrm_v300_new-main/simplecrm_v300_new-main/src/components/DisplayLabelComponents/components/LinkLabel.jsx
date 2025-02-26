import React from "react";
import { LAYOUT_VIEW_TYPE } from "../../../common/layout-constants";
import { pathOr } from "ramda";
import { checkACLAccess } from "../../../common/common-utils";
import { ACL_ACCESS_ACTION_TYPE } from "../../../common/common-constants";
import { TextLabel } from "./TextLabel";
import { Link } from "react-router-dom";
import useStyles from "./../styles";
export const LinkLabel = (props) => {
  const classes = useStyles();
  const { viewName, formData, fieldValue, moduleName, customArgs } = props;
  const { tableMeta, ACLAccessObj } = customArgs;
  const recordId = pathOr(
    "",
    [pathOr("", ["rowIndex"], tableMeta), "id"],
    formData,
  );
  let emailUrl = "";
  if (viewName == LAYOUT_VIEW_TYPE.detailView) {
    return <TextLabel {...props} />;
  } else if (viewName == LAYOUT_VIEW_TYPE.listView) {
    if (moduleName == "Emails") {
      const msgNo = pathOr(
        "",
        [pathOr("", ["rowIndex", "attributes"], tableMeta), "msgno"],
        formData,
      );
      const uid = pathOr(
        "",
        [pathOr("", ["rowIndex", "attributes"], tableMeta), "uid"],
        formData,
      );
      emailUrl = `/${msgNo}/${uid}`;
    }
    if (
      !checkACLAccess(ACLAccessObj, ACL_ACCESS_ACTION_TYPE.view) &&
      moduleName !== "AOR_Reports"
    ) {
      return <TextLabel {...props} />;
    } else {
      return (
        <Link
          to={`/app/detailview/${moduleName}/${recordId}${emailUrl}`}
          className={classes.link}
          // component="button"
          variant="body2"
        >
          {fieldValue}
        </Link>
      );
    }
  }
};
