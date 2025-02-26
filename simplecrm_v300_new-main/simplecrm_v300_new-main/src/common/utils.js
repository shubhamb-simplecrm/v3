import { isEmpty, isNil, pathOr, trim } from "ramda";
import {
  LBL_REQUIRED_FIELD,
  LBL_INVALID_VALUE,
  LBL_INVALID_IMAGE_TYPE,
  LBL_CONFIRM_PASSWORD_MISMATCH,
  LBL_ENTER_SECURE_PASSWORD,
  LBL_INVALID_FILE_TYPE,
  LBL_INVALID_NAME,
  LBL_ERROR_IS_NOT_BEFORE,
  LBL_MAX_FILE_SIZE_MSG,
  LBL_INVALID_FILE_TYPE_MSG,
  LBL_MIN_FILE_SIZE_MSG,
  LBL_NO_FILE_SELECTED_MSG,
} from "../constant";
import {
  isValidPhone,
  isValidEmail,
  isInteger,
  isDecimal,
  isFloat,
  isBefore,
  isImageFile,
  isValidFile,
} from "./validations";
import { api } from "./api-utils";
import { DATE_RANGE_TYPE } from "@/constant/date-constants";

export const formatDate = (date, format = "MM/dd/yyyy") => {
  return date;
};

export const textEllipsis = (text, size) => {
  return typeof text === "string" && text.length > size
    ? text.substring(0, size - 3) + "..."
    : text;
};
export const validateDashletForm = (initialState) => {
  let errors = [];
  let formIsValid = true;
  let checkFieldsArr = [
    {
      name: "title",
      required: true,
      type: "name",
    },
    {
      name: "dashletTitle",
      required: true,
      type: "name",
    },
    {
      name: "url",
      required: true,
      type: "url",
    },
  ];
  checkFieldsArr.forEach((field) => {
    if (initialState.hasOwnProperty(field.name)) {
      let value = pathOr(null, [field.name], initialState);
      if (field.required && !value) {
        errors[field.name] = LBL_REQUIRED_FIELD;
        formIsValid = false;
      }
      switch (field.type) {
        case "url":
          if (!isValidURL(initialState.url)) {
            errors[field.name] = LBL_INVALID_VALUE;
            formIsValid = false;
          }
          break;
        case "name":
          if (value && !value.match(/^[a-zA-Z0-9-.()_&|/: ]*$/)) {
            formIsValid = false;
            errors[field.name] = LBL_INVALID_NAME;
          }
          break;
        default:
          break;
      }
    }
  });

  return { formIsValid: formIsValid, errors: errors };
};

//START: Field configurator condition checking function added by Roshan S

export const isValidationApplied = (field, fieldConfigurator = {}, fields) => {
  let result = [];
  Object.keys(fieldConfigurator).map((fieldData) => {
    Object.keys(fieldConfigurator[fieldData]).map((validationType) => {
      const fieldConfigData = pathOr(
        pathOr(
          [],
          [fieldData, validationType, "conditionGroup"],
          fieldConfigurator,
        ),
        [fieldData, validationType, "conditionGroup", "rules"],
        fieldConfigurator,
      );

      for (let i in fieldConfigData) {
        if (checkConditionApplied(fieldConfigData[i], field)) {
          result[fieldData] = fields[fieldData];
        }
      }
    });
  });
  return Object.assign({}, result); //.filter((v, i, a) => a.indexOf(v) === i);
};

export const checkConditionApplied = (defs, field) => {
  defs = defs || {};
  let type = defs.type || defs.combinator || defs.operator || "equals";

  if (~["or", "and", "not"].indexOf(type)) {
    return isValidationApplied(field, defs);
  }
  if (defs.attribute === field || defs.field === field) {
    return true;
  } else {
    return false;
  }
};

export const checkInitGroupValidate = (
  fields,
  values,
  fieldConfigurator = {},
  formIsValid,
  errors,
  TypeList = ["visible", "required", "readOnly", "invalid", "validation"],
  allFields,
) => {
  const status = false;
  Object.keys(fields).map((fieldNum) => {
    let field = fields[fieldNum];
    let getValidation = checkFieldValidation(
      field,
      values,
      fieldConfigurator,
      formIsValid,
      errors,
      TypeList,
      allFields,
    );
    if (
      pathOr(
        pathOr(false, ["status"], getValidation),
        ["status", "status"],
        getValidation,
      )
    ) {
      const newErrors = pathOr(errors, ["status", "errors"], getValidation);
      formIsValid = pathOr(formIsValid, ["formIsValid"], getValidation);
      Object.keys(newErrors).map((er) => {
        let hasKey = errors.hasOwnProperty(er);
        if (hasKey) {
          errors[er] =
            newErrors[er] !== errors[er] ? "InVisible" : newErrors[er];
        } else {
          errors[er] = newErrors[er];
        }
      });
    }
  });
  return { status, formIsValid, errors };
};

