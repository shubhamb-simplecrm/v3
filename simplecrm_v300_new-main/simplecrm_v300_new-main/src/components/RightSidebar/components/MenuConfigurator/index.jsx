import React, { useState, useEffect, useMemo} from "react";
import {Button, Typography, DialogContent, DialogTitle, DialogActions,useTheme } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { Scrollbars } from "react-custom-scrollbars";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSelector, useDispatch } from "react-redux";
import useStyles,{getMuiTheme} from "./styles";
import { pathOr } from "ramda";
import { saveMenuConfigurator } from "../../../../store/actions/config.actions";
import { FaIcon } from "../../../";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_MENU_ORDER_CONFIGURATOR_TITLE,
  LBL_SAVE_BUTTON_TITLE,
  LBL_SAVE_INPROGRESS,
} from "../../../../constant";
import { getSidebarLinks } from "../../../../store/actions/layout.actions";

const MenuConfigurator = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { open, close } = props;
  const [loader, setLoader] = useState(false);
  //Fetching all Label data from the Redux
  const sidebarAttributes = useSelector((state) =>
    pathOr({}, ["sidebarLinks", "attributes"], state.layout),
  );
  let arr = Object.entries(sidebarAttributes);
  const _moduleInfo = useMemo(
    () =>
      arr.map(([key, info]) => ({
        key,
        label: info.label,
        icon: info.icon,
        info,
      })),
    [sidebarAttributes],
  );
  const [moduleInfo, setModuleInfo] = useState(_moduleInfo);
  useEffect(() => {
    setModuleInfo(moduleInfo);
  }, [moduleInfo, saveMenuConfigurator]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  const dispatch = useDispatch();

  function handleOnDragEnd(result) {
    if (!result.destination) {
      return;
    }
    const oldIndex = moduleInfo.findIndex(
      (module) => module.key === result.source.index,
    );
    const newIndex = moduleInfo.findIndex(
      (module) => module.key === result.destination.index,
    );
    const items1 = reorder(
      moduleInfo,
      result.source.index,
      result.destination.index,
    );
    setModuleInfo(items1);
  }

  //Save button Functionality
  const onSave = async() => {
    setLoader(true);
    let data = moduleInfo.map((item) => item.key);
    try{
    const res = await saveMenuConfigurator(data);
    setLoader(false);
    if(res && res.ok){
      dispatch(getSidebarLinks());
      close();
      window.location.reload();
    }
    }catch(e){
      setLoader(false);
    }
    
  };

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
    padding: grid,
    margin: 5,
    minHeight: "40vh",
  });
  const renderChooser = () => {
    return (
      <>
      <DialogContent>
        <div
          style={{ display: "flex", justifyContent: "center" }}
          className="flex-direction"
        >
          <DragDropContext
            onDragEnd={handleOnDragEnd}
          >
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <Scrollbars
                  autoHide={true}
                  style={{ height: "70vh", width: "50%" }}
                  className="mobileLayoutScrollbar"
                >
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    className="mobileLayout-Col-Cont"
                  >
                    
                    {moduleInfo.map((index2, key) => {
                      return (
                        <Draggable
                          key={index2.key}
                          draggableId={index2.key}
                          index={key}
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
                              <FaIcon
                                icon={`fas ${
                                  index2.icon ? index2.icon.icon : "fa-cube"
                                }`}
                                size="1x"
                              />
                              {"  " + index2.label}
                            </Typography>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                </Scrollbars>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        </DialogContent>
        <DialogActions>
        <Button
            style={{ margin: 3 }}
            color="primary"
            variant="contained"
            onClick={onSave}
            className={classes.buttons}
          >
            {loader?LBL_SAVE_INPROGRESS:LBL_SAVE_BUTTON_TITLE}
          </Button>
          <Button
            style={{ margin: 3 }}
            color="primary"
            variant="contained"
            onClick={close}
            className={classes.buttons}
          >
            {LBL_CANCEL_BUTTON_TITLE}
          </Button>
        </DialogActions>
      </>
    );
  };
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Dialog
        open={open}
        variant="persistent"
        onClose={close}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title"><Typography variant="h6">{LBL_MENU_ORDER_CONFIGURATOR_TITLE}</Typography></DialogTitle>
        
          <Scrollbars autoHide={true} style={{ height: "84vh", width: "100%" }}>
            {renderChooser()}
          </Scrollbars>
        
      </Dialog>
      </MuiThemeProvider>
  );
};

export default MenuConfigurator;