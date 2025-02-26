import { useFieldArray, useFormContext } from "react-hook-form";
import useStyles from "./styles";
import { Button } from "@/components/SharedComponents/Button";
import { memo, useCallback, useMemo } from "react";
import LineItemFieldContainer from "./LineItemFieldContainer";
import { Box, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { clone, isNil, pathOr } from "ramda";
import {
  calculateGrandTotalGroupValue,
  calculateGroupLineTotal,
} from "@/components/FormLayoutContainer/lineitem-calculation";

const NonGroupItemListContainer = (props) => {
  const {
    lineItemRowKey,
    groupIndex = null,
    lineItemFieldMetaObj,
    control,
    onRemoveGroupItem,
  } = props;
  const {
    fields: lineItemsRow,
    remove,
    append,
  } = useFieldArray({
    control,
    name: lineItemRowKey,
  });
  const { getValues, setValue } = useFormContext();
  const addGroupLineItemRow = useCallback(
    (lineItemType) => {
      const lineItemLabels = {
        ...(lineItemType == "product"
          ? lineItemFieldMetaObj?.productDataLabelsFieldsObj || {}
          : lineItemFieldMetaObj?.serviceDataLabelsFieldsObj || {}),
      };
      lineItemLabels["line_type"] = lineItemType;
      append(lineItemLabels);
    },
    [append, lineItemFieldMetaObj],
  );
  const handleRemoveRowItem = useCallback(
    (groupIndex, rowIndex) => {
      remove(rowIndex);
      const initialLineItemValue = { ...clone(getValues()) };
      const groupLineItemValue = pathOr(
        {},
        lineItemRowKey.split("."),
        initialLineItemValue,
      );

      const calculatedGroupValues = calculateGroupLineTotal(groupLineItemValue);
      let singleGroupLineItemKey = lineItemRowKey.split(".");
      singleGroupLineItemKey.pop();
      singleGroupLineItemKey.push("meta");
      singleGroupLineItemKey = singleGroupLineItemKey.join(".");
      setValue(singleGroupLineItemKey, calculatedGroupValues);

      let groupLineItemKey = singleGroupLineItemKey.split(".");
      groupLineItemKey.pop();
      groupLineItemKey.pop();
      groupLineItemKey = groupLineItemKey.join(".");

      calculateGrandTotalGroupValue(
        getValues(groupLineItemKey),
        getValues(),
        setValue,
      );
    },
    [remove],
  );

  return (
    <>
      {lineItemsRow?.map((rowItem, rowIndex) => {
        const lineDataLabels = {
          productDataLabels: lineItemFieldMetaObj?.productDataLabels.map(
            (field) => {
              const newField = { ...field };
              newField.name = `${lineItemRowKey}.${rowIndex}.${newField.name}`;
              newField.field_key = newField.name;
              return newField;
            },
          ),
          serviceDataLabels: lineItemFieldMetaObj?.serviceDataLabels.map(
            (field) => {
              const newField = { ...field };
              newField.name = `${lineItemRowKey}.${rowIndex}.${newField.name}`;
              newField.field_key = newField.name;
              return newField;
            },
          ),
        };

        return (
          <LineItemFieldContainer
            key={rowItem.id}
            control={control}
            rowData={rowItem}
            rowIndex={rowIndex}
            groupIndex={groupIndex}
            onRemoveRowItem={handleRemoveRowItem}
            lineDataLabels={lineDataLabels}
          />
        );
      })}
      <RowButtonGroup
        groupIndex={groupIndex}
        addGroupLineItemRow={addGroupLineItemRow}
        onRemoveGroupItem={onRemoveGroupItem}
      />
    </>
  );
};

const RowButtonGroup = memo((props) => {
  const { groupIndex, addGroupLineItemRow, onRemoveGroupItem } = props;
  const classes = useStyles();

  return (
    <Box mt={2}>
      <Button
        className={classes.mobileLayoutFullWidth + " " + classes.marginBottom}
        variant="outlined"
        color="primary"
        onClick={() => addGroupLineItemRow("product")}
        style={{ marginRight: 10 }}
        label="Add Product Line"
      />
      <Button
        className={classes.mobileLayoutFullWidth + " " + classes.marginBottom}
        variant="outlined"
        color="primary"
        onClick={() => addGroupLineItemRow("service")}
        style={{ marginRight: 10 }}
        label="Add Service Line"
      />

      {!isNil(groupIndex) && (
        <IconButton
          size="small"
          aria-label="delete"
          onClick={() => onRemoveGroupItem(groupIndex)}
          className={classes.margin}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
});
export default NonGroupItemListContainer;