export const checkFieldValidation = (
  field,
  values,
  fieldConfigurator = {},
  formIsValid,
  errors,
  TypeList = ["visible", "required", "readOnly", "invalid", "validation"],
  allFields,
) => {
  let fieldConfigValidate = false;
  if (fieldConfigurator.hasOwnProperty(field?.name)) {
    const isFieldExist = pathOr([], [field.name], fieldConfigurator);
    TypeList.forEach((type) => {
      if (!isFieldExist[type]) {
        return;
      }
      let typeItem = isFieldExist[type] || {};
      if (
        (isEmpty(typeItem?.conditionGroup?.rules) ||
          isNil(typeItem?.conditionGroup?.rules)) &&
        type != "validation"
      ) {
        return;
      }
      const fieldConfigData = pathOr(
        pathOr([], ["conditionGroup"], typeItem),
        ["conditionGroup", "rules"],
        typeItem,
      );
      fieldConfigValidate =
        type === "validation"
          ? checkRegExpCondition(
              typeItem.validation_regExp,
              values[field.name],
              field,
            )
          : checkConditionGroup(
              field,
              fieldConfigData,
              values,
              "and",
              type,
              allFields,
            );
      if (pathOr(fieldConfigValidate, ["status"], fieldConfigValidate)) {
        if (type === "visible") {
          delete errors[field.name];
        } else if (type === "readOnly" && errors[field.name] !== "InVisible") {
          const errorsArr = Object.values(errors);
          if (
            !errorsArr.includes("Invalid Selection") &&
            !errorsArr.includes(LBL_REQUIRED_FIELD)
          ) {
            formIsValid = true;
          }
          errors[field.name] = "ReadOnly";
        } else if (type === "invalid") {
          formIsValid = false;
          const getInvalidField = pathOr(
            pathOr(
              field.name,
              ["field", "value", 0, "attribute"],
              fieldConfigValidate,
            ),
            ["field", "attribute"],
            fieldConfigValidate,
          );
          errors[getInvalidField] = "Invalid Selection";
        } else if (type === "required") {
          formIsValid = false;
          errors[field.name] = LBL_REQUIRED_FIELD;
        } else if (type === "validation") {
          formIsValid = false;
          errors[field.name] = typeItem.validation_message
            ? typeItem.validation_message
            : "Invalid Selection";
        }
      } else {
        if (type === "visible" && errors[field.name] != LBL_REQUIRED_FIELD) {
          errors[field.name] = "InVisible";
        } else if (type === "readOnly" && errors[field.name] === "ReadOnly") {
          delete errors[field.name];
        } else if (
          type === "invalid" &&
          errors[field.name] === "Invalid Selection"
        ) {
          delete errors[field.name];
        }
        // else if (type === "validation") {
        //   console.log("validationFalseCondition", field.name)
        // }
        // else if(type==='required'){
        //   delete errors[field.name];
        // }
      }
    });
  }
  if (
    errors[field.name] !== "InVisible" &&
    (field?.disabled == "true" ||
      field?.disabled == true ||
      field?.disabled == 1 ||
      field?.disabled == "1")
  ) {
    errors[field.name] = "ReadOnly";
  }

  return { status: fieldConfigValidate, formIsValid, errors };
};

//conditions and/or/not-
export const checkConditionGroup = (
  field,
  data,
  values,
  type = "and",
  validationType,
  allFields,
) => {
  // type = type || 'and';
  let list;
  const isOrExist = data.some((element) => element.type === "or");
  let result = { status: false, field: {} };
  let mainResult = [];
  if (type === "and") {
    list = data || [];
    result = { status: true, field: {} }; //pathOr({},[0],data)
    for (let i in list) {
      let conditionResult = checkCondition(
        list[i],
        field,
        values,
        validationType,
        allFields,
      );
      if (!conditionResult) {
        let rowNumber = parseInt(i) + 1;
        if (
          pathOr(false, [rowNumber], list) &&
          pathOr("equals", [rowNumber, "combinator"], list) === "or"
        ) {
          result = checkConditionGroup(
            field,
            pathOr(
              pathOr([], [rowNumber, "value"], list),
              [rowNumber, "rules"],
              list,
            ),
            values,
            type,
            validationType,
            allFields,
          );
          break;
        } else {
          result = false; //{ status: false, type:type,field: list[i] };
          break;
        }
      }
    }
  } else if (type === "or") {
    list = data || [];
    for (let i in list) {
      if (checkCondition(list[i], field, values, validationType, allFields)) {
        result = true;
        break;
      }
    }
  } else if (type === "not") {
    list = data || [];
    for (let i in list) {
      result = !checkCondition(
        list[i],
        field,
        values,
        validationType,
        allFields,
      );
      break;
    }
  }
  return result;
};

