import { isEmpty, pathOr } from "ramda";
import {
  DISPLAY_LABEL_CONSTANT,
  DisplayLabelComponent,
} from "../DisplayLabelComponents";
import clsx from "clsx";

export const recordSelectOptionsKeys = Object.freeze({
  select_this_page: "select_this_page",
  select_all: "select_all",
  deselect_all: "deselect_all",
});

export const recordSelectOptionsObj = Object.freeze({
  // [recordSelectOptionsKeys.select_this_page]: "Select this page",
  [recordSelectOptionsKeys.select_all]: "Select All",
  [recordSelectOptionsKeys.deselect_all]: "Deselect All",
});

export const getFieldDataLabel = (
  listDataLabel,
  moduleName,
  listData,
  viewName,
  customArgs,
  classes,
) => {
  const columnItem = {
    ...listDataLabel,
    options: {
      filter: false,
      display: !isEmpty(listData),
      align: "center"
    },
  };
  if (listDataLabel.type === "action") {
    columnItem["options"]["labelType"] =
      DISPLAY_LABEL_CONSTANT?.listActionOption;
    columnItem["options"]["align"] = "center";
    columnItem["options"]["sort"] = false;
    // columnItem["options"]["setCellHeaderProps"] = (value) => {
    //   return {
    //     style: {
    //       textAlign: "center",
    //     },
    //   };
    // };
  } else if (
    ["name", "full_name", "first_name", "last_name", "document_name"].includes(
      listDataLabel.name,
    )
  ) {
    let nameflag = false;
    if (!nameflag) {
      //   if (isMobile) {
      //     nameflag = true;
      //   }
      columnItem["options"]["setCellProps"] = (value) => {
        return {
          className: clsx({
            [classes.NameCell]: true,
          }),
        };
      };
      columnItem["options"]["labelType"] = DISPLAY_LABEL_CONSTANT?.link;
    }
  } else if (
    listDataLabel.type === "enum" ||
    listDataLabel.type === "dynamicenum" ||
    listDataLabel.type === "multienum" ||
    listDataLabel.type === "currency_id"
  ) {
    columnItem["options"]["labelType"] = DISPLAY_LABEL_CONSTANT?.chip;
  } else if (listDataLabel.type === "parent") {
    columnItem["options"]["labelType"] = DISPLAY_LABEL_CONSTANT?.parent;
    columnItem["options"]["sort"] = false;
  } else if (
    listDataLabel.type === "email" ||
    listDataLabel.name === "email1" ||
    listDataLabel.name === "email2"
  ) {
    columnItem["options"]["labelType"] = DISPLAY_LABEL_CONSTANT?.email;
  } else if (listDataLabel.type === "relate") {
    columnItem["options"]["labelType"] = DISPLAY_LABEL_CONSTANT?.relate;
  } else if (
    listDataLabel.type === "date" ||
    listDataLabel.type === "datetime" ||
    listDataLabel.type === "datetimecombo"
  ) {
    if (
      moduleName == "Documents" &&
      listDataLabel.name === "last_rev_create_date"
    ) {
      columnItem["options"]["sort"] = false;
    }
    columnItem["options"]["labelType"] = DISPLAY_LABEL_CONSTANT?.date;
  } else if (listDataLabel.type === "currency") {
    columnItem["options"]["labelType"] = DISPLAY_LABEL_CONSTANT?.currency;
  } else if (listDataLabel.name === "action_c") {
    // return {
    //   ...dl,
    // //   options: {
    // //     customBodyRenderLite: (dataIndex, rowIndex) => (
    // //       <IconButton
    // //         aria-label="preview"
    // //         size="small"
    // //         onClick={() => onEdit(listViewData[dataIndex].id)}
    // //         className={classes.listActionBtn}
    // //       >
    // //         <EditIcon />
    // //       </IconButton>
    // //     ),
    // //   },
    // // };
  } else if (listDataLabel.type === "bool") {
    columnItem["options"]["labelType"] = DISPLAY_LABEL_CONSTANT?.bool;
  } else if (listDataLabel.type === "phone") {
    columnItem["options"]["labelType"] = DISPLAY_LABEL_CONSTANT?.phone;
  } else if (listDataLabel.type === "url") {
    columnItem["options"]["labelType"] = DISPLAY_LABEL_CONSTANT?.url;
  } else if (listDataLabel.type === "file") {
    columnItem["options"]["labelType"] = DISPLAY_LABEL_CONSTANT?.file;
    columnItem["options"]["sort"] = false;
  } else if (listDataLabel.type === "image") {
    columnItem["options"]["labelType"] = DISPLAY_LABEL_CONSTANT?.image;
    columnItem["options"]["sort"] = false;
  }
  columnItem["options"]["customBodyRender"] = (
    value,
    tableMeta,
    updateValue,
  ) => (
    <DisplayLabelComponent
      labelType={columnItem["options"]["labelType"]}
      listDataLabel={listDataLabel}
      formData={listData}
      moduleName={moduleName}
      fieldValue={value}
      viewName={viewName}
      customArgs={{
        tableMeta,
        ...customArgs,
      }}
    />
  );

  return columnItem;
};

export const handleSelectChange = (
  currentRowsSelected,
  rowsSelected,
  selectedRowsList,
  listData,
  callback,
) => {
  const resultObj = {
    ...selectedRowsList,
  };
  if (selectedRowsList.hasOwnProperty("all")) {
    callback(resultObj, currentRowsSelected, rowsSelected);
  } else if (currentRowsSelected.length === 0) {
    Array.isArray(listData) &&
      listData.forEach((list) => {
        const recordId = pathOr(null, ["id"], list);
        if (resultObj.hasOwnProperty(recordId)) delete resultObj[recordId];
      });
  } else if (currentRowsSelected.length === 1) {
    const recordIndex = pathOr(null, [0, "index"], currentRowsSelected);
    const recordId = pathOr(null, [recordIndex, "id"], listData);
    if (rowsSelected.includes(recordIndex)) {
      resultObj[recordId] = pathOr(null, [recordIndex, "attributes"], listData);
    } else {
      if (resultObj.hasOwnProperty(recordId)) {
        delete resultObj[recordId];
      }
    }
  } else {
    currentRowsSelected.forEach((rowData) => {
      const rowIndex = pathOr(null, ["index"], rowData);
      const recordData = pathOr(null, [rowIndex, "attributes"], listData);
      const recordId = pathOr(null, [rowIndex, "id"], listData);
      if (recordId) {
        resultObj[recordId] = recordData;
      }
    });
  }
  callback(resultObj, currentRowsSelected, rowsSelected);
};

export const parseListOptions = () => {
  return {};
};

export const getDefaultOption = () => {
  return {
    filter: false,
    download: false,
    serverSide: true,
    search: false,
    fixedHeader: false,
    fixedSelectColumn: false,
    print: false,
    viewColumns: false,
    selectToolbarPlacement: "none",
    pagination: true,
  };
};
