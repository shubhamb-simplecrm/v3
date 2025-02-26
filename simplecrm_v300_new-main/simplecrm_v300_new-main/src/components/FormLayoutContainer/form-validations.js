// import { validateForm } from "@/common/utils";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";
import { checkFieldValidation, isValidURL } from "@/common/utils";
import {
  isBefore,
  isDecimal,
  isFloat,
  isImageFile,
  isInteger,
  isValidEmail,
  isValidPhone,
  isValidFile,
} from "@/common/validations";
import {
  LBL_CONFIRM_PASSWORD_MISMATCH,
  LBL_ENTER_SECURE_PASSWORD,
  LBL_ERROR_IS_NOT_BEFORE,
  LBL_INVALID_FILE_TYPE,
  LBL_INVALID_IMAGE_TYPE,
  LBL_INVALID_VALUE,
  LBL_REQUIRED_FIELD,
  LBL_VALUE_LIMIT_MSG,
} from "@/constant";
import { isEmpty, isNil, path, pathOr } from "ramda";

export const EVENT_TYPES = Object.freeze({
  onChange: "onChange",
  onInit: "onInit",
  onBlur: "onBlur",
  onSubmit: "onSubmit",
});

export const VALIDATION_CHECK_TYPES = {
  [`${EVENT_TYPES.onInit}`]: ["visible", "required", "readOnly", "validation"],
  [`${EVENT_TYPES.onChange}`]: [
    "visible",
    "required",
    "readOnly",
    "validation",
  ],
  [`${EVENT_TYPES.onBlur}`]: ["visible", "readOnly", "validation"],
  [`${EVENT_TYPES.onSubmit}`]: [
    "visible",
    "required",
    "readOnly",
    "invalid",
    "validation",
  ],
};
const validationRegexPatterns = {
  oneUpper: "(?=.*[A-Z])",
  oneLower: "(?=.*[a-z])",
  oneSpecial: "(?=.*[~!@#$%^&*])",
  oneNumber: "(?=.*\\d)",
  minLength: (len) => `.{${len},}`,
};

function checkNumberType(value) {
  return typeof value === "number" && !isNaN(value) && value;
}

// Utility functions for validation
const isFieldEmpty = (value) =>
  isNil(value) ||
  isEmpty(value) ||
  (Array.isArray(value) && value.length === 0);

const isRequiredAndEmpty = (fieldMetaObj, value) =>
  (fieldMetaObj?.required === "true" || fieldMetaObj.required === true) &&
  (isNil(value) || isEmpty(value));

const generateRegexPattern = (validationRules = {}) => {
  const { minLength = null, ...otherRules } = validationRules;
  let basePattern = "";
  if (otherRules) {
    basePattern = Object.entries(otherRules).reduce(
      (pattern, [rule, isEnabledOrValue]) => {
        const regexOrFunction = validationRegexPatterns[rule];
        if (!isEnabledOrValue || !regexOrFunction) return pattern;
        return (
          pattern +
          (typeof regexOrFunction === "function"
            ? regexOrFunction(isEnabledOrValue)
            : regexOrFunction)
        );
      },
      "",
    );
  }
  if (minLength)
    return basePattern + validationRegexPatterns.minLength(minLength);

  return basePattern;
};

