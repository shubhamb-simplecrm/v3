import { useCallback, useMemo, useState } from "react";
import useEditViewLayoutFetch from "./hooks/useEditViewLayoutFetch";
import { isEmpty, isNil, pathOr } from "ramda";
import { SkeletonShell, Error, ConvertLeadView } from "@/components";
import { useTheme } from "@material-ui/core";
import { useModuleViewDetail } from "@/hooks/useModuleViewDetail";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";
import { FormLayoutContainer } from "@/components/FormLayoutContainer";
import { createOrEditRecordAction } from "@/store/actions/edit.actions";
import {
  LBL_RECORD_CREATED,
  LBL_RECORD_UPDATED,
  SOMETHING_WENT_WRONG,
} from "@/constant";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "@/store/actions/config.actions";
import { base64decode } from "@/common/encryption-utils";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import LocalStorageUtils from "@/common/local-storage-utils";
import useCommonUtils from "@/hooks/useCommonUtils";

const Edit = ({
  moduleName = null,
  viewName = null,
  onCancelClick = null,
  onRecordSuccess = null,
  customProps = {},
  parentData = {},
  relationshipData = {},
}) => {
  const {
    calendarSelectedDate = null,
    calendarViewType = null,
    customHeader = null,
  } = customProps;
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const metaObj = useModuleViewDetail({ moduleName, viewName });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const { nativeDeviceSettings } = useCommonUtils();
  const {
    currentModule,
    currentModuleLabel,
    currentView,
    recordId,
    params,
    historyState,
  } = metaObj;
  let relateData = useMemo(() => {
    const historyRelateState = pathOr(
      null,
      ["location", "state"],
      historyState,
    );
    const paramsRelateState = pathOr(null, ["relateBeanData"], params);
    if (!isNil(historyRelateState)) {
      return historyRelateState;
    } else if (!isNil(paramsRelateState)) {
      return JSON.parse(base64decode(paramsRelateState));
    } else if (!isNil(relationshipData) && !isEmpty(relationshipData)) {
      return relationshipData;
    } else {
      return {};
    }
  }, [historyState, relationshipData]);
  const { editFormData, editFormLoading, editFormError } =
    useEditViewLayoutFetch(metaObj, {
      calendarSelectedDate,
      calendarViewType,
      relateData,
      parentData,
      currentView,
      onCancelClick,
    });

  const editViewMetaData = useMemo(
    () => pathOr([], ["data", "templateMeta", "data"], editFormData),
    [editFormData],
  );
  const fieldConfiguration = pathOr(
    [],
    [
      "data",
      "templateMeta",
      "FieldConfigursion",
      "data",
      "JSONeditor",
      "dynamicLogic",
      "fields",
    ],
    editFormData,
  );
  const attachmentFieldRelationship = pathOr(
    null,
    ["data", "templateMeta", "attachmentFieldRelationship"],
    editFormData,
  );
  const handleRedirectRoute = (layout, moduleName, recordId) => {
    history.push(`/app/${layout}/${moduleName}/${recordId}`);
  };

  const handleCancelClick = useCallback(() => {
    if (onCancelClick && typeof onCancelClick === "function") {
      onCancelClick();
      return;
    }
    const { currentModule, currentModuleLabel, currentView, recordId, params } =
      metaObj;
    let url = recordId
      ? `/app/${LAYOUT_VIEW_TYPE.detailView}/${currentModule}/${recordId}`
      : `/app/${currentModule}`;
    if (
      history.location.pathname.includes(
        `/${LAYOUT_VIEW_TYPE.createRelateView}/`,
      )
    ) {
      url = `/app/${LAYOUT_VIEW_TYPE.detailView}/${params?.returnModule}/${params?.returnRecord}`;
    } else if (history.location.pathname.includes("/portalAdminLinks")) {
      url = `/app/portalAdministrator`;
    }
    history.push(url);
  }, [history, metaObj, onCancelClick]);

  const handleOnSubmit = useCallback(
    async (requestData) => {
      if (
        typeof requestData?.data == "object" &&
        !isNil(relateData) &&
        !isEmpty(relateData)
      ) {
        requestData.data["relateBean"] = [relateData];
      }
      if (
        !!nativeDeviceSettings?.isLocationLatLongMandatory &&
        Array.isArray(
          nativeDeviceSettings?.allowLocationLatLongCaptureModule,
        ) &&
        nativeDeviceSettings?.allowLocationLatLongCaptureModule.includes(
          currentModule,
        )
      ) {
        const nativeLatLongData = JSON.parse(
          LocalStorageUtils.getValueByKey("nativeLatLongData"),
        );
        const additionalData = requestData.data["additionalData"] ?? {};
        additionalData["locationDetail"] = {
          lat: nativeLatLongData?.lat || "",
          long: nativeLatLongData?.long || "",
        };
        requestData.data["additionalData"] = additionalData;
      }
      setIsFormSubmitting(true);
      const res = await createOrEditRecordAction(
        requestData,
        currentView,
        recordId,
      );
      const responseRecordId = pathOr(null, ["data", "data", "id"], res);
      if (res?.ok) {
        setIsFormSubmitting(false);
        if (!isNil(responseRecordId)) {
          toast(recordId ? LBL_RECORD_UPDATED : LBL_RECORD_CREATED);
          if (currentModule === "Users") {
            dispatch(getCurrentUser());
          }
          if (onRecordSuccess && typeof onRecordSuccess == "function") {
            onRecordSuccess();
            return;
          }
          if (
            metaObj.constantCurrentView == LAYOUT_VIEW_TYPE.createRelateView
          ) {
            handleRedirectRoute(
              LAYOUT_VIEW_TYPE.detailView,
              returnModule,
              returnRecord,
            );
          } else {
            handleRedirectRoute(
              LAYOUT_VIEW_TYPE.detailView,
              currentModule,
              responseRecordId,
            );
          }
          return;
        } else {
          toast(
            pathOr(
              pathOr(
                SOMETHING_WENT_WRONG,
                ["data", "data", "errors", "detail"],
                res,
              ),
              ["data", "data", "meta", "message"],
              res,
            ),
          );
        }
      } else {
        const errors = pathOr({}, ["data", "error", "errors"], res);
        if (!isEmpty(errors)) {
          Object.entries(errors).forEach(([fieldKey, errors]) =>
            Array.isArray(errors)
              ? errors.forEach((e) => toast(e))
              : toast(errors),
          );
        } else {
          toast(SOMETHING_WENT_WRONG);
        }
        setIsFormSubmitting(false);
      }
    },
    [
      relateData,
      createOrEditRecordAction,
      currentView,
      recordId,
      handleCancelClick,
      onRecordSuccess,
    ],
  );

  if (editFormLoading) {
    return <SkeletonShell layout="EditView" />;
  }

  if (editFormError) {
    return <Error description={editFormError} view="EditView" title="Error" />;
  }

  if (isEmpty(editViewMetaData)) {
    return null;
  }

  return (
    // <MuiThemeProvider theme={getMuiTheme(theme)}>
    <>
      {currentView === LAYOUT_VIEW_TYPE?.convertLeadView ? (
        <ConvertLeadView
          id={id}
          data={editViewMetaData}
          fieldConfigurator={fieldConfiguration}
          module={currentModule}
          onSubmit={handleOnSubmit}
        />
      ) : (
        <FormLayoutContainer
          formMetaData={editViewMetaData}
          fieldConfiguration={fieldConfiguration}
          onSubmit={handleOnSubmit}
          isFormSubmitting={isFormSubmitting}
          moduleMetaData={metaObj}
          onClose={handleCancelClick}
          customHeader={customHeader}
          parentData={parentData}
          attachmentFieldRelationship={attachmentFieldRelationship}
        />
      )}
    </>
    // </MuiThemeProvider>
  );
};
export default Edit;