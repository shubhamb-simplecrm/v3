import { isEmpty, isNil, pathOr } from "ramda";
import { checkNumberIsValid } from "../../../../../common/utils";

var lineno;
var prodln = 0;
var servln = 0;
var groupn = 0;
var group_ids = {};

/**
 * Load Line Items
 */

// function insertLineItems(product, group) {

//     var type = 'product_';
//     var ln = 0;
//     var current_group = 'lineItems';
//     var gid = product.group_id;

//     if (typeof group_ids[gid] === 'undefined') {
//         current_group = insertGroup();
//         group_ids[gid] = current_group;
//         for (var g in group) {
//             if (document.getElementById('group' + current_group + g) !== null) {
//                 document.getElementById('group' + current_group + g).value = group[g];
//             }
//         }
//     } else {
//         current_group = group_ids[gid];
//     }

//     if (product.product_id != '0' && product.product_id !== '') {
//         ln = insertProductLine('product_group' + current_group, current_group);
//         type = 'product_';
//     } else {
//         ln = insertServiceLine('service_group' + current_group, current_group);
//         type = 'service_';
//     }

//     for (var p in product) {
//         if (document.getElementById(type + p + ln) !== null) {
//             if (product[p] !== '' && isNumeric(product[p]) && p !== 'vat' && p !== 'product_id' && p !== 'name' && p !== "part_number" && p !== "description" && p !== "item_description") {
//                 document.getElementById(type + p + ln).value = format2Number(product[p]);
//             } else {
//                 document.getElementById(type + p + ln).value = product[p];
//             }
//         }
//     }

//     calculateLine(ln, type);

// }

// /**
//  * Insert product line
//  */

// function insertProductLine(tableid, groupid) {

//     if (!enable_groups) {
//         tableid = "product_group0";
//     }

//     if (document.getElementById(tableid + '_head') !== null) {
//         document.getElementById(tableid + '_head').style.display = "";
//     }

//     var vat_hidden = document.getElementById("vathidden").value;
//     var discount_hidden = document.getElementById("discounthidden").value;

//     sqs_objects["product_name[" + prodln + "]"] = {
//         "form": "EditView",
//         "method": "query",
//         "modules": ["AOS_Products"],
//         "group": "or",
//         "field_list": ["name", "id", "part_number", "cost", "price", "description", "currency_id"],
//         "populate_list": ["product_name[" + prodln + "]", "product_product_id[" + prodln + "]", "product_part_number[" + prodln + "]", "product_product_cost_price[" + prodln + "]", "product_product_list_price[" + prodln + "]", "product_item_description[" + prodln + "]", "product_currency[" + prodln + "]"],
//         "required_list": ["product_id[" + prodln + "]"],
//         "conditions": [{
//             "name": "name",
//             "op": "like_custom",
//             "end": "%",
//             "value": ""
//         }],
//         "order": "name",
//         "limit": "30",
//         "post_onblur_function": "formatListPrice(" + prodln + ");",
//         "no_match_text": "No Match"
//     };
//     sqs_objects["product_part_number[" + prodln + "]"] = {
//         "form": "EditView",
//         "method": "query",
//         "modules": ["AOS_Products"],
//         "group": "or",
//         "field_list": ["part_number", "name", "id", "cost", "price", "description", "currency_id"],
//         "populate_list": ["product_part_number[" + prodln + "]", "product_name[" + prodln + "]", "product_product_id[" + prodln + "]", "product_product_cost_price[" + prodln + "]", "product_product_list_price[" + prodln + "]", "product_item_description[" + prodln + "]", "product_currency[" + prodln + "]"],
//         "required_list": ["product_id[" + prodln + "]"],
//         "conditions": [{
//             "name": "part_number",
//             "op": "like_custom",
//             "end": "%",
//             "value": ""
//         }],
//         "order": "name",
//         "limit": "30",
//         "post_onblur_function": "formatListPrice(" + prodln + ");",
//         "no_match_text": "No Match"
//     };

//     tablebody = document.createElement("tbody");
//     tablebody.id = "product_body" + prodln;
//     document.getElementById(tableid).appendChild(tablebody);

//     var x = tablebody.insertRow(-1);
//     x.id = 'product_line' + prodln;

//     var a = x.insertCell(0);
//     a.innerHTML = "<input type='text' name='product_product_qty[" + prodln + "]' id='product_product_qty" + prodln + "'  value='' title='' tabindex='116' onblur='Quantity_format2Number(" + prodln + ");calculateLine(" + prodln + ",\"product_\");' class='product_qty'>";

//     var b = x.insertCell(1);
//     b.innerHTML = "<input class='sqsEnabled product_name' autocomplete='off' type='text' name='product_name[" + prodln + "]' id='product_name" + prodln + "' maxlength='50' value='' title='' tabindex='116' value=''><input type='hidden' name='product_product_id[" + prodln + "]' id='product_product_id" + prodln + "'  maxlength='50' value=''>";

//     var b1 = x.insertCell(2);
//     b1.innerHTML = "<input class='sqsEnabled product_part_number' autocomplete='off' type='text' name='product_part_number[" + prodln + "]' id='product_part_number" + prodln + "' maxlength='50' value='' title='' tabindex='116' value=''>";

//     var b2 = x.insertCell(3);
//     b2.innerHTML = "<button title='" + SUGAR.language.get('app_strings', 'LBL_SELECT_BUTTON_TITLE') + "' accessKey='" + SUGAR.language.get('app_strings', 'LBL_SELECT_BUTTON_KEY') + "' type='button' tabindex='116' class='button product_part_number_button' value='" + SUGAR.language.get('app_strings', 'LBL_SELECT_BUTTON_LABEL') + "' name='btn1' onclick='openProductPopup(" + prodln + ");'><span class=\"fas fa-mouse-pointer\"></span></button>";

//     var c = x.insertCell(4);
//     c.innerHTML = "<input type='text' name='product_product_list_price[" + prodln + "]' id='product_product_list_price" + prodln + "' maxlength='50' value='' title='' tabindex='116' onblur='calculateLine(" + prodln + ",\"product_\");' class='product_list_price'><input type='hidden' name='product_product_cost_price[" + prodln + "]' id='product_product_cost_price" + prodln + "' value=''  />";

//     if (typeof currencyFields !== 'undefined') {

//         currencyFields.push("product_product_list_price" + prodln);
//         currencyFields.push("product_product_cost_price" + prodln);

//     }