export const checkCondition = (
  defs,
  field,
  values,
  validationType,
  allFields,
) => {
  defs = defs || {};
  let type = defs.type || defs.combinator || defs.operator || "equals";

  if (~["or", "and", "not"].indexOf(type) && defs.rules.length) {
    let defsValue = defs.value || defs.rules;
    return checkConditionGroup(
      field,
      defsValue,
      values,
      type,
      validationType,
      allFields,
    );
  }
  let attribute = defs.attribute || defs.field;
  let value = defs.value;
  if (!attribute) {
    return;
  }
  const setValue = pathOr("", [attribute], values);

  if (type === "equals" || type === "=") {
    if (!value) {
      if (value == false) {
        return false === value;
      }
      return;
    }
    if (defs && allFields[defs.field]?.type === "bool") {
      if (setValue == true) {
        if (validationType === "required" && true === value) {
          return isEmpty(values[field.name]) || isNil(values[field.name]);
        } else {
          return true === value;
        }
      } else {
        if (validationType === "required" && false === value) {
          return isEmpty(values[field.name]) || isNil(values[field.name]);
        } else {
          return false === value;
        }
      }
    }
    if (defs.field === "parent_type") {
      let options = allFields["parent_name"].options;
      let optionValue = "";
      Object.entries(options).map((item) => {
        if (item[0] === values.parent_name.parent_type) {
          optionValue = item[1];
        }
      });
      return optionValue === value;
    }
    if (defs.field === "parent_id") {
      return values.parent_name.parent_id === value;
    }
    if (defs.field === "parent_name") {
      return values.parent_name.parent_name === value;
    }
    if (defs.field === "email_reminder_time") {
      let options = allFields["reminder_time"].options;
      let optionValue = "";
      Object.entries(options).map((item) => {
        if (item[0] === values.reminder_time.email_reminder_time) {
          optionValue = item[1];
        }
      });
      return optionValue === value;
    }
    if (defs.field === "popup_reminder_time") {
      let options = allFields["reminder_time"].options;
      let optionValue = "";
      Object.entries(options).map((item) => {
        if (item[0] === values.reminder_time.reminder_time) {
          optionValue = item[1];
        }
      });
      return optionValue === value;
    }
    if (defs && allFields[defs.field]?.type === "multienum") {
      let formattedValue = value;
      let formattedSetValue = setValue;

      if (typeof value == "string") {
        formattedValue = value.split(",");
      }
      if (typeof setValue == "string") {
        formattedSetValue = setValue.split(",");
      }
      if (validationType === "required") {
        let result = false;
        if (
          formattedValue.every((item) => formattedSetValue.includes(item)) &&
          formattedSetValue.every((item) => formattedValue.includes(item))
        ) {
          result = isEmpty(values[field.name]) || isNil(values[field.name]);
        }
        return result;
      } else {
        return (
          formattedValue.every((item) => formattedSetValue.includes(item)) &&
          formattedSetValue.every((item) => formattedValue.includes(item))
        );
      }
    }
    if (
      defs &&
      allFields[defs.field]?.type === "relate" &&
      typeof setValue === "object"
    ) {
      if (validationType === "required") {
        if (setValue.id === value) {
          return isEmpty(values[field.name]) || isNil(values[field.name]);
        }
      } else {
        return setValue.id === value;
      }
    }
    if (defs && allFields[defs.field]?.type === "wysiwyg") {
      let formattedSetValue = setValue
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, "")
        .replace(/;/g, "");
      return formattedSetValue.trim() === value;
    }
    if (defs && allFields[defs.field]?.type === "email") {
      let formattedSetValue = setValue[0]?.email;
      if (formattedSetValue) {
        return formattedSetValue.trim() === value;
      } else {
        return false;
      }
    }
    // return false;
    if (validationType === "required") {
      if (
        field.type == "parent"
          ? setValue?.id?.trim() === value
          : setValue?.trim() === value
      ) {
        return isEmpty(values[field.name]) || isNil(values[field.name]);
      }
    } else {
      return setValue?.trim() === value;
    }
  }
  if (type === "anyoneof") {
    if (!value) {
      return;
    }
    let formattedValue = value;
    let formattedSetValue = setValue;
    if (typeof value == "number") {
      formattedValue = value.toString().split(",");
    }
    if (typeof setValue == "number") {
      formattedSetValue = setValue.toString().split(",");
    }
    if (typeof value == "string") {
      formattedValue = value.split(",");
    }
    if (typeof setValue == "string") {
      formattedSetValue = setValue.split(",");
    }
    if (
      allFields[defs.field]?.type === "dynamicenum" ||
      allFields[defs.field]?.type === "enum"
    ) {
      let options = allFields[defs.field].options;
      let fValueArr = [];
      Object.entries(options).map((item) => {
        formattedSetValue.map((fValue) => {
          if (item[1] === fValue) {
            fValueArr.push(item[0]);
            formattedSetValue = fValueArr;
          }
        });
      });
    }
    if (validationType === "required") {
      if (formattedSetValue.every((item) => formattedValue.includes(item))) {
        if (field.type === "relate") {
          return (
            isEmpty(values[field.name]?.id) ||
            isNil(values[field.name]?.id) ||
            isEmpty(values[field.name]) ||
            isNil(values[field.name]) ||
            typeof values[field.name]?.id == "undefined"
          );
        }
        return (
          isEmpty(values[field.name]) ||
          isNil(values[field.name]) ||
          values[field.name] == "0"
        );
      }
    } else {
      return formattedSetValue.every((item) => formattedValue.includes(item));
    }
    // return false;
  }

  if (type === "notEquals" || type === "!=") {
    if (!value) {
      return;
    }
    if (
      defs &&
      allFields[defs.field]?.type === "relate" &&
      typeof setValue === "object"
    ) {
      if (validationType === "required") {
        if (setValue.id !== value) {
          return isEmpty(values[field.name]) || isNil(values[field.name]);
        }
      } else {
        return setValue.id !== value;
      }
    }
    if (validationType === "required" && setValue !== value) {
      return isEmpty(values[field.name]) || isNil(values[field.name]);
    }
    return setValue !== value;
  }

  if (type === "isEmpty" || type === "null") {
    if (Array.isArray(setValue)) {
      return !setValue.length;
    }

    if (validationType === "required") {
      if (
        allFields?.[defs.field]?.type == "relate"
          ? typeof setValue?.id == "undefined" ||
            isEmpty(setValue?.id) ||
            isNil(setValue?.id)
          : typeof setValue == "undefined" ||
            isEmpty(setValue) ||
            isNil(setValue)
      ) {
        return field.type == "relate"
          ? isEmpty(values[field.field_key]?.id) ||
              isNil(values[field.field_key]?.id) ||
              values[field.field_key]?.id == undefined
          : isEmpty(values[field.field_key]) ||
              isNil(values[field.field_key]) ||
              values[field.field_key] == undefined;
      }
    } else {
      if (allFields?.[defs.field]?.type == "relate") {
        return (
          typeof setValue?.id == "undefined" ||
          isEmpty(setValue?.id) ||
          isNil(setValue?.id)
        );
      }
      return (
        typeof setValue == "undefined" || isEmpty(setValue) || isNil(setValue)
      );
    }
  }

  if (type === "isNotEmpty" || type === "notNull") {
    if (Array.isArray(setValue)) {
      return !!setValue.length;
    }
    if (validationType === "required") {
      if (
        allFields?.[defs.field]?.type == "relate"
          ? setValue?.id !== null &&
            setValue?.id !== "" &&
            setValue?.id !== undefined
          : setValue !== null && setValue !== "" && setValue !== undefined
      ) {
        return field.type == "relate"
          ? isEmpty(values[field.field_key]?.id) ||
              isNil(values[field.field_key]?.id) ||
              values[field.field_key]?.id == undefined
          : isEmpty(values[field.field_key]) ||
              isNil(values[field.field_key]) ||
              values[field.field_key] == undefined;
      }
    } else {
      if (
        allFields?.[defs.field]?.type == "relate" &&
        typeof setValue != "string"
      ) {
        return (
          setValue?.id !== null &&
          setValue?.id !== "" &&
          typeof setValue?.id !== "undefined" &&
          setValue?.value !== null &&
          setValue?.value !== "" &&
          typeof setValue?.value !== "undefined"
        );
      }
      return (
        setValue !== null && setValue !== "" && typeof setValue !== "undefined"
      );
    }
  }

  if (type === "isTrue") {
    return !!setValue;
  }

  if (type === "isFalse") {
    return !setValue;
  }

  if (type === "contains" || type === "has") {
    if (!setValue) {
      return false;
    }
    return !!~setValue.indexOf(value);
  }

  if (
    type === "notContains" ||
    type === "notHas" ||
    type === "doesNotContain"
  ) {
    if (!setValue) {
      return true;
    }
    return !~setValue.indexOf(value);
  }

  if (type === "startsWith" || type === "beginsWith") {
    setValue.trim();
    if (!setValue) {
      return false;
    }
    return setValue.trim().indexOf(value) === 0;
  }

  if (type === "endsWith") {
    setValue.trim();
    if (!setValue) {
      return false;
    }
    return setValue.trim().endsWith(value);
  }

  if (type === "matches") {
    if (!setValue) {
      return false;
    }
    let match = /^\/(.*)\/([a-z]*)$/.exec(value);
    if (!match || match.length < 2) {
      return false;
    }

    return new RegExp(match[1], match[2]).test(setValue);
  }

  if (type === "greaterThan" || type === ">") {
    return parseInt(setValue) > parseInt(value);
  }

  if (type === "lessThan" || type === "<") {
    return parseInt(setValue) < parseInt(value);
  }

  if (type === "greaterThanOrEquals" || type === ">=") {
    return parseInt(setValue) >= parseInt(value);
  }

  if (type === "lessThanOrEquals" || type === "<=") {
    return parseInt(setValue) <= parseInt(value);
  }

  if (type === "in") {
    return ~value.indexOf(setValue);
    //for multiple options
  }

  if (type === "notIn") {
    return !~value.indexOf(setValue);
  }

  // if (type === 'isToday') {
  //     let dateTime = this.recordView.getDateTime();

  //     if (!setValue) {
  //         return false;
  //     }

  //     if (setValue.length > 10) {
  //         return dateTime.toMoment(setValue).isSame(dateTime.getNowMoment(), 'day');
  //     }

  //     return dateTime.toMomentDate(setValue).isSame(dateTime.getNowMoment(), 'day');
  // }

  // if (type === 'inFuture') {
  //     let dateTime = this.recordView.getDateTime();

  //     if (!setValue) {
  //         return false;
  //     }

  //     if (setValue.length > 10) {
  //         return dateTime.toMoment(setValue).isAfter(dateTime.getNowMoment(), 'day');
  //     }

  //     return dateTime.toMomentDate(setValue).isAfter(dateTime.getNowMoment(), 'day');
  // }

  // if (type === 'inPast') {
  //     let dateTime = this.recordView.getDateTime();

  //     if (!setValue) {
  //         return false;
  //     }

  //     if (setValue.length > 10) {
  //         return dateTime.toMoment(setValue).isBefore(dateTime.getNowMoment(), 'day');
  //     }

  //     return dateTime.toMomentDate(setValue).isBefore(dateTime.getNowMoment(), 'day');
  // }

  return false;
};

