import React from "react";
import useStyles from "./styles";
import { Tooltip } from "@material-ui/core";
import { useSelector } from "react-redux";
import { click2Call } from "../../../store/actions/config.actions";
import { pathOr } from "ramda";
import { checkMaskingCondition } from "../../../common/utils";
const PhoneString = ({ field, value, fieldConfiguratorData = {} }) => {
  const classes = useStyles();
  const currentUserData = useSelector(
    (state) => state?.config?.currentUserData,
  );
  const cloudConnectConfig = useSelector(
    (state) => state.config.config.cloudConnectConfig,
  );
  const handleClick2call = async (phone) => {
    let req = {
      agent_id: pathOr("", ["agent_id"], cloudConnectConfig),
      session: pathOr("", ["session_id"], cloudConnectConfig),
      customer_phone: phone ?? "",
      campaign_name: pathOr("", ["campaign_id"], cloudConnectConfig),
      tenant_id: pathOr("", ["tenant_id"], cloudConnectConfig),
    };
    let res = await click2Call(req);
  };

  const valueData = checkMaskingCondition(
    fieldConfiguratorData,
    { [field.field_key]: value },
    "masking",
  );
  value = valueData[field.field_key];
  return (
    <p style={{ margin: 0 }}>
      <Tooltip title="Click to Call">
        {/* <Link
          to="#"
          component = "a"
          href = {`tel:${value}`}
          className={classes.emailLink}
          variant="body2"
          onClick={() => {
            handleClick2call(value);
          }}
          id={field?.name}
        > */}
        <a href={`tel:${value}`} className={classes.phoneLink}>{value}</a>
        {/* </Link> */}
      </Tooltip>
    </p>
  );
};

export default PhoneString;