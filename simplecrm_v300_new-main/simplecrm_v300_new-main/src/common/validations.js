import { pathOr } from "ramda";
import { store } from "../store/config-store";

let num_grp_sep = ",";
let dec_sep = ".";
let datef = "m/d/Y";

let ConversionRates = new Array();
let CurrencySymbols = new Array();
let lastRate = "1";
ConversionRates["-99"] = "1";
CurrencySymbols["-99"] = "₹";
ConversionRates["9a046e39-8647-cabc-20b3-5cfe04bfd4c3"] = "0.0145297";
CurrencySymbols["9a046e39-8647-cabc-20b3-5cfe04bfd4c3"] = "$";
ConversionRates["e0f20181-2612-661f-c6a9-578346cd8986"] = "0.02";
CurrencySymbols["e0f20181-2612-661f-c6a9-578346cd8986"] = "$";
let currencyFields = ["balance_c", "payment_c", "currency_type_c"];

const setConfig = (config) => {
  for (let x in config) {
    //eval(`${x} = ${config[x]}`);
    window[`${x}`] = `${config[x]}`;
  }
};
const formatNumber = (n, num_grp_sep, dec_sep, round, precision) => {
  if (typeof num_grp_sep == "undefined" || typeof dec_sep == "undefined")
    return n;
  n = n ? n.toString() : "";
  if (n.split) n = n.split(".");
  else return n;
  if (n.length > 2) return n.join(".");
  if (typeof round != "undefined") {
    if (round > 0 && n.length > 1) {
      n[1] = parseFloat("0." + n[1]);
      n[1] = Math.round(n[1] * Math.pow(10, round)) / Math.pow(10, round);
      n[1] = n[1].toString().split(".")[1];
    }
    if (round <= 0) {
      n[0] =
        Math.round(parseInt(n[0], 10) * Math.pow(10, round)) /
        Math.pow(10, round);
      n[1] = "";
    }
  }
  if (typeof precision != "undefined" && precision >= 0) {
    if (n.length > 1 && typeof n[1] != "undefined")
      n[1] = n[1].substring(0, precision);
    else n[1] = "";
    if (n[1].length < precision) {
      for (var wp = n[1].length; wp < precision; wp++) n[1] += "0";
    }
  }
  let regex = /(\d+)(\d{3})/;
  while (num_grp_sep != "" && regex.test(n[0]))
    n[0] = n[0].toString().replace(regex, "$1" + num_grp_sep + "$2");
  return n[0] + (n.length > 1 && n[1] != "" ? dec_sep + n[1] : "");
};
const unformatNumber = (n, num_grp_sep, dec_sep) => {
  var x = unformatNumberNoParse(n, num_grp_sep, dec_sep);
  x = x.toString();
  if (x.length > 0) {
    return parseFloat(x);
  }
  return "";
};
const unformatNumberNoParse = (n, num_grp_sep, dec_sep) => {
  if (typeof num_grp_sep == "undefined" || typeof dec_sep == "undefined")
    return n;
  n = n ? n.toString() : "";
  if (n.length > 0) {
    if (num_grp_sep != "") {
      let num_grp_sep_re = new RegExp("\\" + num_grp_sep, "g");
      n = n.replace(num_grp_sep_re, "");
    }
    n = n.replace(dec_sep, ".");
    if (typeof CurrencySymbols != "undefined") {
      for (var idx in CurrencySymbols) {
        n = n.replace(CurrencySymbols[idx], "");
      }
    }
    return n;
  }
  return "";
};
const isValidEmail = (emailStr) => {
  if (emailStr.length === 0) {
    return true;
  }
  var lastChar = emailStr.charAt(emailStr.length - 1);
  if (!lastChar.match(/[^\.]/i)) {
    return false;
  }
  var firstLocalChar = emailStr.charAt(0);
  if (firstLocalChar.match(/\./)) {
    return false;
  }
  var pos = emailStr.lastIndexOf("@");
  var localPart = emailStr.substr(0, pos);
  var lastLocalChar = localPart.charAt(localPart.length - 1);
  if (lastLocalChar.match(/\./)) {
    return false;
  }
  var reg = /@.*?;/g;
  var results;
  while ((results = reg.exec(emailStr)) != null) {
    let original = results[0];
    let parsedResult = results[0].replace(";", "::;::");
    emailStr = emailStr.replace(original, parsedResult);
  }
  reg = /.@.*?,/g;
  while ((results = reg.exec(emailStr)) != null) {
    let original = results[0];
    if (original.indexOf("::;::") == -1) {
      let parsedResult = results[0].replace(",", "::;::");
      emailStr = emailStr.replace(original, parsedResult);
    }
  }
  var emailArr = emailStr.split(/::;::/);
  for (var i = 0; i < emailArr.length; i++) {
    var emailAddress = emailArr[i];
    if (emailAddress.trim() != "") {
      if (
        !/^\s*[\w.%+\-&'#!\$\*=\?\^_`\{\}~\/]+@([A-Z0-9-]+\.)*[A-Z0-9-]+\.[\w-]{2,}\s*$/i.test(
          emailAddress,
        ) &&
        !/^.*<[A-Z0-9._%+\-&'#!\$\*=\?\^_`\{\}~]+?@([A-Z0-9-]+\.)*[A-Z0-9-]+\.[\w-]{2,}>\s*$/i.test(
          emailAddress,
        )
      ) {
        return false;
      }
    }
  }
  return true;
};
const isValidPhone = (phoneStr) => {
  return phoneStr.length !== 0 && /^[ 0-9-()+]*$/.test(phoneStr);
};
const isFloat = (floatStr) => {
  if (floatStr.length == 0) {
    return true;
  }
  if (!(typeof num_grp_sep == "undefined" || typeof dec_sep == "undefined")) {
    floatStr = unformatNumberNoParse(floatStr, num_grp_sep, dec_sep).toString();
  }
  return /^(-)?[0-9\.]+$/.test(floatStr);
};

