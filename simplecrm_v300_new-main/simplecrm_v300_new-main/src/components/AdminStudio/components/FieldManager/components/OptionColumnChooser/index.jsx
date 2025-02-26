import { Grid, IconButton, TextField } from "@material-ui/core";
import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { FormInput } from "@/components";
import { isEmpty } from "ramda";
import useStyles from "./styles";
import clsx from "clsx";

function OptionColumnChooser({
  list,
  setList,
  setIsEditLabel,
  handleSaveLabel,
  handleDeleteOption,
  onLabelChange,
  isEditLabel,
}) {
  const classes = useStyles();

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setList(items);
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="characters">
        {(provided) => (
          <div
            className="characters"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {list.map((option, index) => {
              return (
                <Draggable
                  key={`${index}id`}
                  draggableId={`${index}id`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Grid
                        container
                        justifyContent="space-between"
                        className={classes.columnBox}
                      >
                        <Grid item lg={10} className={classes.optionRow}>
                          <span className={classes.optionKey}>
                            {`${
                              isEmpty(option?.optionName)
                                ? "[Blank]"
                                : option?.optionName
                            }:`}
                          </span>
                          <span
                            className={classes.optionLabel}
                            onDoubleClick={() =>
                              !isEditLabel.includes(option?.optionName) &&
                              setIsEditLabel([
                                ...isEditLabel,
                                option?.optionName,
                              ])
                            }
                          >
                            {isEditLabel.includes(option?.optionName) ? (
                              <FormInput
                                field={{
                                  field_key: "optionLabel",
                                  name: "optionLabel",
                                  type: "varchar",
                                  label: "",
                                }}
                                variant={"standard"}
                                value={option?.optionLabel}
                                onChange={(value) =>
                                  onLabelChange(value, index)
                                }
                                fullWidth={true}
                              />
                            ) : isEmpty(option?.optionLabel) ? (
                              <span className={classes.blank}>{"[Blank]"}</span>
                            ) : (
                              option?.optionLabel
                            )}
                          </span>
                        </Grid>
                        <Grid item className={classes.optionActions}>
                          {isEditLabel.includes(option?.optionName) ? (
                            <SaveIcon
                              onClick={() =>
                                handleSaveLabel(option?.optionName, index)
                              }
                              className={classes.icon}
                            />
                          ) : (
                            <EditIcon
                              onClick={() =>
                                setIsEditLabel([
                                  ...isEditLabel,
                                  option?.optionName,
                                ])
                              }
                              className={classes.icon}
                            />
                          )}
                          <IconButton
                            disabled={isEditLabel.includes(option?.optionName)}
                            className={classes.deleteIconButton}
                          >
                            <DeleteIcon
                              onClick={() => handleDeleteOption(index)}
                              className={clsx(classes.deleteIcon, {
                                [classes.deleteIconDisabled]:
                                  isEditLabel.includes(option?.optionName),
                              })}
                            />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default OptionColumnChooser;
