import { isEmpty, isNil, pathOr } from "ramda";
import { add_custom_duration } from "@/common/duration_dependency";
import {
  DEFAULT_REMINDER,
  attachmentField,
  observeFieldValueConfiguration,
} from "./editview-constant";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";
import {
  lineItemSingleGroupTotalFields,
  lineItemSingleGroupTotalFieldsInitialValue,
  setDefaultValuesToDataLabels,
} from "./lineitem-calculation";
import { toHoursAndMinutes } from "@/common/utils";
import { api } from "@/common/api-utils";

const fieldIsValid = (field) => {
  return (
    isNil(field) || isEmpty(field) || typeof field !== "object" || !!field?.name
  );
};

const extractFieldValues = async (
  inputData,
  metaData,
  parentData = {},
  customArgs,
) => {
  const {
    currencyRecords = [],
    defaultCurrency = {},
    passwordValidation = {},
    currentUserData = {},
    enableAttachmentButtonModules,
  } = customArgs;
  const {
    currentModule,
    params = { returnModule: "", returnRecord: "" },
    currentView,
  } = metaData;
  const { parent_name = "", parent_id = "", parent_type = "" } = parentData;
  const { returnModule, returnRecord } = params;
  let fieldInitialValues = {};
  const currencyFields = [];
  const panelWiseFields = {};
  let fieldObj = {};
  if (enableAttachmentButtonModules?.some((v) => v === currentModule)) {
    fieldObj[attachmentField.name] = attachmentField;
  }
  const setValues = (attributes) => {
    if (!Array.isArray(attributes)) return;
    const panelsFieldsArr = attributes.flat(2);
    panelsFieldsArr.forEach((field) => {
      if (!fieldIsValid(field)) return;
      if (field.type === "line_item") {
        const lineItemData = pathOr({}, ["linedata"], field);
        const grandTotalFieldsArr = pathOr(
          [],
          ["total_field_datalabel"],
          lineItemData,
        );
        // product line items data labels
        const productDataLabels = pathOr(
          [],
          ["product_datalabels", 0],
          lineItemData,
        );
        // service line items data labels
        const serviceDataLabels = pathOr(
          [],
          ["service_datalabels", 0],
          lineItemData,
        );
        const isGroupLineItemEnable = pathOr(0, ["enable_group"], lineItemData);
        let outPutLineItemValues = {};
        if (isGroupLineItemEnable) {
          const groupLineItemData = pathOr({}, ["groups_data"], lineItemData);
          if (typeof groupLineItemData == "object") {
            outPutLineItemValues["grouped"] = Object.values(groupLineItemData);
          }
        } else {
          const rowLineItemData = pathOr({}, ["simple_data"], lineItemData);
          if (typeof rowLineItemData == "object") {
            outPutLineItemValues["ungrouped"] = Object.values(rowLineItemData);
          }
        }
        if (Array.isArray(grandTotalFieldsArr)) {
          grandTotalFieldsArr.forEach((field) => {
            if (fieldIsValid(field)) {
              fieldInitialValues[field.field_key] = field?.value || 0;
            }
          });
        }
        const lineItemFieldsObj = {
          currencyField: pathOr(
            null,
            ["currency_field_datalabel", 0],
            lineItemData,
          ),
          grandTotal: grandTotalFieldsArr,
          lineItemField: null,
          singleGroupTotal: [],
          singleGroupTotalFieldsName: lineItemSingleGroupTotalFields,
          singleGroupTotalFieldsInitialValue:
            lineItemSingleGroupTotalFieldsInitialValue,
          productDataLabels: productDataLabels,
          serviceDataLabels: serviceDataLabels,
          productDataLabelsFieldsObj:
            setDefaultValuesToDataLabels(productDataLabels),
          serviceDataLabelsFieldsObj:
            setDefaultValuesToDataLabels(serviceDataLabels),
          totalFieldsDataLabels: grandTotalFieldsArr,
        };
        if (!isEmpty(lineItemFieldsObj["grandTotal"])) {
          lineItemFieldsObj["singleGroupTotal"] = lineItemFieldsObj[
            "grandTotal"
          ].filter((field) =>
            lineItemSingleGroupTotalFields.includes(field.field_key),
          );
        }
        if (fieldIsValid(field)) {
          fieldInitialValues[field.name] = outPutLineItemValues;
          fieldObj[field.name] = field;
          fieldObj[field.name]["lineItemFieldMetaObj"] = lineItemFieldsObj;
        }
      } else if (field.type === "parent") {
        if (currentView == LAYOUT_VIEW_TYPE.quickCreateView) {
          const fieldOptions = pathOr({}, ["options"], field);
          fieldInitialValues[field.name] =
            parent_name && fieldOptions?.hasOwnProperty(parent_type)
              ? { parent_name, parent_id, parent_type }
              : {
                parent_name: "",
                parent_id: "",
                parent_type: "",
              };
        } else {
          fieldInitialValues[field.name] = field?.parent_name
            ? field.parent_name
            : { parent_name: "", parent_id: "", parent_type: "" };
        }
        fieldObj[field.name] = field;
      } else if (field.type === "file") {
        fieldInitialValues[field.name] = field?.value ? field.value : [];
        fieldObj[field.name] = field;
      } else if (field.type === "bool") {
        fieldInitialValues[field.name] =
          field?.value === "true" ||
          field?.value === "1" ||
          field?.value === 1 ||
          field?.value === true;
        fieldObj[field.name] = field;
      } else if (field.type === "email") {
        fieldInitialValues[field.name] =
          !isNil(field?.value) &&
            !isEmpty(field?.value) &&
            Array.isArray(field?.value)
            ? field?.value
            : [
              {
                email: "",
                primary: true,
                optOut: false,
                invalid: false,
                deleted: false,
                error: false,
              },
            ];
        fieldObj[field.name] = field;
      } else if (field.type === "password") {
        fieldInitialValues[field.name] = field?.value ? field.value : [];
        fieldObj[field.name] = { ...field, validation: passwordValidation };
      } else if (field.type === "multifile") {
        fieldInitialValues[field.name] = field.value
          ? field.value.map((v) => ({
            ...v,
            isFileUploaded: true,
            isNewFile: false,
          }))
          : [];
        fieldObj[field.name] = field;
      } else if (field.name === "duration") {
        fieldInitialValues[field.name] = pathOr("0", ["value"], field);
        fieldInitialValues["duration_hours"] = pathOr(
          "0",
          ["duration_hours"],
          field,
        );
        fieldInitialValues["duration_minutes"] = pathOr(
          "0",
          ["duration_minutes"],
          field,
        );
        fieldObj[field.name] = field;
      } else if (field.type === "decimal") {
        if (
          field.hasOwnProperty("decimalcurrency") &&
          !!field.decimalcurrency
        ) {
          currencyFields.push(field.name);
        }
        fieldInitialValues[field.name] = field.value;
        fieldObj[field.name] = field;
      } else if (field.type == "address") {
        const tempValues = {};
        let fieldNameSplit = field.name.split("_");
        if (!isEmpty(fieldNameSplit)) {
          fieldNameSplit = fieldNameSplit[0];
        }
        if (typeof field?.value == "object") {
          Object.entries(field?.value)?.forEach(([key, value]) => {
            if (key.startsWith(fieldNameSplit)) {
              tempValues[key] = value;
            }
          });
        }
        fieldInitialValues[field.name] = tempValues;
        fieldObj[field.name] = field;
      } else if (
        !isNil(field?.module) &&
        field?.module === returnModule &&
        !isEmpty(returnRecord)
      ) {
        fieldInitialValues[field.name] = returnRecord
          ? { id: field?.value?.id || "", value: field?.value?.value || "" }
          : "";
        fieldObj[field.name] = field;
      } else if (
        currentModule === "Cases" &&
        returnModule &&
        returnRecord &&
        field.field_key === "source_c"
      ) {
        fieldInitialValues[field.name] = field.value ? field.value : "Call";
        fieldObj[field.name] = field;
      } else if (currentModule === "Cases" && field.field_key === "status") {
        fieldInitialValues[field.name] =
          fieldInitialValues["state"] == "Open" ? "Open_New" : field.value;
        fieldObj[field.name] = field;
      } else if (
        currentModule === "Cases" &&
        returnModule &&
        returnRecord &&
        field?.parentenum
      ) {
        for (let optionKey in field.options) {
          if (
            optionKey.startsWith(fieldInitialValues[field.parentenum]) &&
            fieldInitialValues[field.parentenum] !== ""
          ) {
            if (fieldIsValid(field)) {
              fieldInitialValues[field.name] = field.value
                ? field.value
                : optionKey;
              fieldObj[field.name] = field;
            }
          }
        }
        if (!fieldInitialValues.hasOwnProperty(field.name)) {
          fieldObj[field.name] = field;
          fieldInitialValues[field.name] = field.value;
        }
      } else {
        fieldInitialValues[field.name] = field.value ? field.value : "";
        fieldObj[field.name] = field;
        if (field.name === "currency_id") {
          fieldObj[field.name]["currencyRateRecord"] = currencyRecords.reduce(
            (pV, cV) => {
              pV[cV["id"]] = cV;
              return pV;
            },
            {},
          );
          fieldObj[field.name]["currencyRateRecord"][defaultCurrency["id"]] =
            defaultCurrency;
          fieldObj[field.name]["lastRate"] = pathOr(
            1,
            [field.name, "currencyRateRecord", field?.value, "conversion_rate"],
            fieldObj,
          );
        } else if (field?.name === "reminders") {
          fieldObj[field.name]["defaultReminder"] = DEFAULT_REMINDER;
          fieldInitialValues[field.name] =
            isNil(field?.value) || isEmpty(field?.value)
              ? [
                {
                  ...DEFAULT_REMINDER,
                  invitees: [
                    {
                      id: "",
                      module_id: pathOr("", ["data", "id"], currentUserData),
                      module: "Users",
                      value: pathOr(
                        "",
                        ["data", "attributes", "name"],
                        currentUserData,
                      ),
                      name: pathOr(
                        "",
                        ["data", "attributes", "name"],
                        currentUserData,
                      ),
                      email: pathOr(
                        "",
                        ["data", "attributes", "email1"],
                        currentUserData,
                      ),
                    },
                  ],
                },
              ]
              : field?.value;
        } else if (field?.name === "reminder_time") {
          fieldInitialValues[field.name] = {
            reminder_checked: pathOr(
              false,
              ["value", "reminder_checked"],
              field,
            ),
            reminder_time: pathOr("-1", ["value", "reminder_time"], field),
            email_reminder_checked: pathOr(
              false,
              ["value", "email_reminder_checked"],
              field,
            ),
            email_reminder_time: pathOr(
              "-1",
              ["value", "email_reminder_time"],
              field,
            ),
          };
        }
      }
    });
  };

  inputData.forEach((panelData, panelIndex) => {
    const panelFields = pathOr([], ["attributes"], panelData);
    const panelTabsArr = pathOr([], ["panels"], panelData);
    const panelKey = pathOr("", ["key"], panelData);
    panelWiseFields[panelKey] = [];
    if (Array.isArray(panelFields)) {
      const panelsFieldsArr = panelFields.flat(2);
      panelsFieldsArr?.forEach((field) => {
        panelWiseFields[panelKey].push(field.name);
      });
    }
    if (!isEmpty(panelFields) && !isNil(panelFields)) setValues(panelFields);
    if (!isEmpty(panelTabsArr) && !isNil(panelTabsArr)) {
      panelTabsArr.forEach((tabsData, panelIndex) => {
        const tabsFields = pathOr([], ["attributes"], tabsData);
        if (!isEmpty(tabsFields) && !isNil(tabsFields)) setValues(tabsFields);
      });
    }
  });

  Object.entries(fieldObj).forEach(([fKey, fObj]) => {
    if (fKey == "currency_id") {
      fieldObj[fKey]["currencyFields"] = currencyFields;
    } else if (
      fObj.hasOwnProperty("decimalcurrency") &&
      !!fObj.decimalcurrency
    ) {
      if (fieldObj.hasOwnProperty("currency_id") && fieldObj) {
        fieldObj[fKey]["currencySymbol"] =
          fieldObj?.currency_id?.currencyRateRecord[
            fieldObj?.currency_id?.value
          ]?.symbol;
      }
    }
  });

  let { formValues, allFieldObj } = await customOnInitValueSetter(
    metaData,
    fieldObj,
    fieldInitialValues,
  );

  return {
    formValues,
    fieldObj: allFieldObj,
    panelWiseFields,
  };
};