//     var d = x.insertCell(5);
//     d.innerHTML = "<input type='text' name='product_product_discount[" + prodln + "]' id='product_product_discount" + prodln + "'  maxlength='50' value='' title='' tabindex='116' onblur='calculateLine(" + prodln + ",\"product_\");' onblur='calculateLine(" + prodln + ",\"product_\");' class='product_discount_text'><input type='hidden' name='product_product_discount_amount[" + prodln + "]' id='product_product_discount_amount" + prodln + "' value=''  />";
//     d.innerHTML += "<select tabindex='116' name='product_discount[" + prodln + "]' id='product_discount" + prodln + "' onchange='calculateLine(" + prodln + ",\"product_\");' class='form-control product_discount_amount_select'>" + discount_hidden + "</select>";

//     var e = x.insertCell(6);
//     e.innerHTML = "<input type='text' name='product_product_unit_price[" + prodln + "]' id='product_product_unit_price" + prodln + "' maxlength='50' value='' title='' tabindex='116' readonly='readonly' onblur='calculateLine(" + prodln + ",\"product_\");' onblur='calculateLine(" + prodln + ",\"product_\");' class='product_unit_price'>";

//     if (typeof currencyFields !== 'undefined') {
//         currencyFields.push("product_product_unit_price" + prodln);
//     }

//     var f = x.insertCell(7);
//     f.innerHTML = "<input type='text' name='product_vat_amt[" + prodln + "]' id='product_vat_amt" + prodln + "' maxlength='250' value='' title='' tabindex='116' readonly='readonly' class='product_vat_amt_text'>";
//     f.innerHTML += "<select tabindex='116' name='product_vat[" + prodln + "]' id='product_vat" + prodln + "' onchange='calculateLine(" + prodln + ",\"product_\");' class='form-control product_vat_amt_select'>" + vat_hidden + "</select>";

//     if (typeof currencyFields !== 'undefined') {
//         currencyFields.push("product_vat_amt" + prodln);
//     }
//     var g = x.insertCell(8);
//     g.innerHTML = "<input type='text' name='product_product_total_price[" + prodln + "]' id='product_product_total_price" + prodln + "' maxlength='50' value='' title='' tabindex='116' readonly='readonly' class='product_total_price'><input type='hidden' name='product_group_number[" + prodln + "]' id='product_group_number" + prodln + "' value='" + groupid + "'>";

//     if (typeof currencyFields !== 'undefined') {
//         currencyFields.push("product_product_total_price" + prodln);
//     }
//     var h = x.insertCell(9);
//     h.innerHTML = "<input type='hidden' name='product_currency[" + prodln + "]' id='product_currency" + prodln + "' value=''><input type='hidden' name='product_deleted[" + prodln + "]' id='product_deleted" + prodln + "' value='0'><input type='hidden' name='product_id[" + prodln + "]' id='product_id" + prodln + "' value=''><button type='button' id='product_delete_line" + prodln + "' class='button product_delete_line' value='" + SUGAR.language.get(module_sugar_grp1, 'LBL_REMOVE_PRODUCT_LINE') + "' tabindex='116' onclick='markLineDeleted(" + prodln + ",\"product_\")'><span class=\"fa fa-times\"></span></button><br>";

//     enableQS(true);
//     //QSFieldsArray["EditView_product_name"+prodln].forceSelection = true;

//     var y = tablebody.insertRow(-1);
//     y.id = 'product_note_line' + prodln;

//     var h1 = y.insertCell(0);
//     h1.colSpan = "5";
//     h1.style.color = "rgb(68,68,68)";
//     h1.innerHTML = "<span style='vertical-align: top;' class='product_item_description_label'>" + SUGAR.language.get(module_sugar_grp1, 'LBL_PRODUCT_DESCRIPTION') + " :&nbsp;&nbsp;</span>";
//     h1.innerHTML += "<textarea tabindex='116' name='product_item_description[" + prodln + "]' id='product_item_description" + prodln + "' rows='2' cols='23' class='product_item_description'></textarea>&nbsp;&nbsp;";

//     var i = y.insertCell(1);
//     i.colSpan = "5";
//     i.style.color = "rgb(68,68,68)";
//     i.innerHTML = "<span style='vertical-align: top;' class='product_description_label'>" + SUGAR.language.get(module_sugar_grp1, 'LBL_PRODUCT_NOTE') + " :&nbsp;</span>";
//     i.innerHTML += "<textarea tabindex='116' name='product_description[" + prodln + "]' id='product_description" + prodln + "' rows='2' cols='23' class='product_description'></textarea>&nbsp;&nbsp;"

//     addToValidate('EditView', 'product_product_id' + prodln, 'id', true, "Please choose a product");

//     addAlignedLabels(prodln, 'product');

//     prodln++;

//     return prodln - 1;
// }

// var addAlignedLabels = function (ln, type) {
//     if (typeof type == 'undefined') {
//         type = 'product';
//     }
//     if (type != 'product' && type != 'service') {
//         console.error('type could be "product" or "service" only');
//     }
//     var labels = [];
//     $('tr#' + type + '_head td').each(function (i, e) {
//         if (type == 'product' && $(e).attr('colspan') > 1) {
//             for (var i = 0; i < parseInt($(e).attr('colspan')); i++) {
//                 if (i == 0) {
//                     labels.push($(e).html());
//                 } else {
//                     labels.push('');
//                 }
//             }
//         } else {
//             labels.push($(e).html());
//         }
//     });
//     $('tr#' + type + '_line' + ln + ' td').each(function (i, e) {
//         $(e).prepend('<span class="alignedLabel">' + labels[i] + '</span>');
//     });
// }

// /**
//  * Open product popup
//  */
// function openProductPopup(ln) {

//     lineno = ln;
//     var popupRequestData = {
//         "call_back_function": "setProductReturn",
//         "form_name": "EditView",
//         "field_to_name_array": {
//             "id": "product_product_id" + ln,
//             "name": "product_name" + ln,
//             "description": "product_item_description" + ln,
//             "part_number": "product_part_number" + ln,
//             "cost": "product_product_cost_price" + ln,
//             "price": "product_product_list_price" + ln,
//             "currency_id": "product_currency" + ln
//         }
//     };

//     open_popup('AOS_Products', 800, 850, '', true, true, popupRequestData);

// }

// function setProductReturn(popupReplyData) {
//     set_return(popupReplyData);
//     formatListPrice(lineno);
// }

// function formatListPrice(ln) {