//logic for masking condition
export const checkMaskingCondition = (
  fieldConfiguratorData,
  values,
  type,
  fields = {},
) => {
  Object.entries(values).map((field) => {
    if (fieldConfiguratorData?.[field?.[0]]) {
      if (fieldConfiguratorData[field[0]]?.[type]) {
        let maskingPattern =
          fieldConfiguratorData[field[0]][type]["masked_pattern"];
        let count = fieldConfiguratorData[field[0]][type]["masked_count"];
        let startCount =
          fieldConfiguratorData[field[0]][type]["masked_startCount"];
        let endCount = fieldConfiguratorData[field[0]][type]["masked_endCount"];

        let optionFields = ["enum", "dynamicenum", "multienum", "radioenum"];
        let fieldValue = optionFields.includes(fields[field[0]]?.["type"])
          ? fields[field[0]]["options"][field[1]] || ""
          : field[1];
        if (maskingPattern === "end" && fieldValue.length > count) {
          let regex = new RegExp("(?<=.{" + count + "}).", "g");
          values[field[0]] = fieldValue.replace(regex, "*");
        } else if (maskingPattern === "start" && fieldValue.length > count) {
          let regex = new RegExp(".(?=.{" + count + ",}$)", "g");
          values[field[0]] = fieldValue.replace(regex, "*");
        } else if (
          maskingPattern === "middle" &&
          fieldValue.length > parseInt(startCount) + parseInt(endCount)
        ) {
          let regex = new RegExp(
            "(?<=.{" + startCount + "}).(?=.{" + endCount + ",}$)",
            "g",
          );
          values[field[0]] = fieldValue.replace(regex, "*");
        } else {
          //for masking pattern = all
          values[field[0]] =
            typeof fieldValue === "string"
              ? fieldValue.replace(/./g, "*")
              : "*********";
        }
      }
    }
  });
  return values;
};

//logic for regExp condition
export const checkRegExpCondition = (regExpPattern, value = "", field = {}) => {
  var regExp = new RegExp(regExpPattern);
  try {
    var regExp = new RegExp(regExpPattern);
    if (isEmpty(value) || isEmpty(regExpPattern)) {
      return;
    }
    if (field?.type == "email") {
      const result = value.find((email) => {
        if (!isEmpty(email?.email)) {
          return checkRegex(email?.email, regExp);
        }
        return false;
      });
      return result;
    } else {
      value = value.toString();
      return checkRegex(value, regExp);
    }
  } catch (error) {
    console.warn(`The regex pattern is not valid for: ${field.name}`);
    return false; // The regex pattern is not valid
  }
  return false;
};
const checkRegex = (value, regExp) => {
  if (value.match(regExp)) {
    return false;
  } else {
    return true;
  }
};
//END: Field configurator condition checking function added by Roshan S

