import React, { memo, useMemo } from "react";
import {
  LinkLabel,
  ParentLabel,
  StatusLabel,
  TextLabel,
  RelateLabel,
  DateLabel,
  BoolLabel,
  CurrencyLabel,
  UrlLabel,
  FileLabel,
  ImageLabel,
  EmailLabel,
  ListActionOption,
  PhoneLabel,
} from "./components";
import { pathOr } from "ramda";

export const DISPLAY_LABEL_CONSTANT = {
  listActionOption: "listActionOption",
  link: "link",
  email: "email",
  text: "text",
  chip: "chip",
  parent: "parent",
  relate: "relate",
  date: "date",
  currency: "currency",
  bool: "bool",
  url: "url",
  file: "file",
  image: "image",
  phone: "phone",
};
const DISPLAY_COMPONENT_CONSTANT = {
  [DISPLAY_LABEL_CONSTANT?.listActionOption]: ListActionOption,
  [DISPLAY_LABEL_CONSTANT?.link]: LinkLabel,
  [DISPLAY_LABEL_CONSTANT?.email]: EmailLabel,
  [DISPLAY_LABEL_CONSTANT?.text]: TextLabel,
  [DISPLAY_LABEL_CONSTANT?.chip]: StatusLabel,
  [DISPLAY_LABEL_CONSTANT?.parent]: ParentLabel,
  [DISPLAY_LABEL_CONSTANT?.relate]: RelateLabel,
  [DISPLAY_LABEL_CONSTANT?.date]: DateLabel,
  [DISPLAY_LABEL_CONSTANT?.currency]: CurrencyLabel,
  [DISPLAY_LABEL_CONSTANT?.bool]: BoolLabel,
  [DISPLAY_LABEL_CONSTANT?.url]: UrlLabel,
  [DISPLAY_LABEL_CONSTANT?.file]: FileLabel,
  [DISPLAY_LABEL_CONSTANT?.image]: ImageLabel,
  [DISPLAY_LABEL_CONSTANT?.phone]: PhoneLabel,
};
export const DisplayLabelComponent = memo((props) => {
  const { labelType = null, formData = {}, customArgs } = props;
  const ACLAccessObj = pathOr(
    "",
    [
      pathOr("", ["tableMeta", "rowIndex"], customArgs),
      "attributes",
      "ACLAccess",
    ],
    formData,
  );
  const LabelComponentItem = () => {
    const ComponentItem =
      DISPLAY_COMPONENT_CONSTANT[labelType] ||
      DISPLAY_COMPONENT_CONSTANT["text"];
    return (
      <ComponentItem {...props} customArgs={{ ...customArgs, ACLAccessObj }} />
    );
  };
  return <LabelComponentItem />;
});