//     if (typeof currencyFields !== 'undefined') {
//         var product_currency_id = document.getElementById('product_currency' + ln).value;
//         product_currency_id = product_currency_id ? product_currency_id : -99; //Assume base currency if no id
//         var product_currency_rate = get_rate(product_currency_id);
//         var dollar_product_price = ConvertToDollar(document.getElementById('product_product_list_price' + ln).value, product_currency_rate);
//         document.getElementById('product_product_list_price' + ln).value = format2Number(ConvertFromDollar(dollar_product_price, lastRate));
//         var dollar_product_cost = ConvertToDollar(document.getElementById('product_product_cost_price' + ln).value, product_currency_rate);
//         document.getElementById('product_product_cost_price' + ln).value = format2Number(ConvertFromDollar(dollar_product_cost, lastRate));
//     } else {
//         document.getElementById('product_product_list_price' + ln).value = format2Number(document.getElementById('product_product_list_price' + ln).value);
//         document.getElementById('product_product_cost_price' + ln).value = format2Number(document.getElementById('product_product_cost_price' + ln).value);
//     }

//     calculateLine(ln, "product_");
// }

// /**
//  * Insert Service Line
//  */

// function insertServiceLine(tableid, groupid) {

//     if (!enable_groups) {
//         tableid = "service_group0";
//     }
//     if (document.getElementById(tableid + '_head') !== null) {
//         document.getElementById(tableid + '_head').style.display = "";
//     }

//     var vat_hidden = document.getElementById("vathidden").value;
//     var discount_hidden = document.getElementById("discounthidden").value;

//     tablebody = document.createElement("tbody");
//     tablebody.id = "service_body" + servln;
//     document.getElementById(tableid).appendChild(tablebody);

//     var x = tablebody.insertRow(-1);
//     x.id = 'service_line' + servln;

//     var a = x.insertCell(0);
//     a.colSpan = "4";
//     a.innerHTML = "<textarea name='service_name[" + servln + "]' id='service_name" + servln + "'  cols='64' title='' tabindex='116' class='service_name'></textarea><input type='hidden' name='service_product_id[" + servln + "]' id='service_product_id" + servln + "'  maxlength='50' value='0'>";

//     var a1 = x.insertCell(1);
//     a1.innerHTML = "<input type='text' name='service_product_list_price[" + servln + "]' id='service_product_list_price" + servln + "' maxlength='50' value='' title='' tabindex='116'   onblur='calculateLine(" + servln + ",\"service_\");' class='service_list_price'>";

//     if (typeof currencyFields !== 'undefined') {
//         currencyFields.push("service_product_list_price" + servln);
//     }

//     var a2 = x.insertCell(2);
//     a2.innerHTML = "<input type='text' name='service_product_discount[" + servln + "]' id='service_product_discount" + servln + "'  maxlength='50' value='' title='' tabindex='116' onblur='calculateLine(" + servln + ",\"service_\");' onblur='calculateLine(" + servln + ",\"service_\");' class='service_discount_text'><input type='hidden' name='service_product_discount_amount[" + servln + "]' id='service_product_discount_amount" + servln + "' value=''/>";
//     a2.innerHTML += "<select tabindex='116' name='service_discount[" + servln + "]' id='service_discount" + servln + "' onchange='calculateLine(" + servln + ",\"service_\");' class='form-control service_discount_select'>" + discount_hidden + "</select>";

//     var b = x.insertCell(3);
//     b.innerHTML = "<input type='text' name='service_product_unit_price[" + servln + "]' id='service_product_unit_price" + servln + "' maxlength='50' value='' title='' tabindex='116'   onblur='calculateLine(" + servln + ",\"service_\");' class='service_unit_price'>";

//     if (typeof currencyFields !== 'undefined') {
//         currencyFields.push("service_product_unit_price" + servln);
//     }
//     var c = x.insertCell(4);
//     c.innerHTML = "<input type='text' name='service_vat_amt[" + servln + "]' id='service_vat_amt" + servln + "' maxlength='250' value='' title='' tabindex='116' readonly='readonly' class='service_vat_text'>";
//     c.innerHTML += "<select tabindex='116' name='service_vat[" + servln + "]' id='service_vat" + servln + "' onchange='calculateLine(" + servln + ",\"service_\");' class='form-control service_vat_select'>" + vat_hidden + "</select>";
//     if (typeof currencyFields !== 'undefined') {
//         currencyFields.push("service_vat_amt" + servln);
//     }

//     var e = x.insertCell(5);
//     e.innerHTML = "<input type='text' name='service_product_total_price[" + servln + "]' id='service_product_total_price" + servln + "' maxlength='50' value='' title='' tabindex='116' readonly='readonly' class='service_total_price'><input type='hidden' name='service_group_number[" + servln + "]' id='service_group_number" + servln + "' value='" + groupid + "'>";

//     if (typeof currencyFields !== 'undefined') {
//         currencyFields.push("service_product_total_price" + servln);
//     }
//     var f = x.insertCell(6);
//     f.innerHTML = "<input type='hidden' name='service_deleted[" + servln + "]' id='service_deleted" + servln + "' value='0'><input type='hidden' name='service_id[" + servln + "]' id='service_id" + servln + "' value=''><button type='button' class='button service_delete_line' id='service_delete_line" + servln + "' value='" + SUGAR.language.get(module_sugar_grp1, 'LBL_REMOVE_PRODUCT_LINE') + "' tabindex='116' onclick='markLineDeleted(" + servln + ",\"service_\")'><span class=\"fa fa-times\"></span></button><br>";

//     addAlignedLabels(servln, 'service');

//     servln++;

//     return servln - 1;
// }

// /**
//  * Insert product Header
//  */

// function insertProductHeader(tableid) {
//     tablehead = document.createElement("thead");
//     tablehead.id = tableid + "_head";
//     tablehead.style.display = "none";
//     document.getElementById(tableid).appendChild(tablehead);

//     var x = tablehead.insertRow(-1);
//     x.id = 'product_head';

//     var a = x.insertCell(0);
//     a.style.color = "rgb(68,68,68)";
//     a.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_PRODUCT_QUANITY');

//     var b = x.insertCell(1);
//     b.style.color = "rgb(68,68,68)";
//     b.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_PRODUCT_NAME');

//     var b1 = x.insertCell(2);
//     b1.colSpan = "2";
//     b1.style.color = "rgb(68,68,68)";
//     b1.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_PART_NUMBER');

//     var c = x.insertCell(3);
//     c.style.color = "rgb(68,68,68)";
//     c.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_LIST_PRICE');

//     var d = x.insertCell(4);
//     d.style.color = "rgb(68,68,68)";
//     d.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_DISCOUNT_AMT');

//     var e = x.insertCell(5);
//     e.style.color = "rgb(68,68,68)";
//     e.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_UNIT_PRICE');

//     var f = x.insertCell(6);
//     f.style.color = "rgb(68,68,68)";
//     f.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_VAT_AMT');

