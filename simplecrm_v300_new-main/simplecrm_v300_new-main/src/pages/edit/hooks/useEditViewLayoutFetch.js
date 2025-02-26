import { useCallback, useEffect, useState } from "react";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";
import { getEditViewFormDataAction } from "@/store/actions/edit.actions";
import { isEmpty, isNil, pathOr } from "ramda";
import { toast } from "react-toastify";
import { requestForLatLongToNative } from "@/common/mobile-utils";
import useCommonUtils from "@/hooks/useCommonUtils";
import { SOMETHING_WENT_WRONG } from "@/constant";

const useEditViewLayoutFetch = (
  { currentModule = "", recordId = null, params = {}, historyState = {} },
  customProps,
) => {
  const {
    calendarSelectedDate = null,
    calendarViewType = null,
    relateData = null,
    parentData = {},
    currentView = null,
    onCancelClick = null,
  } = customProps;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const parentModuleName = pathOr(
    pathOr("", ["parent_type"], parentData),
    ["returnModule"],
    params,
  );
  const parentReturnId = pathOr(
    pathOr("", ["parent_id"], parentData),
    ["returnRecord"],
    params,
  );
  const { nativeDeviceSettings } = useCommonUtils();

  const getFormData = useCallback(
    (module, recordId, parentModuleName, relateData) => {
      const layoutType =
        !isEmpty(relateData) && !isNil(relateData)
          ? LAYOUT_VIEW_TYPE.createRelateView
          : recordId
            ? currentView == LAYOUT_VIEW_TYPE.convertLeadView
              ? LAYOUT_VIEW_TYPE.convertLeadView
              : currentView == LAYOUT_VIEW_TYPE.duplicateView
                ? LAYOUT_VIEW_TYPE.duplicateView
                : LAYOUT_VIEW_TYPE.editView
            : LAYOUT_VIEW_TYPE.createView;
      setLoading(true);
      getEditViewFormDataAction(module, layoutType, recordId, {
        calendarSelectedDate,
        calendarViewType,
        parentModuleName: parentModuleName || "",
        parentReturnId: parentReturnId || "",
      })
        .then((response) => {
          setLoading(false);
          if (response?.ok) {
            if (
              !!nativeDeviceSettings?.isLocationLatLongMandatory &&
              Array.isArray(
                nativeDeviceSettings?.allowLocationLatLongCaptureModule,
              ) &&
              nativeDeviceSettings?.allowLocationLatLongCaptureModule.includes(
                module,
              )
            ) {
              requestForLatLongToNative();
            }
            setData(response.data);
          } else {
            const errorMessage = pathOr(
              SOMETHING_WENT_WRONG,
              ["data", "errors", "detail"],
              response,
            );
            toast(errorMessage);
            setError(errorMessage);
            if (onCancelClick && typeof onCancelClick === "function") {
              onCancelClick();
              return;
            }
          }
        })
        .catch((e) => {
          setError(e);
          setLoading(false);
          if (onCancelClick && typeof onCancelClick === "function") {
            onCancelClick();
            return;
          }
        });
    },
    [customProps],
  );

  // Initial get EditView Data API fire
  useEffect(() => {
    if (isEmpty(currentModule)) return;
    getFormData(currentModule, recordId, parentModuleName, relateData);
  }, [currentModule, recordId, parentModuleName]);

  return { editFormData: data, editFormLoading: loading, editFormError: error };
};
export default useEditViewLayoutFetch;
