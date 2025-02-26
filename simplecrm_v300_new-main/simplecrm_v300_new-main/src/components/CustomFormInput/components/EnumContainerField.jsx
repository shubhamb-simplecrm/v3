import EnumField from "./EnumField";
import AutoCompleteEnumField from "./AutoCompleteEnumField";

const EnumContainerField = (props) => {
  const { fieldMetaObj } = props;
  return ["repeat_type", "repeat_interval", "end", "duration"].indexOf(
    fieldMetaObj?.name,
  ) !== -1 && false ? (
    <EnumField {...props} />
  ) : (
    <AutoCompleteEnumField {...props} />
  );
};

export default EnumContainerField;
