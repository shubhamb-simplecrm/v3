import React from "react";
import { Link } from "react-router-dom";
import useStyles, { getMuiTheme } from "./styles";
import { pathOr } from "ramda";
import { checkMaskingCondition } from "../../../common/utils";
import { Typography } from "../../Wrappers/Wrappers";
const RelateString = ({ field, value, fieldConfiguratorData}) => {
  const classes = useStyles();
  const valueData = checkMaskingCondition(fieldConfiguratorData, { [field.field_key]: value }, "masking");
  value = valueData[field.field_key];
  return (
    <Typography>
      <Link
        to={`/app/detailview/${field?.module}/${pathOr(
          "",
          [field?.id_name],
          field,
        )}`}
        className={classes.link}
        variant="body2"
        id={field?.id_name}
      >
        {value}
      </Link>
    </Typography>
  );
};
export default RelateString;