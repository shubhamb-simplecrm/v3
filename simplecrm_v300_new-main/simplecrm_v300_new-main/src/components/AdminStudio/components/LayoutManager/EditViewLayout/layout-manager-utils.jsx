import { isEmpty, isNil, pathOr } from "ramda";

const grid = 8;

export const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  // userSelect: "none",
  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,
  // // padding: "0 10px",
  // border: "5px solid white",
  // borderRadius: "5px",
  // // background: isDragging ? "lightgreen" : "inherit",
  ...draggableStyle,
});
export const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "#ffffff",
  border: "1px solid rgb( 0,113,210)",
  borderRadius: "5px",
  padding: "0px 8px ",
  // display: "inlineFlex",
  gap: 5,
  maxHeight:"fit-content"
});

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const getPlaceholderImage = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      // height: "100vh", // You can adjust the height as needed
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="40"
      viewBox="0 0 100 100"
    >
      <rect x="0" y="0" width="100" height="100" fill="#ccc" />
      <path
        d="M50 20V80"
        stroke="#333"
        stroke-width="6"
        stroke-linecap="round"
      />
      <path
        d="M20 50H80"
        stroke="#333"
        stroke-width="6"
        stroke-linecap="round"
      />
    </svg>
  </div>
);

export const getPanelRowId = (id) => {
  const outputObj = {
    panelId: null,
    rowId: null,
  };

  if (isNil(id) || isEmpty(id)) return outputObj;
  const idArr = id.split("-");
  if (idArr.length === 2) {
    outputObj["panelId"] = idArr[1];
  } else if (idArr.length === 3) {
    outputObj["panelId"] = idArr[1];
    outputObj["rowId"] = idArr[2];
  }
  return outputObj;
};

export const getPanelRowIndex = (
  panelData,
  customArgs = {
    droppableId: null,
    panelId: null,
    rowId: null,
  },
) => {
  let { droppableId, panelId, rowId } = customArgs;
  const outputObj = {
    panelIndex: null,
    rowIndex: null,
  };
  if (!isNil(droppableId) && !isEmpty(droppableId)) {
    const idsData = getPanelRowId(droppableId);
    panelId = idsData?.panelId;
    rowId = idsData?.rowId;
    outputObj["panelId"] = panelId;
    outputObj["rowId"] = rowId;
  }
  if (isEmpty(panelData) || isNil(panelData) || isEmpty(panelId)) return null;
  panelData.forEach((panel, panelIndex) => {
    if (panel.id == panelId) outputObj["panelIndex"] = panelIndex;
  });
  if (!isEmpty(rowId) && !isNil(rowId)) {
    const rowData = pathOr(
      [],
      [outputObj.panelIndex, "children", "data"],
      panelData,
    );
    rowData.forEach((row, rowIndex) => {
      if (row.id == rowId) outputObj["rowIndex"] = rowIndex;
    });
  }
  return outputObj;
};
