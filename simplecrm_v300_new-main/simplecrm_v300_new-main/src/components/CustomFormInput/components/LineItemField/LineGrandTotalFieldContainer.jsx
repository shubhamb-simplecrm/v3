import { Box, Card, Grid, Typography } from "@material-ui/core";
import CustomFormInput from "../..";
import { pathOr } from "ramda";
import useStyles from "./styles";
import { memo } from "react";

const readOnlyFieldsArr = [
  "total_amt",
  "discount_amount",
  "subtotal_amount",
  "shipping_tax_amt",
  "tax_amount",
  "total_amount",
];
const LineGrandTotalFieldContainer = memo((props) => {
  const { fieldList, listTitle, ...rest } = props;
  const classes = useStyles();

  return (
    <Box
      component={Grid}
      container
      direction="column"
      spacing={1}
      className={classes.grandTotalRoot}
    >
      <Grid item xs={12} sm={12}>
        <Typography color="textSecondary" gutterBottom align="left">
          {listTitle}
        </Typography>
      </Grid>
      {fieldList?.map((field, key) => (
        <Grid key={field.name} item xs={12} sm={12}>
          <CustomFormInput
            {...rest}
            fieldMetaObj={{
              //   ...lineItemFieldObj?.lineItemField,
              ...field,
              field_key: field?.name,
              name: field?.name,
            }}
            fieldState={{
              disabled: readOnlyFieldsArr.includes(field.field_key),
            }}
          />
        </Grid>
      ))}
    </Box>
  );
});
export default LineGrandTotalFieldContainer;