// Specific validators for different types
const fieldValidatorsByType = {
  phone: (value, fieldMetaObj) => {
    if (isFieldEmpty(value.trim())) return null;
    return !isValidPhone(value.trim()) ? LBL_INVALID_VALUE : null;
  },
  parent: (value, fieldMetaObj, formValues) => {
    const parentModuleType = pathOr("", [`parent_type`], formValues);
    const parentRecordId = pathOr("", [`parent_id`], formValues);
    if (isFieldEmpty(parentModuleType) && isFieldEmpty(parentRecordId))
      return null;
    if (isFieldEmpty(parentModuleType))
      return {
        errorType: "required",
        messages: {
          parent_type: `Relate Module Required.`,
        },
      };
    if (isFieldEmpty(parentRecordId))
      return {
        errorType: "required",
        messages: {
          parent_name: `Relate Module Required.`,
        },
      };
  },
  email: (value, fieldMetaObj) => {
    if (isFieldEmpty(value)) return null;
    if (Array.isArray(value)) {
      let errors = {
        errorType: "invalid",
        messages: {},
      };
      value.map((emailField, key) => {
        let emailValue = pathOr("", ["email"], emailField);
        if (!isFieldEmpty(value) && !isValidEmail(emailValue.trim())) {
          errors["messages"][`${fieldMetaObj.name}-${key}`] = LBL_INVALID_VALUE;
        }
      });
      return !isEmpty(errors?.messages) ? errors : null;
    } else {
      return null;
    }
  },
  int: (value, fieldMetaObj) => {
    if (isFieldEmpty(value)) return null;
    let fieldValue = isNil(value) ? 0 : value.toString().replace(/\$|\,/g, "");
    fieldValue = parseFloat(fieldValue);
    let minValue = checkNumberType(parseInt(fieldMetaObj?.min))
      ? fieldMetaObj?.min
      : Number.MIN_SAFE_INTEGER;
    let maxValue = checkNumberType(parseInt(fieldMetaObj?.max))
      ? fieldMetaObj?.max
      : Number.MAX_VALUE;

    if (!isInteger(fieldValue) && !isFloat(fieldValue)) {
      return LBL_INVALID_VALUE;
    } else if (!(fieldValue >= minValue && fieldValue <= maxValue)) {
      return LBL_VALUE_LIMIT_MSG;
    }
    return null;
  },
  decimal: (value, fieldMetaObj) => {
    if (isFieldEmpty(value)) return null;
    let fieldValue = isNil(value) ? 0 : value.toString().replace(/\$|\,/g, "");
    fieldValue = parseFloat(fieldValue);
    let minValue = checkNumberType(parseFloat(fieldMetaObj?.min))
      ? fieldMetaObj?.min
      : Number.MIN_SAFE_INTEGER;
    let maxValue = checkNumberType(parseFloat(fieldMetaObj?.max))
      ? fieldMetaObj?.max
      : Number.MAX_VALUE;

    if (!isInteger(fieldValue) && !isFloat(fieldValue)) {
      return LBL_INVALID_VALUE;
    } else if (!(fieldValue >= minValue && fieldValue <= maxValue)) {
      return `Value is not in range between ${minValue} to ${maxValue}`;
    }
    return null;
  },
  float: (value, fieldMetaObj) => {
    if (isFieldEmpty(value)) return null;
    let fieldValue = isNil(value) ? 0 : value.toString().replace(/\$|\,/g, "");
    fieldValue = parseFloat(fieldValue);

    let minValue = checkNumberType(parseFloat(fieldMetaObj?.min))
      ? fieldMetaObj?.min
      : Number.MIN_SAFE_INTEGER;
    let maxValue = checkNumberType(parseFloat(fieldMetaObj?.max))
      ? fieldMetaObj?.max
      : Number.MAX_VALUE;

    if (!isInteger(fieldValue) && !isFloat(fieldValue)) {
      return LBL_INVALID_VALUE;
    } else if (!(fieldValue >= minValue && fieldValue <= maxValue)) {
      return `Value is not in range between ${minValue} to ${maxValue}`;
    }
    return null;
  },
  url: (value) => {
    if (isFieldEmpty(value)) return null;
    return !isValidURL(value) ? LBL_INVALID_VALUE : null;
  },
  name: (value, fieldMetaObj, formValues, viewName) => {
    if (isFieldEmpty(value)) return null;
    const isInvalidValue =
      (fieldMetaObj?.name === "first_name" ||
        fieldMetaObj?.name === "last_name") &&
      !value.match(/^[a-zA-Z0-9- .()_:]*$/);
    const maxLengthLimit = pathOr(Number.MAX_VALUE, ["len"], fieldMetaObj);
    if (isInvalidValue) {
      return LBL_INVALID_VALUE;
    } else if (value.length > maxLengthLimit) {
      return `value is exceed provided limit - ${maxLengthLimit} character`;
    }
    return null;
  },
  JSONeditor: (value) => {
    const isValidValue = typeof value !== "object" || value === null;
    return !isValidValue ? LBL_INVALID_VALUE : null;
  },
  password: (value, fieldMetaObj, formValues) => {
    const { validation = {} } = fieldMetaObj;
    const { isPasswordValidationApplied = false } = validation;
    const regexPattern = generateRegexPattern(validation);
    const passwordExp = new RegExp(regexPattern);
    if (
      isFieldEmpty(value) ||
      fieldMetaObj.name === "user_hash" ||
      fieldMetaObj.name == "old_password"
    )
      return null;
    if (
      fieldMetaObj.name === "confirm_new_password" &&
      formValues?.hasOwnProperty("new_password") &&
      formValues?.new_password?.trim() !== value?.trim()
    ) {
      return LBL_CONFIRM_PASSWORD_MISMATCH;
    } else if (isPasswordValidationApplied) {
      if (
        formValues?.hasOwnProperty("old_password") &&
        fieldMetaObj.name == "new_password"
      ) {
        if (
          !isFieldEmpty(formValues?.old_password) &&
          !value.trim().match(passwordExp)
        ) {
          return LBL_ENTER_SECURE_PASSWORD;
        } else if (
          isFieldEmpty(formValues?.old_password) &&
          !isFieldEmpty(value)
        ) {
          return "Old password is Required";
        }
      } else if (
        !isFieldEmpty(value.trim()) &&
        !value.trim().match(passwordExp)
      ) {
        return LBL_ENTER_SECURE_PASSWORD;
      }
    }

    return null;
  },
  image: (value, fieldMetaObj, formValues, viewName) => {
    if (!!fieldMetaObj?.multi) return null;
    if (
      viewName == LAYOUT_VIEW_TYPE?.createView ||
      viewName == LAYOUT_VIEW_TYPE?.editView ||
      viewName == LAYOUT_VIEW_TYPE?.quickCreateView
    ) {
      let fileName = Array.isArray(value)
        ? pathOr(null, [0, "name"], value)
        : value;
      if (isRequiredAndEmpty(fieldMetaObj, fileName)) {
        return LBL_REQUIRED_FIELD;
      } else if (!isFieldEmpty(fileName) && !isImageFile(fileName)) {
        return LBL_INVALID_IMAGE_TYPE;
      }
    }
    return null;
  },
  file: (value, fieldMetaObj, formValues, viewName) => {
    if (!!fieldMetaObj?.multi) return null;
    if (
      viewName == LAYOUT_VIEW_TYPE?.createView ||
      viewName == LAYOUT_VIEW_TYPE?.editView ||
      viewName == LAYOUT_VIEW_TYPE?.quickCreateView
    ) {
      const fileName = pathOr(null, [0, "name"], value);
      if (isRequiredAndEmpty(fieldMetaObj, fileName)) {
        return LBL_REQUIRED_FIELD;
      } else if (!isFieldEmpty(fileName) && !isValidFile(fileName)) {
        return LBL_INVALID_FILE_TYPE;
      }
      return null;
    }
  },
  function: (value, fieldMetaObj, formValues, viewName) => {
    return null;
  },
  relate: (value, fieldMetaObj, formValues, viewName) => {
    if (
      !!fieldMetaObj?.required &&
      typeof value === "object" &&
      isFieldEmpty(value?.id ?? "") &&
      isFieldEmpty(value?.value ?? "")
    ) {
      return LBL_REQUIRED_FIELD;
    }
    return null;
  },
};