const customOnInitValueSetter = async (
  moduleMetaData,
  allFieldObj,
  formValues,
) => {
  const { currentModule } = moduleMetaData;
  const { id } = moduleMetaData?.params;

  if (["Meetings", "Tasks", "Calls"].includes(currentModule)) {
    const duration = {
      duration: pathOr("", ["duration"], formValues),
      duration_hours: pathOr("", ["duration_hours"], formValues),
      duration_minutes: pathOr("", ["duration_minutes"], formValues),
    };
    if (!id) {
      duration.duration_hours = 0;
      duration.duration_minutes = 15;
      duration.duration = 900;
    }
    formValues["duration"] = duration.duration;
    formValues["duration_hours"] = duration.duration_hours;
    formValues["duration_minutes"] = duration.duration_minutes;
  }

  // if (
  //   currentModule === "scrm_OpenAIPrompt" &&
  //   allFieldObj?.ryabot_role?.extrenal_api?.api_url
  // ) {
  //   try {
  //     const res = await api.get(
  //       allFieldObj?.ryabot_role?.extrenal_api?.api_url,
  //       {
  //         data: allFieldObj?.ryabot_role,
  //       },
  //     );

  //     if (res?.ok) {
  //       const updatedRyabotRole = pathOr(
  //         allFieldObj?.ryabot_role,
  //         ["data", "data"],
  //         res,
  //       );
  //       allFieldObj = {
  //         ...allFieldObj,
  //         ryabot_role: updatedRyabotRole,
  //       };
  //     }
  //   } catch (error) {
  //     console.error("Error fetching from external API:", error);
  //   }
  // }

  return { formValues, allFieldObj };
};

