import React, { useState } from "react";
import RelateFieldDialog from "./components/relate-field-dialog";
import RelateFieldInput from "./components/relate-field-input";
const AutoComplete = (props) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const toggleDialogVisibility = () => {
    setIsDialogVisible((v) => !v);
  };
  return (
    <>
      <RelateFieldInput
        {...props}
        isDialogVisible={isDialogVisible}
        toggleDialogVisibility={toggleDialogVisibility}
      />
      {isDialogVisible ? (
        <RelateFieldDialog
          {...props}
          isDialogVisible={isDialogVisible}
          toggleDialogVisibility={toggleDialogVisibility}
        />
      ) : null}
    </>
  );
};

export default AutoComplete;
