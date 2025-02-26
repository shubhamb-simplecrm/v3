import { memo, useCallback, useMemo, lazy, Suspense } from "react";
import { isEmpty, isNil, pathOr } from "ramda";
import { Controller } from "react-hook-form";
import { PropTypes } from "prop-types";
import Skeleton from "@material-ui/lab/Skeleton";

const BoolField = lazy(() => import("./components/BoolField"));
const CurrencyField = lazy(() => import("./components/CurrencyField"));
const JSONEditor = lazy(() => import("./components/JSONEditor"));
const DateField = lazy(() => import("./components/DateField"));
const DateTimeContainerField = lazy(
  () => import("./components/DateTimeContainerField"),
);
const DynamicEnumField = lazy(() => import("./components/DynamicEnumField"));
const EnumField = lazy(() => import("./components/EnumField"));
const EnumContainerField = lazy(
  () => import("./components/EnumContainerField"),
);
const RadioGroupField = lazy(() => import("./components/RadioGroupField"));
const FileUploadField = lazy(() => import("./components/FileUploadField"));
// const FileUploadMultipleField = lazy(
//   () => import("./components/FileUploadMultipleField"),
// );
const NumericField = lazy(() => import("./components/NumericField"));
const AutoCompleteMultiEnumField = lazy(
  () => import("./components/AutoCompleteMultiEnumField"),
);
const AutoCompleteEmailMultiEnumField = lazy(
  () => import("./components/AutoCompleteEmailMultiEnumField"),
);
const ParentField = lazy(() => import("./components/ParentField"));
const RelateField = lazy(() => import("./components/RelateField"));
const TextAreaField = lazy(() => import("./components/TextAreaField"));
const UrlField = lazy(() => import("./components/UrlField"));
const TinyMceField = lazy(() => import("./components/TinyMceField"));
const LineItemField = lazy(() => import("./components/LineItemField"));
const AddressField = lazy(() => import("./components/AddressField"));
const EmailContainerField = lazy(
  () => import("./components/EmailContainerField"),
);
const NameField = lazy(() => import("./components/NameField"));
const CheckBoxGroup = lazy(() => import("./components/CheckBoxGroup"));
const Recipient = lazy(() => import("./components/Recipient"));
const Reminders = lazy(() => import("./components/Reminders"));
const ReminderTime = lazy(() => import("./components/ReminderTime"));
const PasswordField = lazy(() => import("./components/PasswordField"));
const RepeatCalenderEvents = lazy(
  () => import("./components/RepeatCalenderEvents"),
);

const DEFAULT_FIELD_COMPONENT = lazy(() => import("./components/VarCharField"));
const COMPONENT_MAPPING_FIELD_TYPE = new Map(
  Object.entries({
    bool: BoolField,
    JSONeditor: JSONEditor,
    currency: CurrencyField,
    date: DateField,
    datetime: DateTimeContainerField,
    datetimecombo: DateTimeContainerField,
    enum: EnumContainerField,
    dynamicenum: DynamicEnumField,
    radioenum: RadioGroupField,
    file: FileUploadField,
    image: FileUploadField,
    // multifile: FileUploadMultipleField,
    decimal: NumericField,
    float: NumericField,
    int: NumericField,
    multienum: AutoCompleteMultiEnumField,
    emailmultienum: AutoCompleteEmailMultiEnumField,
    parent: ParentField,
    assigned_user_name: RelateField,
    relate: RelateField,
    text: TextAreaField,
    iframe: UrlField,
    url: UrlField,
    wysiwyg: TinyMceField,
    line_item: LineItemField,
    address: AddressField,
    email: EmailContainerField,
    password: PasswordField,
    name: NameField,
    checkboxGroup: CheckBoxGroup,
    recipients: Recipient,
    reminder_time: ReminderTime,
    repeat_event: RepeatCalenderEvents,
    function: Reminders,
  }),
);
const COMPONENT_MAPPING_FIELD_NAME = new Map(
  Object.entries({
    email1: EmailContainerField,
  }),
);
const CustomFormInput = memo((props) => {
  const { control, field, fieldMetaObj, fieldState, disabled, error } = props;
  if (!fieldMetaObj?.name) return null;
  const FormInput = isNil(control) ? FormInputContainer : FormInputController;
  return (
    <FormInput
      {...props}
      fieldMetaObj={{ ...field, ...fieldMetaObj }}
      fieldState={{
        disabled,
        error: !isNil(error) && !isEmpty(error),
        helperText: error,
        ...fieldState,
      }}
    />
  );
});

const FormInputController = memo(({ fieldMetaObj, control, ...rest }) => (
  <Controller
    control={control}
    name={fieldMetaObj?.name}
    render={({ field, formState, fieldState, ...controllerProps }) => {
      const fieldErrorState = pathOr({}, ["error", "types"], fieldState);
      const parsedFieldState = useMemo(
        () => ({
          ...fieldErrorState,
          disabled: field.disabled || !!fieldErrorState?.disabled,
        }),
        [field.disabled, fieldErrorState],
      );

      return (
        <FormInputContainer
          {...rest}
          {...field}
          control={control}
          fieldMetaObj={fieldMetaObj}
          formState={formState}
          fieldState={parsedFieldState}
        />
      );
    }}
  />
));

const FormInputContainer = memo((props) => {
  const { fieldMetaObj, onChange, fieldState } = props;
  const isFieldVisible = pathOr(true, ["visible"], fieldState);
  const FieldComponent = useMemo(() => {
    let component = DEFAULT_FIELD_COMPONENT;
    if (COMPONENT_MAPPING_FIELD_NAME.has(fieldMetaObj?.name)) {
      component = COMPONENT_MAPPING_FIELD_NAME.get(fieldMetaObj?.name);
    } else if (COMPONENT_MAPPING_FIELD_TYPE.has(fieldMetaObj?.type)) {
      component = COMPONENT_MAPPING_FIELD_TYPE.get(fieldMetaObj?.type);
    }
    return component;
  }, [fieldMetaObj]);

  const handleChange = useCallback(
    (value) => {
      if (
        value &&
        value.target &&
        typeof value.target === "object" &&
        (value.target instanceof HTMLElement || "value" in value.target)
      ) {
        onChange(
          value.target.type === "checkbox"
            ? value.target.checked
            : value.target.value,
        );
      } else {
        onChange(value);
      }
    },
    [onChange],
  );
  return (
    <Suspense fallback={<Skeleton variant="text" sx={{ fontSize: "1rem" }} />}>
      <fieldset
        style={{ padding: 0, border: "none" }}
        data-fieldname={fieldMetaObj?.name}
        data-type={fieldMetaObj?.type}
        data-required={fieldMetaObj?.required ?? false}
      >
        {isFieldVisible ? (
          <FieldComponent {...props} onChange={handleChange} />
        ) : null}
      </fieldset>
    </Suspense>
  );
});

CustomFormInput.propTypes = {
  control: PropTypes.any,
  field: PropTypes.object,
  fieldMetaObj: PropTypes.object.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

CustomFormInput.defaultProps = {
  control: null,
  field: {},
  fieldState: {
    disabled: false,
    required: false,
    error: false,
    visible: true,
    helperText: null,
  },
  disabled: false,
  error: null,
  variant: "outlined",
};

export default CustomFormInput;
