import React, { useCallback, useState } from "react";
import RelateFieldDialog from "./components/relate-field-dialog";
import RelateFieldInput from "./components/RelateFieldInput";
import { PropTypes } from "prop-types";

const RelateField = (props) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const toggleDialogVisibility = useCallback(() => {
    setIsDialogVisible((v) => !v);
  }, []);
  return (
    <>
      <RelateFieldInput
        {...props}
        isDialogVisible={isDialogVisible}
        toggleDialogVisibility={toggleDialogVisibility}
      />
      {isDialogVisible && (
        <RelateFieldDialog
          {...props}
          isDialogVisible={isDialogVisible}
          toggleDialogVisibility={toggleDialogVisibility}
        />
      )}
    </>
  );
};

RelateField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

export default RelateField;
