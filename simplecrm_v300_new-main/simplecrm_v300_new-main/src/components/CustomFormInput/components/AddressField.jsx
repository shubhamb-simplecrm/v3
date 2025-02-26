import React, { useState, useCallback } from "react";
import { pathOr } from "ramda";
import { PropTypes } from "prop-types";
import CustomFormInput from "@/components/CustomFormInput";
import { LBL_ADDRESS_COPY_FROM_LEFT } from "@/constant";
import {
  LBL_ADDRESS_ADDRESS,
  LBL_ADDRESS_CITY,
  LBL_ADDRESS_COUNTRY,
  LBL_ADDRESS_POSTAL_CODE,
  LBL_ADDRESS_STATE,
  LBL_BILLING_ADDRESS,
  LBL_OTHER_ADDRESS,
  LBL_PRIMARY_ADDRESS,
  LBL_SHIPPING_ADDRESS,
} from "@/constant";

const ADDRESS_TYPE_TITLE = {
  primary_address_street: LBL_PRIMARY_ADDRESS,
  alt_address_street: LBL_OTHER_ADDRESS,
  billing_address_street: LBL_BILLING_ADDRESS,
  shipping_address_street: LBL_SHIPPING_ADDRESS,
};

const ADDRESS_EDIT_LABELS = {
  primary_address_street: [
    {
      name: "primary_address_street",
      label: LBL_ADDRESS_ADDRESS,
    },
    {
      name: "primary_address_state",
      label: LBL_ADDRESS_STATE,
    },
    {
      name: "primary_address_postalcode",
      label: LBL_ADDRESS_POSTAL_CODE,
    },
    {
      name: "primary_address_country",
      label: LBL_ADDRESS_COUNTRY,
    },
    {
      name: "primary_address_city",
      label: LBL_ADDRESS_CITY,
    },
  ],
  alt_address_street: [
    {
      name: "alt_address_street",
      label: LBL_ADDRESS_ADDRESS,
    },
    {
      name: "alt_address_state",
      label: LBL_ADDRESS_STATE,
    },
    {
      name: "alt_address_postalcode",
      label: LBL_ADDRESS_POSTAL_CODE,
    },
    {
      name: "alt_address_country",
      label: LBL_ADDRESS_COUNTRY,
    },
    {
      name: "alt_address_city",
      label: LBL_ADDRESS_CITY,
    },
  ],
  billing_address_street: [
    {
      name: "billing_address_street",
      label: LBL_ADDRESS_ADDRESS,
    },
    {
      name: "billing_address_state",
      label: LBL_ADDRESS_STATE,
    },
    {
      name: "billing_address_postalcode",
      label: LBL_ADDRESS_POSTAL_CODE,
    },
    {
      name: "billing_address_country",
      label: LBL_ADDRESS_COUNTRY,
    },
    {
      name: "billing_address_city",
      label: LBL_ADDRESS_CITY,
    },
  ],
  shipping_address_street: [
    {
      name: "shipping_address_street",
      label: LBL_ADDRESS_ADDRESS,
    },
    {
      name: "shipping_address_state",
      label: LBL_ADDRESS_STATE,
    },
    {
      name: "shipping_address_postalcode",
      label: LBL_ADDRESS_POSTAL_CODE,
    },
    {
      name: "shipping_address_country",
      label: LBL_ADDRESS_COUNTRY,
    },
    {
      name: "shipping_address_city",
      label: LBL_ADDRESS_CITY,
    },
  ],
};

const AddressField = (props) => {
  const { onChange, value, fieldMetaObj, fieldState, customProps } = props;
  const [copyAddress, setCopyAddress] = useState(false);
  const headerTitle = pathOr("", [fieldMetaObj?.name], ADDRESS_TYPE_TITLE);
  const addressFields = pathOr([], [fieldMetaObj?.name], ADDRESS_EDIT_LABELS);
  const handleOnChange = useCallback(
    (fieldName, inputValue, fieldValue) => {
      fieldValue[fieldName] = inputValue;
      onChange(fieldValue);
    },
    [onChange],
  );
  const handleCopyAddress = useCallback(
    (check) => {
      if (check) {
        setCopyAddress(true);
        const newValues = {};
        if (
          fieldMetaObj.name === "alt_address_street" &&
          typeof customProps?.formValues?.primary_address_street == "object"
        ) {
          Object.entries(
            customProps?.formValues?.primary_address_street,
          ).forEach(([parentFieldName, parentFieldValue]) => {
            const childFieldName = parentFieldName.replace("primary", "alt");
            newValues[childFieldName] = parentFieldValue;
          });
        } else if (
          fieldMetaObj.name === "shipping_address_street" &&
          typeof customProps?.formValues?.billing_address_street == "object"
        ) {
          Object.entries(
            customProps?.formValues?.billing_address_street,
          ).forEach(([parentFieldName, parentFieldValue]) => {
            const childFieldName = parentFieldName.replace(
              "billing",
              "shipping",
            );
            newValues[childFieldName] = parentFieldValue;
          });
        }
        onChange(newValues);
      } else {
        setCopyAddress(false);
      }
    },
    [fieldMetaObj, onChange, customProps],
  );

  const renderCheckBox = useCallback(() => {
    if (
      fieldMetaObj.name === "alt_address_street" ||
      fieldMetaObj.name === "shipping_address_street"
    ) {
      return (
        <CustomFormInput
          {...props}
          control={null}
          fieldMetaObj={{
            ...fieldMetaObj,
            label: LBL_ADDRESS_COPY_FROM_LEFT,
            type: "bool",
          }}
          value={Boolean(copyAddress)}
          onChange={handleCopyAddress}
        />
      );
    } else {
      return null;
    }
  }, [fieldMetaObj, copyAddress]);

  return (
    <>
      {headerTitle}
      {addressFields.map((addressObj, key) => (
        <div
          style={{
            margin: "12px 0px",
          }}
        >
          <CustomFormInput
            {...props}
            control={null}
            fieldMetaObj={{
              ...fieldMetaObj,
              ...addressObj,
              field_key: addressObj?.name,
              name: addressObj?.name,
              type: "varchar",
            }}
            fieldState={{
              ...fieldState,
              disabled:
                fieldMetaObj.name === "alt_address_street" ||
                fieldMetaObj.name === "shipping_address_street"
                  ? copyAddress
                  : fieldState?.disabled,
            }}
            onChange={(inputValue) =>
              handleOnChange(addressObj.name, inputValue, value)
            }
            value={pathOr("", [addressObj?.name], value)}
          />
        </div>
      ))}
      {renderCheckBox()}
    </>
  );
};
AddressField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

AddressField.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  variant: "outlined",
  size: "small",
  fieldState: {
    disabled: false,
    required: false,
    error: false,
    visible: true,
    helperText: null,
  },
  moduleMetaData: {},
  customProps: {},
};

export default AddressField;