import { LAYOUT_VIEW_TYPE } from "../../common/layout-constants";
export const attachmentField = {
  label: "Add Attachments",
  field_key: "documents",
  name: "documents",
  type: "file",
  multi: true,
  default: "None",
  initial_documents: [],
  value: [],
  required: false,
};
export const DEFAULT_REMINDER = {
  idx: 0,
  id: "",
  popup: true,
  email: true,
  timer_popup: 1800,
  timer_email: 3600,
  del_invitees: [],
  invitees: [],
};

export const wysiwygCustomToolBarOptions = [
  {
    field_key: "email_template_selection",
    name: "email_template_selection",
    label: "Select Email Template",
    type: "relate",
    comment: "Select Email Template",
    module: "EmailTemplates",
    icon: "template-add",
  },
  {
    field_key: "pdf_template_selection",
    name: "pdf_template_selection",
    label: "Select PDF Template",
    type: "relate",
    comment: "Select PDF Template",
    module: "AOS_PDF_Templates",
    icon: "template-add",
  },
];

// const ONCHANGE_OBSERVABLE_MODULE_VIEW_CONSTANT = Object.freeze({
//   cases: `Cases`,
//   opportunities: `Opportunities`,
//   casesCreateView: `Cases#${LAYOUT_VIEW_TYPE.createView}`,
// });

// # - field type name , example - #enum
// $ - field property name,  example - $parentname
// + -  append modulename with view name - cases+createview

export const observeFieldValueConfiguration = Object.freeze({
  all: {
    name: ["firstname", "lastname"],
    [`#dynamicenum`]: ["$parentenum"],
    alt_address_street: ["primary_address_street"],
    shipping_address_street: ["billing_address_street"],
    repeat_calendar_events: ["date_start"],
    documents: ["assigned_user_name"],
  },
});
