import dayjs from "dayjs";

export const parse_date = (d, format) => {
  var format_parts = format.split(" ");
  var date_format = format_parts[0];
  var time_format = format_parts[1];
  if (format_parts.length == 3) time_format += "" + time_format[2];
  var date_delimiter = /([-.\\/])/.exec(date_format)[0];
  var time_delimiter = /([.:])/.exec(time_format)[0];
  var has_meridiem = /p/i.test(format);

  var delimiter =
    date_delimiter == "." ? "\\" + date_delimiter : date_delimiter;
  var date_format_cleaned = date_format
    .replace(/%/g, "")
    .replace(new RegExp(delimiter, "g"), "");
  var month_pos = date_format_cleaned.search(/m/);
  var day_pos = date_format_cleaned.search(/d/);
  var year_pos = date_format_cleaned.search(/Y/);

  var date_parts = d.split(" ");
  var date_str = date_parts[0];
  var time_str = date_parts[1];
  if (date_parts.length == 3) time_str += date_parts[2];
  var date_arr = date_str.split(date_delimiter);
  var year = date_arr[year_pos];
  var month = date_arr[month_pos];
  var day = date_arr[day_pos];
  var hour = time_str.substr(0, 2);
  var minute = time_str.substr(3, 2);
  if (has_meridiem) {
    var meridiem = "am";
    if (/pm/i.test(time_str)) meridiem = "pm";
    hour = (hour % 12) + (meridiem === "am" ? 0 : 12);
  }
  var date = new Date(year, month - 1, day, hour, minute);
  return date;
};

export const calculate_duration = (
  start_field,
  end_field,
  format,
  date_reg_format,
  date_reg_positions,
  time_reg_format,
) => {
  let duration = 0;
  try {
    var start = getDateObject(
      start_field,
      date_reg_format,
      date_reg_positions,
      time_reg_format,
    );
    var end = getDateObject(
      end_field,
      date_reg_format,
      date_reg_positions,
      time_reg_format,
    );
    duration = (end.getTime() - start.getTime()) / 1000;
  } catch (e) {
    duration = 0;
  }
  var minutes = duration / 60;
  var hours = parseInt(minutes / 60);
  minutes = parseInt(minutes % 60);
  let data = {
    duration_minutes: minutes,
    duration_hours: hours,
    duration: duration,
  };
  return data;
};
export const add_custom_duration = (durationInput) => {
  const options = {
    "": "None",
    900: "15 minutes",
    1800: "30 minutes",
    2700: "45 minutes",
    3600: "1 hour",
    5400: "1.5 hours",
    7200: "2 hours",
    10800: "3 hours",
    21600: "6 hours",
    86400: "1 day",
    172800: "2 days",
    259200: "3 days",
    604800: "1 week",
  };

  const label = options[durationInput] || get_duration_text(durationInput);
  return { value: durationInput, label: label };
};
const get_duration_text = (durationInput) => {
  if (!durationInput) return "None";
  const durationObj = dayjs.duration(durationInput, "seconds");
  const years = durationObj.years();
  const months = durationObj.months();
  const days = durationObj.days();
  const hours = durationObj.hours();
  const minutes = durationObj.minutes();

  let textParts = [];
  if (years) textParts.push(`${years} ${years > 1 ? "years" : "year"}`);
  if (months) textParts.push(`${months} ${months > 1 ? "months" : "month"}`);
  if (days) textParts.push(`${days} ${days > 1 ? "days" : "day"}`);
  if (hours) textParts.push(`${hours} ${hours > 1 ? "hours" : "hour"}`);
  if (minutes)
    textParts.push(`${minutes} ${minutes > 1 ? "minutes" : "minute"}`);

  return textParts.join(" ");
};

const isTime = (timeStr, time_reg_format) => {
  var timeRegex = time_reg_format;
  timeRegex = timeRegex.replace(/[ ]*\([^)]*m\)/i, "");
  if (timeStr.length == 0) {
    return true;
  }
  let myregexp = new RegExp(timeRegex);
  if (!myregexp.test(timeStr)) {
    return false;
  }
  return true;
};

const getDateObject = (
  dtStr,
  date_reg_format,
  date_reg_positions,
  time_reg_format,
) => {
  if (dtStr.length === 0) {
    return true;
  }
  let myregexp = new RegExp(date_reg_format);
  if (myregexp.exec(dtStr)) {
    var dt = myregexp.exec(dtStr);
  } else {
    return false;
  }
  var yr = dt[date_reg_positions["Y"]];
  var mh = dt[date_reg_positions["m"]];
  var dy = dt[date_reg_positions["d"]];
  var dtar = dtStr.split(" ");
  var date1 = "";
  if (typeof dtar[1] != "undefined" && isTime(dtar[1], time_reg_format)) {
    var t1 = dtar[1].replace(/am/i, " AM");
    t1 = t1.replace(/pm/i, " PM");
    t1 = t1.replace(/\./, ":");
    date1 = new Date(mh + "/" + dy + "/" + yr + " " + t1);
  } else {
    date1 = new Date(mh + "/" + dy + "/" + yr);
  }
  if (isNaN(date1.valueOf())) {
    return null;
  }
  return date1;
};
