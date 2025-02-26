import React from "react";
import parse from "html-react-parser";
import { Reminders, ReminderTime, EmailString } from "../../FormComponents";
import { FormInput } from "../../";
import { truncate, addressString, isDisabled } from "../../../common/utils";
import { Typography } from "../../Wrappers/Wrappers";
const EditRow = ({
  initialValues,
  field,
  onChange,
  onBlur = () => {},
  module,
  errors,
  mode,
  view,
  quickCreate,
  hiddenAll,
  isAdmin,
  recordId,
  recordName,
}) => {
  const parseFieldValue = (field, value) => {
    if (
      field.field_key === "opportunities_scoring_c" ||
      field.field_key === "lead_scoring_c"
    ) {
      if (value && value != null && typeof value == "string") {
        let tmp = document.createElement("SPAN");
        tmp.innerHTML = value;
        return (value = tmp.textContent || tmp.innerText || "");
      }
    }
    if (
      /<\/?[a-z][\s\S]*>/i.test(value) &&
      view !== "editview" &&
      field.type === "wysiwyg"
    ) {
      return parse(value);
    }
    if (field.field_key === "description") {
      if (value && value != null && typeof value == "string") {
        switch (view) {
          case "createview":
            return (value = "");

          default:
            let tmp1 = document.createElement("div");
            tmp1.textContent = value;

            return (value = tmp1.textContent || tmp1.innerText || "");
        }
      }
    }
    //to parse address field
    if (
      field.field_key ===
      field.field_key.substr(0, field.field_key.indexOf("_")) +
        "_address_street"
    ) {
      value = "";
    }
    if (
      (field.field_key == "email1" || field.type === "email") &&
      Array.isArray(field.value)
    ) {
      return ""; //emailString(field);
    }
    if (field.field_key === "converted" && view === "detailview") {
      return field.value == 1 ? "Yes" : "No";
    }
    if (field.name == "reminders") {
      return (
        <Reminders
          field={field}
          onChange={(val) => {
            return val;
          }}
          onBlur={(val) => {
            return val;
          }}
          errors={""}
          variant="outlined"
          value={field.value}
          small={false}
          disabled={true}
          view={"detailview"}
        />
      );
    }
    if (field.name == "reminder_time") {
      return (
        <ReminderTime
          field={field}
          errors={""}
          value={field.value}
          disabled={true}
          onChange={(val) => {
            return val;
          }}
          onBlur={(val) => {
            return val;
          }}
          view={"detailview"}
        />
      );
    }
    if (mode === "rightpanel" && field.type === "text" && field.color) {
      return (
        <Typography style={{ color: field.color }}>{field.value}</Typography>
      );
    }

    return value;
  };

  return (
    <>
      {errors[field.name] !== "InVisible" ? (
        <FormInput
          field={field}
          initialValues={initialValues}
          value={
            (field?.field_key !== "estimated_effort_c"
              ? parseFieldValue(field, initialValues[field.name]) || ""
              : field.value) ||
            (field?.field_key !== "effort_c"
              ? parseFieldValue(field, initialValues[field.name]) || ""
              : field.value)
          }
          dynamicEnumValue={initialValues[field.parentenum] || ""}
          errors={errors}
          module={module}
          small={true}
          onChange={(val) => onChange(field, val)}
          onBlur={(val) => onBlur(field, val)}
          disabled={isDisabled(module, field, view, isAdmin, hiddenAll)}
          view={view}
          quickCreate={quickCreate}
          recordId={recordId}
          recordName={recordName}
        />
      ) : null}
    </>
  );
};

export default EditRow;
