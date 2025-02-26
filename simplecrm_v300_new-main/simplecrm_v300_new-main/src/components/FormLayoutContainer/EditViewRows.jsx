import React, { memo } from "react";
import { Grid } from "@material-ui/core";
import useStyles from "./styles";
import EditViewFormInput from "./EditViewFormInput";
const EditViewRows = ({
  panelData,
  panelIndex,
  moduleMetaData,
  customProps,
}) => {
  const classes = useStyles();
  return (
    <Grid container>
      {panelData.attributes.map((row, rowNum) =>
        row.map((field, fieldNum) => (
          <Grid
            key={`${field.field_key}-${fieldNum}`}
            item
            xs={12}
            sm={row?.length == 2 ? 6 : 12}
            className={classes.fieldSpacing}
          >
            <EditViewFormInput
              fieldMetaObj={field}
              customProps={{
                ...customProps,
                panelData: panelData,
                rowData: row,
                panelIndex: panelIndex,
                rowIndex: rowNum,
                fieldIndex: fieldNum,
              }}
              moduleMetaData={moduleMetaData}
            />
          </Grid>
        )),
      )}
    </Grid>
  );
};

export default memo(EditViewRows);