const validateField = (
  fieldName,
  fieldMetaObj,
  formValues,
  errorsObj,
  moduleMetaData,
) => {
  const { viewName = LAYOUT_VIEW_TYPE?.createView, currentModule } =
    moduleMetaData;
  const value = formValues[fieldName];
  const validator = fieldValidatorsByType[fieldMetaObj.type];
  let isValid = true;
  // Custom validations for specific fields
  if (currentModule == "Users") {
    if (
      ["old_password", "confirm_new_password", "new_password"].includes(
        fieldName,
      )
    ) {
      if (isFieldEmpty(formValues?.old_password)) {
        fieldMetaObj["required"] = false;
      } else {
        fieldMetaObj["required"] = true;
      }
    }
    if (
      fieldName == "confirm_new_password" &&
      !isFieldEmpty(formValues?.new_password)
    ) {
      fieldMetaObj["required"] = true;
    }
  } else if (fieldName === "case_number") {
    fieldMetaObj["required"] = false;
  } else if (fieldName === "state" && currentModule === "Cases") {
    let stateVal = pathOr("", ["state"], formValues);
    let resolutionVal = pathOr("", ["resolution"], formValues);
    if (stateVal === "Closed" && isFieldEmpty(resolutionVal)) {
      errorsObj["resolution"] = LBL_REQUIRED_FIELD;
      isValid = false;
    } else {
      if (errorsObj.hasOwnProperty("resolution")) {
        delete errorsObj["resolution"];
      }
    }
  } else if (fieldName == "date_start" && formValues[fieldName]) {
    const dynamicEndDateFieldName =
      currentModule === "Tasks" ? "date_due" : "date_end";
    if (
      formValues.hasOwnProperty(dynamicEndDateFieldName) &&
      formValues.hasOwnProperty(dynamicEndDateFieldName) &&
      !isFieldEmpty(formValues[dynamicEndDateFieldName])
    ) {
      if (
        !isBefore(formValues[fieldName], formValues[dynamicEndDateFieldName])
      ) {
        isValid = false;
        errorsObj[fieldName] =
          `${fieldMetaObj.label} (${formValues[fieldName]}) ${LBL_ERROR_IS_NOT_BEFORE} ${formValues[dynamicEndDateFieldName]}`;
      }
    }
    if (
      formValues.hasOwnProperty(dynamicEndDateFieldName) &&
      !isFieldEmpty(formValues[dynamicEndDateFieldName])
    ) {
      if (
        !isBefore(formValues[fieldName], formValues[dynamicEndDateFieldName])
      ) {
        isValid = false;
        errorsObj[fieldName] =
          `${fieldMetaObj.label} (${formValues[fieldName]}) ${LBL_ERROR_IS_NOT_BEFORE} ${formValues[dynamicEndDateFieldName]}`;
      }
    }
  }

  if (isRequiredAndEmpty(fieldMetaObj, value)) {
    errorsObj[fieldName] = LBL_REQUIRED_FIELD;
    isValid = false;
  } else if (!isNil(validator)) {
    // Type-specific validation
    const errorMessage = validator(value, fieldMetaObj, formValues, viewName);
    if (!isNil(errorMessage)) {
      errorsObj[fieldName] = errorMessage;
      isValid = false;
    }
  }

  return isValid;
};