export const setInitConfiguration = async (
  formMetaData,
  moduleMetaData,
  parentData,
  customArgs,
) => {
  const fieldData = await extractFieldValues(
    formMetaData,
    moduleMetaData,
    parentData,
    customArgs,
  );

  const fieldInitialValues = pathOr({}, ["formValues"], fieldData);
  const fieldsMetaObj = pathOr({}, ["fieldObj"], fieldData);
  const panelWiseFields = pathOr({}, ["panelWiseFields"], fieldData);
  const observeFieldsObj = { ...observeFieldValueConfiguration };
  Object.entries(fieldsMetaObj).forEach(([fieldName, fieldMetaObj]) => {
    fieldsMetaObj[fieldName] = {
      ...fieldsMetaObj[fieldName],
      dependentFields: findObservableFields(
        fieldMetaObj,
        observeFieldsObj,
        moduleMetaData?.currentModule,
        moduleMetaData?.viewName,
      ),
    };
    if (
      fieldMetaObj?.hasOwnProperty("dependentSuggestionFields") &&
      Array.isArray(fieldMetaObj?.dependentSuggestionFields)
    ) {
      fieldsMetaObj[fieldName]["dependentFields"] = [
        ...fieldsMetaObj[fieldName]["dependentFields"],
        ...fieldMetaObj?.dependentSuggestionFields,
      ];
    }
    if (
      fieldMetaObj?.type === "dynamicenum" &&
      fieldMetaObj?.hasOwnProperty("parentenum") &&
      fieldsMetaObj?.hasOwnProperty(fieldMetaObj["parentenum"])
    ) {
      const prevValue = pathOr(
        [],
        [fieldMetaObj["parentenum"], "dynamicEnumFields"],
        fieldsMetaObj,
      );
      fieldsMetaObj[fieldMetaObj["parentenum"]]["dynamicEnumFields"] = [
        ...prevValue,
        fieldName,
      ];
    }
  });

  return {
    fieldInitialValues,
    fieldsMetaObj,
    panelWiseFields,
  };
};

