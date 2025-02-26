import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FaIcon({
  icon = "fas fa-cube",
  size = "1x",
  color = "",
  className = "",
}) {
  //const parseIcon = ()=>{
  let dataArr = icon ? icon.toString().split(" ") : [];
  dataArr = dataArr.filter((el, index) => dataArr.indexOf(el) === index);
  if (dataArr.length === 2) {
    if (dataArr[0] === "far") dataArr[0] = "fas";
    dataArr[1] = dataArr[1].replace("fa-", "");
  }
  if (dataArr.length === 3) {
    dataArr[1] = dataArr[2].replace("fa-", "");
    dataArr.splice(2, 1);
  }

  return (
    <FontAwesomeIcon
      icon={dataArr}
      size={size}
      color={color}
      className={className}
    />
  );
}