const isTime = (timeStr) => {
  const state = store.getState();
  const timeRegFormat = pathOr(
    "[0-9]{1,2}:[0-9]{2}",
    ["config", "userPreference", "attributes", "global", "time_reg_format"],
    state,
  );
  let dateRegPositions = pathOr(
    { Y: 1, m: 2, d: 3 },
    ["config", "userPreference", "attributes", "global", "date_reg_positions"],
    state,
  );
  if (typeof dateRegPositions != "string") {
    dateRegPositions = "[0-9]{1,2}:[0-9]{2}";
  }
  var timeRegex = timeRegFormat.replace(/[ ]*\([^)]*m\)/i, "");
  if (timeStr.length == 0) {
    return true;
  }
  let myregexp = new RegExp(timeRegex);
  if (!myregexp.test(timeStr)) {
    return false;
  }
  return true;
};

const inRange = (value, min, max) => {
  if (typeof num_grp_sep != "undefined" && typeof dec_sep != "undefined")
    value = unformatNumberNoParse(value, num_grp_sep, dec_sep).toString();
  var result = true;
  if (typeof min == "number" && value < min) {
    result = false;
  }
  if (typeof max == "number" && value > max) {
    result = false;
  }
  return result;
};

const isDate = (dtStr) => {
  const state = store.getState();
  let dateRegFormat = pathOr(
    "([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})",
    ["config", "userPreference", "attributes", "global", "date_reg_format"],
    state,
  );
  let dateRegPositions = pathOr(
    { Y: 1, m: 2, d: 3 },
    ["config", "userPreference", "attributes", "global", "date_reg_positions"],
    state,
  );
  if (typeof dateRegPositions != "object") {
    dateRegPositions = { Y: 1, m: 2, d: 3 };
  }
  if (typeof dateRegFormat != "string") {
    dateRegFormat = "([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})";
  }
  if (dtStr.length == 0) {
    return true;
  }
  let myregexp = new RegExp(dateRegFormat);
  if (!myregexp.test(dtStr)) return false;
  let m = "";
  let d = "";
  let y = "";
  let dateParts = dtStr.match(dateRegFormat);
  for (let key in dateRegPositions) {
    let index = dateRegPositions[key];
    if (key == "m") {
      m = dateParts[index];
    } else if (key == "d") {
      d = dateParts[index];
    } else {
      y = dateParts[index];
    }
  }
  let dd = new Date(y, m, 0);
  if (y < 1) return false;
  if (m > 12 || m < 1) return false;
  if (d < 1 || d > dd.getDate()) return false;
  return true;
};
export const getDateObject = (dtStr) => {
  const state = store.getState();
  const dateRegFormat = pathOr(
    "([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})",
    ["config", "userPreference", "attributes", "global", "date_reg_format"],
    state,
  );
  const dateRegPositions = pathOr(
    { Y: 1, m: 2, d: 3 },
    ["config", "userPreference", "attributes", "global", "date_reg_positions"],
    state,
  );
  if (dtStr.length === 0) {
    return true;
  }
  let myregexp = new RegExp(dateRegFormat);
  if (myregexp.exec(dtStr)) var dt = myregexp.exec(dtStr);
  else return false;
  var yr = dt[dateRegPositions["Y"]];
  var mh = dt[dateRegPositions["m"]];
  var dy = dt[dateRegPositions["d"]];
  var dtar = dtStr.split(" ");
  var date1;
  if (typeof dtar[1] != "undefined" && isTime(dtar[1])) {
    var t1 = dtar[1]?.replace(/am/i, " AM");
    var t1 = t1?.replace(/pm/i, " PM");
    t1 = t1?.replace(/\./, ":");
    date1 = new Date(mh + "/" + dy + "/" + yr + " " + t1);
  } else {
    date1 = new Date(mh + "/" + dy + "/" + yr);
  }
  if (isNaN(date1.valueOf())) {
    return null;
  }
  return date1;
};
const toDecimal = (original, precision) => {
  precision = precision == null ? 2 : precision;
  let num = Math.pow(10, precision);
  let temp = Math.round(original * num) / num;
  if ((temp * 100) % 100 == 0) return temp + ".00";
  if ((temp * 10) % 10 == 0) return temp + "0";
  return temp;
};

