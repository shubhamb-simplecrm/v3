import { useSelector } from "react-redux";
import { LBL_DASHBOARD_PAGE_TITLE } from "@/constant";
import { isEmpty, pathOr } from "ramda";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";
const viewArr = [
  "detailview",
  "editview",
  "duplicateview",
  "createview",
  "createrelateview",
  "convertlead",
];
export const useModuleViewDetail = (props = {}) => {
  const { moduleName = null, viewName = null } = props;
  const [metaDetail, setMetaDetail] = useState({
    currentModule: "",
    currentModuleLabel: "",
    currentView: "",
    constantCurrentView: "",
    recordId: null,
    allParams: {},
    historyState: {},
    moduleList: {},
  });
  const { pathname } = useLocation();
  const params = useParams();
  const history = useHistory();
  const moduleList = useSelector((state) => state.layout.moduleList);
  const historyState = pathOr({}, ["location", "state"], history);

  useEffect(() => {
    let tempPath = pathname.split("/")[2];
    let currentModule = "";
    let currentModuleLabel = "";
    let currentView = "";
    let recordId = null;
    let constantCurrentView = "";
    if (moduleName) {
      currentModule = moduleName;
      currentModuleLabel = pathOr(currentModule, [currentModule], moduleList);
      if (viewName) {
        currentView = viewName;
      } else {
        if (pathname.includes("Home")) {
          currentView = "Home";
        } else if (pathname.includes("duplicateview")) {
          currentView = "duplicateview";
        } else if (pathname.includes("portalAdministrator")) {
          currentView = tempPath;
          currentModule = tempPath;
          currentModuleLabel = "System Settings";
        } else {
          viewArr.forEach((view) => {
            if (pathname.includes(view)) {
              currentView = view;
            }
          });
          if (isEmpty(currentView)) {
            currentView = "listview";
          }
        }
      }
    } else {
      if (tempPath == "Home") {
        currentView = "Dashboard";
        currentModule = tempPath;
        currentModuleLabel = moduleList[tempPath] || LBL_DASHBOARD_PAGE_TITLE;
      } else if (tempPath == "portalAdministrator") {
        currentView = tempPath;
        currentModule = tempPath;
        currentModuleLabel = "System Settings";
      } else if (tempPath == "dropdownEditor") {
        currentView = tempPath;
        currentModule = tempPath;
        currentModuleLabel = "Dropdown Editor";
      } else if (viewArr.includes(tempPath)) {
        currentView = tempPath;
        currentModule = pathname.split("/")[3];
        currentModuleLabel = pathOr(currentModule, [currentModule], moduleList);
        recordId = !["createrelateview"].includes(tempPath)
          ? pathOr(null, [4], pathname.split("/"))
          : null;
      } else {
        currentView = "listview";
        currentModule = tempPath;
        currentModuleLabel = moduleList[currentModule];
      }
    }
    if (currentView) {
      Object.entries(LAYOUT_VIEW_TYPE).forEach(([key, value]) => {
        if (currentView == value) {
          constantCurrentView = key;
        }
      });
    }
    setMetaDetail({
      currentModule,
      currentModuleLabel,
      currentView,
      constantCurrentView,
      recordId,
      params,
      historyState,
      moduleList,
    });
  }, [pathname, moduleName]);

  return metaDetail;
};
