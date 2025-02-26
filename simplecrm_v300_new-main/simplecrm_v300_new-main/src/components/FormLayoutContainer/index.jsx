import useCommonUtils from "@/hooks/useCommonUtils";
import useStyles from "./styles";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Box, Grid, Paper } from "@material-ui/core";
import {
  LBL_ATTACHMENT_BUTTON_TITLE,
  LBL_CANCEL_BUTTON_TITLE,
  LBL_SAVE_BUTTON_TITLE,
  LBL_SAVE_INPROGRESS,
} from "@/constant";
import { EditViewPanelAccordions } from "./EditViewPanelAccordions";
import { AttachmentDialog } from "./AttachmentDialog";
import { Button } from "@/components/SharedComponents/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import AttachmentIcon from "@material-ui/icons/Attachment";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";
import { isEmpty, isNil, pathOr } from "ramda";
import {
  currencyRateConversation,
  customOnChangeValueSetter,
  getFormattedValue,
  setInitConfiguration,
} from "./editview-utils";
import {
  calculateGroupGrandTotal,
  lineItemFieldOnChangeCalculation,
} from "./lineitem-calculation";
import { EVENT_TYPES } from "./form-validations";
import {
  getBase64,
  removeFieldHiddenValueRepeatCalendar,
} from "@/common/utils";
import useFormValidator from "./hooks/useFormValidator";
import CustomCircularProgress from "../SharedComponents/CustomCircularProgress";
import { useFormStore } from "./hooks/useEditViewState";

