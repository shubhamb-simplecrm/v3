import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";
import EmailField from "./EmailField";
import VarCharField from "./VarCharField";

const EmailContainerField = (props) => {
  const { moduleMetaData, fieldMetaObj } = props;
  return moduleMetaData?.currentView === LAYOUT_VIEW_TYPE.searchLayoutView ||
    fieldMetaObj?.name === "email1" ? (
    <EmailField {...props} />
  ) : (
    <VarCharField {...props} />
  );
};
export default EmailContainerField;