//     var g = x.insertCell(7);
//     g.style.color = "rgb(68,68,68)";
//     g.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_TOTAL_PRICE');

//     var h = x.insertCell(8);
//     h.style.color = "rgb(68,68,68)";
//     h.innerHTML = '&nbsp;';
// }

// /**
//  * Insert service Header
//  */

// function insertServiceHeader(tableid) {
//     tablehead = document.createElement("thead");
//     tablehead.id = tableid + "_head";
//     tablehead.style.display = "none";
//     document.getElementById(tableid).appendChild(tablehead);

//     var x = tablehead.insertRow(-1);
//     x.id = 'service_head';

//     var a = x.insertCell(0);
//     a.colSpan = "4";
//     a.style.color = "rgb(68,68,68)";
//     a.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_SERVICE_NAME');

//     var b = x.insertCell(1);
//     b.style.color = "rgb(68,68,68)";
//     b.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_SERVICE_LIST_PRICE');

//     var c = x.insertCell(2);
//     c.style.color = "rgb(68,68,68)";
//     c.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_SERVICE_DISCOUNT');

//     var d = x.insertCell(3);
//     d.style.color = "rgb(68,68,68)";
//     d.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_SERVICE_PRICE');

//     var e = x.insertCell(4);
//     e.style.color = "rgb(68,68,68)";
//     e.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_VAT_AMT');

//     var f = x.insertCell(5);
//     f.style.color = "rgb(68,68,68)";
//     f.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_TOTAL_PRICE');

//     var g = x.insertCell(6);
//     g.style.color = "rgb(68,68,68)";
//     g.innerHTML = '&nbsp;';
// }

// /**
//  * Insert Group
//  */

// function insertGroup() {

//     if (!enable_groups && groupn > 0) {
//         return;
//     }
//     var tableBody = document.createElement("tr");
//     tableBody.id = "group_body" + groupn;
//     tableBody.className = "group_body";
//     document.getElementById('lineItems').appendChild(tableBody);

//     var a = tableBody.insertCell(0);
//     a.colSpan = "100";
//     var table = document.createElement("table");
//     table.id = "group" + groupn;
//     table.className = "group";

//     table.style.whiteSpace = 'nowrap';

//     a.appendChild(table);

//     tableheader = document.createElement("thead");
//     table.appendChild(tableheader);
//     var header_row = tableheader.insertRow(-1);

//     if (enable_groups) {
//         var header_cell = header_row.insertCell(0);
//         header_cell.scope = "row";
//         header_cell.colSpan = "8";
//         header_cell.innerHTML = SUGAR.language.get(module_sugar_grp1, 'LBL_GROUP_NAME') + ":&nbsp;&nbsp;<input name='group_name[]' id='" + table.id + "name' maxlength='255'  title='' tabindex='120' type='text' class='group_name'><input type='hidden' name='group_id[]' id='" + table.id + "id' value=''><input type='hidden' name='group_group_number[]' id='" + table.id + "group_number' value='" + groupn + "'>";

//         var header_cell_del = header_row.insertCell(1);
//         header_cell_del.scope = "row";
//         header_cell_del.colSpan = "2";
//         header_cell_del.innerHTML = "<span title='" + SUGAR.language.get(module_sugar_grp1, 'LBL_DELETE_GROUP') + "' style='float: right;'><a style='cursor: pointer;' id='deleteGroup' tabindex='116' onclick='markGroupDeleted(" + groupn + ")' class='delete_group'><span class=\"fa fa-times\"></span></a></span><input type='hidden' name='group_deleted[]' id='" + table.id + "deleted' value='0'>";
//     }

//     var productTableHeader = document.createElement("thead");
//     table.appendChild(productTableHeader);
//     var productHeader_row = productTableHeader.insertRow(-1);
//     var productHeader_cell = productHeader_row.insertCell(0);
//     productHeader_cell.colSpan = "100";
//     var productTable = document.createElement("table");
//     productTable.id = "product_group" + groupn;
//     productTable.className = "product_group";
//     productHeader_cell.appendChild(productTable);

//     insertProductHeader(productTable.id);

//     var serviceTableHeader = document.createElement("thead");
//     table.appendChild(serviceTableHeader);
//     var serviceHeader_row = serviceTableHeader.insertRow(-1);
//     var serviceHeader_cell = serviceHeader_row.insertCell(0);
//     serviceHeader_cell.colSpan = "100";
//     var serviceTable = document.createElement("table");
//     serviceTable.id = "service_group" + groupn;
//     serviceTable.className = "service_group";
//     serviceHeader_cell.appendChild(serviceTable);

//     insertServiceHeader(serviceTable.id);

//     tablefooter = document.createElement("tfoot");
//     table.appendChild(tablefooter);
//     var footer_row = tablefooter.insertRow(-1);
//     var footer_cell = footer_row.insertCell(0);
//     footer_cell.scope = "row";
//     footer_cell.colSpan = "20";
//     footer_cell.innerHTML = "<input type='button' tabindex='116' class='button add_product_line' value='" + SUGAR.language.get(module_sugar_grp1, 'LBL_ADD_PRODUCT_LINE') + "' id='" + productTable.id + "addProductLine' onclick='insertProductLine(\"" + productTable.id + "\",\"" + groupn + "\")' />";
//     footer_cell.innerHTML += " <input type='button' tabindex='116' class='button add_service_line' value='" + SUGAR.language.get(module_sugar_grp1, 'LBL_ADD_SERVICE_LINE') + "' id='" + serviceTable.id + "addServiceLine' onclick='insertServiceLine(\"" + serviceTable.id + "\",\"" + groupn + "\")' />";
//     if (enable_groups) {
//         footer_cell.innerHTML += "<span class='totals'><label>" + SUGAR.language.get(module_sugar_grp1, 'LBL_TOTAL_AMT') + ":</label><input name='group_total_amt[]' id='" + table.id + "total_amt' class='group_total_amt' maxlength='26' value='' title='' tabindex='120' type='text' readonly></span>";

//         var footer_row2 = tablefooter.insertRow(-1);
//         var footer_cell2 = footer_row2.insertCell(0);
//         footer_cell2.scope = "row";
//         footer_cell2.colSpan = "20";
//         footer_cell2.innerHTML = "<span class='totals'><label>" + SUGAR.language.get(module_sugar_grp1, 'LBL_DISCOUNT_AMOUNT') + ":</label><input name='group_discount_amount[]' id='" + table.id + "discount_amount' class='group_discount_amount' maxlength='26' value='' title='' tabindex='120' type='text' readonly></label>";

