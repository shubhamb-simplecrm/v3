import React, { memo, useState } from "react";
import useStyles from "./styles";
import { Grid, CardContent, Collapse } from "@material-ui/core";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CustomFormInput from "@/components/CustomFormInput";
const LineItemFieldContainer = ({
  control,
  groupIndex,
  rowIndex,
  rowData,
  onRemoveRowItem,
  lineDataLabels,
}) => {
  const classes = useStyles();
  const { productDataLabels, serviceDataLabels } = lineDataLabels;

  const renderFields = (rowFields) => {
    return (
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        className={classes.lineItemBox}
      >
        <LineItemRowFields
          control={control}
          rowFields={rowFields}
          groupIndex={groupIndex}
          rowIndex={rowIndex}
        />
        <LineItemRowExtraFields
          control={control}
          rowFields={rowFields}
          groupIndex={groupIndex}
          rowIndex={rowIndex}
          onRemoveRowItem={onRemoveRowItem}
        />
      </Grid>
    );
  };
  return rowData?.line_type == "product"
    ? renderFields(productDataLabels)
    : renderFields(serviceDataLabels);
};
const LineItemRowFields = memo(
  ({ control, rowFields, groupIndex, rowIndex }) => {
    return rowFields?.map(
      (field, fieldNum) =>
        !field.field_key.includes("item_description") &&
        !field.field_key.includes("description") && (
          <Grid
            key={fieldNum}
            item
            sm={6}
            xs={12}
            md={
              field.field_key.includes("name") || field.type === "relate"
                ? 2
                : 2
            }
          >
            <CustomFormInput control={control} fieldMetaObj={field} />
          </Grid>
        ),
    );
  },
);
const LineItemRowExtraFields = memo(
  ({ control, rowFields, groupIndex, rowIndex, onRemoveRowItem }) => {
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
    const classes = useStyles();
    const handleCheck = rowFields.some((item) =>
      item.field_key.includes("aos_products"),
    );
    return (
      <>
        <>
          <Grid item>
            {handleCheck && (
              <IconButton
                size="small"
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            )}
          </Grid>
          <Grid item>
            <IconButton
              size="small"
              aria-label="delete"
              onClick={() => onRemoveRowItem(groupIndex, rowIndex)}
              className={classes.margin}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </>
        {handleCheck && (
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
          >
            <Collapse
              className={classes.collapseBox}
              in={expanded}
              timeout="auto"
              unmountOnExit
            >
              <CardContent className={classes.collapseCardContent}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  {rowFields &&
                    rowFields.map(
                      (field, fieldNum) =>
                        (field.field_key.includes("item_description") ||
                          field.field_key.includes("description")) && (
                          <Grid
                            key={field.field_key}
                            item
                            sm="auto"
                            xs="6"
                            md="6"
                          >
                            <CustomFormInput
                              control={control}
                              fieldMetaObj={field}
                            />
                          </Grid>
                        ),
                    )}
                </Grid>
              </CardContent>
            </Collapse>
          </Grid>
        )}
      </>
    );
  },
);
export default memo(LineItemFieldContainer);
