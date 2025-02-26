import { checkInitGroupValidate, isValidationApplied } from "@/common/utils";
import { useRef } from "react";
import {
  EVENT_TYPES,
  VALIDATION_CHECK_TYPES,
  validateEditForm,
} from "../form-validations";
import { LBL_REQUIRED_FIELD } from "@/constant";
import { isEmpty, pathOr } from "ramda";
const useFormValidator = () => {
  const refs = useRef({
    fields: {},
    values: {},
    errors: {},
    parseErrors: {},
    metadata: {},
    postErrorCallback: null,
    FCObj: null,
    panelState: {},
  }).current;

  const setInitConfig = (
    fields,
    values,
    FCObj,
    metadata,
    postErrorCallback,
  ) => {
    Object.assign(refs, {
      fields,
      values,
      FCObj,
      metadata,
      postErrorCallback,
    });
  };

  const validateFields = (
    values,
    eventType = EVENT_TYPES.onChange,
    customArgs = {},
  ) => {
    const { onChangeField = {} } = customArgs;
    const validationType =
      VALIDATION_CHECK_TYPES[eventType] ||
      VALIDATION_CHECK_TYPES[EVENT_TYPES.onChange];
    const prevErrors = (() => {
      if (eventType === EVENT_TYPES.onChange) {
        if (refs.errors?.hasOwnProperty(onChangeField.name)) {
          delete refs.errors[onChangeField.name];
        }
      }
      return refs.errors;
    })();
    // const validationFields =
    //   eventType === EVENT_TYPES.onChange
    //     ? isValidationApplied(onChangeField.name, refs.FCObj, refs.fields)
    //     : refs.fields;
    if (eventType === EVENT_TYPES.onSubmit) {
      return validateEditForm(refs.fields, values, refs.metadata, refs.FCObj);
    }
    return checkInitGroupValidate(
      refs.fields,
      values,
      refs.FCObj,
      true,
      prevErrors,
      validationType,
      refs.fields,
    );
  };

  const updateErrorStates = (eventType, fieldsErrorState) => {
    if (refs.postErrorCallback && Object.keys(fieldsErrorState).length > 0) {
      Object.entries(fieldsErrorState).forEach(([fieldKey, errorState]) => {
        if (
          eventType === EVENT_TYPES.onChange &&
          JSON.stringify(refs.parseErrors[fieldKey]) !==
            JSON.stringify(fieldsErrorState[fieldKey])
        ) {
          refs.postErrorCallback.setError(fieldKey, { types: errorState });
        } else if (eventType !== EVENT_TYPES.onChange) {
          refs.postErrorCallback.setError(fieldKey, { types: errorState });
        }
      });
    }
  };
  const updatePanelErrorStates = (eventType, fieldsErrorState) => {
    if (refs.postErrorCallback && Object.keys(fieldsErrorState).length > 0) {
      Object.entries(refs.postErrorCallback?.panelWiseFields ?? {}).forEach(
        ([panelKey, fields]) => {
          const flag = fields.some((fieldName) => {
            const fieldState = pathOr({}, [fieldName], fieldsErrorState);
            return (
              !isEmpty(fieldState) &&
              (Boolean(fieldState.visible) || Boolean(fieldState.disabled))
            );
          });
          refs.panelState = { ...refs.panelState, [panelKey]: flag };
          if (eventType !== EVENT_TYPES.onInit)
            refs.postErrorCallback.changeFormPanelState(panelKey, flag);
        },
      );
    }
  };
  const parseErrorObj = (
    errorObj,
    eventType,
    { onChangeField = null, isFormSubmitted = null },
  ) => {
    return Object.keys(refs.fields).reduce((acc, key) => {
      const error = errorObj[key];
      const errorType =
        typeof error === "object" ? error?.errorType || "" : error;
      const errorMessage =
        typeof error === "object" ? error?.messages || {} : error;
      const fieldObj = refs.fields[key];
      const isOnChangeError =
        isFormSubmitted &&
        errorType === EVENT_TYPES.onChange &&
        key === onChangeField?.name;
      acc[key] = {
        disabled: errorType === "ReadOnly",
        visible: errorType !== "InVisible",
        required:
          fieldObj?.required == "true" ||
          errorType === LBL_REQUIRED_FIELD ||
          (typeof fieldObj?.required !== "string" && !!fieldObj?.required),
        error:
          errorType &&
          errorType !== "InVisible" &&
          errorType !== "ReadOnly" &&
          (isOnChangeError ||
            (eventType !== EVENT_TYPES.onInit &&
              errorType !== EVENT_TYPES.onChange)),
        helperText:
          errorType &&
          errorType !== "InVisible" &&
          errorType !== "ReadOnly" &&
          (isOnChangeError
            ? errorMessage
            : eventType !== EVENT_TYPES.onInit &&
                errorType !== EVENT_TYPES.onChange
              ? errorMessage
              : null),
      };
      return acc;
    }, {});
  };

  const validationChecker = (
    eventType = EVENT_TYPES.onChange,
    {
      values = refs.values,
      onChangeField = {},
      errors = {},
      isFormSubmitted,
    } = {},
  ) => {
    const validationResult = validateFields(values, eventType, {
      onChangeField,
    });
    const newErrors = { ...errors, ...validationResult.errors };
    const fieldsErrorState = parseErrorObj(newErrors, eventType, {
      onChangeField,
      isFormSubmitted,
    });
    updateErrorStates(eventType, fieldsErrorState);
    updatePanelErrorStates(eventType, fieldsErrorState);
    refs.errors = { ...refs.errors, ...newErrors };
    refs.parseErrors = fieldsErrorState;
    refs.values = values;
    return { ...validationResult, fieldsErrorState };
  };
  const getPanelState = () => {
    return refs.panelState;
  };
  return { getPanelState, setInitConfig, validationChecker };
};
export default useFormValidator;