export const validateForm = (
  fields,
  values,
  config,
  fieldConfigurator = {},
) => {
  config.view = pathOr("createview", ["view"], config);
  window.calendar_format = config.calendar_format;
  window.date_reg_format = config.date_reg_format;
  window.time_reg_format = config.time_reg_format;
  window.date_reg_positions = config.date_reg_positions;
  let invalidTxt = LBL_INVALID_VALUE;
  let errors = {};
  let formIsValid = true;
  // eslint-disable-next-line no-lone-blocks
  {
    Object.keys(fields).map((fieldNum) => {
      let field = fields[fieldNum];
      const getValidation = checkFieldValidation(
        field,
        values,
        fieldConfigurator,
        formIsValid,
        errors,
        ["visible", "required", "readOnly", "invalid", "validation"],
        fields,
      );
      if (pathOr(false, ["status"], getValidation)) {
        formIsValid = pathOr(formIsValid, ["formIsValid"], getValidation);
        errors = pathOr(errors, ["errors"], getValidation);
      }
      if (field.name === "case_number") {
        field.required = false;
      }
      if (
        field.name === "state" &&
        config.module &&
        config.module === "Cases"
      ) {
        let stateVal = values && values.state ? values.state : "";
        let resolutionVal =
          values && values.resolution ? values.resolution : "";
        if (
          stateVal === "Closed" &&
          (!resolutionVal || !resolutionVal.length)
        ) {
          formIsValid = false;
          errors["resolution"] = LBL_REQUIRED_FIELD;
        } else {
          if (errors["resolution"]) {
            delete errors["resolution"];
          }
        }
      }
      if (
        field.type === "relate" &&
        field.required === "true" &&
        !values[field.name]
      ) {
        formIsValid = false;
        errors[field.name] = LBL_REQUIRED_FIELD;
      } else if (
        field.type !== "relate" &&
        field.required === "true" &&
        !values[field.name]
      ) {
        formIsValid = false;
        errors[field.name] = LBL_REQUIRED_FIELD;
      }

      /* validation for date between for Meetings modules */
      if (
        field.name === "date_start" &&
        values[field.name] &&
        values["date_end"]
      ) {
        if (!isBefore(values[field.name], values["date_end"])) {
          formIsValid = false;
          errors[field.name] = `${field.label} (${
            values[field.name]
          }) ${LBL_ERROR_IS_NOT_BEFORE} ${values["date_end"]}`;
        }
      }
      /* validation for date between for Tasks modules */
      if (
        field.name === "date_start" &&
        values[field.name] &&
        values["date_due"]
      ) {
        if (!isBefore(values[field.name], values["date_due"])) {
          formIsValid = false;
          errors[field.name] = `${field.label} (${
            values[field.name]
          }) ${LBL_ERROR_IS_NOT_BEFORE} ${values["date_due"]}`;
        }
      }
      if (
        field.type == "multienum" &&
        field.required === "true" &&
        isEmpty(values[field.name])
      ) {
        formIsValid = false;
        errors[field.name] = LBL_REQUIRED_FIELD;
      }

      switch (field.type) {
        case "phone":
          if (values[field.name] && !isValidPhone(values[field.name].trim())) {
            formIsValid = false;
            errors[field.name] = invalidTxt;
          }
          break;
        case "email":
          if (values[field.name] && values[field.name].length > 0) {
            if (Array.isArray(values[field.name])) {
              values[field.name].map((emaiField, key) => {
                if (!isValidEmail(emaiField.email.trim())) {
                  formIsValid = false;
                  errors[field.name + "" + key] = invalidTxt;
                }
              });
            }
          } else {
            formIsValid = false;
            errors[field.name + "" + 0] = LBL_REQUIRED_FIELD;
          }
          break;
        // case 'date':
        // case 'datetimecombo':
        // 	if(!isDate(values[field.name].trim()))
        // 	{
        // 		formIsValid = false;
        // 		errors[field.name] = invalidTxt+field.label;
        // 	}
        // 	break;

        case "int":
          if (values[field.name] && !isInteger(values[field.name])) {
            formIsValid = false;
            errors[field.name] = invalidTxt;
          }
          break;
        case "decimal":
          if (values[field.name] && !isDecimal(values[field.name])) {
            formIsValid = false;
            errors[field.name] = invalidTxt;
          }
          break;
        //case 'currency':
        case "float":
          if (values[field.name] && !isFloat(values[field.name])) {
            formIsValid = false;
            errors[field.name] = invalidTxt;
          }
          break;
        case "url":
        case "iframe":
          let isValidUrl = new RegExp(
            /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
          );
          if (
            values[field.name] &&
            values[field.name].trim() &&
            !isValidUrl.test(values[field.name].trim())
          ) {
            formIsValid = false;
            errors[field.name] = invalidTxt;
          }
          break;
        case "user_name":
        case "name":
          if (values[field.name]) {
            if (
              (field.field_key == "first_name" ||
                field.field_key == "last_name") &&
              !values[field.name].match(/^[a-zA-Z0-9- .()_:]*$/)
            ) {
              formIsValid = false;
              errors[field.name] = LBL_INVALID_NAME;
            }
          }
          break;
        // case "varchar":
        //   if (
        //     values[field.name] &&
        //     (field.field_key == "first_name" || field.field_key == "last_name") &&
        //     !values[field.name].match(/^[/^[a-zA-Z0-9-.()_&|/:]*$/)
        //   ) {
        //     formIsValid = false;
        //     errors[field.name] = LBL_INVALID_NAME;
        //   }
        //   break;

        case "JSONeditor":
          if (
            typeof values[field.name] !== "object" &&
            values[field.name] === null
          ) {
            formIsValid = false;
            errors[field.name] = "Not an json.";
          }
          break;
        case "password":
          // if (
          // values.hasOwnProperty("old_password") &&
          // !isEmpty(values["old_password"].trim())
          // ) {
          if (field.name !== "user_hash") {
            if (
              (isEmpty(values[field.name]) || isNil(values[field.name])) &&
              field.required &&
              !isEmpty(values["old_password"]?.trim())
            ) {
              formIsValid = false;
              errors[field.name] = LBL_REQUIRED_FIELD;
            }
            if (
              !isEmpty(values[field.name]) &&
              !isNil(values[field.name]) &&
              field.name != "old_password" &&
              config?.passwordValidation?.isPasswordValidationApplied
            ) {
              var pattern = `^${
                config["passwordValidation"]["oneUpper"] ? "(?=.*[A-Z])" : ""
              }${
                config["passwordValidation"]["oneLower"] ? "(?=.*[a-z])" : ""
              }${
                config["passwordValidation"]["oneSpecial"]
                  ? "(?=.*[~!@#$%^&*])"
                  : ""
              }${config["passwordValidation"]["oneNumber"] ? "(?=.*\\d)" : ""}${
                config["passwordValidation"]["minLength"]
                  ? `.{${config.passwordValidation.minLength},}`
                  : ""
              }$`;
              var passwordExp = new RegExp(pattern);
              if (!values[field.name].trim().match(passwordExp)) {
                formIsValid = false;
                errors[field.name] = LBL_ENTER_SECURE_PASSWORD;
              }
            }
            if (field.name === "confirm_new_password") {
              if (
                values?.new_password?.trim() !==
                values?.confirm_new_password?.trim()
              ) {
                formIsValid = false;
                errors["confirm_new_password"] = LBL_CONFIRM_PASSWORD_MISMATCH;
              }
            }
          }
          // }
          break;
        case "image":
          if (config.view === "createview" || config.view === "editview") {
            let fileName = pathOr(null, [field.name, 0, "name"], values);
            if (field.required === "true" && fileName === null) {
              formIsValid = false;
              errors[field.name] = LBL_REQUIRED_FIELD;
            } else if (fileName != null && !isImageFile(fileName)) {
              formIsValid = false;
              errors[field.name] = LBL_INVALID_IMAGE_TYPE;
            }
          }
        case "file":
          if (config.view === "createview" || config.view === "editview") {
            let fileName = pathOr(null, [field.name, 0, "name"], values);
            if (field.required === "true" && fileName === null) {
              formIsValid = false;
              errors[field.name] = LBL_REQUIRED_FIELD;
            } else if (fileName != null && !isValidFile(fileName)) {
              formIsValid = false;
              errors[field.name] = LBL_INVALID_FILE_TYPE;
            }
          }
          break;
        default:
          break;
      }
    });
  }
  return { formIsValid: formIsValid, errors: errors };
};
export const getBase64 = (file, cb = null) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // reader.onload = () => resolve({ 'name': file.name, 'file_content': reader.result.replace(/^data:.+;base64,/, '') });
    reader.onload = () => {
      if (typeof cb == "function") {
        cb({ name: file.name, file_content: reader.result });
      } else {
        resolve({ name: file.name, file_content: reader.result });
      }
    };
    reader.onerror = (error) => {
      if (typeof cb == "function") {
        cb({ name: null, file_content: "" });
      } else {
        reject(error);
      }
    };
  });
};
export const downloadFile = async (site_url, filename, id, module = "") => {
  return;
};

