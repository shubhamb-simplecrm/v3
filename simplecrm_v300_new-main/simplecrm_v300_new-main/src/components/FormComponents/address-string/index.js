import React from "react";
import { pathOr } from "ramda";
import { checkMaskingCondition } from "../../../common/utils";
const AddressString = ({ field, fieldConfiguratorData={}}) => {
  let value = "";

  let address_street = pathOr(
    null,
    [field.name.substr(0, field.name.indexOf("_")) + "_address_street"],
    field.value,
  );
  let address_city = pathOr(
    null,
    [field.name.substr(0, field.name.indexOf("_")) + "_address_city"],
    field.value,
  );
  let address_state = pathOr(
    null,
    [field.name.substr(0, field.name.indexOf("_")) + "_address_state"],
    field.value,
  );
  let address_postalcode = pathOr(
    null,
    [field.name.substr(0, field.name.indexOf("_")) + "_address_postalcode"],
    field.value,
  );
  let address_country = pathOr(
    null,
    [field.name.substr(0, field.name.indexOf("_")) + "_address_country"],
    field.value,
  );

  value = address_street ? address_street + ", " : "";
  value += address_city ? address_city + ", " : "";
  value += address_state ? address_state + ", " : "";
  value += address_postalcode ? address_postalcode + ", " : "";
  value += address_country;
  if (
    address_street === null &&
    field.name === "Contactsprimary_address_street"
  ) {
    value = pathOr("", ["value"], field);
  }
  
  const valueData = checkMaskingCondition(fieldConfiguratorData, { [field.field_key]: value }, "masking");
  return valueData[field.field_key];
  return value;
};

export default AddressString;
