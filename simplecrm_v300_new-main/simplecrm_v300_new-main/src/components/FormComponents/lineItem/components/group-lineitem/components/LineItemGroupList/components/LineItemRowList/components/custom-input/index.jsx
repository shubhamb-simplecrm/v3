import { memo } from "react";
import { FormInput } from "../../../../../../../../../..";
const CustomInput = memo(
  ({ methods, module, lineItemGroupName, initialValues, field }) => {
    const {
      field: { onChange, onBlur, value, name, ref },
      fieldState: { invalid, isTouched, isDirty, error },
      formState,
    } = methods;
    return (
      <FormInput
        field={field}
        key={field.field_key}
        rows={3}
        value={value}
        readOnly={
          field.name === "product_total_price" ||
          field.name === "vat_amt" ||
          field.name === "gst_c" ||
          field.name === "uom_c" ||
          field.name === "tax_class_c" ||
          field.name === "hsn_code_c" ||
          field.name === "sac_code_c"
        }
        disabled={
          field.name === "tax_class_c" ||
          field.name === "hsn_code_c" ||
          field.name === "sac_code_c"
            ? true
            : false
        }
        small={true}
        variant="standard"
        module={module}
        onChange={onChange}
        lineItemGroupName={lineItemGroupName}
        initialValues={initialValues}
      />
    );
  },
  // (prevProps, nextProps) =>
  //   prevProps.formState.isDirty === nextProps.formState.isDirty,
);

export default CustomInput;
