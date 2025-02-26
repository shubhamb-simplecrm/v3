import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";

import {
  AutoComplete,
  Wysiwyg,
  VarChar,
  Enum,
  Bool,
  DateField,
  DateTime,
  Text,
  Currency,
  Numeric,
  DynamicEnum,
  Url,
  FileUpload,
  RadioEnum,
  Parent,
  LineItem,
  Address,
  Email,
  DateSearch,
  Password,
  Reminders,
  CurrencySearch,
  ReminderTime,
  Suggestions,
  SelectAndSearchDropdwonComponent,
  MultiSelectWithSearch,
  JSONeditor,
  Tinymce,
  CheckBoxGroup,
  RepeatCalenderEvents,
  FileUploadMultiple,
} from "../FormComponents";
import Recipient from "../FormComponents/recipient";
import useCommonUtils from "@/hooks/useCommonUtils";

const FormInput = (props) => {
  const [value, setValue] = useState(props.field.value || "");
  const { isCopyPasteContentAllow } = useCommonUtils();
  useEffect(() => setValue(props.value), [props.value]);

  const onValueChange = (value) => {
    setValue(value);
    props.onChange(value);
  };
  const onValueBlur = (value) => {
    setValue(value);
    if (props.onBlur) {
      props.onBlur(value);
    }
  };

  const handleOnCopyEvent = useCallback(
    (e) => {
      if (!isCopyPasteContentAllow) {
        e.preventDefault();
      }
      return null;
    },
    [isCopyPasteContentAllow],
  );

  switch (props?.field?.type) {
    case "bool":
      return (
        <Bool
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value}
        />
      );
    case "JSONeditor":
      return (
        <>
          <JSONeditor
            {...props}
            onCopy={handleOnCopyEvent}
            onChange={(value) => onValueChange(value)}
            onBlur={(value) => onValueBlur(value)}
            value={value}
            // label={props.label}
          />
        </>
      );
    case "currency":
      return props.view === "SearchLayout" ? (
        <CurrencySearch
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value}
        />
      ) : (
        <Currency
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value}
        />
      );
    case "date":
      return (
        <DateField
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value ? value : ""}
        />
      );
    case "datetimecombo":
    case "datetime":
      return props.view === "SearchLayout" ? (
        <DateSearch
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value ? value : ""}
        />
      ) : (
        <DateTime
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value ? value : ""}
        />
      );

    case "dynamicenum":
      return (
        <DynamicEnum
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value}
        />
      );
    case "enum":
      return (
        <div>
          {props?.field?.name == "duration" ||
          props.view === "SearchLayout" ||
          props.isSearchEnumDisabled ||
          ["repeat_type", "repeat_interval", "end"].indexOf(
            props.field.name,
          ) !== -1 ? (
            <Enum
              {...props}
              onCopy={handleOnCopyEvent}
              onChange={(value) => onValueChange(value)}
              onBlur={(value) => onValueBlur(value)}
              value={value}
            />
          ) : (
            <SelectAndSearchDropdwonComponent
              {...props}
              onCopy={handleOnCopyEvent}
              onChange={(value) => onValueChange(value)}
              onBlur={(value) => onValueBlur(value)}
              value={value}
            />
          )}
        </div>
      );
    case "radioenum":
      return (
        <RadioEnum
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value}
        />
      );
    case "file":
    case "image":
      return (
        <FileUpload
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(file) => onValueChange(file)}
          onBlur={(value) => onValueBlur(value)}
          value={value}
        />
      );
    case "multifile":
      return (
        <FileUploadMultiple
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(file) => onValueChange(file)}
          value={value ?? value}
        />
      );
    case "decimal":
    case "float":
    case "int":
      return (
        <Numeric
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value}
        />
      );
    // case "suggestion":
    //   return (
    //     <Suggestion
    //       {...props}
    //       onChange={(value) => onValueChange(value)}
    //       onBlur={(value) => onValueBlur(value)}
    //       value={value ? value : ""}
    //     />
    //   );
    case "multienum": {
      return (
        <div>
          <MultiSelectWithSearch
            {...props}
            onCopy={handleOnCopyEvent}
            onChange={(value) => onValueChange(value)}
            onBlur={(value) => onValueBlur(value)}
            value={value ? value : []}
          />
        </div>
      );
    }
    case "parent":
      return (
        <Parent
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value}
        />
      );

    case "assigned_user_name":
    case "relate":
      return (
        <AutoComplete
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value ? value : { value: "", id: "" }}
        />
      );
    case "text":
      return (
        <Text
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value ? value : ""}
        />
      );
    case "iframe":
    case "url":
      return (
        <Url
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value ? value : ""}
        />
      );
    case "wysiwyg":
      return (
        <Tinymce
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value ? value : ""}
        />
      );
    case "line_item":
      return (
        <LineItem
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value ? value : ""}
        />
      );
    case "address":
      return (
        <Address
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value ? value : ""}
        />
      );
    case "email":
      return props.view === "SearchLayout" ? (
        <VarChar
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value ? value : ""}
        />
      ) : (
        <Email
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value ? value : ""}
        />
      );
    case "password":
      return props.field.name !== "user_hash" ? (
        <Password
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value ? value : ""}
        />
      ) : null;
    case "name":
      return props.module === "Cases" ? (
        <Suggestions
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value ? value : { value: "", id: "" }}
          field={{
            ...props.field,
            module: "AOK_KnowledgeBase",
            type: "suggestion",
          }}
        />
      ) : (
        <VarChar
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          onBlur={(value) => onValueBlur(value)}
          value={value}
        />
      );
    case "checkboxGroup":
      return (
        <CheckBoxGroup
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          value={value ? value : ""}
        />
      );
    case "recipients":
      return (
        <Recipient
          {...props}
          onCopy={handleOnCopyEvent}
          onChange={(value) => onValueChange(value)}
          value={value ? value : ""}
        />
      );
    default:
      switch (props?.field?.name) {
        case "email1":
          return (
            <Email
              {...props}
              onCopy={handleOnCopyEvent}
              onChange={(value) => onValueChange(value)}
              onBlur={(value) => onValueBlur(value)}
              value={value ? value : ""}
            />
          );
        case "reminders":
          return (
            <Reminders
              {...props}
              onCopy={handleOnCopyEvent}
              onChange={(value) => onValueChange(value)}
              onBlur={(value) => onValueBlur(value)}
              value={value ? value : ""}
            />
          );
        case "reminder_time":
          return (
            <ReminderTime
              {...props}
              onCopy={handleOnCopyEvent}
              onChange={(value) => onValueChange(value)}
              onBlur={(value) => onValueBlur(value)}
              value={value ? value : ""}
            />
          );
        case "repeat_calendar_events":
          return (
            <RepeatCalenderEvents
              {...props}
              onCopy={handleOnCopyEvent}
              onChange={(value) => onValueChange(value)}
              value={value ? value : ""}
            />
          );
        // case "suggestion_box":
        //   return (
        //     <Suggestion
        //       {...props}
        //       onChange={(value) => onValueChange(value)}
        //       value={value ? value : ""}
        //     />
        //   );
        default:
          return (
            <VarChar
              {...props}
              onCopy={handleOnCopyEvent}
              onChange={(value) => onValueChange(value)}
              onBlur={(value) => onValueBlur(value)}
              value={value ? value : ""}
            />
          );
      }
  }
};

export default FormInput;
