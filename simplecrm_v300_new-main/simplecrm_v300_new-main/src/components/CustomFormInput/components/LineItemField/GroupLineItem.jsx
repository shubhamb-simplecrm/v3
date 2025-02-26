import { DragDropContext } from "@hello-pangea/dnd";
import GroupItemListContainer from "./GroupItemListContainer";
const GroupLineItem = (props) => {
  const { onDragEnd, ...rest } = props;
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <GroupItemListContainer {...rest} />
      </DragDropContext>
    </>
  );
};
export default GroupLineItem;
