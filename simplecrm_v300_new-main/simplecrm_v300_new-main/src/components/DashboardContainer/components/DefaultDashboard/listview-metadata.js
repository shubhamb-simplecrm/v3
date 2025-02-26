import { pathOr } from "ramda";
import {
  checkInitGroupValidate,
  checkMaskingCondition,
} from "../../../../common/utils";

export const getFilteredData = (listViewData, listViewColumns, FCObj, module) =>
  listViewData &&
  listViewData.map((item) => {
    const tempInitialData = pathOr(item, ["attributes"], item);
    let fields = {};
    listViewColumns.map((column)=>{
      fields[column.name]=column;
    })

    let maskedInitialData = checkMaskingCondition(
      FCObj,
      tempInitialData,
      "masking",
    );
    const getErrorObj = checkInitGroupValidate(
      fields,
      maskedInitialData,
      FCObj,
      true,
      {},
      ["visible"],
      fields,
    );
    const errorData = pathOr({}, ["errors"], getErrorObj);
    const row = {};
    if (module === "AOR_Reports") {
      Object.keys(item.attributes).map((key) => {
        row[key] = item.attributes[key];
      });
    } else {
        listViewColumns.map((col) => {
        if (errorData[col.name] === "InVisible") {
          row[col.name] = "";
        } else {
          row[col.name] = item[col.name];
        }
      });
    }
    return row;
  });