export const getFormattedValue = (
  data,
  allFormFieldObj = {},
  module,
  customArgs,
) => {
  const { getParseDateTimeFormat = "" } = customArgs;
  let formattedData = { ...data };

  Object.entries(formattedData).forEach(([key, value]) => {
    if (key === "reminders" && Array.isArray(value) && !isEmpty(value)) {
      const dateWillExecute = dayjs(
        pathOr("", ["date_start"], formattedData),
        getParseDateTimeFormat,
      ).unix();
      formattedData[key] = value
        .map((item) => ({
          ...item,
          date_willexecute: dateWillExecute,
        }))
        .filter((item) => item.email || item.popup);
    } else if (allFormFieldObj[key]?.type === "address") {
      formattedData = { ...formattedData, ...value };
    } else if (
      typeof value === "object" &&
      key !== "line_items" &&
      key === "parent_name" &&
      module !== "Accounts"
    ) {
      formattedData = { ...formattedData, ...value };
    } else if (allFormFieldObj[key]?.type === "email" && !isEmpty(value)) {
      formattedData[key] = value
        .map((emailObj) => {
          if (!!emailObj?.email && !isEmpty(emailObj?.email?.trim())) {
            return {
              ...emailObj,
              email: emailObj.email.toString().trim(),
            };
          }
          return emailObj;
        })
        .filter(
          (emailField) =>
            !isEmpty(emailField?.email?.trim()) &&
            !isEmpty(emailField?.emailid?.trim()),
        );
    } else if (
      allFormFieldObj[key]?.type === "varchar" ||
      allFormFieldObj[key]?.type === "name"
    ) {
      if (typeof value === "string") {
        formattedData[key] = value.trim();
      }
    }
  });

  return formattedData;
};

