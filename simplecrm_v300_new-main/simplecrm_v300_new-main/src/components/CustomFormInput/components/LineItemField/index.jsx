import { pathOr } from "ramda";
import GroupLineItem from "./GroupLineItem";
import NonGroupLineItem from "./NonGroupLineItem";
import { useCallback } from "react";
import LineGrandTotalFieldContainer from "./LineGrandTotalFieldContainer";

const LineItemField = (props) => {
  const { fieldMetaObj } = props;
  const isGroupEnable = pathOr(
    false,
    ["linedata", "enable_group"],
    fieldMetaObj,
  );
  const lineItemFieldMetaObj = pathOr(
    {},
    ["lineItemFieldMetaObj"],
    fieldMetaObj,
  );
  const totalFieldsDataLabels = pathOr(
    [],
    ["totalFieldsDataLabels"],
    lineItemFieldMetaObj,
  );
  const onDragEnd = useCallback(() => {
    return null;
  }, []);

  return (
    <>
      {!!isGroupEnable ? (
        <GroupLineItem
          {...props}
          lineItemFieldMetaObj={lineItemFieldMetaObj}
          onDragEnd={onDragEnd}
        />
      ) : (
        <NonGroupLineItem
          {...props}
          lineItemFieldMetaObj={lineItemFieldMetaObj}
          onDragEnd={onDragEnd}
        />
      )}
      <LineGrandTotalFieldContainer
        {...props}
        listTitle="Grand Total"
        fieldList={totalFieldsDataLabels}
      />
    </>
  );
};
export default LineItemField;