export function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

export const addressString = (field) => {
  let value = "";

  let address_street = pathOr(
    null,
    [field.name.substr(0, field.name.indexOf("_")) + "_address_street"],
    field.value,
  );
  let address_city = pathOr(
    null,
    [field.name.substr(0, field.name.indexOf("_")) + "_address_city"],
    field.value,
  );
  let address_state = pathOr(
    null,
    [field.name.substr(0, field.name.indexOf("_")) + "_address_state"],
    field.value,
  );
  let address_postalcode = pathOr(
    null,
    [field.name.substr(0, field.name.indexOf("_")) + "_address_postalcode"],
    field.value,
  );
  let address_country = pathOr(
    null,
    [field.name.substr(0, field.name.indexOf("_")) + "_address_country"],
    field.value,
  );

  value = address_street ? address_street + ", " : "";
  value += address_city ? address_city + ", " : "";
  value += address_state ? address_state + ", " : "";
  value += address_postalcode ? address_postalcode + ", " : "";
  value += address_country;
  if (
    address_street === null &&
    field.name === "Contactsprimary_address_street"
  ) {
    value = pathOr("", ["value"], field);
  }
  return value;
};
export const isDisabled = (module, field, view, isAdmin, hiddenAll) => {
  if (field.field_key === "case_number" && view === "editview") {
    return true;
  }
  if (
    field.field_key === "opportunities_scoring_c" ||
    field.field_key === "lead_scoring_c"
  ) {
    return true;
  }
  if (module === "Users" && field.field_key === "UserType" && isAdmin != 1) {
    return true;
  }
  if (module === "Meetings" && field.field_key === "duration") {
    return true;
  }
  if (hiddenAll["disabled"].find((o) => o === field.name)) {
    return true;
  }
  if (field.disabled) {
    return field.disabled;
  }
  return false;
};

export const isValidURL = (value) => {
  if (typeof value !== "string") {
    return false;
  }
  let exprValidUrl = new RegExp(
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
  );
  value = value.trim();
  if (value && !exprValidUrl.test(value)) {
    return false;
  }
  return true;
};

export const demoInstanceDependencyConfig = (
  event = "",
  initialValues = [],
  fields = [],
  setFields,
  field = [],
  value = null,
  module,
  view,
  setHiddenAll,
) => {
  /* Instance : pipalbank.simplecrmdemo.com START */
  const baseUrl = api.getBaseURL();
  if (baseUrl === "https://pipalbank.simplecrmdemo.com/Api") {
    if (event === "onChange") {
      if (module === "Cases" && field.name && field.name === "ticket_type_c") {
        let hideFields = {};
        if (value === "External") {
          hideFields = {
            hidden: ["scrm_employee_cases_1_name", "department_c", "issue_c"],
            disabled: [],
          };
        } else {
          hideFields = {
            hidden: ["casetype_c", "subtype_c", "account_name"],
            disabled: [],
          };
        }
        setHiddenAll(hideFields);
      }
    }
    if (event === "onInit") {
      if (module === "Cases" && initialValues.ticket_type_c) {
        let hideFields = {};
        if (initialValues.ticket_type_c === "External") {
          setHiddenAll({
            hidden: ["scrm_employee_cases_1_name", "department_c", "issue_c"],
            disabled: [],
          });
        } else {
          setHiddenAll({
            hidden: ["casetype_c", "subtype_c", "account_name"],
            disabled: [],
          });
        }
      }
    }
  }
  /* Instance : ekyccrm.simplecrmdemo.com END*/
  /* Instance : ekyccrm.simplecrmdemo.com START */
  if (baseUrl === "https://ekyccrm.simplecrmdemo.com/Api") {
    if (event === "onChange") {
      if (
        module === "Opportunities" &&
        field.name &&
        field.name === "producttype_c"
      ) {
        if (value !== "Investment") {
          setHiddenAll({
            hidden: [
              "fund_to_cover_expenses_c",
              "employment_status_c",
              "financial_security_c",
              "risk_taking_approach_c",
              "money_borrowed_for_equity_c",
            ],
            disabled: [],
          });
        } else {
          setHiddenAll({ hidden: [], disabled: [] });
        }
      }
    }

    if (event === "onInit") {
      if (module === "Opportunities" && initialValues.producttype_c) {
        if (initialValues.producttype_c !== "Investment") {
          setHiddenAll({
            hidden: [
              "fund_to_cover_expenses_c",
              "employment_status_c",
              "financial_security_c",
              "risk_taking_approach_c",
              "money_borrowed_for_equity_c",
            ],
            disabled: [],
          });
        } else {
          setHiddenAll({ hidden: [], disabled: [] });
        }
      }
    }
  }
  /* Instance : ekyccrm.simplecrmdemo.com START */
};

