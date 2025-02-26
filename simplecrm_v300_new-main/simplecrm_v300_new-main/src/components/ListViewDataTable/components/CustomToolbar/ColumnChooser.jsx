import React, { memo, useCallback, useEffect, useState } from "react";
import {
  getColumnChooserFieldsData,
  updateChooserColumnsData,
} from "../../../../store/actions/listview.actions";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { Button } from "../../../SharedComponents/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Close";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_COLUMNS_FILTER_HEADER_TITLE,
  LBL_COLUMNS_UPDATED,
  LBL_DISPLAYED,
  LBL_HIDDEN,
  SOMETHING_WENT_WRONG,
} from "../../../../constant";
import useStyles from "./styles";
import CustomDialog from "../../../SharedComponents/CustomDialog";
import { pathOr } from "ramda";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import { Skeleton } from "@/components";
import { useListViewState } from "@/customStrore/useListViewState";

const tabsHeadingLabel = Object.freeze({
  hide_tabs: LBL_HIDDEN,
  display_tabs: LBL_DISPLAYED,
});

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const ColumnChooser = ({
  dialogOpenStatus,
  currentModule,
  onClose,
  onListStateChange,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [tabsFieldData, setTabsFieldData] = useState({});
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const { listActions } = useListViewState((state) => ({
    listActions: state.actions,
  }));
  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      if (!destination) return;

      const sourceList = Object.entries({
        ...tabsFieldData[source.droppableId],
      });
      const destinationList = Object.entries({
        ...tabsFieldData[destination.droppableId],
      });
      const [removed] = sourceList.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceList.splice(destination.index, 0, removed);
        setTabsFieldData((prev) => ({
          ...prev,
          [source.droppableId]: Object.fromEntries(sourceList),
        }));
      } else {
        destinationList.splice(destination.index, 0, removed);
        setTabsFieldData((prev) => ({
          ...prev,
          [source.droppableId]: Object.fromEntries(sourceList),
          [destination.droppableId]: Object.fromEntries(destinationList),
        }));
      }
    },
    [tabsFieldData],
  );

  const handleOnSubmit = useCallback(() => {
    setFormSubmitLoading(true);
    const displayColString = Object.keys(tabsFieldData.display_tabs).join("|");
    const hideColString = Object.keys(tabsFieldData.hide_tabs).join("|");

    const requestPayload = {
      type: currentModule,
      displayColumns: displayColString,
      hideTabs: hideColString,
    };

    updateChooserColumnsData(requestPayload)
      .then((res) => {
        if (res.ok) {
          toast(LBL_COLUMNS_UPDATED);
          onClose();
          onListStateChange({
            pageNo: 1,
            withAppliedFilter: true,
          });
        } else {
          toast(SOMETHING_WENT_WRONG);
        }
      })
      .catch(() => {
        toast(SOMETHING_WENT_WRONG);
      })
      .finally(() => {
        setFormSubmitLoading(false);
        listActions.changeTableState({
          pageNo: 1,
          withAppliedFilter: true,
        });
      });
  }, [tabsFieldData, currentModule, onClose, onListStateChange]);

  useEffect(() => {
    if (dialogOpenStatus) {
      setLoading(true);
      getColumnChooserFieldsData(currentModule)
        .then((res) => {
          const parsedData = {
            display_tabs: pathOr(
              {},
              ["data", "data", "templateMeta", "data", "display_tabs"],
              res,
            ),
            hide_tabs: pathOr(
              {},
              ["data", "data", "templateMeta", "data", "hide_tabs"],
              res,
            ),
          };
          setTabsFieldData(parsedData);
        })
        .catch(() => {
          toast(SOMETHING_WENT_WRONG);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dialogOpenStatus, currentModule]);
  return (
    <CustomDialog
      isDialogOpen={dialogOpenStatus}
      handleCloseDialog={onClose}
      maxWidth={"sm"}
      height={"100%"}
      title={LBL_COLUMNS_FILTER_HEADER_TITLE}
      bodyContent={
        loading ? (
          <Skeleton />
        ) : (
          <ColumnChooserBody
            tabsFieldData={tabsFieldData}
            onDragEnd={onDragEnd}
          />
        )
      }
      bottomActionContent={
        <Box className={classes.buttonGroupRoot}>
          <Button
            label={formSubmitLoading ? "Saving..." : "Save"}
            disabled={formSubmitLoading}
            startIcon={
              formSubmitLoading ? <CircularProgress size={16} /> : <SaveIcon />
            }
            onClick={handleOnSubmit}
          />
          <Button
            label={LBL_CANCEL_BUTTON_TITLE}
            startIcon={<CancelIcon />}
            disabled={formSubmitLoading}
            onClick={onClose}
          />
        </Box>
      }
    />
  );
};

const ColumnChooserBody = memo(({ tabsFieldData, onDragEnd }) => {
  const classes = useStyles();
  return (
    <div className={classes.column}>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(tabsFieldData).map(([key, col]) => (
          <div key={key} className={classes.columnTab}>
            <div className={classes.columnHeading}>{tabsHeadingLabel[key]}</div>
            <ColumnTab listObj={col} id={key} />
          </div>
        ))}
      </DragDropContext>
    </div>
  );
});

const ColumnTab = memo(({ listObj, id }) => {
  const classes = useStyles();
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          style={{ height: "100%", overflow: "scroll" }}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {Object.entries(listObj).map(([value, label], index) => (
            <Item
              key={value}
              columnId={id}
              label={label}
              value={value}
              index={index}
              list={listObj}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
});

const Item = memo(({ label, value, index, list, columnId }) => {
  const classes = useStyles();
  const isDisabled =
    Object.keys(list).length === 1 && columnId == "display_tabs";

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
          {label}
        </div>
      )}
    </Draggable>
  );
});

export default ColumnChooser;