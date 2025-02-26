import { Button } from "@/components/SharedComponents/Button";
import { Box, Grid } from "@material-ui/core";
import { clone, pathOr } from "ramda";
import { memo, useCallback, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import LineGrandTotalFieldContainer from "./LineGrandTotalFieldContainer";
import NonGroupItemListContainer from "./NonGroupItemListContainer";
import { calculateGrandTotalGroupValue } from "@/components/FormLayoutContainer/lineitem-calculation";

const GroupItemListContainer = memo((props) => {
  const { control, fieldMetaObj, lineItemFieldMetaObj, moduleMetaData } = props;
  const lineItemFieldName = pathOr("", ["name"], fieldMetaObj);
  const lineItemGroupKey = `${lineItemFieldName}.grouped`;
  const {
    fields: lineItemGroups,
    append,
    remove,
  } = useFieldArray({
    control,
    name: lineItemGroupKey,
  });
  const { getValues, setValue } = useFormContext();
  const addLineItemGroup = useCallback(() => {
    append({
      meta: {
        ...lineItemFieldMetaObj?.singleGroupTotalFieldsInitialValue,
      },
      data: [],
    });
  }, [lineItemFieldMetaObj]);
  const onRemoveGroupItem = useCallback(
    (groupIndex) => {
      remove(groupIndex);
      const initialLineItemValue = { ...clone(getValues()) };
      const groupLineItemValue = pathOr(
        {},
        lineItemGroupKey.split("."),
        initialLineItemValue,
      );
      calculateGrandTotalGroupValue(
        groupLineItemValue,
        initialLineItemValue,
        setValue,
      );
    },
    [remove],
  );
  return (
    <>
      {lineItemGroups.map((groupItem, key) => (
        <GroupItemCard
          key={groupItem.id}
          {...props}
          groupItem={groupItem}
          groupIndex={key}
          lineItemGroupKey={lineItemGroupKey}
          lineItemFieldMetaObj={lineItemFieldMetaObj}
          onRemoveGroupItem={onRemoveGroupItem}
        />
      ))}
      <Button
        variant="outlined"
        color="primary"
        label="Add Group"
        onClick={addLineItemGroup}
      />
    </>
  );
});

const GroupItemCard = memo((props) => {
  const { lineItemFieldMetaObj, groupIndex, lineItemGroupKey } = props;
  const lineItemRowKey = `${lineItemGroupKey}.${groupIndex}.data`;
  const singleGroupTotalFieldList = useMemo(() => {
    const fieldList = pathOr([], ["singleGroupTotal"], lineItemFieldMetaObj);
    return fieldList?.map((field) => {
      const fieldObj = { ...field };
      fieldObj.field_key =
        fieldObj.name = `${lineItemGroupKey}.${groupIndex}.meta.${field.name}`;

      return fieldObj;
    });
  }, [lineItemFieldMetaObj, groupIndex, lineItemGroupKey]);
  return (
    <Box
      component={Grid}
      container
      direction="column"
      spacing={1}
      boxShadow={1}
      padding={2}
      marginY={2}
    >
      <Grid item xs={12} sm={12}>
        <NonGroupItemListContainer {...props} lineItemRowKey={lineItemRowKey} />
      </Grid>
      <Grid item xs={12} sm={12}>
        <LineGrandTotalFieldContainer
          {...props}
          fieldList={singleGroupTotalFieldList}
        />
      </Grid>
    </Box>
  );
});
export default GroupItemListContainer;
