import React from "react";
import CustomFormInput from "@/components/CustomFormInput";
import { pathOr } from "ramda";
import { useWatch } from "react-hook-form";
import { useFormStore } from "./hooks/useEditViewState";

const EditViewFormInput = (props) => {
  const { fieldMetaObj, customProps = {} } = props;
  const formId = pathOr(null, ["formId"], customProps);
  const fieldObj = useFormStore((state) =>
    pathOr(
      {},
      ["formMetaData", formId, "fieldData", fieldMetaObj?.name],
      state,
    ),
  );
  const dependentFields = pathOr([], ["dependentFields"], fieldObj);
  const control = pathOr({}, ["control"], customProps);
  const formValues = pathOr({}, ["formValues"], customProps);
  const watchedValues = useWatch({ control, name: dependentFields });
  const watchedValuesObj = dependentFields.reduce((acc, field, index) => {
    acc[field] = watchedValues[index];
    return acc;
  }, {});

  return (
    <CustomFormInput
      {...props}
      fieldMetaObj={fieldObj}
      control={control}
      customProps={{
        ...customProps,
        formValues: {
          ...formValues,
          ...watchedValuesObj,
        },
      }}
    />
  );
};

export default EditViewFormInput;
