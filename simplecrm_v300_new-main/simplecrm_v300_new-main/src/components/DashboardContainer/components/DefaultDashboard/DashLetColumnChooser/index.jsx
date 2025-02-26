import React, { useState, useEffect } from "react";
// styles
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useStyles from "./styles";
import { getMuiTheme } from "./styles";
import { Typography, useTheme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import { Scrollbars } from "react-custom-scrollbars";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { pathOr } from "ramda";
import {
  LBL_DASHLET_EDIT_HIDE_COLUMNS,
  LBL_DASHLET_EDIT_DISPLAY_COLUMNS,
  LBL_DASHLET_EDIT_COLUMNS,
} from "../../../../../constant";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: "5px 15px",
  margin: `0 0 ${grid}px 0`,
  color: isDragging ? "#0071d2CC" : "#0071d2",
  border: "1px solid rgba(56, 193, 239, 0.5)",
  fontSize: "0.875rem",
  fontFamily: "Poppins",
  lineHeight: "1.75",
  fontWeight: 400,
  borderRadius: 2,
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  border: "1px solid rgb(204 204 204 / 27%)",
  padding: grid,
  margin: 5,
  minHeight: "40vh",
});

export default function DashLetColumnChooser({
  columnChooser,
  setTransferListLeftColumns,
  setTransferListRightColumns,
}) {
  const classes = useStyles();
  const currentTheme = useTheme();

  const [displayColumns, setDisplayColumns] = useState(() =>
    Object.entries(pathOr({}, ["display_tabs", "columns"], columnChooser)).map(
      ([fieldName, fieldLabel]) => {
        return { fieldLabel, fieldName };
      },
    ),
  );
  const [hiddenColumns, setHiddenColumns] = useState(() =>
    Object.entries(pathOr({}, ["hide_tabs", "columns"], columnChooser)).map(
      ([fieldName, fieldLabel]) => {
        return { fieldLabel, fieldName };
      },
    ),
  );

  useEffect(() => {
    const displayColumnNames = displayColumns.map((a) => a.fieldName);
    const hiddenColumnNames = hiddenColumns.map((a) => a.fieldName);

    // column1|column2|column3
    setTransferListLeftColumns(displayColumnNames.join("|"));
    setTransferListRightColumns(hiddenColumnNames.join("|"));
  }, [displayColumns, hiddenColumns]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    let updatedHiddenColumns = [];
    let updatedDisplayedColumns = [];
    let targetFieldDisplay = [
      ...displayColumns.filter((a) => a.fieldName === draggableId),
    ][0];
    let targetFieldHidden = [
      ...hiddenColumns.filter((a) => a.fieldName === draggableId),
    ][0];
    let dispayColumnUpdated = [
      ...displayColumns.filter((a) => a.fieldName !== draggableId),
    ];
    let hiddenColumnUpdated = [
      ...hiddenColumns.filter((a) => a.fieldName !== draggableId),
    ];

    // only update index
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "displayColumns") {
        const targetField = targetFieldDisplay;
        updatedDisplayedColumns = dispayColumnUpdated;
        updatedDisplayedColumns.splice(destination.index, 0, targetField);

        updatedHiddenColumns = [...hiddenColumns];
      } else {
        const targetField = targetFieldHidden;
        updatedHiddenColumns = hiddenColumnUpdated;
        updatedHiddenColumns.splice(destination.index, 0, targetField);

        updatedDisplayedColumns = [...displayColumns];
      }
    } else if (source.droppableId === "displayColumns") {
      updatedDisplayedColumns = dispayColumnUpdated;
      const targetField = targetFieldDisplay;
      updatedHiddenColumns = [...hiddenColumns];
      updatedHiddenColumns.splice(destination.index, 0, targetField);
    } else {
      updatedHiddenColumns = hiddenColumnUpdated;
      const targetField = targetFieldHidden;
      updatedDisplayedColumns = [...displayColumns];
      updatedDisplayedColumns.splice(destination.index, 0, targetField);
    }

    setDisplayColumns(updatedDisplayedColumns);
    setHiddenColumns(updatedHiddenColumns);
  };

  const customList = () => (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          flexDirection: "row-reverse",
        }}
        className="flex-direction"
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="hiddenColumns">
            {(provided, snapshot) => (
              <Scrollbars
                autoHide={true}
                style={{ height: "40vh", width: "50%" }}
                className="mobileLayoutScrollbar"
              >
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  className="mobileLayout-Col-Cont"
                >
                  <Typography variant="subtitle1">
                    {LBL_DASHLET_EDIT_HIDE_COLUMNS}
                  </Typography>
                  {hiddenColumns.map((item, index) => (
                    <Draggable
                      key={item.fieldName}
                      draggableId={item.fieldName}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Typography
                          variant="subtitle1"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                        >
                          {item.fieldLabel}
                        </Typography>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </Scrollbars>
            )}
          </Droppable>

          <Droppable droppableId="displayColumns">
            {(provided, snapshot) => (
              <Scrollbars
                autoHide={true}
                style={{ height: "40vh", width: "50%" }}
                className="mobileLayoutScrollbar"
              >
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  className="mobileLayout-Col-Cont"
                >
                  <Typography variant="subtitle1">
                    {LBL_DASHLET_EDIT_DISPLAY_COLUMNS}
                  </Typography>
                  {displayColumns.map((item, index) => (
                    <Draggable
                      key={item.fieldName}
                      draggableId={item.fieldName}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Typography
                          variant="subtitle1"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                        >
                          {item.fieldLabel}
                        </Typography>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </Scrollbars>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </Card>
  );

  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <Grid justify="left" alignItems="left" className={classes.root}>
        <Grid xs={12} item>
          {customList()}
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
}
