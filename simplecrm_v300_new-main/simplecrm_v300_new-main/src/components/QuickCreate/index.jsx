import { Edit } from "@/pages";
import CustomDialog from "../SharedComponents/CustomDialog";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";
import { useSelector } from "react-redux";

const QuickCreate = ({
  open = false,
  moduleName,
  viewName = LAYOUT_VIEW_TYPE.quickCreateView,
  onCancelClick = null,
  onRecordSuccess = null,
  relationshipData,
  parentData,
  customProps = {},
}) => {
  const { customHeader = null } = customProps;
  const moduleLabel =
    useSelector((state) => state.layout.moduleList?.[moduleName]) || moduleName;
  const isMobileViewCheck = useIsMobileView();
  return (
    <CustomDialog
      isDialogOpen={open}
      handleCloseDialog={onCancelClick}
      maxWidth={"md"}
      style={{
        minHeight: 200,
      }}
      bodyContent={
        <Edit
          moduleName={moduleName}
          viewName={viewName}
          onCancelClick={onCancelClick}
          onRecordSuccess={onRecordSuccess}
          customProps={{
            ...customProps,
            customHeader: customHeader ?? (
              <b style={{ fontSize: "1rem" }}>{moduleLabel}</b>
            ),
          }}
          relationshipData={relationshipData}
          parentData={parentData}
        />
      }
      fullScreen={isMobileViewCheck}
      fullWidth={true}
    />
  );
};
export default QuickCreate;
