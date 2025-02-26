import React from "react";
import { Link } from "react-router-dom";
import { checkMaskingCondition } from "../../../common/utils";
import useStyles, { getMuiTheme } from "./styles";
import { Typography } from "../../Wrappers/Wrappers";

const ParentString = ({ field, value, fieldConfiguratorData={} }) => {
  const classes = useStyles();
  const valueData = checkMaskingCondition(fieldConfiguratorData, { [field.field_key]: value }, "masking");
  value = valueData[field.field_key];
  return (
    <Typography>
      <Link
        to={`/app/detailview/${field?.parent_name?.parent_type}/${field?.parent_name?.parent_id}`}
        className={classes.link}
        variant="body2"
        id={field?.parent_name}
      >
        {value}
      </Link>
    </Typography>
  );
};

export default ParentString;
