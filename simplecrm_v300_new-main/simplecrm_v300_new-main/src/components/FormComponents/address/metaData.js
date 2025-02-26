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
} from "../../../constant";

const addressTitle = {
  primary_address_street: LBL_PRIMARY_ADDRESS,
  alt_address_street: LBL_OTHER_ADDRESS,
  billing_address_street: LBL_BILLING_ADDRESS,
  shipping_address_street: LBL_SHIPPING_ADDRESS,
};
const editValues = {
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
export { addressTitle, editValues };
