import React from "react";
import RelateFieldIconInput from "./components/relate-field-icon-input";
import RelateFieldTextInput from "./components/relate-field-text-input";

const RelateFieldInput = (props) => {
  const { isIconBtn } = props;
  return isIconBtn ? (
    <RelateFieldIconInput {...props} />
  ) : (
    <RelateFieldTextInput {...props} />
  );
};

export default RelateFieldInput;
