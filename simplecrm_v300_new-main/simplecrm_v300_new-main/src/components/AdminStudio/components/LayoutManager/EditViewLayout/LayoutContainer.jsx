import React, { memo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Grid } from "@material-ui/core";
import { FieldListContainer } from "./FieldListContainer";
import PanelListContainer from "./PanelListContainer";
import { useIsMobileView } from "@/hooks/useIsMobileView";

const LayoutContainer = ({ onLayoutDragChange, isSaveDisable }) => {
  const onDragStart = (start) => {
    // setDraggingItemId(start.draggableId);
  };
  const isTabMd = useIsMobileView("md");
  const isTabSm = useIsMobileView("sm");
  const isTabXs = useIsMobileView("xs");
  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onLayoutDragChange}>
      <Grid container lg={12}>
        <Grid
          item
          lg={3}
          md={4}
          sm={4}
          style={{
            padding: "0px 8px",
          }}
        >
          <FieldListContainer isSaveDisable={isSaveDisable} />
        </Grid>
        <Grid
          item
          lg={9}
          md={8}
          sm={8}
          style={{
            height:
              isTabMd || isTabSm
                ? "calc(60vh - 86px)"
                : isSaveDisable
                  ? "68vh"
                  : "75vh",
            overflow: "auto",
            border: "1px solid rgb( 0,113,210)",
            borderRadius: "5px",
            padding: "0px 4px 0px 8px ",
          }}
        >
          <PanelListContainer />
        </Grid>
      </Grid>
    </DragDropContext>
  );
};

export default LayoutContainer;
