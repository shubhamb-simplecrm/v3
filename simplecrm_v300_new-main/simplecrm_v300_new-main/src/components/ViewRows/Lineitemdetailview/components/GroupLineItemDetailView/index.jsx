import React, { useState } from "react";
import { useSelector } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { NumericFormat } from "react-number-format";
import { pathOr, mapObjIndexed, isEmpty, map } from "ramda";
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
  Container,
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
/*
const useStyles = makeStyles({
    table: {
        minWidth: 650,
        border: "#cccccc43 solid thin",
    },
});
*/
export default function GroupLineItemDetailView({ data, module }) {
  const classes = useStyles();
  const theme = useTheme();
  const config = useSelector((state) => state.config);
  const currencyArray = pathOr(
    [],
    ["userPreference", "attributes", "CurrenciesRecords"],
    config,
  );
  const lineItemGrandTotalFields = pathOr([], ["total_field_datalabel"], data);
  const getData = pathOr([], ["groups_data"], data);
  const getProductLabelsData = pathOr([], ["product_datalabels", 0], data);
  const getServiceLabelsData = pathOr([], ["service_datalabels", 0], data);
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
  const currencyId = pathOr(
    [],
    ["simple_data", "data", "0", "currency_id"],
    data,
  );
  const hiddenFields = ["item_description", "description"];

  let currencySymbol = pathOr(
    "₹",
    ["config", "default_currency_symbol"],
    config,
  );

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
  const serviceRowArray = [];
  const productRowArray = [];
  const dataArray = [];
  const metaArray = [];
  const groupNameArray = [];
  mapObjIndexed((dataRow, key, obj) => {
    if (typeof dataRow !== "object") return;
    let tempArray = pathOr([], ["data"], dataRow);
    let tempMetaArray = pathOr([], ["meta"], dataRow);
    let tempName = pathOr("", ["meta", "name"], dataRow);
    groupNameArray.push(tempName);
    dataArray.push(tempArray);
    metaArray.push(tempMetaArray);
    tempArray.map((item) =>
      typeof item === "object" && item.line_type === "product"
        ? productRowArray.push(item)
        : serviceRowArray.push(item),
    );
  }, getData);
  const getProductTableValue = (e, row) => {
    if (e.field_key == "product_qty") {
      return (
        <StyledTableCell align="center">
          <NumericFormat
            value={parseFloat(row.product_qty).toFixed(5)}
            displayType={"text"}
            thousandSeparator={true}
            decimalSeparator="."
            decimalScale={5}
          />
        </StyledTableCell>
      );
    } else if (e.field_key == "aos_products") {
      return (
        <StyledTableCell align="center">
          {row.aos_products.value}
        </StyledTableCell>
      );
    } else if (e.field_key == "product_list_price") {
      return (
        <StyledTableCell align="right">
          {currencySymbol}
          <NumericFormat
            value={parseFloat(row.product_list_price).toFixed(2)}
            displayType={"text"}
            thousandSeparator={true}
            decimalSeparator="."
            decimalScale={2}
          />
        </StyledTableCell>
      );
    } else if (e.field_key == "product_discount") {
      return (
        <StyledTableCell align="center">
          {row.discount === "Amount"
            ? parseFloat(row.product_discount).toFixed(0)
            : parseFloat(row.product_discount).toFixed(0) + "%"}
        </StyledTableCell>
      );
    } else if (e.field_key == "product_unit_price") {
      return (
        <StyledTableCell align="right">
          {currencySymbol}
          <NumericFormat
            value={parseFloat(row.product_unit_price).toFixed(2)}
            displayType={"text"}
            thousandSeparator={true}
            decimalSeparator="."
            decimalScale={2}
          />
        </StyledTableCell>
      );
    } else if (e.field_key == "vat") {
      return (
        <StyledTableCell align="center">
          {parseFloat(row.vat) + "%"}
        </StyledTableCell>
      );
    } else if (e.field_key == "vat_amt") {
      return (
        <StyledTableCell align="right">
          {currencySymbol}
          <NumericFormat
            value={parseFloat(row.vat_amt).toFixed(2)}
            displayType={"text"}
            thousandSeparator={true}
            decimalSeparator="."
            decimalScale={2}
          />
        </StyledTableCell>
      );
    } else if (e.field_key == "product_total_price") {
      return (
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
      );
    } else if (
      e.field_key != "item_description" ||
      e.field_key !== "description"
    ) {
      return (
        <StyledTableCell align="center">
          {pathOr("", [e.field_key], row)}
        </StyledTableCell>
      );
    }
  };
  const getServiceTableValue = (e, row) => {
    if (e.field_key == "name") {
      return <StyledTableCell align="center">{row.name}</StyledTableCell>;
    } else if (e.field_key == "product_list_price") {
      return (
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
      );
    } else if (e.field_key == "product_discount") {
      return (
        <StyledTableCell align="center">
          {row.discount === "Amount"
            ? parseFloat(row.product_discount).toFixed(0)
            : parseFloat(row.product_discount).toFixed(0) + "%"}
        </StyledTableCell>
      );
    } else if (e.field_key == "product_unit_price") {
      return (
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
      );
    } else if (e.field_key == "vat") {
      return (
        <StyledTableCell align="center">
          {parseFloat(row.vat) + "%"}
        </StyledTableCell>
      );
    } else if (e.field_key == "vat_amt") {
      return (
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
      );
    } else if (e.field_key == "product_total_price") {
      return (
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
      );
    } else if (
      e.field_key != "item_description" ||
      e.field_ke !== "description"
    ) {
      return (
        <StyledTableCell align="center">
          {pathOr("", [e.field_key], row)}
        </StyledTableCell>
      );
    }
  };
  return (
    <>
      <Card className={`${classes.root} ${classes.border} ${classes.margin1}`}>
        {dataArray.map((dataRow, groupIndex) => (
          <div>
            <Card
              className={`${classes.root} ${classes.border} ${classes.margin1}`}
            >
              {/* Mobile View LineItem view :START */}
              <MuiThemeProvider theme={getMuiTheme(theme)}>
                {!isEmpty(dataRow) && (
                  <Box
                    boxShadow={0}
                    m={1}
                    display={{
                      xs: "block",
                      sm: "none",
                      md: "none",
                      lg: "none",
                    }}
                    className={classes.margin}
                  >
                    {dataRow
                      .filter((data1) => data1.line_type === "product")
                      .map((row, i) => (
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
                            in={productExpanded === i || true}
                            timeout="auto"
                            unmountOnExit
                          >
                            <CardContent>
                              <List>
                                {!isEmpty(row) && (
                                  <div>
                                    {getProductLabelsData.map((e, i) => (
                                      <ListItem key={`listitem-${i}`}>
                                        <ListItemIcon
                                          className={classes.labelColor}
                                          key={`listitem-icon-${i}`}
                                          textOverflow="ellipsis"
                                        >
                                          {e.label}
                                        </ListItemIcon>
                                        <ListItemSecondaryAction
                                          key={`listitem-action-${i}`}
                                        >
                                          {getProductTableValue(e, row)}
                                        </ListItemSecondaryAction>
                                      </ListItem>
                                    ))}
                                  </div>
                                )}
                              </List>
                            </CardContent>
                          </Collapse>
                        </Card>
                      ))}
                  </Box>
                )}
                {!isEmpty(dataRow) && (
                  <Box
                    boxShadow={0}
                    m={1}
                    display={{
                      xs: "block",
                      sm: "none",
                      md: "none",
                      lg: "none",
                    }}
                    className={classes.margin}
                  >
                    {dataRow
                      .filter((data1) => data1.line_type === "service")
                      .map((row, i) => (
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
                                onClick={() =>
                                  handleExpandClickService(i * groupIndex)
                                }
                                aria-expanded={serviceExpanded === i}
                                aria-label="show more"
                                disableRipple
                              >
                                <ExpandMoreIcon fontSize="small" />
                              </IconButton>
                            }
                            title={
                              <Typography className={classes.link}>
                                {dataRow
                                  .filter(
                                    (data1) => data1.line_type === "service",
                                  )
                                  .map((row, key) => row.name)}
                              </Typography>
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
                                    {getServiceLabelsData.map((e, i) => (
                                      <ListItem key={`listitem-${i}`}>
                                        <ListItemIcon
                                          className={classes.labelColor}
                                          key={`listitem-icon-${i}`}
                                          textOverflow="ellipsis"
                                        >
                                          {e.label}
                                        </ListItemIcon>
                                        <ListItemSecondaryAction
                                          key={`listitem-action-${i}`}
                                        >
                                          {getServiceTableValue(e, row)}
                                        </ListItemSecondaryAction>
                                      </ListItem>
                                    ))}
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
              {/* Mobile View LineItem view :END */}
              <Hidden xsDown={true}>
                {!isEmpty(dataRow) && (
                  <TableContainer component={Paper}>
                    {!isEmpty(productRowArray) && (
                      <Table
                        className={classes.table}
                        aria-label="customized table"
                      >
                        <TableHead>
                          <TableRow style={{ height: "auto" }}>
                            <StyledTableCell align="center">
                              Quantity
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Product
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              List
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Discount
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Sale Price
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Tax
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Tax Amount
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              Total
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataRow
                            .filter((data1) => data1.line_type === "product")
                            .map((row, key) => (
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
                                    value={parseFloat(
                                      row.product_list_price,
                                    ).toFixed(2)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    decimalSeparator="."
                                    decimalScale={2}
                                  />
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {row.discount === "Amount"
                                    ? parseFloat(row.product_discount).toFixed(
                                      0,
                                    )
                                    : parseFloat(row.product_discount).toFixed(
                                      0,
                                    ) + "%"}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {currencySymbol}
                                  <NumericFormat
                                    value={parseFloat(
                                      row.product_unit_price,
                                    ).toFixed(2)}
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
                                    value={parseFloat(
                                      row.product_total_price,
                                    ).toFixed(2)}
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
                {!isEmpty(dataRow) && (
                  <TableContainer component={Paper} style={{ marginTop: "2%" }}>
                    {!isEmpty(serviceRowArray) && (
                      <Table
                        className={classes.table}
                        aria-label="customized table"
                      >
                        <TableHead>
                          <TableRow style={{ height: "auto" }}>
                            {!isEmpty(
                              dataRow.filter(
                                (data1) => data1.line_type === "service",
                              ),
                            ) &&
                              getServiceLabelsData.map(
                                (e) =>
                                  !hiddenFields.includes(e.field_key) && (
                                    <StyledTableCell
                                      align={
                                        e.field_key == "product_total_price"
                                          ? "right"
                                          : "center"
                                      }
                                    >
                                      {e.label}
                                    </StyledTableCell>
                                  ),
                              )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataRow
                            .filter((data1) => data1.line_type === "service")
                            .map((row, key) => (
                              <TableRow key={key} style={{ height: "auto" }}>
                                {getServiceLabelsData.map((e) =>
                                  getServiceTableValue(e, row),
                                )}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    )}
                  </TableContainer>
                )}
              </Hidden>
              <Box p={2}>
                {getTotalGroupLabelsData().map((field) => (
                  <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="stretch"
                  >
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
              </Box>
            </Card>
          </div>
        ))}
        <Box p={2}>
          {lineItemGrandTotalFields.map((field) => (
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="stretch"

            >
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
                  <NumericFormat
                    value={field.value}
                    displayType={"text"}
                    thousandSeparator={true}
                    decimalSeparator="."
                    decimalScale={2}
                  />
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Card>
    </>
  );
}