const isInteger = (s) => {
  if (typeof num_grp_sep != "undefined" && typeof dec_sep != "undefined") {
    s = unformatNumberNoParse(s, num_grp_sep, dec_sep).toString();
  }
  return /^[+-]?[0-9]*$/.test(s);
};
const isDecimal = (s) => {
  if (typeof s == "string" && s == "") return true;
  if (typeof num_grp_sep != "undefined" && typeof dec_sep != "undefined") {
    s = unformatNumberNoParse(s, num_grp_sep, dec_sep).toString();
  }
  return /^[+-]?[0-9]*\.?[0-9]*$/.test(s);
};
const isNumeric = (s) => {
  return isDecimal(s);
};
// currency

const get_rate = (id) => {
  return ConversionRates[id];
};
const ConvertToDollar = (amount, rate) => {
  return amount / rate;
};
const ConvertFromDollar = (amount, rate) => {
  return amount * rate;
};
const ConvertRate = (id, fields) => {
  for (var i = 0; i < fields.length; i++) {
    fields[i].value = toDecimal(
      ConvertFromDollar(
        toDecimal(ConvertToDollar(toDecimal(fields[i].value), lastRate)),
        ConversionRates[id],
      ),
    );
  }
  lastRate = ConversionRates[id];
};
const ConvertRateSingle = (id, field) => {
  var temp = field.innerHTML.substring(1, field.innerHTML.length);
  let unformattedNumber = unformatNumber(temp, num_grp_sep, dec_sep);
  field.innerHTML =
    CurrencySymbols[id] +
    formatNumber(
      toDecimal(
        ConvertFromDollar(
          ConvertToDollar(unformattedNumber, lastRate),
          ConversionRates[id],
        ),
      ),
      num_grp_sep,
      dec_sep,
      2,
      2,
    );
  lastRate = ConversionRates[id];
};
const isBefore = (value1, value2) => {
  var d1 = getDateObject(value1);
  var d2 = getDateObject(value2);
  if (typeof d2 == "boolean") {
    return true;
  }
  return d2 >= d1;
};
const CurrencyConvertAll = (form) => {
  try {
    let id = form.currency_id.options[form.currency_id.selectedIndex].value;
    let fields = new Array();

    for (let i in currencyFields) {
      let field = currencyFields[i];
      if (typeof form[field] != "undefined") {
        form[field].value = unformatNumber(
          form[field].value,
          num_grp_sep,
          dec_sep,
        );
        fields.push(form[field]);
      }
    }
    ConvertRate(id, fields);
    for (let i in fields) {
      fields[i].value = formatNumber(fields[i].value, num_grp_sep, dec_sep);
    }
  } catch (err) {
    // Do nothing, if we can't find the currency_id field we will just not attempt to convert currencies
    // This typically only happens in lead conversion and quick creates, where the currency_id field may be named somethnig else or hidden deep inside a sub-form.
  }
};

const unformat2Number = (num) => {
  return num.toString().replace(/\$|\,/g, "");
};
const formatCurrency = (strValue) => {
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

  return (blnSign ? "" : "-") + dblValue + "." + strCents;
};

const isImageFile = (fileName) => {
  fileName = fileName ? fileName.trim() : "";
  let allowedTypes = ["png", "jpg", "jpeg"];
  let fileExtArr = fileName.split(".");
  if (fileExtArr.length > 2) return false;
  let ext = pathOr("", [1], fileExtArr).toLowerCase();
  for (var i = allowedTypes.length; i >= 0; i--) {
    if (ext === allowedTypes[i]) {
      return true;
    }
  }
  return false;
};

const isValidFile = (fileName = "") => {
  const state = store.getState();
  const allowedFileExtensions = pathOr(
    [],
    ["config", "config", "upload_allowed_file_extensions"],
    state,
  );
  fileName = fileName ? fileName.trim() : "";
  const extensionRegex = /\.([^.\\/:*?"<>|\r\n]+)$/;
  const match = fileName.match(extensionRegex);
  if (!match) {
    return false;
  }
  const extension = match[1].toLowerCase();

  const isFileAllow = allowedFileExtensions.includes(extension);
  return isFileAllow;
};
export {
  setConfig,
  isValidPhone,
  isValidEmail,
  isInteger,
  isDecimal,
  isFloat,
  isDate,
  isBefore,
  ConvertToDollar,
  ConvertFromDollar,
  unformat2Number,
  formatCurrency,
  isImageFile,
  isValidFile,
};
