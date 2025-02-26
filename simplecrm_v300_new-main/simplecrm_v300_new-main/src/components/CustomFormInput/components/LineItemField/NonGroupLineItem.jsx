import { DragDropContext } from "@hello-pangea/dnd";
import NonGroupItemListContainer from "./NonGroupItemListContainer";

const NonGroupLineItem = (props) => {
  const { onDragEnd, fieldMetaObj, ...rest } = props;
  const lineItemRowKey = `${fieldMetaObj.name}.ungrouped`;
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <NonGroupItemListContainer
          {...rest}
          fieldMetaObj={fieldMetaObj}
          lineItemRowKey={lineItemRowKey}
        />
      </DragDropContext>
    </>
  );
};
export default NonGroupLineItem;