//         var footer_row3 = tablefooter.insertRow(-1);
//         var footer_cell3 = footer_row3.insertCell(0);
//         footer_cell3.scope = "row";
//         footer_cell3.colSpan = "20";
//         footer_cell3.innerHTML = "<span class='totals'><label>" + SUGAR.language.get(module_sugar_grp1, 'LBL_SUBTOTAL_AMOUNT') + ":</label><input name='group_subtotal_amount[]' id='" + table.id + "subtotal_amount' class='group_subtotal_amount'  maxlength='26' value='' title='' tabindex='120' type='text' readonly></span>";

//         var footer_row4 = tablefooter.insertRow(-1);
//         var footer_cell4 = footer_row4.insertCell(0);
//         footer_cell4.scope = "row";
//         footer_cell4.colSpan = "20";
//         footer_cell4.innerHTML = "<span class='totals'><label>" + SUGAR.language.get(module_sugar_grp1, 'LBL_TAX_AMOUNT') + ":</label><input name='group_tax_amount[]' id='" + table.id + "tax_amount' class='group_tax_amount' maxlength='26' value='' title='' tabindex='120' type='text' readonly></span>";

//         if (document.getElementById('subtotal_tax_amount') !== null) {
//             var footer_row5 = tablefooter.insertRow(-1);
//             var footer_cell5 = footer_row5.insertCell(0);
//             footer_cell5.scope = "row";
//             footer_cell5.colSpan = "20";
//             footer_cell5.innerHTML = "<span class='totals'><label>" + SUGAR.language.get(module_sugar_grp1, 'LBL_SUBTOTAL_TAX_AMOUNT') + ":</label><input name='group_subtotal_tax_amount[]' id='" + table.id + "subtotal_tax_amount' class='group_subtotal_tax_amount' maxlength='26' value='' title='' tabindex='120' type='text' readonly></span>";

//             if (typeof currencyFields !== 'undefined') {
//                 currencyFields.push("" + table.id + 'subtotal_tax_amount');
//             }
//         }

//         var footer_row6 = tablefooter.insertRow(-1);
//         var footer_cell6 = footer_row6.insertCell(0);
//         footer_cell6.scope = "row";
//         footer_cell6.colSpan = "20";
//         footer_cell6.innerHTML = "<span class='totals'><label>" + SUGAR.language.get(module_sugar_grp1, 'LBL_GROUP_TOTAL') + ":</label><input name='group_total_amount[]' id='" + table.id + "total_amount' class='group_total_amount'  maxlength='26' value='' title='' tabindex='120' type='text' readonly></span>";

//         if (typeof currencyFields !== 'undefined') {
//             currencyFields.push("" + table.id + 'total_amt');
//             currencyFields.push("" + table.id + 'discount_amount');
//             currencyFields.push("" + table.id + 'subtotal_amount');
//             currencyFields.push("" + table.id + 'tax_amount');
//             currencyFields.push("" + table.id + 'total_amount');
//         }
//     }
//     groupn++;
//     return groupn - 1;
// }

// /**
//  * Mark Group Deleted
//  */

// function markGroupDeleted(gn) {
//     document.getElementById('group_body' + gn).style.display = 'none';

//     var rows = document.getElementById('group_body' + gn).getElementsByTagName('tbody');

//     for (x = 0; x < rows.length; x++) {
//         var input = rows[x].getElementsByTagName('button');
//         for (y = 0; y < input.length; y++) {
//             if (input[y].id.indexOf('delete_line') != -1) {
//                 input[y].click();
//             }
//         }
//     }

// }

// /**
//  * Mark line deleted
//  */

// function markLineDeleted(ln, key) {
//     // collapse line; update deleted value
//     document.getElementById(key + 'body' + ln).style.display = 'none';
//     document.getElementById(key + 'deleted' + ln).value = '1';
//     document.getElementById(key + 'delete_line' + ln).onclick = '';
//     var groupid = 'group' + document.getElementById(key + 'group_number' + ln).value;

//     if (checkValidate('EditView', key + 'product_id' + ln)) {
//         removeFromValidate('EditView', key + 'product_id' + ln);
//     }

//     calculateTotal(groupid);
//     calculateTotal();
// }

