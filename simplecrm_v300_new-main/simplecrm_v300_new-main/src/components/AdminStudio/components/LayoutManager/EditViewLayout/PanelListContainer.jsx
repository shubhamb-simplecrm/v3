import { Draggable, Droppable } from "@hello-pangea/dnd";
import React, { useCallback } from "react";
import { getItemStyle, getListStyle } from "./layout-manager-utils";
import { RowListContainer } from "./RowListContainer";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
} from "@material-ui/core";
import useStyles from "./styles";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import { isEmpty, isNil } from "ramda";
import { useLayoutManageState } from "./useLayoutManageState";
import { FormInput } from "@/components";
import { LBL_DETAIL_VIEW } from "@/constant";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { memo } from "react";
const PanelListContainer = memo(() => {
  const { panelLayoutData, addPanel } = useLayoutManageState((state) => ({
    panelLayoutData: state.panelLayoutData,
    addPanel: state.actions.addPanel,
  }));

  const renderPanels = useCallback(() => {
    if (isEmpty(panelLayoutData?.data)) {
      return <AddPanelButton onClick={() => addPanel(-1)} />;
    }
    return panelLayoutData?.data.map((panelItem, index) => (
      <PanelItemContainer
        key={panelItem?.id}
        panelItem={panelItem}
        index={index}
      />
    ));
  }, [panelLayoutData, addPanel]);

  if (isNil(panelLayoutData) || isNil(panelLayoutData?.data)) return null;

  return (
    <Droppable
      droppableId={panelLayoutData?.containerId}
      type={panelLayoutData?.type}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={{
            background: snapshot.isDraggingOver
              ? "rgb(195,215,242, 0.25)"
              : "#ffffff",
          }}
        >
          {renderPanels()}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
});
const PanelItemContainer = memo(({ panelItem, index }) => {
  const classes = useStyles();
  const { addPanel, removePanel, changePanelName, changePanelCollapseState } =
    useLayoutManageState((state) => ({
      addPanel: state.actions.addPanel,
      removePanel: state.actions.removePanel,
      changePanelName: state.actions.changePanelName,
      changePanelCollapseState: state.actions.changePanelIsCollapseState,
    }));
  return (
    <Draggable key={panelItem?.id} draggableId={panelItem?.id} index={index}>
      {(provided, snapshot) => (
        <>
          <Card
            variant="outlined"
            className={classes.root}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              border: "1px solid #dedede",
              margin: "15px 10px",
              // padding: "0px 10px",
              backgroundColor: snapshot.isDragging
                ? "rgb(211, 211, 211, 0.25)"
                : "#ffffff",
            }}
          >
            <CardHeader
              style={{
                backgroundColor: "rgb(247,247,247)",
                margin: "0px",
                padding: "5px 10px",
              }}
              title={
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 300,
                    position: "relative",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "0px",
                    padding: "5px",
                  }}
                >
                  <FormInput
                    field={{
                      field_key: "panel_key",
                      name: "panel_key",
                      type: "varchar",
                      label: "Panel Name",
                    }}
                    fullWidth={false}
                    value={panelItem.label.toUpperCase()}
                    onChange={(v) => changePanelName(index, v)}
                  />
                </div>
              }
              action={
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 300,
                    position: "relative",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "0px",
                    padding: "5px 5px 0px 0px",
                  }}
                >
                  <FormInput
                    field={{
                      field_key: "panel_expand",
                      name: "panel_expand",
                      type: "bool",
                      label: "Default Collapse",
                    }}
                    fullWidth={false}
                    value={panelItem?.panelCollapsed}
                    onChange={(v) => changePanelCollapseState(index, v)}
                  />
                  <IconButton
                    aria-label="close"
                    onClick={() => removePanel(index)}
                  >
                    <CloseIcon style={{ padding: "2px" }} />
                  </IconButton>
                </div>
              }
            />
            <CardContent
              style={{
                padding: "0px",
              }}
            >
              <RowListContainer
                panelIndex={index}
                rowData={panelItem.children}
              />
            </CardContent>
            <CardActions
              style={{
                padding: "4px 0px",
                fontSize: 10,
              }}
            >
              <div
                className={classes.addPanel}
                onClick={() => addPanel(index)}
                style={{ marginLeft: "10px" }}
              >
                <AddIcon style={{ padding: "1px", whiteSpace:"nowrap" }} />
                <p>Add Panel</p>
              </div>
            </CardActions>
          </Card>
          {provided.placeholder}
        </>
      )}
    </Draggable>
  );
});

const AddPanelButton = memo(({ onClick }) => {
  return (
    <div
      style={{
        height: "76vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        onClick={onClick}
        style={{
          textAlign: "center",
          // color: "rgb(66,66,66,0.8)",
          color: "rgba(56,121,211,0.8)",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        <AddIcon style={{ transform: "scale(2)" }} />
        <p style={{ fontSize: "0.8rem", margin: "0px", padding: "3px"}}>
          {"Add Panel"}
        </p>
      </div>
    </div>
  );
});
export default PanelListContainer;