// function for remove hidden field value from initialValue object in repeat Calendar Event - START
export const removeFieldHiddenValueRepeatCalendar = (
  values = {},
  dateStarted = "",
) => {
  let hiddenArr = [];
  let repeatType = "";
  const baseInitialValue = {
    repeat_type: "None",
    repeat_interval: "1",
    end: "after",
    repeat_count: "10",
    repeat_until: dateStarted,
    repeat_dow: "",
  };
  const repeatTypeValue = pathOr("", ["repeat_type"], values);
  if (repeatTypeValue == "None" || isEmpty(repeatTypeValue)) {
    hiddenArr = [
      "repeat_interval",
      "end",
      "repeat_count",
      "repeat_until",
      "repeat_dow",
    ];
  } else {
    const endValue = pathOr("", ["end"], values);
    if (["Daily", "Monthly", "Yearly"].includes(repeatTypeValue)) {
      hiddenArr = [...hiddenArr, "repeat_dow"];
      if (endValue == "after") {
        hiddenArr = [...hiddenArr, "repeat_until"];
      } else if (endValue == "by") {
        hiddenArr = [...hiddenArr, "repeat_count"];
      } else if (isEmpty(endValue)) {
        hiddenArr = [...hiddenArr, "repeat_until", "repeat_dow"];
      }
    } else if (repeatTypeValue == "Weekly") {
      if (endValue == "after") {
        hiddenArr = [...hiddenArr, "repeat_until"];
      } else if (endValue == "by") {
        hiddenArr = [...hiddenArr, "repeat_count"];
      } else if (isEmpty(endValue)) {
        hiddenArr = [...hiddenArr, "repeat_until"];
      }
    }
  }
  values = { ...baseInitialValue, ...values };
  hiddenArr.map((e) => {
    values = values;
    // delete values[e];
  });
  if (isNil(repeatTypeValue) || isEmpty(repeatTypeValue)) {
    values["repeat_type"] = "None";
  }

  return {
    hiddenFieldsArr: hiddenArr,
    filteredValues: values,
    repeatType: repeatType,
  };
};

// function for remove hidden field value from initialValue object in repeat Calendar Event - END

export function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}
export const isValidUrlString = (str) => {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ); // fragment locator
  return !!pattern.test(str);
};

