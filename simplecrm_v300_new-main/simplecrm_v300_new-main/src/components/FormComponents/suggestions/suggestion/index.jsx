import React, { useEffect, useState } from "react";
import { TextField, Tooltip, Link } from "@material-ui/core";
import { pathOr } from "ramda";
import { useSelector, useDispatch } from "react-redux";
import { FaIcon } from "../../../";
import useStyles from "./styles";
export default function SuggestionName({ initialValues, onChange }) {
  const classes = useStyles();
  const { editViewTabData } = useSelector((state) => state.edit);
  const [nameTxt, setNameTxt] = useState(null);
  const displayString = () => {
    let account_name = pathOr(null, ["account_name", "value"], initialValues);
    let category = pathOr(null, ["type"], initialValues);
    let type = pathOr(null, ["casetype_c"], initialValues);
    let subtype = pathOr(null, ["subtype_c"], initialValues);

    const data = pathOr(
      [],
      ["Cases", "data", "templateMeta", "data"],
      editViewTabData,
    );
    let dom = [];
    const newData =
      data &&
      data.filter((item) => {
        item.attributes.filter((row) => {
          row.filter((field) => {
            if (
              ["type", "casetype_c", "subtype_c", "account_name"].includes(
                field.name,
              )
            ) {
              dom[field.name] = field.options ?? [];
            }
          });
        });
      });
    category = pathOr(null, ["type", category], dom);
    type = pathOr(null, ["casetype_c", type], dom);
    subtype = pathOr(null, ["subtype_c", subtype], dom);
    let arr = [account_name, category, type, subtype];
    arr = arr.filter((n) => n);
    setNameTxt(arr.join(" - "));
  };
  useEffect(() => {
    displayString();
  });

  return nameTxt ? (
    <Tooltip title={"Click to pick suggestion"} placement="top-start">
      <Link
        className={classes.suggestionText}
        onClick={() => onChange(nameTxt)}
      >
        {nameTxt}{" "}
        <FaIcon
          className={classes.suggestionCopyBtn}
          icon={`fas fa-copy`}
          size="1x"
        />
      </Link>
    </Tooltip>
  ) : (
    ""
  );
}
