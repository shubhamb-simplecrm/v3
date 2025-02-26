import React, { memo, useMemo } from "react";
import { pathOr } from "ramda";
import RowLineItem from "./components/row-lineitem";
import GroupLineItem from "./components/group-lineitem";

function LineItem(props) {
  const isGroupLineItem = useMemo(() => {
    const enableGroup = pathOr(0, ["field", "linedata", "enable_group"], props);
    return enableGroup;
  }, [props.field]);
  return isGroupLineItem ? (
    <GroupLineItem {...props} />
  ) : (
    <RowLineItem {...props} />
  );
}

export default memo(LineItem);
