import {
  ADD_PANEL,
  ADD_PANEL_BUTTON,
  ADD_ROW,
  ADD_ROW_BUTTON,
  FIELD_LIST_ITEM,
  PANEL,
  ROW,
} from "./layout-manager-constants";

export const PANEL_LIST_ITEMS = {
  containerId: `panelContainer`,
  type: PANEL,
  data: [
    {
      id: "panel_0",
      label: "Panel 0",
      children: {
        containerId: "container-panel_0",
        type: ROW,
        data: [
          {
            id: "row_00",
            children: {
              containerId: "container-panel_0-row_00",
              type: FIELD_LIST_ITEM,
              data: [
                { id: "NAME", label: "Name" },
                {
                  id: "BILLING_ADDRESS_CITY",
                  label: "City",
                },
              ],
            },
          },
          {
            id: "row_01",
            children: {
              containerId: "container-panel_0-row_01",
              type: FIELD_LIST_ITEM,
              data: [],
            },
          },
        ],
      },
    },
    {
      id: "panel_1",
      label: "Panel 1",
      children: {
        containerId: "container-panel_1",
        type: ROW,
        data: [
          {
            id: "row_10",
            children: {
              containerId: "container-panel_1-row_10",
              type: FIELD_LIST_ITEM,
              data: [],
            },
          },
        ],
      },
    },
    {
      id: "panel_2",
      label: "Panel 2",
      children: {
        containerId: "container-panel_2",
        type: ROW,
        data: [],
      },
    },
  ],
};

export const ADD_PANEL_ROW_BUTTONS = [
  {
    containerId: ADD_PANEL,
    buttonId: ADD_PANEL_BUTTON,
    type: PANEL,
    label: "Add Panel",
  },
  {
    containerId: ADD_ROW,
    buttonId: ADD_ROW_BUTTON,
    type: ROW,
    label: "Add Row",
  },
];

export const FIELD_LIST_ITEMS = [
  // { id: "NAME", label: "Name", type: FIELD_LIST_ITEM },
  // {
  //   id: "BILLING_ADDRESS_CITY",
  //   label: "City",
  //   type: FIELD_LIST_ITEM,
  // },
  { id: "ACCOUNT_TYPE", label: "Type", type: FIELD_LIST_ITEM },
  { id: "PHONE_OFFICE", label: "Phone", type: FIELD_LIST_ITEM },
  { id: "ASSIGNED_USER_NAME", label: "User", type: FIELD_LIST_ITEM },
  {
    id: "BILLING_ADDRESS_COUNTRY",
    label: "Billing Country",
    type: FIELD_LIST_ITEM,
  },
  { id: "EMAIL1", label: "Email Address", type: FIELD_LIST_ITEM },
  {
    id: "DATE_ENTERED",
    label: "Date Created",
    type: FIELD_LIST_ITEM,
  },
  { id: "INDUSTRY", label: "Industry", type: FIELD_LIST_ITEM },
  {
    id: "ANNUAL_REVENUE",
    label: "Annual Revenue",
    type: FIELD_LIST_ITEM,
  },
  { id: "PHONE_FAX", label: "Phone Fax", type: FIELD_LIST_ITEM },
  {
    id: "BILLING_ADDRESS_STREET",
    label: "Billing Street",
    type: FIELD_LIST_ITEM,
  },
  {
    id: "BILLING_ADDRESS_STATE",
    label: "Billing State",
    type: FIELD_LIST_ITEM,
  },
  {
    id: "BILLING_ADDRESS_POSTALCODE",
    label: "Billing Postal Code",
    type: FIELD_LIST_ITEM,
  },
  {
    id: "SHIPPING_ADDRESS_STREET",
    label: "Shipping Street",
    type: FIELD_LIST_ITEM,
  },
  {
    id: "SHIPPING_ADDRESS_CITY",
    label: "Shipping City",
    type: FIELD_LIST_ITEM,
  },
  {
    id: "SHIPPING_ADDRESS_STATE",
    label: "Shipping State",
    type: FIELD_LIST_ITEM,
  },
  {
    id: "SHIPPING_ADDRESS_POSTALCODE",
    label: "Shipping Postal Code",
    type: FIELD_LIST_ITEM,
  },
  {
    id: "SHIPPING_ADDRESS_COUNTRY",
    label: "Shipping Country",
    type: FIELD_LIST_ITEM,
  },
  { id: "RATING", label: "Rating", type: FIELD_LIST_ITEM },
  {
    id: "PHONE_ALTERNATE",
    label: "Other Phone",
    type: FIELD_LIST_ITEM,
  },
  { id: "WEBSITE", label: "Website", type: FIELD_LIST_ITEM },
  { id: "OWNERSHIP", label: "Ownership", type: FIELD_LIST_ITEM },
  { id: "EMPLOYEES", label: "Employees", type: FIELD_LIST_ITEM },
  { id: "SIC_CODE", label: "SIC Code", type: FIELD_LIST_ITEM },
  {
    id: "TICKER_SYMBOL",
    label: "Ticker Symbol",
    type: FIELD_LIST_ITEM,
  },
  {
    id: "DATE_MODIFIED",
    label: "Date Modified",
    type: FIELD_LIST_ITEM,
  },
  {
    id: "CREATED_BY_NAME",
    label: "Created By",
    type: FIELD_LIST_ITEM,
  },
  {
    id: "MODIFIED_BY_NAME",
    label: "Modified By",
    type: FIELD_LIST_ITEM,
  },
];