// /**
//  * Calculate Line Values
//  */
const currencyConversionByRate = async (lineItems, currency) => {
  if (isNil(currency)) return lineItems;
  if (typeof currency != "object") {
    if (currency === -99.0 || currency === -99 || currency === "-99.00")
      return lineItems;

    return lineItems;
  }
  // const rates = {
  //   rates: {
  //     EUR: 0.81162,
  //   },
  // };
  // lineItems.map(async (lineItem) => {
  //   // if (
  //   //   (lineRow["type"] === "decimal" || lineRow["type"] === "currency") &&
  //   //   lineRow["name"] !== "currency_id" &&
  //   //   lineRow["name"] !== "product_qty" &&
  //   //   lineRow["name"] !== "product_discount"
  //   // ) {
  //   // }
  //   const value = await Dinero({ amount: 500 })
  //     .convert("EUR", {
  //       endpoint: new Promise((resolve) => resolve(rates)),
  //     })
  //     .then((dinero) => {
  //       return dinero.getCurrency(); // returns 'EUR'
  //     })
  //     .catch((err) => {
  //       // handle errors
  //     });
// });
};
export const calculateLine = (lineItem, selectedCurrency = null) => {
  // if (!isNil(selectedCurrency)) {
  //   lineItem = currencyConversionByRate(lineItem, selectedCurrency);
  // }
  let productUnitPrice = checkNumberIsValid(lineItem["product_unit_price"], 0);
  let productListPrice = checkNumberIsValid(lineItem["product_list_price"], 0);
  let productQTY = checkNumberIsValid(lineItem["product_qty"], 1);
  productQTY = productQTY == 0 ? 1 : productQTY;
  let productDiscount = checkNumberIsValid(lineItem["product_discount"], 1);
  let productVAT = checkNumberIsValid(lineItem["vat"], 0);
  let productDiscountType =
    lineItem.discount === "Amount" ? "Amount" : "Percentage";
  let productTotalPrice =
    productQTY * (lineItem == "product" ? productUnitPrice : productListPrice);
  let totalVat = 0;

  if (productDiscountType === "Amount") {
    if (productDiscount > productListPrice) {
      productDiscount = productListPrice;
    }
    productUnitPrice = productListPrice - productDiscount;
  } else if (productDiscountType === "Percentage") {
    if (productDiscount > 100) {
      productDiscount = 100;
    }
    productDiscount = (productDiscount / 100) * productListPrice;
    productUnitPrice = productListPrice - productDiscount;
  }
  totalVat = ((productTotalPrice - productDiscount) * productVAT) / 100;
  productTotalPrice = productTotalPrice - productDiscount + totalVat;

  lineItem["product_qty"] = productQTY;
  lineItem["vat_amt"] = totalVat;
  lineItem["product_total_price"] = productTotalPrice;
  lineItem["product_list_price"] = productListPrice;
  lineItem["product_unit_price"] = productUnitPrice;
  return lineItem;
};
export const calculateSingleGroupTotal = (
  lineItemData,
  otherDetailObj = {},
  currenciesRecords = [],
  allFields = [],
  lastCurrency = [],
  changeField = null,
) => {
  if (changeField === "currency_id") {
    lineItemData = CurrencyConvertAll(
      lineItemData,
      currenciesRecords,
      allFields,
      lastCurrency,
    );
  }
  let tot_amt = 0;
  let subtotal = 0;
  let dis_tot = 0;
  let tax = 0;
  let totalGroupValuesObj = {};
  let shippingAmount = 0;
  lineItemData.map((lineItem) => {
    let tot_amtGroup = 0;
    let subtotalGroup = 0;
    let dis_totGroup = 0;
    let taxGroup = 0;
    let lineItemType = lineItem["line_type"];
    var dis_amt = 0;
    var product_vat_amt = 0;
    let qty = checkNumberIsValid(lineItem["product_qty"], 1);
    let list = checkNumberIsValid(lineItem["product_list_price"], 0);
    let unit = checkNumberIsValid(lineItem["product_list_price"], 0);
    let deleted = 0;
    let productDiscount = checkNumberIsValid(lineItem["product_discount"], 0);
    let productDiscountType =
      lineItem.discount === "Amount" ? "Amount" : "Percentage";
    let productFinalTotalTax = 0;
    let productFinalTotalAmount = qty * unit;
    let productFinalTotalDiscount = 0;
    let gstAmount = checkNumberIsValid(lineItem["vat"], 0);
    if (lineItem["product_discount_amount"] != -1) {
      let product_discount_amount = parseFloat(
        lineItem["product_discount_amount"],
      );
      let product_discount = productDiscount;
      if (productDiscountType === "Amount") {
        if (productDiscount > unit) {
          product_discount = unit;
        }
        product_discount_amount = product_discount;
      } else if (productDiscountType === "Percentage") {
        if (productDiscount > 100) {
          product_discount = 100;
        }
        product_discount_amount = (product_discount / 100) * unit;
      }
      productFinalTotalDiscount = parseFloat(product_discount_amount);
    }
    if (lineItem["vat_amt"] != -1) {
      const allProductTotalDiscount = Math.abs(productFinalTotalDiscount) * qty;
      productFinalTotalTax =
        (productFinalTotalAmount - allProductTotalDiscount) * (gstAmount / 100);
      productFinalTotalTax = checkNumberIsValid(productFinalTotalTax, 0);
    }
    if (lineItem["deleted"] != -1) {
      deleted = lineItem["deleted"] || "";
    }
    if (qty !== 0 && unit !== 0 && deleted != 1) {
      tot_amt += parseFloat(unit) * parseFloat(qty);
      tot_amtGroup += parseFloat(unit) * parseFloat(qty);
    }

    if (productFinalTotalDiscount !== 0 && deleted != 1) {
      const allProductTotalDiscount = Math.abs(productFinalTotalDiscount) * qty;
      dis_tot += parseFloat(allProductTotalDiscount);
      dis_totGroup += parseFloat(allProductTotalDiscount);
    }
    if (productFinalTotalTax !== 0 && deleted != 1) {
      tax += parseFloat(productFinalTotalTax);
      taxGroup += parseFloat(productFinalTotalTax);
    }
  });
  subtotal = parseFloat(tot_amt) - parseFloat(dis_tot);
  lineItemData["total_amt"] = format2Number(parseInt(tot_amt));
  lineItemData["subtotal_amount"] = format2Number(parseInt(subtotal));
  lineItemData["discount_amount"] = format2Number(parseInt(dis_tot));

  if (!isEmpty(otherDetailObj)) {
    shippingAmount = checkNumberIsValid(otherDetailObj["shipping_amount"], 0);
    let shippingTax = checkNumberIsValid(otherDetailObj["shipping_tax"], 0);
    let shippingTaxAmount =
      (parseFloat(shippingAmount) * parseFloat(shippingTax)) / 100;
    totalGroupValuesObj["shipping_amount"] = shippingAmount;
    totalGroupValuesObj["shipping_tax_amt"] = shippingTaxAmount;
    tax += shippingTaxAmount;
  }
  totalGroupValuesObj["total_amt"] = parseFloat(tot_amt).toFixed(2);
  totalGroupValuesObj["subtotal_amount"] = parseFloat(subtotal).toFixed(2);
  totalGroupValuesObj["discount_amount"] = -Math.abs(
    parseFloat(dis_tot).toFixed(2),
  );
  totalGroupValuesObj["tax_amount"] = parseFloat(tax).toFixed(2);
  totalGroupValuesObj["subtotal_tax_amount"] = (
    parseFloat(subtotal) + parseFloat(tax)
  ).toFixed(2);
  totalGroupValuesObj["total_amount"] = // parseFloat(otherCharges) +
    (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

  totalGroupValuesObj["tax_amount"] = format2Number(parseInt(tax));
  totalGroupValuesObj["subtotal_tax_amount"] = format2Number(
    parseInt(subtotal) + parseInt(tax),
  );
  totalGroupValuesObj["total_amount"] = format2Number(
    parseInt(subtotal) + parseInt(tax) + parseInt(shippingAmount),
  );
  return totalGroupValuesObj;
};
export const calculateTotal = (
  initialValues,
  currenciesRecords = [],
  allFields = [],
  lastCurrency = [],
  changeField = null,
) => {
  if (changeField === "currency_id") {
    initialValues = CurrencyConvertAll(
      initialValues,
      currenciesRecords,
      allFields,
      lastCurrency,
    );
  }
  var row = pathOr(
    pathOr([], ["line_items", "grouped"], initialValues),
    ["line_items", "ungrouped"],
    initialValues,
  );
  var tot_amt = 0;
  var subtotal = 0;
  var dis_tot = 0;
  var tax = 0;
  // for (i = 0; i < length; i++) {
  row.map((data) => {
    var qty = 1;
    var list = null;
    var unit = 0;
    var deleted = 0;
    var dis_amt = 0;
    var product_vat_amt = 0;
    // console.log("data===", data)
    if (data["product_qty"]) {
      qty = unformat2Number(data["product_qty"]) || 1;
    }
    if (data["product_list_price"] != -1) {
      list = unformat2Number(data["product_list_price"]) || 0.0;
    }
    if (data["product_unit_price"] != -1) {
      unit = unformat2Number(data["product_list_price"] || 0.0);
    }
    if (data["product_discount_amount"] != -1) {
      let product_discount_amount = data["product_discount_amount"];
      let product_discount = data["product_discount"];
      if (data.discount === "Amount") {
        if (product_discount > list) {
          product_discount = list;
        }
        product_discount_amount = product_discount;
      } else if (data.discount === "Percentage") {
        if (product_discount > 100) {
          product_discount = 100;
        }
        product_discount_amount = (product_discount / 100) * list;
      }

      dis_amt = "-" + unformat2Number(product_discount_amount || 0.0);
      // console.log("product_discount_amount", dis_amt)
    }

    //console.log("qty", qty, 'list', list, 'unit', unit)
    if (data["vat_amt"] != -1) {
      product_vat_amt = unformat2Number(data["vat_amt"] || 0.0);
    }
    if (data["deleted"] != -1) {
      deleted = data["deleted"] || "";
    }

    // if (deleted != 1 && key !== '') {
    //     head[row[i].parentNode.id] = 1;
    // } else if (key !== '' && head[row[i].parentNode.id] != 1) {
    //     head[row[i].parentNode.id] = 0;
    // }

    if (qty !== 0 && list !== null && deleted != 1) {
      tot_amt += parseInt(list) * parseInt(qty);
    } else if (qty !== 0 && unit !== 0 && deleted != 1) {
      tot_amt += parseInt(unit) * parseInt(qty);
    }

    if (dis_amt !== 0 && deleted != 1) {
      dis_tot += parseInt(dis_amt) * parseInt(qty);
    }
    if (product_vat_amt !== 0 && deleted != 1) {
      tax += parseInt(product_vat_amt);
    }
  });
  // console.log("totalTax", tax, "tot_amt", tot_amt, "dis_tot", dis_tot)
  // for (var h in head) {
  //     if (head[h] != 1 && document.getElementById(h + '_head') !== null) {
  //         document.getElementById(h + '_head').style.display = "none";
  //     }
  // }

  subtotal = parseInt(tot_amt) + parseInt(dis_tot);
  initialValues["total_amt"] = format2Number(parseInt(tot_amt));
  initialValues["subtotal_amount"] = format2Number(parseInt(subtotal));
  initialValues["discount_amount"] = format2Number(parseInt(dis_tot));

  var shipping = unformat2Number(initialValues["shipping_amount"] || 0.0);
  var shippingtax = unformat2Number(initialValues["shipping_tax"] || 0.0);

  var shippingtax_amt = parseInt(shipping) * (parseInt(shippingtax) / 100);
  initialValues["shipping_tax_amt"] = format2Number(parseInt(shippingtax_amt));

  tax += parseInt(shippingtax_amt);
  initialValues["tax_amount"] = format2Number(parseInt(tax));
  initialValues["subtotal_tax_amount"] = format2Number(
    parseInt(subtotal) + parseInt(tax),
  );
  initialValues["total_amount"] = format2Number(
    parseInt(subtotal) + parseInt(tax) + parseInt(shipping),
  );
  // console.log("-------------", initialValues)

  return initialValues;
};
/**
 * Calculate totals for single group in grouped lineitem and
 */
// function set_value(id, value) {
//     if (document.getElementById(id) !== null) {
//         document.getElementById(id).value = format2Number(value);
//     }
// }

// function get_value(id) {
//     if (document.getElementById(id) !== null) {
//         return unformat2Number(document.getElementById(id).value);
//     }
//     return 0;
// }

export const unformat2Number = (num) => {
  if (isNil(num)) return 0;
  console.log("unformat2Number", num);
  // return unformatNumber(num, ',', ',');
  return num.toString().replace(/\$|\,/g, "");
};

export const isNumeric = (str) => {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};

export const format2Number = (str, sig) => {
  // console.log("str1", str)

  if (typeof sig === "undefined") {
    sig = 2;
  }
  let num = Number(str);
  if (sig == 2) {
    str = formatCurrency(num);
  } else {
    str = num.toFixed(sig);
  }

  str = str.split(/,/).join("{,}").split(/\./).join("{.}");
  str = str.split("{,}").join(",").split("{.}").join(".");

  // console.log("strrrrrrrrrr", num, str)
  return str;
};

export const formatCurrency = (strValue) => {
  strValue = strValue.toString().replace(/\$|\,/g, "");
  let dblValue = parseFloat(strValue);

  let blnSign = dblValue == (dblValue = Math.abs(dblValue));
  dblValue = Math.floor(dblValue * 100 + 0.50000000001);
  let intCents = dblValue % 100;
  let strCents = intCents.toString();
  dblValue = Math.floor(dblValue / 100).toString();
  if (intCents < 10) strCents = "0" + strCents;
  for (var i = 0; i < Math.floor((dblValue.length - (1 + i)) / 3); i++)
    dblValue =
      dblValue.substring(0, dblValue.length - (4 * i + 3)) +
      "," +
      dblValue.substring(dblValue.length - (4 * i + 3));
  // console.log("sttr", (((blnSign) ? '' : '-') + dblValue + '.' + strCents))
  return (blnSign ? "" : "-") + dblValue + "." + strCents;
};

export const Quantity_format2Number = (initialValues) => {
  var str = "";
  var qty = unformat2Number(initialValues.product_qty);
  if (qty === null) {
    qty = 1;
  }

  if (qty === 0) {
    str = "0";
  } else {
    str = format2Number(qty);
    if (true) {
      str = str.replace(/0*$/, "");
      str = str.replace(".", "~");
      str = str.replace(/~$/, "");
      str = str.replace("~", ".");
    }
  }

  initialValues.product_qty = str;
};

export const formatNumber = (n, num_grp_sep, dec_sep, round, precision) => {
  if (typeof num_grp_sep == "undefined" || typeof dec_sep == "undefined") {
    return n;
  }
  if (n === 0) n = "0";

  n = n ? n.toString() : "";
  if (n.split) {
    n = n.split(".");
  } else {
    return n;
  }
  if (n.length > 2) {
    return n.join(".");
  }
  if (typeof round != "undefined") {
    if (round > 0 && n.length > 1) {
      n[1] = parseFloat("0." + n[1]);
      n[1] = Math.round(n[1] * Math.pow(10, round)) / Math.pow(10, round);
      if (n[1].toString().includes(".")) {
        n[1] = n[1].toString().split(".")[1];
      } else {
        n[0] = (parseInt(n[0]) + n[1]).toString();
        n[1] = "";
      }
    }
    if (round <= 0) {
      n[0] =
        Math.round(parseInt(n[0], 10) * Math.pow(10, round)) /
        Math.pow(10, round);
      n[1] = "";
    }
  }
  if (typeof precision != "undefined" && precision >= 0) {
    if (n.length > 1 && typeof n[1] != "undefined") {
      n[1] = n[1].substring(0, precision);
    } else {
      n[1] = "";
    }
    if (n[1].length < precision) {
      for (var wp = n[1].length; wp < precision; wp++) {
        n[1] += "0";
      }
    }
  }
  let regex = /(\d+)(\d{3})/;
  while (num_grp_sep !== "" && regex.test(n[0])) {
    n[0] = n[0].toString().replace(regex, "$1" + num_grp_sep + "$2");
  }
  return n[0] + (n.length > 1 && n[1] !== "" ? dec_sep + n[1] : "");
};

// function check_form(formname) {
//     calculateAllLines();
//     if (typeof (siw) != 'undefined' && siw && typeof (siw.selectingSomething) != 'undefined' && siw.selectingSomething)
//         return false;
//     return validate_form(formname, '');
// }

export const handleCheck = (data, val) => {
  return data.some((item) => val === item.id);
};

// export const get_rate = (id) => {
//     return ConversionRates[id];
// }
export const ConvertToDollar = (amount, rate) => {
  // console.log("convertToDollar", amount / rate)

  return amount / rate;
};
export const ConvertFromDollar = (amount, rate) => {
  // console.log("convertFromDollar", amount, rate, amount * rate)
  return amount * rate;
};
export const ConvertRate = (newRate, oldRate, fields) => {
  // console.log("ConvertRate", fields);
  let updatedFields = [];
  Object.values(fields).map((field) => {
    updatedFields[field.name] = parseFloat(
      ConvertFromDollar(
        parseFloat(ConvertToDollar(parseFloat(field.value), oldRate)),
        newRate,
      ),
    );
  });
  return updatedFields;
};
// export const ConvertRateSingle = (id, field) => {
//     var temp = field.innerHTML.substring(1, field.innerHTML.length);
//     unformattedNumber = unformatNumber(temp, num_grp_sep, dec_sep);

//     field.innerHTML = CurrencySymbols[id] + formatNumber(toDecimal(ConvertFromDollar(ConvertToDollar(unformattedNumber, lastRate), ConversionRates[id])), num_grp_sep, dec_sep, 2, 2);
//     lastRate = ConversionRates[id];
// }
export const CurrencyConvertAll = (
  initialValues,
  currenciesRecords,
  allFields,
  lastCurrency,
) => {
  try {
    let currencyFields = [];
    let id = initialValues.currency_id;
    if (id === -99.0 || id === -99 || id === "-99.00") {
      return initialValues;
    } else {
      let newRate = 1;
      let oldRate = 1;
      let getLastCurrency = lastCurrency[lastCurrency.length - 2];
      Object.values(currenciesRecords).map((getCurrency) => {
        if (getCurrency.id === id) {
          newRate =
            id === -99.0 || id === "-99.00" || id === "-99"
              ? 1
              : getCurrency.conversion_rate;
        }
        if (getCurrency.id === getLastCurrency) {
          oldRate =
            getLastCurrency === -99.0 ||
            getLastCurrency === "-99.00" ||
            getLastCurrency === "-99"
              ? 1
              : getCurrency.conversion_rate;
        }
      });

      Object.values(allFields).map((rowField) => {
        if (rowField["type"] === "line_item") {
          let lineGroup =
            pathOr(0, ["linedata", "enable_group"], rowField) === 0
              ? "ungrouped"
              : "grouped";
          let lineProductCurrencyFields = pathOr(
            "",
            ["linedata", "product_datalabels"],
            rowField,
          );
          let lineServiceCurrencyFields = pathOr(
            "",
            ["linedata", "service_datalabels"],
            rowField,
          );

          let linedata = initialValues.line_items[lineGroup];

          Object.values(linedata).map((row, rowNum) => {
            let lineFields = [];
            if (row.line_type === "product") {
              lineFields = lineProductCurrencyFields[0];
            } else {
              lineFields = lineServiceCurrencyFields[0];
            }
            let lineItemRow = [];
            Object.values(lineFields).map((lineRow, lineRowNum) => {
              if (
                (lineRow["type"] === "decimal" ||
                  lineRow["type"] === "currency") &&
                lineRow["name"] !== "currency_id" &&
                lineRow["name"] !== "product_qty" &&
                lineRow["name"] !== "product_discount"
              ) {
                lineItemRow[lineRow["name"]] = lineRow;
                if (typeof row[lineRow["name"]] != undefined) {
                  lineItemRow[lineRow["name"]].value = unformat2Number(
                    row[lineRow["name"]],
                    ",",
                    ".",
                  );
                }

                // lineItemRow[]=row;
              }
            });
            let convertedLineItemData = ConvertRate(
              newRate,
              oldRate,
              lineItemRow,
            );

            // console.log("convertedLineItemData", convertedLineItemData)

            Object.keys(convertedLineItemData).map((lineKey) => {
              linedata[rowNum][lineKey] = unformat2Number(
                convertedLineItemData[lineKey],
                ",",
                ".",
              );
              // console.log("lineKey", lineKey, convertedLineItemData[lineKey])
            });
            initialValues["line_items"] = { [lineGroup]: linedata };
            // console.log("convertedLineItemDatainitialValues", initialValues)
          });
        } else if (
          (rowField["type"] === "decimal" || rowField["type"] === "currency") &&
          rowField["name"] !== "currency_id"
        ) {
          currencyFields[rowField.name] = rowField;

          if (typeof initialValues[rowField.name] != "undefined") {
            // initialValues[rowField.name] = unformat2Number(initialValues[rowField.name], ",", ".");
            currencyFields[rowField.name].value = unformat2Number(
              initialValues[rowField.name],
              ",",
              ".",
            );
            // fields.push(form[field]);
          }
        }
      });

      let convertedFields = ConvertRate(newRate, oldRate, currencyFields);
      // let newInitialValues=[];
      Object.keys(convertedFields).map((rowKey) => {
        initialValues[rowKey] = format2Number(
          convertedFields[rowKey],
          ",",
          ".",
        );
        // console.log("initialValues[rowField.name]", initialValues[rowField.name])
      });

      return initialValues;
    }
  } catch (err) {
    // Do nothing, if we can't find the currency_id field we will just not attempt to convert currencies
    // This typically only happens in lead conversion and quick creates, where the currency_id field may be named somethnig else or hidden deep inside a sub-form.
  }
};