export const validateEditForm = (
  fieldsMetaObj,
  formValues,
  moduleMetaData,
  fieldConfiguration = {},
) => {
  let errorsObj = {};
  let formIsValid = true;
  Object.entries(fieldsMetaObj).forEach(([fieldName, fObj]) => {
    const fieldMetaObj = { ...fObj };
    const getValidationObj = checkFieldValidation(
      fieldMetaObj,
      formValues,
      fieldConfiguration,
      formIsValid,
      errorsObj,
      VALIDATION_CHECK_TYPES[EVENT_TYPES?.onSubmit],
      fieldsMetaObj,
    );
    if (pathOr(false, ["status"], getValidationObj)) {
      formIsValid = pathOr(formIsValid, ["formIsValid"], getValidationObj);
      errorsObj = pathOr(errorsObj, ["errors"], getValidationObj);
    }
    const isValid = validateField(
      fieldName,
      fieldMetaObj,
      formValues,
      errorsObj,
      moduleMetaData,
    );
    formIsValid = formIsValid && isValid;
  });

  const tempArr = Object.values(errorsObj).reduce((pv, cv) => {
    if (cv !== "ReadOnly" && cv !== "InVisible") {
      pv.push(cv);
    }
    return pv;
  }, []);
  formIsValid = isEmpty(tempArr);

  return { formIsValid, errors: errorsObj };
};
