import React, { memo, useCallback } from "react";
import { CircularProgress, Grid, Tooltip } from "@material-ui/core";
import { Button } from "../Button";
import {
  LBL_RESTORE_DEFAULT_BUTTON_TITLE,
  LBL_SAVE_BUTTON_TITLE,
  LBL_SAVE_INPROGRESS,
} from "../../../constant";
import SaveIcon from "@material-ui/icons/Save";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import useStyles from "./styles";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { isEmpty, isNil } from "ramda";
import { truncate } from "../../../common/utils";

function reorder(list, startIndex, endIndex) {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

const CustomColumnChooser = (props) => {
  const {
    formSubmitLoading,
    tabsFieldData,
    setTabsFieldData,
    tabsHeadingLabel,
    hideActionButtons = false,
    handleRestoreDefault,
    handleSubmit,
  } = props;
  const classes = useStyles();
  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      // Make sure we have a valid destination
      if (!destination) return null;

      const current = Object.entries({ ...tabsFieldData[source.droppableId] });
      const next = Object.entries({
        ...tabsFieldData[destination.droppableId],
      });
      const target = current[source.index];
      // moving to same list
      if (source.droppableId === destination.droppableId) {
        const reordered = reorder(current, source.index, destination.index);
        const result = {
          ...tabsFieldData,
          [source.droppableId]: Object.fromEntries(reordered),
        };
        setTabsFieldData(result);
      } else {
        // moving to different list
        current.splice(source.index, 1);
        next.splice(destination.index, 0, target);
        const result = {
          ...tabsFieldData,
          [source.droppableId]: Object.fromEntries(current),
          [destination.droppableId]: Object.fromEntries(next),
        };
        setTabsFieldData(result);
      }
      return;
    },
    [tabsFieldData],
  );

  return (
    <>
      <ColumnChooserBody
        tabsFieldData={tabsFieldData}
        onDragEnd={onDragEnd}
        tabsHeadingLabel={tabsHeadingLabel}
      />
      {!hideActionButtons && (
        <Grid
          container
          className={classes.buttonGroupRoot}
          justifyContent="flex-end"
          spacing={1}
          style={{ paddingTop: "10px" }}
        >
          <Grid item>
            <Button
              label={LBL_RESTORE_DEFAULT_BUTTON_TITLE}
              startIcon={<SettingsBackupRestoreIcon />}
              onClick={() => handleRestoreDefault()}
            />
          </Grid>
          <Grid item>
            <Button
              label={
                formSubmitLoading ? LBL_SAVE_INPROGRESS : LBL_SAVE_BUTTON_TITLE
              }
              startIcon={
                formSubmitLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <SaveIcon />
                )
              }
              disabled={formSubmitLoading}
              onClick={() => handleSubmit()}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

const ColumnChooserBody = memo(
  ({ tabsFieldData, onDragEnd, tabsHeadingLabel }) => {
    const classes = useStyles();
    return (
      <div className={classes.column}>
        <DragDropContext onDragEnd={onDragEnd}>
          {!isEmpty(tabsFieldData) &&
            !isNil(tabsFieldData) &&
            Object.entries(tabsFieldData).map(([key, col], colIndex) => (
              <div key={key} className={classes.columnTab}>
                <ColumnTab
                  listObj={col}
                  id={key}
                  tabsHeadingLabel={tabsHeadingLabel}
                  colIndex={colIndex}
                />
              </div>
            ))}
        </DragDropContext>
      </div>
    );
  },
);

const ColumnTab = memo(({ listObj, id, tabsHeadingLabel, colIndex }) => {
  const classes = useStyles();
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div>
          <div className={classes.columnHeading}>
            {`${tabsHeadingLabel[id]} Columns`}
          </div>
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={classes.innerColumn}
          >
            {isEmpty(listObj) ? (
              <span style={{ color: "gray" }}> {"[Drop Here]"}</span>
            ) : (
              Object.entries(listObj).map(([value, label], index) => (
                <Item
                  key={`${id}-${value}`}
                  label={label}
                  value={value}
                  index={index}
                  list={listObj}
                  colIndex={colIndex}
                  colId={id}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
});

const Item = memo(({ label, value, index, list, colIndex, colId }) => {
  const classes = useStyles({ colId });
  const isDisabled = Object.keys(list).length === 1 && colIndex == 0;
  const parser = new DOMParser();
  const decodedLabel = parser.parseFromString(
    `<!doctype html><body>${label}`,
    "text/html",
  ).body.textContent;
  let labelValue = isEmpty(label) || isNil(label) ? value : decodedLabel;
  return (
    <Draggable
      key={value}
      draggableId={value}
      index={index}
      isDragDisabled={isDisabled}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={isDisabled ? classes.itemDisabled : classes.item}
        >
          <Tooltip title={labelValue} disableHoverListener={labelValue.length < 19}>
          <span>{labelValue}</span>
          </Tooltip>
          <Tooltip title={value} disableHoverListener={value.length < 19}>
          <p className={classes.secondaryText}>{`(${value})`}</p>
          </Tooltip>
        </div>
      )}
    </Draggable>
  );
});

export default CustomColumnChooser;
