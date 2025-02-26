import { Draggable, Droppable } from "@hello-pangea/dnd";
import React from "react";
import { getItemStyle, getListStyle } from "./layout-manager-utils";
import { RowFieldContainer } from "./RowFieldContainer";
import { isEmpty } from "ramda";
import { useLayoutManageState } from "./useLayoutManageState";
import { Grid, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";
import { memo } from "react";

export const RowListContainer = memo(({ panelIndex, rowData }) => {
  const classes = useStyles();
  const { addRow, removeRow } = useLayoutManageState((state) => ({
    addRow: state.actions.addRow,
    removePanel: state.actions.removePanel,
    removeRow: state.actions.removeRow,
  }));
  return (
    <Droppable
      droppableId={rowData?.containerId}
      type={rowData?.type}
      style={{ border: "2px solid lightblue " }}
      // direction="horizontal"
      isDropDisabled={rowData?.data == 2}
    >
      {(provided, snapshot) => (
        <div ref={provided.innerRef}>
          {!!rowData?.data && !isEmpty(rowData?.data) ? (
            <>
              {rowData?.data?.map((rowItem, index) => (
                <RowItemContainer
                  key={rowItem.id}
                  rowFieldItem={rowItem}
                  index={index}
                  removeRow={removeRow}
                  panelIndex={panelIndex}
                />
              ))}
              {provided.placeholder}
              <div
                className={classes.addRow}
                style={{ marginLeft: "8px" }}
                onClick={() => addRow(panelIndex, -1)}
              >
                <AddIcon style={{ padding: "1px" }} />
                <span>Add Row</span>
              </div>
            </>
          ) : (
            <div
              onClick={() => {
                addRow(panelIndex, -1);
              }}
              style={{
                textAlign: "center",
                // color: "rgb(66,66,66,0.8)",
                color: "rgba(56,121,211,0.75)",
                paddingTop: "15px",
                cursor: "pointer"
              }}
            >
              <AddIcon style={{ transform: "scale(2)" }} />
              <p
                style={{
                  fontSize: "0.8rem",
                  margin: "0px",
                  padding: "3px 10px",
                }}
              >
                Add Row
              </p>
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
});

const RowItemContainer = memo(
  ({ rowFieldItem, index, removeRow, panelIndex }) => {
    return (
      <Draggable draggableId={rowFieldItem.id} index={index}>
        {(provided, snapshot) => (
          <>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                ...getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style,
                ),
                // display: "flex",
                background: "#ffffff",
                // padding: "10px",
                margin: "10px ",
                maxHeight: "50px",
                backgroundColor: snapshot.isDragging
                  ? "rgb(211, 211, 211, 0.5)"
                  : "rgb(211, 211, 211, 0.2)",
                // position: "relative",
              }}
            >
              <Grid container>
                <Grid item lg={11} md={11} sm={11}>
                  <RowFieldContainer rowFieldData={rowFieldItem.children} />
                </Grid>
                <Grid item lg={1} md={1} sm={1}>
                  <IconButton onClick={() => removeRow(panelIndex, index)}>
                    <CloseIcon style={{ padding: "2px" }} />
                  </IconButton>
                </Grid>
              </Grid>
            </div>
            {provided.placeholder}
          </>
        )}
      </Draggable>
    );
  },
);