export const FormLayoutContainer = (props) => {
  const {
    formMetaData,
    onSubmit,
    fieldConfiguration,
    moduleMetaData,
    isFormSubmitting,
    onClose = null,
    customHeader,
    parentData,
    attachmentFieldRelationship,
  } = props;
  const formValidator = useFormValidator();
  const {
    passwordValidation,
    userPrefCurrencyRecords,
    defaultCurrency,
    currentUserData,
    enableAttachmentButtonModules,
  } = useCommonUtils();
  const { currentModule } = moduleMetaData;
  const formId = useId();
  const classes = useStyles();
  const { setInitStateData, changeFormFieldData, changeFormPanelState } =
    useFormStore((state) => state.actions);
  const formRefs = useRef({
    fields: {},
    values: {},
    isFormSubmitted: false,
  }).current;
  const [initialErrors, setInitialErrors] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const { getParseDateTimeFormat } = useCommonUtils();
  const methods = useForm({
    disabled: isFormSubmitting,
    errors: initialErrors,
    values: initialValues,
  });
  const { watch, setValue, setError, clearErrors, handleSubmit } = methods;

  const handleFieldOnChange = useCallback(() => {
    const subscription = watch(async (formValues, { name, type, ...a }) => {
      if (isNil(name)) return;
      const customFormValues = { ...formValues };
      let nestedFieldArr = !!name ? name?.split(".") : [];
      const fieldName = nestedFieldArr[0];
      const fieldObj = pathOr({}, [fieldName], formRefs.fields);
      const fieldValue = pathOr(null, [fieldName], formValues);
      const changeFormFieldValue = (input, fieldInputValue, params = {}) => {
        if (typeof input === "string") {
          customFormValues[input] = fieldInputValue;
          setValue(input, fieldInputValue, params);
        } else if (typeof input === "object") {
          Object.entries(input).forEach(([fName, fValue]) => {
            customFormValues[fName] = fValue;
            setValue(fName, fValue, params);
          });
        }
      };

      (async () => {
        if (type === "change") {
          if (fieldObj?.type === "relate") {
            if (
              fieldName === "billing_account" ||
              fieldName === "shipping_account"
            ) {
              const accountType = fieldName.split("_")[0];
              const tempData = pathOr(
                {},
                ["rowData", "attributes"],
                fieldValue,
              );

              if (
                formRefs.fields.hasOwnProperty(
                  `${accountType}_address_street`,
                ) &&
                !isEmpty(tempData)
              ) {
                const tempAddressData = {
                  [`${accountType}_address_street`]:
                    tempData?.[`${accountType}_address_street`] || "",
                  [`${accountType}_address_city`]:
                    tempData?.[`${accountType}_address_city`] || "",
                  [`${accountType}_address_country`]:
                    tempData?.[`${accountType}_address_country`] || "",
                  [`${accountType}_address_postalcode`]:
                    tempData?.[`${accountType}_address_postalcode`] || "",
                  [`${accountType}_address_state`]:
                    tempData?.[`${accountType}_address_state`] || "",
                };
                changeFormFieldValue(
                  `${accountType}_address_street`,
                  tempAddressData,
                );
              }
            }
          } else if (fieldObj.type === "parent") {
            const parentName = pathOr("", ["parent_name"], fieldValue);
            const parentId = pathOr("", ["parent_id"], fieldValue);
            const parentType = pathOr("", ["parent_type"], fieldValue);
            const tempValue = {
              parent_name: isNil(parentName) ? "" : parentName,
              parent_id: isNil(parentId) ? "" : parentId,
              parent_type: isNil(parentType) ? "" : parentType,
            };
            changeFormFieldValue(fieldObj.name, tempValue);
          } else if (fieldObj.type === "repeat_event") {
            const hiddenAndFilterValuesObj =
              removeFieldHiddenValueRepeatCalendar(fieldValue);
            const tempValue = hiddenAndFilterValuesObj.filteredValues;
            changeFormFieldValue(fieldObj.name, tempValue);
          } else if (fieldObj.type === "file") {
            if (currentModule === "Documents") {
              const tempValue = {};
              if (fieldValue) {
                const currentDate = new Date().toJSON().slice(0, 10);
                tempValue["document_name"] = pathOr(
                  currentDate,
                  [0, "name"],
                  fieldValue,
                );
                tempValue["revision"] = "1";
                tempValue["status_id"] = "Active";
              } else {
                tempValue[fieldObj.name] = [{ name: null, file_content: "" }];
                tempValue["document_name"] = "";
                tempValue["revision"] = "";
                tempValue["status_id"] = "";
              }
              changeFormFieldValue(tempValue);
            }
            return;
          } else if (
            fieldObj.type == "enum" ||
            fieldObj.type == "dynamicenum"
          ) {
            const dynamicEnumFields = pathOr(
              [],
              ["dynamicEnumFields"],
              fieldObj,
            );
            if (!isEmpty(dynamicEnumFields)) {
              const tempObj = {};
              dynamicEnumFields.forEach((fieldKey) => {
                tempObj[fieldKey] = "";
              });
              changeFormFieldValue(tempObj);
            }
          } else if (fieldObj.type === "line_item") {
            const outputUpdatingFields = lineItemFieldOnChangeCalculation(
              fieldObj,
              {
                nestedFieldArr,
                formValues,
                fieldValue,
                changeFormFieldValue,
              },
            );
            // changeFormFieldValue(outputUpdatingFields);
          } else if (fieldObj.type === "currency") {
            if (fieldObj.name === "currency_id") {
              const currencyFields = pathOr([], ["currencyFields"], fieldObj);
              const lastRate = pathOr([], ["lastRate"], fieldObj);
              const currentCurrency = pathOr(
                null,
                ["currencyRateRecord", fieldValue],
                fieldObj,
              );
              currencyFields.forEach((fName) => {
                const fieldAmount =
                  parseInt(
                    customFormValues[fName]
                      ?.toString()
                      ?.replace(/,(?=.*\.\d+)/g, ""),
                  ) || 0;
                changeFormFieldData(formId, fName, (fObj) => {
                  fObj["currencySymbol"] = currentCurrency?.symbol;
                  return fObj;
                });
                changeFormFieldValue(
                  fName,
                  currencyRateConversation(
                    currentCurrency?.conversion_rate,
                    fieldAmount,
                    lastRate,
                  ),
                );
              });
              changeFormFieldData(formId, fieldName, (fObj) => {
                fObj = {
                  ...fObj,
                  lastRate: currentCurrency?.conversion_rate,
                };
                return fObj;
              });
              formRefs.fields = {
                ...formRefs.fields,
                [fieldName]: {
                  ...formRefs.fields[fieldName],
                  lastRate: currentCurrency?.conversion_rate,
                },
              };
            }
          } else if (fieldObj.type === "name") {
            if (typeof fieldValue === "object") {
              const outputObj = {};
              const newValue = pathOr("", ["value"], fieldValue);
              const additionalInfo = pathOr(
                "",
                ["rowData", "attributes", "additional_info"],
                fieldValue,
              );
              outputObj[fieldObj?.name] = newValue;
              if (moduleMetaData.currentModule === "Cases")
                outputObj["resolution"] = additionalInfo;
              changeFormFieldValue(outputObj);
            }
          }

          if (moduleMetaData.currentModule === "AOS_Quotes") {
            if (
              (fieldName == "shipping_amount" || fieldName == "shipping_tax") &&
              formRefs.fields.hasOwnProperty("line_items")
            ) {
              const lineItemType = !!pathOr(
                0,
                ["line_items", "linedata", "enable_group"],
                formRefs.fields,
              )
                ? "grouped"
                : "ungrouped";

              const lineItemValue = pathOr(
                [],
                ["line_items", lineItemType],
                formValues,
              );
              changeFormFieldValue(
                calculateGroupGrandTotal(lineItemValue, formValues),
              );
            }
          }
          customOnChangeValueSetter(
            moduleMetaData,
            fieldObj,
            fieldValue,
            customFormValues,
            changeFormFieldValue,
            changeFormFieldData,
            { getParseDateTimeFormat, formId, formFields: formRefs.fields },
          );
        } else if (type === undefined) {
          if (fieldObj.type === "line_item") {
            // lineItemFieldOnChangeCalculation(fieldObj, {
            //   nestedFieldArr,
            //   formValues,
            //   fieldValue,
            //   changeFormFieldValue,
            // });
          }
        }
      })();
      if (type === "change") {
        const formattedFormValues = getFormattedValue(
          customFormValues,
          formRefs.fields,
          moduleMetaData?.currentModule,
          { getParseDateTimeFormat },
        );
        formValidator.validationChecker(EVENT_TYPES?.onChange, {
          onChangeField: fieldObj,
          values: formattedFormValues,
          isFormSubmitted: formRefs.isFormSubmitted,
        });
        formRefs.values = customFormValues;
      } else if (type === undefined) {
        // console.log("handleFieldOnChange", name, type, fieldName);
        // if (fieldName === "line_items") {
        //   console.log(
        //     "handleFieldOnChange1",
        //     name,
        //     formValues,
        //     { name, type, a },
        //     b,
        //   );
        // }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, changeFormFieldData, lineItemFieldOnChangeCalculation]);

  const handleFormSubmit = useCallback(
    async (submittedFormValues) => {
      const formattedFormValues = getFormattedValue(
        submittedFormValues,
        formRefs.fields,
        moduleMetaData?.currentModule,
        { getParseDateTimeFormat },
      );
      const { formIsValid, errors } = formValidator.validationChecker(
        EVENT_TYPES?.onSubmit,
        {
          values: formattedFormValues,
          isFormSubmitted: formRefs.isFormSubmitted,
        },
      );
      if (formIsValid) {
        const submitData = {
          data: {
            type: moduleMetaData?.currentModule,
            id: moduleMetaData?.recordId || undefined,
            attributes: formattedFormValues,
          },
        };
        onSubmit(submitData);
      }
    },
    [moduleMetaData, getParseDateTimeFormat],
  );

  const handleOnInit = async () => {
    if (
      isEmpty(moduleMetaData?.currentModule) ||
      isNil(moduleMetaData?.currentModule)
    ) {
      return;
    }
    const { fieldInitialValues, fieldsMetaObj, panelWiseFields } =
      await setInitConfiguration(formMetaData, moduleMetaData, parentData, {
        currencyRecords: userPrefCurrencyRecords,
        defaultCurrency,
        passwordValidation,
        currentUserData,
        enableAttachmentButtonModules,
      });
    formRefs.fields = fieldsMetaObj;
    formRefs.values = fieldInitialValues;
    formValidator.setInitConfig(
      formRefs.fields,
      formRefs.values,
      fieldConfiguration,
      moduleMetaData,
      {
        setError,
        panelWiseFields,
        changeFormPanelState: (panelKey, panelState) =>
          changeFormPanelState(formId, panelKey, panelState),
      },
    );
    const { fieldsErrorState } = formValidator.validationChecker(
      EVENT_TYPES?.onInit,
      {
        values: formRefs.values,
        isFormSubmitted: formRefs.isFormSubmitted,
      },
    );
    const parseErrors = {};
    Object.entries(fieldsErrorState).forEach(([fieldKey, errorsState]) => {
      parseErrors[fieldKey] = {
        types: errorsState,
      };
    });
    setInitialErrors(parseErrors);
    setInitialValues(formRefs.values);
    setInitStateData(
      formId,
      {},
      {
        fieldData: formRefs.fields,
        panelData: {
          panelWiseFields,
          panelState: formValidator.getPanelState(),
        },
      },
    );
  };

  // useEffect for handle Onload Event
  useEffect(() => {
    handleOnInit();
  }, [formMetaData, moduleMetaData]);

  // useEffect for handle Field Onchange Event
  useEffect(handleFieldOnChange, [watch, setValue]);

  if (isEmpty(formRefs.values)) return null;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(event) => {
          event.stopPropagation();
          formRefs.isFormSubmitted = true;
          handleSubmit(handleFormSubmit, (err, e) =>
            handleFormSubmit(formRefs.values, e),
          )(event);
        }}
        noValidate
        autoComplete="off"
      >
        <Paper key="editBody" className={classes.paperEdit}>
          <FormButtonGroup
            onClose={onClose}
            moduleMetaData={moduleMetaData}
            control={methods?.control}
            isFormSubmitting={isFormSubmitting}
            customHeader={customHeader}
            customProps={{
              formId,
              formValues: formRefs.values,
              formFields: formRefs.fields,
              control: methods?.control,
              attachmentFieldRelationship,
            }}
          />
          <EditViewPanelAccordions
            formMetaData={formMetaData}
            moduleMetaData={moduleMetaData}
            customProps={{
              formId,
              formValues: formRefs.values,
              formFields: formRefs.fields,
              control: methods?.control,
            }}
          />
          <FormButtonGroup
            onClose={onClose}
            moduleMetaData={moduleMetaData}
            isFormSubmitting={isFormSubmitting}
          />
        </Paper>
      </form>
    </FormProvider>
  );
};

const FormButtonGroup = ({
  moduleMetaData,
  isFormSubmitting,
  control = null,
  onClose,
  customHeader = null,
  customProps,
}) => {
  const classes = useStyles();
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>{customHeader}</Grid>
      <Box component={Grid} item className={classes.buttonGroupRoot}>
        <Button
          type="submit"
          label={isFormSubmitting ? LBL_SAVE_INPROGRESS : LBL_SAVE_BUTTON_TITLE}
          startIcon={
            isFormSubmitting ? (
              <CustomCircularProgress size={16} />
            ) : (
              <SaveIcon />
            )
          }
          disabled={isFormSubmitting}
        />
        <Button
          disabled={isFormSubmitting}
          label={LBL_CANCEL_BUTTON_TITLE}
          onClick={onClose}
          startIcon={<CancelIcon />}
        />
        {!isNil(customProps?.control) && (
          <AttachmentButtonOption
            isFormSubmitting={isFormSubmitting}
            moduleMetaData={moduleMetaData}
            customProps={customProps}
          />
        )}
      </Box>
    </Grid>
  );
};

const AttachmentButtonOption = ({
  moduleMetaData,
  isFormSubmitting,
  customProps,
}) => {
  const [attachmentDialogState, setAttachmentDialogState] = useState(false);
  const { enableAttachmentButtonModules } = useCommonUtils();
  const isAttachmentButtonAllow = useMemo(
    () =>
      enableAttachmentButtonModules?.includes(moduleMetaData?.currentModule),
    [moduleMetaData, enableAttachmentButtonModules],
  );
  const handleOnBtnClick = () => {
    setAttachmentDialogState((v) => !v);
  };
  const handleCloseDialog = () => {
    setAttachmentDialogState(false);
  };
  if (
    moduleMetaData?.constantCurrentView === LAYOUT_VIEW_TYPE.quickCreateView ||
    !isAttachmentButtonAllow
  ) {
    return null;
  }
  return (
    <>
      <Button
        type="button"
        disabled={isFormSubmitting}
        label={LBL_ATTACHMENT_BUTTON_TITLE}
        onClick={handleOnBtnClick}
        startIcon={<AttachmentIcon />}
      />
      {attachmentDialogState ? (
        <AttachmentDialog
          open={attachmentDialogState}
          onClose={handleCloseDialog}
          moduleMetaData={moduleMetaData}
          customProps={customProps}
        />
      ) : null}
    </>
  );
};