export const formatFileSize = (bytes, decimalPoint) => {
  if (bytes == 0) return "0 Bytes";
  var k = 1000,
    dm = decimalPoint || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const checkNumberIsValid = (value, returnValue = null) => {
  value = isNil(value) ? 0 : value.toString().replace(/\$|\,/g, "");
  value = parseFloat(value);
  let isValuePositive = Math.sign(value);
  if (isNil(returnValue) || isNaN(returnValue)) {
    return !isNaN(value) || isValuePositive == -1;
  } else {
    return isNaN(value) || isValuePositive == -1 ? returnValue : value;
  }
};

export const buildFilterQueryObj = (
  inputFilterValues,
  inputFilterMetaFields,
) => {
  let outputFilterObj = {};
  for (let fieldName in inputFilterValues) {
    const fieldValue = pathOr("", [fieldName], inputFilterValues);
    const fieldMetaObj = pathOr({}, [fieldName], inputFilterMetaFields);
    if (!isEmpty(fieldValue) && fieldMetaObj) {
      let operator = "eq";
      const operatorTypeFieldObj = {
        lke: ["name", "url"],
        multi: ["multienum"],
      };
      for (let type in operatorTypeFieldObj) {
        const fieldArr = operatorTypeFieldObj[type];
        if (fieldArr?.includes(fieldMetaObj?.type)) operator = type;
      }
      if (typeof fieldValue !== "object") {
        if (fieldMetaObj.type === "bool") {
          outputFilterObj[`filter[${fieldName}][${operator}]`] =
            fieldValue === "true" ||
            fieldValue === "1" ||
            fieldValue === 1 ||
            fieldValue === true
              ? 1
              : 0;
        } else {
          const encodedValue = fieldValue.trim();
          outputFilterObj[`filter[${fieldName}][${operator}]`] = encodedValue;
        }
      } else {
        if (
          fieldMetaObj.type === "datetime" ||
          fieldMetaObj.type === "datetimecombo"
        ) {
          const parsedRangeValues = parseRangeTypeFieldValues(
            fieldValue,
            fieldMetaObj,
            operator,
          );
          outputFilterObj = {
            ...outputFilterObj,
            ...parsedRangeValues?.filterOption,
          };
        } else if (fieldMetaObj.type === "currency") {
          const parsedRangeValues = parseRangeTypeFieldValues(
            fieldValue,
            fieldMetaObj,
            operator,
          );
          outputFilterObj = {
            ...outputFilterObj,
            ...parsedRangeValues?.filterOption,
          };
        } else if (fieldMetaObj?.type === "relate") {
          const encodedValue = pathOr("", ["value"], fieldValue)?.trim();
          const recordId = pathOr("", ["id"], fieldValue);
          outputFilterObj[`filter[${fieldName}][]`] = encodedValue;
          outputFilterObj[`filter[${fieldName}_id][]`] = recordId;
        } else if (fieldMetaObj?.type === "assigned_user_name") {
          const recordId = pathOr("", ["id"], fieldValue);
          outputFilterObj[`filter[${fieldName}][]`] = recordId;
        } else if (fieldMetaObj?.type === "parent") {
          const parentIdValue = pathOr("", ["parent_id"], fieldValue)?.trim();
          const parentTypeValue = pathOr(
            "",
            ["parent_type"],
            fieldValue,
          )?.trim();
          if (!isEmpty(parentIdValue)) {
            outputFilterObj[`filter[parent_type][${operator}]`] =
              parentTypeValue;
            outputFilterObj[`filter[parent_id][${operator}]`] = parentIdValue;
          }
        } else if (fieldMetaObj.type === "multienum") {
          outputFilterObj[`filter[${fieldName}][${operator}]`] =
            fieldValue.join(",");
        } else {
          outputFilterObj[`filter[${fieldName}][${operator}]`] = pathOr(
            "",
            ["id"],
            fieldValue,
          );
        }
      }
    }
  }
  if (isEmpty(outputFilterObj)) {
    outputFilterObj[`filter[reset][eq]`] = "true";
  }
  return outputFilterObj;
};
export function truncateString(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

export const parserDashboardPositionData = (layoutData) => {
  return (
    layoutData &&
    layoutData.map((item, n) => {
      const dashLetData = {};
      dashLetData["data"] = pathOr({}, ["data"], item);
      dashLetData["h"] = parseInt(pathOr(2, ["h"], item)) || 2;
      dashLetData["i"] = pathOr("", ["data", "id"], item);
      // dashLetData["i"] = parseInt(pathOr("", ["i"], item)).toString();
      dashLetData["static"] = pathOr("", ["static"], item);
      dashLetData["moved"] = pathOr("", ["moved"], item);
      dashLetData["w"] = pathOr(null, ["w"], item);
      dashLetData["w"] =
        dashLetData["w"] == "Infinity"
          ? Infinity
          : parseInt(dashLetData["w"]) || 2;
      dashLetData["x"] = parseInt(pathOr(0, ["x"], item)) || 0;
      dashLetData["y"] = parseInt(pathOr(0, ["y"], item)) || 0;
      dashLetData["id"] = pathOr("", ["data", "id"], item);
      return dashLetData;
    })
  );
};
export const parseV267URL = (redirectUrl = "") => {
  if (redirectUrl === undefined || redirectUrl === null || redirectUrl === "")
    return {};

  const url_redirect = redirectUrl.split("&");
  if (
    url_redirect === undefined ||
    url_redirect === null ||
    url_redirect[0] === ""
  )
    return {};

  if (url_redirect[0].includes("?")) {
    url_redirect[0] = url_redirect[0].split("?")[1];
  }

  const returnValue = {};
  url_redirect.map((item) => {
    if (item.includes("=")) {
      const itemSplit = item.split("=");
      if (itemSplit instanceof Array) {
        returnValue[itemSplit[0]] = itemSplit[1];
      }
    }
  });
  return returnValue;
};
export const isValidPrecision = (
  value,
  precision,
  dec_sep = ".",
  num_grp_sep = ",",
) => {
  value = trim(value.toString());
  if (precision == "") return true;
  if (value == "") return true;
  if (precision == "0") {
    if (value.indexOf(dec_sep) == -1) {
      return true;
    } else {
      return false;
    }
  }
  if (value.charAt(value.length - precision - 1) == num_grp_sep) {
    if (value.substr(value.indexOf(dec_sep), 1) == dec_sep) {
      return false;
    }
    return true;
  }
  var actualPrecision = value.substr(
    value.indexOf(dec_sep) + 1,
    value.length,
  ).length;
  return actualPrecision == precision;
};

export const getFirstAlphabet = (string) => {
  let str = string.toUpperCase();
  for (var i = 0; i < str.length; i++) {
    if (/[a-zA-Z]/.test(str[i])) {
      return str[i];
    }
  }
  return "";
};

export const toHoursAndMinutes = (totalSeconds) => {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { h: hours, m: minutes, s: seconds };
};

export const isTrue = (value) => {
  return value === true || value === "true" || value == 1;
};

export const isHTML = (str) => {
  var a = document.createElement("div");
  a.innerHTML = str;

  for (var c = a.childNodes, i = c.length; i--; ) {
    if (c[i].nodeType == 1) return true;
  }

  return false;
};

const parseRangeTypeFieldValues = (fieldValue, fieldMetaObj, operator) => {
  // if (!fieldMetaObj?.enable_range_search) return fieldValue;

  const rangeValue = pathOr("", ["range"], fieldValue);
  const fieldName = pathOr("", ["name"], fieldMetaObj);
  const outputResult = {
    filterOption: {},
    options: {},
  };

  const addSingleField = () => {
    outputResult.filterOption[`filter[range_${fieldName}][operator]`] =
      rangeValue;
    outputResult.options[`range_${fieldName}`] = rangeValue;
    // outputResult.options[`${fieldName}_range_choice`] = rangeValue;
  };

  const addDoubleField = () => {
    const rangeFieldValue = pathOr("", [`range_${fieldName}`], fieldValue);
    if (rangeFieldValue) {
      outputResult.filterOption[`filter[range_${fieldName}][${operator}]`] =
        rangeFieldValue;
      outputResult.filterOption[`filter[${fieldName}_range_choice][operator]`] =
        rangeValue;
      outputResult.options[`${fieldName}_range_choice`] = rangeValue;
      outputResult.options[`range_${fieldName}`] = rangeFieldValue;
    }
  };

  const addTripleField = () => {
    const rangeStartFieldValue = pathOr(
      "",
      [`start_range_${fieldName}`],
      fieldValue,
    );
    const rangeEndFieldValue = pathOr(
      "",
      [`end_range_${fieldName}`],
      fieldValue,
    );
    if (rangeStartFieldValue && rangeEndFieldValue) {
      outputResult.filterOption[
        `filter[start_range_${fieldName}][${operator}]`
      ] = rangeStartFieldValue;
      outputResult.filterOption[`filter[end_range_${fieldName}][${operator}]`] =
        rangeEndFieldValue;
      outputResult.filterOption[`filter[${fieldName}_range_choice][operator]`] =
        rangeValue;
      outputResult.options[`${fieldName}_range_choice`] = rangeValue;
      outputResult.options[`start_range_${fieldName}`] = rangeStartFieldValue;
      outputResult.options[`end_range_${fieldName}`] = rangeEndFieldValue;
    }
  };

  if (DATE_RANGE_TYPE?.singleField.includes(rangeValue)) {
    addSingleField();
  } else if (DATE_RANGE_TYPE?.doubleField.includes(rangeValue.toString())) {
    addDoubleField();
  } else if (DATE_RANGE_TYPE?.tripleField.includes(rangeValue.toString())) {
    addTripleField();
  }

  return outputResult;
};

export function getFileExtension(filename) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop() : null;
}

export function decodeHtmlEntities(str = "") {
  const entities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&#x2F;": "/",
    "&#x5C;": "\\",
    "&#96;": "`",
    "&#x3D;": "=",
  };
  return str.replace(/&[a-zA-Z0-9#]+;/g, (match) => entities[match] || match);
}
export const validatePrecision = (inputValue, precision) => {
  let message = "";
  if (precision) {
    let decimalVal = inputValue.split(".")[1];
    if (decimalVal && decimalVal.length > precision) {
      message = `Maximum precision of ${precision} decimal places exceeded!`;
    }
  }
  return message;
};

export const validateFile = (
  file,
  maxUploadLimit,
  fileType = null,
  minUploadLimit,
) => {
  if (!file) return LBL_NO_FILE_SELECTED_MSG;
  if (
    fileType &&
    fileType === "image" &&
    !["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type)
  ) {
    return LBL_INVALID_FILE_TYPE_MSG;
  }
  if (file.size <= minUploadLimit) {
    return `${LBL_MIN_FILE_SIZE_MSG} ${minUploadLimit} bytes.`;
  }
  if (file.size > maxUploadLimit) {
    return `${LBL_MAX_FILE_SIZE_MSG} ${maxUploadLimit} bytes.`;
  }
  return null;
};

export const getChipStyle = (currentTheme, chipBgColor) => {
  if (currentTheme.palette.type === "dark") {
    return {
      color: chipBgColor,
      fontWeight: "bolder",
      background: "transparent",
      border: "1px solid",
    };
  }
  return {
    color: chipBgColor,
    background: `${chipBgColor}20`,
    border: "none",
  };
};