export const findObservableFields = (
  fieldMetaObj,
  observeFieldsConfig,
  moduleName,
  viewName,
) => {
  let observerFieldArr = [];
  const fieldName = pathOr("", ["name"], fieldMetaObj);
  const fieldType = pathOr("", ["type"], fieldMetaObj);
  const fieldMetaPatten = [
    "all",
    moduleName,
    viewName,
    `${moduleName}+${viewName}`,
  ];
  if (!isEmpty(fieldName)) {
    fieldMetaPatten?.forEach((patten) => {
      const observableFieldNameList = pathOr(
        [],
        [patten, fieldName],
        observeFieldsConfig,
      );
      const observableFieldTypeList = pathOr(
        [],
        [patten, `#${fieldType}`],
        observeFieldsConfig,
      );
      observerFieldArr = [
        ...observerFieldArr,
        ...observableFieldNameList,
        ...observableFieldTypeList,
      ];
    });
    observerFieldArr = observerFieldArr
      .reduce((pValue, cValue) => {
        if (
          typeof cValue == "string" &&
          cValue.startsWith("$") &&
          fieldMetaObj?.hasOwnProperty(cValue.slice(1))
        ) {
          return [...pValue, fieldMetaObj[cValue.slice(1)]];
        } else {
          return [...pValue, cValue];
        }
      }, [])
      .filter((value) => !isEmpty(value) && !isNil(value));
    // const observableFieldsObj = {
    //   globalLevel: pathOr([], ["all", fieldName], observeFieldsConfig),
    //   moduleLevel: pathOr([], [moduleName, fieldName], observeFieldsConfig),
    //   viewLevel: pathOr([], [viewName, fieldName], observeFieldsConfig),
    //   moduleViewLevel: pathOr(
    //     [],
    //     [`${moduleName}+${viewName}`, fieldName],
    //     observeFieldsConfig,
    //   ),
    //   fieldTypeLevel: pathOr([], ["all", `#${fieldType}`], observeFieldsConfig),
    // };
    // observerFieldArr = observableFieldsObj.filter((value) =>
    //   Array.isArray(value),
    // );
    // if (!isEmpty(observerFieldArr)) observerFieldArr = observerFieldArr.flat();
  }
  return observerFieldArr;
};

