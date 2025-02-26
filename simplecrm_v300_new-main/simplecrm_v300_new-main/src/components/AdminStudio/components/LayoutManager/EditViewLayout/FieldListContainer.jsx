import React, { memo } from "react";
import useStyles from "./styles";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import {
  FIELD_LIST_CONTAINER,
  FIELD_LIST_ITEM,
} from "./layout-manager-constants";
import { IconButton, Tooltip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { truncateString } from "@/common/utils";
import { useLayoutManageState } from "./useLayoutManageState";
import { useIsMobileView } from "@/hooks/useIsMobileView";
export const FieldListContainer = memo(({ isSaveDisable }) => {
  const { availableField } = useLayoutManageState((state) => ({
    availableField: state.availableField,
  }));
  const isTabMd = useIsMobileView("md");
  const isTabSm = useIsMobileView("sm");
  return (
    <div
      style={{
        height: isTabMd || isTabSm ? "calc(60vh - 86px)" : isSaveDisable ? "68vh" : "75vh",
        overflow: "auto",
        border: "1px solid rgb( 0,113,210)",
        borderRadius: "5px",
        paddingLeft: "8px ",
      }}
    >
      <Droppable
        droppableId={FIELD_LIST_CONTAINER}
        isDropDisabled={true}
        type={FIELD_LIST_ITEM}
      >
        {(provided) => (
          <>
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {availableField.map((itemObj, index) => (
                <FieldItem key={itemObj.id} itemObj={itemObj} index={index} />
              ))}
              {provided.placeholder}
            </div>
          </>
        )}
      </Droppable>
    </div>
  );
});

export const FieldItem = memo(({ itemObj, index, onDelete = null }) => {
  const { label, id } = itemObj;
  const classes = useStyles();
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided) => (
        <>
          <Tooltip title={label} disableHoverListener={label <= 30}>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={classes.fieldListItem}
            >
              {truncateString(label, 30)}
              {onDelete && (
                <IconButton size="small" onClick={onDelete}>
                  <DeleteIcon style={{ padding: "2px", color: "lightgray" }} />
                </IconButton>
              )}
            </div>
          </Tooltip>
          {provided.placeholder}
        </>
      )}
    </Draggable>
  );
});