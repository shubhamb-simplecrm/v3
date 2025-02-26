import React, { useState } from "react";
import { useSelector } from "react-redux";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { NumericFormat } from "react-number-format";
import { pathOr } from "ramda";
import {
  Box,
  Card,
  CardHeader,
  Hidden,
  IconButton,
  MuiThemeProvider,
  useTheme,
  Collapse,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Grid,
} from "@material-ui/core";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useStyles, { getMuiTheme } from "./style";

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: "0.875rem !important",
    padding: "4px 8px !important",
  },
  body: {
    padding: "8px 8px !important",
    fontSize: "0.875rem",
  },
}))(TableCell);
export default function SimpleLineItemDetailView({ data }) {
  const classes = useStyles();
  const theme = useTheme();
  const config = useSelector((state) => state.config);
  const lineItemData = pathOr([], ["simple_data", "data"], data);
  const ProductLineItemData = [];
  const serviceLineItemData = [];
  lineItemData?.forEach((lineItem) => {
    if (lineItem?.line_type === "service") {
      serviceLineItemData.push(lineItem);
    } else {
      ProductLineItemData.push(lineItem);
    }
  });
  //const currencyId = pathOr([], ['userPreference','attributes', 'global', 'currency'], config);
  const currencyArray = pathOr(
    [],
    ["userPreference", "attributes", "CurrenciesRecords"],
    config,
  );
  const currencyId = pathOr(
    [],
    ["simple_data", "data", "0", "currency_id"],
    data,
  );

  let currencySymbol = pathOr(
    "₹",
    ["config", "default_currency_symbol"],
    config,
  );
  //let currencySymbol = '₹';
  currencyArray.map((item) => {
    if (item.id == currencyId) {
      currencySymbol = item.symbol;
    }
  });
  const [productExpanded, setProductExpanded] = useState(-1);
  const [serviceExpanded, setServiceExpanded] = useState(-1);
  const handleExpandClickProduct = (i) => {
    setProductExpanded(productExpanded === i ? -1 : i);
  };
  const handleExpandClickService = (i) => {
    setServiceExpanded(serviceExpanded === i ? -1 : i);
  };
  const getTotalGroupLabelsData = (groupKey) => {
    const rowTotalFields = [
      "total_amt",
      "discount_amount",
      "subtotal_amount",
      "tax_amount",
      "total_amount",
    ];
    let fieldArr = pathOr([], ["total_field_datalabel"], data);
    // let fieldArr = pathOr(
    //   "",
    //   [module, "data", "templateMeta", "data", 0, "panels"],
    //   detailViewTabData,
    // );
    // fieldArr = fieldArr.filter((item) => item.key == "LBL_LINE_ITEMS");
    // fieldArr = pathOr([], [0, "attributes"], fieldArr);
    let fieldArr2 = fieldArr
      .map((item) => {
        let field_key = pathOr(null, ["field_key"], item);

        if (field_key && rowTotalFields.includes(field_key)) {
          return item;
        }
      })
      .filter((item) => item);
    return fieldArr2;
  };

  return (
    <div>
      <MuiThemeProvider theme={getMuiTheme(theme)}>
        {ProductLineItemData.length !== 0 && (
          <Box
            boxShadow={0}
            m={1}
            display={{ xs: "block", sm: "none", md: "none", lg: "none" }}
            className={classes.margin}
          >
            {ProductLineItemData.map((row, i) => (
              <Card
                className={`${classes.root} ${classes.border} ${classes.margin1}`}
              >
                <CardHeader
                  className={classes.bkgrndColor}
                  action={
                    <IconButton
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: productExpanded === i,
                      })}
                      onClick={() => handleExpandClickProduct(i)}
                      aria-expanded={productExpanded === i}
                      aria-label="show more"
                      disableRipple
                    >
                      <ExpandMoreIcon fontSize="small" />
                    </IconButton>
                  }
                  title={
                    <Typography className={classes.link}>
                      {row.aos_products && row.aos_products.value}
                    </Typography>
                  }
                />
                <Collapse
                  in={productExpanded === i}
                  timeout="auto"
                  unmountOnExit
                >
                  <CardContent>
                    <List>
                      {row ? (
                        <div>
                          <ListItem key={"listitem-31"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-1"}
                              textOverflow="ellipsis"
                            >
                              {row.product_qty ? "Quantity" : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-11"}>
                              {" "}
                              {row.product_qty
                                ? parseFloat(row.product_qty).toFixed(0)
                                : ""}
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem key={"listitem-32"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-2"}
                              textOverflow="ellipsis"
                            >
                              {row.aos_products && row.aos_products.value
                                ? "Product"
                                : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-12"}>
                              {" "}
                              {row.aos_products && row.aos_products.value
                                ? row.aos_products.value
                                : ""}
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem key={"listitem-33"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-3"}
                              textOverflow="ellipsis"
                            >
                              {row.product_list_price ? "List" : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-13"}>
                              {currencySymbol}{" "}
                              {row.product_list_price ? (
                                <NumericFormat
                                  value={parseFloat(
                                    row.product_list_price,
                                  ).toFixed(2)}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  decimalSeparator="."
                                  decimalScale={2}
                                />
                              ) : (
                                ""
                              )}
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem key={"listitem-34"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-4"}
                              textOverflow="ellipsis"
                            >
                              {row.product_discount ? "Discount" : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-14"}>
                              {" "}
                              {row.discount === "Amount"
                                ? parseFloat(row.product_discount).toFixed(0)
                                : parseFloat(row.product_discount).toFixed(0) +
                                  "%"}
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem key={"listitem-35"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-5"}
                              textOverflow="ellipsis"
                            >
                              {row.product_unit_price ? "Sale Price" : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-15"}>
                              {currencySymbol}{" "}
                              {row.product_unit_price ? (
                                <NumericFormat
                                  value={parseFloat(
                                    row.product_unit_price,
                                  ).toFixed(2)}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  decimalSeparator="."
                                  decimalScale={2}
                                />
                              ) : (
                                ""
                              )}
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem key={"listitem-36"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-6"}
                              textOverflow="ellipsis"
                            >
                              {row.vat ? "Tax" : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-16"}>
                              {" "}
                              {row.vat ? parseFloat(row.vat) + "%" : ""}
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem key={"listitem-37"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-7"}
                              textOverflow="ellipsis"
                            >
                              {row.vat_amt ? "Tax Amount" : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-17"}>
                              {" "}
                              {currencySymbol}
                              {row.vat_amt ? (
                                <NumericFormat
                                  value={parseFloat(row.vat_amt).toFixed(2)}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  decimalSeparator="."
                                  decimalScale={2}
                                />
                              ) : (
                                ""
                              )}
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem key={"listitem-38"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-8"}
                              textOverflow="ellipsis"
                            >
                              {row.product_total_price ? "Total" : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-18"}>
                              {" "}
                              {currencySymbol}
                              {row.product_total_price ? (
                                <NumericFormat
                                  value={parseFloat(
                                    row.product_total_price,
                                  ).toFixed(2)}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  decimalSeparator="."
                                  decimalScale={2}
                                />
                              ) : (
                                ""
                              )}
                            </ListItemSecondaryAction>
                          </ListItem>
                        </div>
                      ) : (
                        ""
                      )}
                    </List>
                  </CardContent>
                </Collapse>
              </Card>
            ))}
          </Box>
        )}
      </MuiThemeProvider>

      <MuiThemeProvider theme={getMuiTheme(theme)}>
        {serviceLineItemData.length !== 0 && (
          <Box
            boxShadow={0}
            m={1}
            display={{ xs: "block", sm: "none", md: "none", lg: "none" }}
            className={classes.margin}
          >
            {serviceLineItemData.map((row, i) => (
              <Card
                className={`${classes.root} ${classes.border} ${classes.margin1}`}
              >
                <CardHeader
                  className={classes.bkgrndColor}
                  action={
                    <IconButton
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: serviceExpanded === i,
                      })}
                      onClick={() => handleExpandClickService(i)}
                      aria-expanded={serviceExpanded === i}
                      aria-label="show more"
                      disableRipple
                    >
                      <ExpandMoreIcon fontSize="small" />
                    </IconButton>
                  }
                  title={
                    <Typography className={classes.link}>{row.name}</Typography>
                  }
                />
                <Collapse
                  in={serviceExpanded === i}
                  timeout="auto"
                  unmountOnExit
                >
                  <CardContent>
                    <List>
                      {row ? (
                        <div>
                          <ListItem key={"listitem-71"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-51"}
                              textOverflow="ellipsis"
                            >
                              {row.name ? "Service" : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-61"}>
                              {" "}
                              {row.name ? row.name : ""}
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem key={"listitem-72"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-52"}
                              textOverflow="ellipsis"
                            >
                              {row.product_list_price ? "List" : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-62"}>
                              {" "}
                              {currencySymbol}{" "}
                              {row.product_list_price ? (
                                <NumericFormat
                                  value={parseFloat(
                                    row.product_list_price,
                                  ).toFixed(2)}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  decimalSeparator="."
                                  decimalScale={2}
                                />
                              ) : (
                                ""
                              )}
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem key={"listitem-73"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-53"}
                              textOverflow="ellipsis"
                            >
                              {row.product_list_price ? "Discount" : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-63"}>
                              {row.discount === "Amount"
                                ? parseFloat(row.product_discount).toFixed(0)
                                : parseFloat(row.product_discount).toFixed(0) +
                                  "%"}
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem key={"listitem-74"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-54"}
                              textOverflow="ellipsis"
                            >
                              {row.product_discount ? "Sale Price" : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-64"}>
                              {" "}
                              {currencySymbol}{" "}
                              {row.product_unit_price ? (
                                <NumericFormat
                                  value={parseFloat(
                                    row.product_unit_price,
                                  ).toFixed(2)}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  decimalSeparator="."
                                  decimalScale={2}
                                />
                              ) : (
                                ""
                              )}
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem key={"listitem-75"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-55"}
                              textOverflow="ellipsis"
                            >
                              {row.product_unit_price ? "Tax" : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-65"}>
                              {row.vat ? parseFloat(row.vat) + "%" : ""}
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem key={"listitem-76"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-56"}
                              textOverflow="ellipsis"
                            >
                              {row.vat ? "Tax Amount" : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-66"}>
                              {" "}
                              {currencySymbol}
                              {row.vat_amt ? (
                                <NumericFormat
                                  value={parseFloat(row.vat_amt).toFixed(2)}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  decimalSeparator="."
                                  decimalScale={2}
                                />
                              ) : (
                                ""
                              )}
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem key={"listitem-77"}>
                            <ListItemIcon
                              className={classes.labelColor}
                              key={"listitem-icon-57"}
                              textOverflow="ellipsis"
                            >
                              {row.vat_amt ? "Total" : ""}
                            </ListItemIcon>
                            <ListItemSecondaryAction key={"listitem-action-67"}>
                              {" "}
                              {currencySymbol}
                              {row.product_total_price ? (
                                <NumericFormat
                                  value={parseFloat(
                                    row.product_total_price,
                                  ).toFixed(2)}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  decimalSeparator="."
                                  decimalScale={2}
                                />
                              ) : (
                                ""
                              )}
                            </ListItemSecondaryAction>
                          </ListItem>
                        </div>
                      ) : (
                        ""
                      )}
                    </List>
                  </CardContent>
                </Collapse>
              </Card>
            ))}
          </Box>
        )}
      </MuiThemeProvider>

      <Hidden xsDown={true}>
        {ProductLineItemData.length !== 0 && (
          <TableContainer component={Paper}>
            {ProductLineItemData && (
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow style={{ height: "auto" }}>
                    <StyledTableCell align="center">Quantity</StyledTableCell>
                    <StyledTableCell align="center">Product</StyledTableCell>
                    <StyledTableCell align="center">List</StyledTableCell>
                    <StyledTableCell align="center">Discount</StyledTableCell>
                    <StyledTableCell align="center">Sale Price</StyledTableCell>
                    <StyledTableCell align="center">Tax</StyledTableCell>
                    <StyledTableCell align="center">Tax Amount</StyledTableCell>
                    <StyledTableCell align="right">Total</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ProductLineItemData.map((row, key) => (
                    <TableRow key={key} style={{ height: "auto" }}>
                      <StyledTableCell align="center">
                        {parseFloat(row.product_qty).toFixed(0)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.aos_products.value}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {currencySymbol}
                        <NumericFormat
                          value={parseFloat(row.product_list_price).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalSeparator="."
                          decimalScale={2}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.discount === "Amount"
                          ? parseFloat(row.product_discount).toFixed(0)
                          : parseFloat(row.product_discount).toFixed(0) + "%"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {currencySymbol}
                        <NumericFormat
                          value={parseFloat(row.product_unit_price).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalSeparator="."
                          decimalScale={2}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {parseFloat(row.vat) + "%"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {currencySymbol}
                        <NumericFormat
                          value={parseFloat(row.vat_amt).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalSeparator="."
                          decimalScale={2}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {currencySymbol}
                        <NumericFormat
                          value={parseFloat(row.product_total_price).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalSeparator="."
                          decimalScale={2}
                        />
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        )}
        {serviceLineItemData.length !== 0 && (
          <TableContainer component={Paper} style={{ marginTop: "2%" }}>
            {serviceLineItemData && (
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow style={{ height: "auto" }}>
                    <StyledTableCell align="center">Service</StyledTableCell>
                    <StyledTableCell align="center">List</StyledTableCell>
                    <StyledTableCell align="center">Discount</StyledTableCell>
                    <StyledTableCell align="center">Sale Price</StyledTableCell>
                    <StyledTableCell align="center">Tax</StyledTableCell>
                    <StyledTableCell align="center">Tax Amount</StyledTableCell>
                    <StyledTableCell align="right">Total</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceLineItemData.map((row, key) => (
                    <TableRow key={key} style={{ height: "auto" }}>
                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {currencySymbol}
                        <NumericFormat
                          value={parseFloat(row.product_list_price).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalSeparator="."
                          decimalScale={2}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.discount === "Amount"
                          ? parseFloat(row.product_discount).toFixed(0)
                          : parseFloat(row.product_discount).toFixed(0) + "%"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {currencySymbol}
                        <NumericFormat
                          value={parseFloat(row.product_unit_price).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalSeparator="."
                          decimalScale={2}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {parseFloat(row.vat) + "%"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {currencySymbol}
                        <NumericFormat
                          value={parseFloat(row.vat_amt).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalSeparator="."
                          decimalScale={2}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {currencySymbol}
                        <NumericFormat
                          value={parseFloat(row.product_total_price).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalSeparator="."
                          decimalScale={2}
                        />
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        )}
      </Hidden>
      {getTotalGroupLabelsData().map((field) => (
        <Grid container direction="row" justify="flex-end" alignItems="stretch">
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              maxWidth: "150px",
            }}
            // className={classes.mobileLabelLayoutPadding}
          >
            <Typography className={classes.text} variant="subtitle2">
              {field.label ? field.label : ""}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={10}
            style={{
              maxWidth:
                field.field_key === "total_amt" ||
                field.field_key === "discount_amount" ||
                field.field_key === "subtotal_amount" ||
                field.field_key === "shipping_amount" ||
                field.field_key === "shipping_tax_amt" ||
                field.field_key === "shipping_tax" ||
                field.field_key === "tax_amount" ||
                field.field_key === "shipping_c" ||
                field.field_key === "total_amount"
                  ? "150px"
                  : "auto",
            }}
          >
            <Typography
              className={classes.text}
              variant="subtitle1"
              style={{
                // paddingLeft: row.length === 2 ? 6 : null,
                textAlign:
                  field.field_key === "total_amt" ||
                  field.field_key === "discount_amount" ||
                  field.field_key === "subtotal_amount" ||
                  field.field_key === "shipping_amount" ||
                  field.field_key === "shipping_tax_amt" ||
                  field.field_key === "shipping_tax" ||
                  field.field_key === "tax_amount" ||
                  field.field_key === "shipping_c" ||
                  field.field_key === "total_amount"
                    ? "right"
                    : "unset",
              }}
            >
              {field.field_key === "shipping_c" &&
              metaArray[groupIndex]["name"] == "Products" ? (
                field.value
              ) : (
                <NumericFormat
                  value={parseFloat(
                    metaArray[groupIndex][field.field_key],
                  ).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  decimalSeparator="."
                  decimalScale={2}
                />
              )}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </div>
  );
}