export const customOnChangeValueSetter = (
  moduleMetaData,
  fieldObj,
  fieldValue,
  formValues,
  changeFormFieldValue,
  changeFormFieldData,
  customArgs,
) => {
  const { getParseDateTimeFormat, formId, formFields } = customArgs;
  const { currentModule, view, returnModule, returnRecord } = moduleMetaData;
  if (currentModule === "Cases") {
    if (fieldObj.type == "name") {
      if (fieldValue?.value) {
        const tempValue = {};
        tempValue[fieldObj.name] = pathOr("", ["value"], fieldValue);
        if (fieldValue?.resolution) {
          tempValue["resolution"] = pathOr("", ["resolution"], fieldValue);
          changeFormFieldValue(tempValue);
          toast(LBL_RESOLUTION_ADDED);
          return;
        }
      }
    } else if (returnModule && returnRecord) {
      if (fieldObj.name === "state") {
        changeFormFieldValue("status", fieldValue);
        return;
      }
    } else if (fieldObj.name === "state") {
      let val = fieldValue === "Closed" ? "Closed_Closed" : "";
      val = fieldValue === "Open" ? "Open_New" : val;
      changeFormFieldValue("status", val);
      return;
    }
  } else if (
    ["Meetings", "Calls", "FP_events", "Tasks"].includes(currentModule)
  ) {
    const dynamicEndDateFieldName =
      currentModule === "Tasks" ? "date_due" : "date_end";
    if (
      fieldObj.name === "date_start" &&
      formFields?.hasOwnProperty("duration") &&
      formFields?.hasOwnProperty(dynamicEndDateFieldName)
    ) {
      const changeFieldsObj = {};
      let endDateValue = pathOr(null, [dynamicEndDateFieldName], formValues);
      const dayJsStartDate = dayjs(fieldValue, getParseDateTimeFormat);
      const dayJsEndDate = dayjs(endDateValue, getParseDateTimeFormat);
      let durationValue = pathOr(null, ["duration"], formValues);
      if (dayJsEndDate.isValid()) {
        const diffMin = dayJsEndDate.diff(dayJsStartDate, "minute");
        const diffSec = dayJsEndDate.diff(dayJsStartDate, "second");
        changeFieldsObj["duration"] = diffSec;
        changeFieldsObj["duration_hours"] = parseInt(diffMin / 60);
        changeFieldsObj["duration_minutes"] = parseInt(diffMin % 60);
        let cstm = add_custom_duration(changeFieldsObj?.duration);
        changeFormFieldData(formId, "duration", (fObj) => {
          fObj = {
            ...fObj,
            options: { ...fObj?.options, [cstm?.value]: cstm?.label.trim() },
          };
          return fObj;
        });
      } else {
        if (!durationValue) {
          changeFieldsObj["duration_hours"] = 0;
          changeFieldsObj["duration_minutes"] = 15;
          changeFieldsObj["duration"] = 900;
          durationValue = 900;
        }
        changeFieldsObj[dynamicEndDateFieldName] = dayJsStartDate
          .add(durationValue, "s")
          .format(getParseDateTimeFormat);
      }
      changeFormFieldValue(changeFieldsObj);
    } else if (
      fieldObj.name === "duration" &&
      formFields?.hasOwnProperty("date_start") &&
      formFields?.hasOwnProperty(dynamicEndDateFieldName)
    ) {
      const changeFieldsObj = {};
      const startDate = pathOr("", ["date_start"], formValues);
      const endDate = pathOr("", [dynamicEndDateFieldName], formValues);
      const dayJsStartDate = dayjs(startDate, getParseDateTimeFormat);
      const dayJsEndDate = dayjs(endDate, getParseDateTimeFormat);
      const durationObj = toHoursAndMinutes(parseInt(fieldValue));
      changeFieldsObj["duration_minutes"] = durationObj["m"];
      changeFieldsObj["duration_hours"] = durationObj["h"];
      if (dayJsStartDate.isValid()) {
        const newEndDate = dayJsStartDate
          .add(fieldValue, "second")
          .format(getParseDateTimeFormat);
        changeFieldsObj[dynamicEndDateFieldName] = newEndDate;
      } else if (dayJsEndDate.isValid()) {
        const newStartDate = dayJsEndDate
          .subtract(fieldValue, "second")
          .format(getParseDateTimeFormat);
        changeFieldsObj["date_start"] = newStartDate;
      }
      changeFormFieldValue(changeFieldsObj);
    } else if (
      fieldObj.name === dynamicEndDateFieldName &&
      formFields?.hasOwnProperty("duration") &&
      formFields?.hasOwnProperty("date_start")
    ) {
      const changeFieldsObj = {};
      let startDateValue = pathOr(null, ["date_start"], formValues);
      const dayJsStartDate = dayjs(startDateValue, getParseDateTimeFormat);
      const dayJsEndDate = dayjs(fieldValue, getParseDateTimeFormat);
      let durationValue = pathOr(null, ["duration"], formValues);
      if (dayJsStartDate.isValid()) {
        const diffMin = dayJsEndDate.diff(dayJsStartDate, "minute");
        const diffSec = dayJsEndDate.diff(dayJsStartDate, "second");
        changeFieldsObj["duration"] = diffSec;
        changeFieldsObj["duration_hours"] = parseInt(diffMin / 60);
        changeFieldsObj["duration_minutes"] = parseInt(diffMin % 60);

        let cstm = add_custom_duration(changeFieldsObj?.duration);
        changeFormFieldData(formId, "duration", (fObj) => {
          fObj = {
            ...fObj,
            options: { ...fObj?.options, [cstm?.value]: cstm?.label.trim() },
          };
          return fObj;
        });
      } else {
        if (!durationValue) {
          changeFieldsObj["duration_hours"] = 0;
          changeFieldsObj["duration_minutes"] = 15;
          changeFieldsObj["duration"] = 900;
          durationValue = 900;
        }

        changeFieldsObj["date_start"] = dayJsEndDate
          .subtract(durationValue, "s")
          .format(getParseDateTimeFormat);
      }
      changeFormFieldValue(changeFieldsObj);
    }
  }
};

export const currencyRateConversation = (
  conversationRate,
  amount,
  lastRate,
) => {
  function convertToDollar(amount, rate) {
    return amount / rate;
  }
  function convertFromDollar(amount, rate) {
    return amount * rate;
  }
  return convertFromDollar(
    convertToDollar(parseFloat(amount), parseFloat(lastRate)),
    parseFloat(conversationRate),
  );
};
