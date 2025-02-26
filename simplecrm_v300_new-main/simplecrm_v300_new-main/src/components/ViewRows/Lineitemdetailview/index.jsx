import React from "react";
import { pathOr } from "ramda";

import SimpleLineItemDetailView from "./components/SimpleLineItemDetailView";
import GroupLineItemDetailView from "./components/GroupLineItemDetailView";

export default function LineItemDetailView({ data, module }) {
  const isGroupLineItem = pathOr(0, ["enable_group"], data);
  return isGroupLineItem ? (
    <GroupLineItemDetailView data={data} module={module} />
  ) : (
    <SimpleLineItemDetailView data={data} module={module} />
  );
}
