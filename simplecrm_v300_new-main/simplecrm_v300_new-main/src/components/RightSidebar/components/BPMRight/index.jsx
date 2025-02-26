import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
// styles
import useStyles, { getMuiTheme } from "./styles";
import { useTheme, Typography } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { pathOr } from "ramda";
import { BPM } from "../../../";
import { LBL_BPM_TITLE } from "../../../../constant";
import DrawerHeader from "../DrawerHeader";

export default function BPMRight() {
  console.log("dad");
  const classes = useStyles();
  const theme = useTheme();
  const { detailViewTabData } = useSelector((state) => state.detail);
  const location = useLocation();
  let splitPathName = location.pathname.split("/");
  let isDetail = pathOr([], [2], splitPathName);
  const module = isDetail === "detailview" ? splitPathName[3] : null;
  const record = isDetail === "detailview" ? splitPathName[4] : null;

  return (
    <>
      <DrawerHeader title={LBL_BPM_TITLE} />
      <MuiThemeProvider theme={getMuiTheme(theme)}>
        <BPM
          data={detailViewTabData[module]}
          module={module}
          view="rightpanel"
          headerBackground="true"
          recordId={record}
          mode="rightpanel"
        />
      </MuiThemeProvider>
    </>
  );
}
