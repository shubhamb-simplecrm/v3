import React, { memo, useEffect, useState } from "react";
import useStyles from "./styles";
import { TextField, Checkbox } from "@material-ui/core";
import { pathOr } from "ramda";
import { LBL_ADDRESS_COPY_FROM_LEFT } from "../../../constant";
import { addressTitle, editValues } from "./metaData";

const Address = ({
  initialValues,
  field,
  onChange,
  errors = {},
  value,
  onCopy = null,
}) => {
  const classes = useStyles();
  const [copy, setCopy] = useState(false);
  let iserror = pathOr(false, [field?.name], errors);

  const handleChange = (name, value) => {
    let newValues = { ...initialValues, [name]: value };
    onChange(newValues);
  };
  const copyAddress = (check) => {
    if (check) {
      setCopy(true);
      let newValues = {};
      editValues.primary_address_street.map((field) => {
        let fieldname = field.name.replace("primary", "alt");
        newValues[fieldname] = initialValues[field.name];
      });
      editValues.billing_address_street.map((field) => {
        let fieldname = field.name.replace("billing", "shipping");
        newValues[fieldname] = initialValues[field.name];
      });
      onChange(newValues);
    } else {
      setCopy(false);
    }
  };

  const renderCheckBox = () => {
    if (
      field.field_key === "alt_address_street" ||
      field.field_key === "shipping_address_street"
    ) {
      return (
        <div>
          {LBL_ADDRESS_COPY_FROM_LEFT}
          <Checkbox
            id={field.name}
            name={field.name}
            checked={Boolean(copy)}
            onChange={(e) => copyAddress(e.target.checked)}
          />
        </div>
      );
    }
  };

  return (
    <>
      {addressTitle[field.field_key]}
      {editValues[field.field_key].map((addressField, key) => (
        <TextField
          id={addressField.name}
          name={addressField.name}
          variant="outlined"
          size="small"
          label={addressField.label}
          required={field.required === "true" ? true : false}
          value={initialValues[addressField.name]}
          classes={{ root: classes.cstmAdj }}
          error={iserror}
          helperText={pathOr(null, [field?.name], errors)}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          disabled={
            copy &&
            (field.field_key === "alt_address_street" ||
              field.field_key === "shipping_address_street")
          }
          onCut={onCopy}
          onCopy={onCopy}
          onPaste={onCopy}
          onContextMenu={onCopy}
        />
      ))}
      {renderCheckBox()}
    </>
  );
};

export default memo(Address);
