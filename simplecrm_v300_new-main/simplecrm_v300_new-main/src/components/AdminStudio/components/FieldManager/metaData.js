const FieldList = {
  name: {
    field_key: "name",
    label: "Name",
  },
  description: {
    field_key: "description",
    label: "Description",
  },
  assigned_user_id: {
    field_key: "assigned_user_id",
    label: "Assigned To",
  },
  currency_id: {
    field_key: "currency_id",
    label: "Currency",
  },
  date_modified: {
    field_key: "date_modified",
    label: "Date Modified",
  },
  date_entered: {
    field_key: "date_entered",
    label: "Date Entered",
  },
  industry: {
    field_key: "industry",
    label: "Industry",
  },
  status: {
    field_key: "status",
    label: "Status",
  },
  priority: {
    field_key: "priority",
    label: "Priority",
  },
  email: {
    field_key: "email",
    label: "Email",
  },
  phone_num: {
    field_key: "phone_num",
    label: "Phone Number",
  },
  website: {
    field_key: "website",
    label: "Website",
  },
  type: {
    field_key: "type",
    label: "Type",
  },
  fax: {
    field_key: "fax",
    label: "Fax",
  },
  address: {
    field_key: "address",
    label: "Address",
  },
};

  const nameFieldData = [
    {
      name: "field_name",
      label: "Field Name",
      value: "SimpleCRM",
      type: "varchar",
      disabled: false,
      required: false,
      comment: "",
    },
    {
      name: "helptext",
      label: "Help Text",
      value: "",
      type: "varchar",
      disabled: false,
      required: false,
      comment: "",
    },
    {
      name: "commentText",
      label: "Comment Text",
      value: "This is a name of a company",
      type: "text",
      disabled: false,
      required: false,
      comment: "",
    },
    {
      name: "defaultValue",
      label: "Field Name",
      value: "SimpleCRM",
      type: "varchar",
      disabled: false,
      required: false,
      comment: "",
    },
    {
      name: "max_size",
      label: "Max Size",
      value: 150,
      type: "int",
      disabled: false,
      required: false,
      comment: "",
    },
    {
      name: "required",
      label: "Required",
      value: false,
      type: "bool",
      disabled: false,
      required: false,
      comment: "",
    },
    {
      name: "disabled",
      label: "Disabled",
      value: false,
      type: "bool",
      disabled: false,
      required: false,
      comment: "",
    },
    {
      name: "importable",
      label: "Importable",
      value: "required",
      type: "enum",
      disabled: false,
      required: false,
      options: { required: "Required", yes: "Yes", no: "No" },
      comment: "",
    },
  ];
export { FieldList, nameFieldData };
