import { Droppable } from "@hello-pangea/dnd";
import React from "react";
import { FieldItem } from "./FieldListContainer";
import { Grid } from "@material-ui/core";
import { useLayoutManageState } from "./useLayoutManageState";
import { pathOr } from "ramda";
import { memo } from "react";

export const RowFieldContainer = memo(({ rowFieldData }) => {
  const { removeRowField } = useLayoutManageState((state) => ({
    removeRowField: state.actions.removeRowField,
  }));
  const fieldList = pathOr([], ["data"], rowFieldData);
  return (
    <Droppable
      droppableId={rowFieldData?.containerId}
      type={rowFieldData?.type}
      direction="horizontal"
      // isDropDisabled={fieldList?.length == 2}
    >
      {(provided, snapshot) => (
        <Grid
          container
          gap={5}
          innerRef={provided.innerRef}
          style={{
            minHeight: 50,
            padding: "0px 10px",
          }}
        >
          {rowFieldData?.data?.map((rowItem, index) => (
            <Grid key={rowItem.id} item sm={6}>
              <FieldItem
                itemObj={rowItem}
                index={index}
                onDelete={() =>
                  removeRowField(rowFieldData?.containerId, index)
                }
              />
            </Grid>
          ))}
          {provided.placeholder}
        </Grid>
      )}
    </Droppable>
  );
});
