import React from "react";
import { Button, Modal } from "@material-ui/core";
import { connect } from "react-redux";
import { pathOr } from "ramda";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import { updateChoosedColumns } from "../../../../../../store/actions/module.actions";
import { LBL_CANCEL_BUTTON_TITLE, LBL_COLUMN_UPATE_INPROGRESS, LBL_SAVE_BUTTON_TITLE } from "../../../../../../constant";

const getDisplayTabs = (meta) => {
  const displayFieldsObj = pathOr(
    {},
    ["templateMeta", "data", "display_tabs"],
    meta,
  );
  let displayFieldsArr = [];
  for (let key in displayFieldsObj) {
    let field = { content: displayFieldsObj[key], id: key };
    displayFieldsArr.push(field);
  }
  return displayFieldsArr;
};

const getHiddenTabs = (meta) => {
  const hiddenFieldsObj = pathOr(
    {},
    ["templateMeta", "data", "hide_tabs"],
    meta,
  );
  let hiddenFieldsArr = [];
  for (let key in hiddenFieldsObj) {
    let field = { content: hiddenFieldsObj[key], id: key };
    hiddenFieldsArr.push(field);
  }
  return hiddenFieldsArr;
};

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "grey" : "#c3c3c3",
  color: isDragging ? "white" : "black",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
  overflowY: "scroll",
  maxHeight: "70vh",
  //   height: 250
});

class ColumnChooser extends React.Component {
  state = {
    selected: getDisplayTabs(this.props.columnChooserFields),
    items: getHiddenTabs(this.props.columnChooserFields),
    loading: false,
  };

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {
    droppable: "items",
    droppable2: "selected",
  };

  getList = (id) => this.state[this.id2List[id]];

  onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index,
      );
      let state = { items };
      if (source.droppableId === "droppable2") {
        state = { selected: items };
      }
      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination,
      );
      this.setState({
        items: result.droppable,
        selected: result.droppable2,
      });
    }
  };

  updateColumns = () => {
    toast(LBL_COLUMN_UPATE_INPROGRESS)
    let colString = this.state.selected.reduce((a, c) => (a += `|${c.id}`), "");
    this.props.updateChoosedColumns(
      this.props.currentModule,
      colString.slice(1),
    );
    this.props.toggleModalVisibility(!this.props.modalVisible);
  };

  renderChooser = () => {
    return (
      <>
        <div style={{ display: "flex", justifyContent: "center", flexDirection: "row-reverse" }}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  <p style={{ fontWeight: "bold", textAlign: "center" }}>
                    Hidden Tabs
                  </p>
                  {this.state.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="droppable2">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  <p style={{ fontWeight: "bold", textAlign: "center" }}>
                    Displayed Tabs
                  </p>
                  {this.state.selected.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div
          style={{
            margin: "5 auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          
              <Button
                style={{ margin: 3 }}
                color="primary"
                variant="contained"
                onClick={this.updateColumns}
              >
                {LBL_SAVE_BUTTON_TITLE}
              </Button>
              <Button
                style={{ margin: 3 }}
                color="primary"
                variant="contained"
                onClick={() =>
                  this.props.toggleModalVisibility(!this.props.modalVisible)
                }
              >
                {LBL_CANCEL_BUTTON_TITLE}
              </Button>

        </div>
      </>
      // </div>
    );
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <Modal
        style={{ marginTop: 100 }}
        open={this.props.modalVisible}
        onClose={() =>
          this.props.toggleModalVisibility(!this.props.modalVisible)
        }
      >
        {this.renderChooser()}
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    columnChooserFields:
      state.modules.columnsChooserFields[state.modules.selectedModule],
    currentModule: state.modules.selectedModule,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateChoosedColumns: (currentModule, cols) =>
      dispatch(updateChoosedColumns(currentModule, cols)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ColumnChooser);
