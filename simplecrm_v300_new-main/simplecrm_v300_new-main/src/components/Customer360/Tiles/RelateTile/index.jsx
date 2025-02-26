import React, {useState } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
// styles
import useStyles, { getMuiTheme } from "./styles";
import { Card, CardContent, useTheme } from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightOutlinedIcon from "@material-ui/icons/ChevronRightOutlined";
import ChevronLeftOutlinedIcon from "@material-ui/icons/ChevronLeftOutlined";
import RecentInteractions from "./RecentInteractions";
import { SkeletonShell, FaIcon } from "../../../../components";
import Scrollbars from "react-custom-scrollbars";
import DefaultTile from "./DefaultTile";
import AISuggestions from "./AISuggestionsTile";

export default function RelateTile({ id, data, pid, pmodule }) {
  let pageCnt = 0
  let loading = false
  const classes = useStyles();
  const currentTheme = useTheme();
  const [page, setPage] = useState(0);
  const [countData, setCountData] = useState(0);

  const previousPage = () => {
    setPage(page - 1);
  };
  const nextPage = () => {
    setPage(page + (page ? 1 : 2));
  };

  const renderList = (item) => {
    switch (item.module_name) {
      case "Transaction History":
        return (
          <DefaultTile
            data={data}
            id={id}
            page={page}
            setPageCnt={pageCnt}
            setCountData={setCountData}
          />
        );
      case "cases":
        return (
          <DefaultTile
            id={id}
            data={data}
            page={page}
            setPageCnt={pageCnt}
            setCountData={setCountData}
          />
        );
      case "Activities":
        return (
          <RecentInteractions
            id={id}
            data={data}
            page={page}
            setPageCnt={pageCnt}
            setCountData={setCountData}
          />
        );
      case "AISuggestions":
        return (
          <AISuggestions
            id={id}
            data={data}
            page={page}
            setCountData={setCountData}
          />
        );
      default:
        return (
          <DefaultTile
            data={data}
            id={id}
            page={page}
            setPageCnt={pageCnt}
            setCountData={setCountData}
          />
        );
    }
  };
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <Card
        className={classes.root}
        style={{
          borderTop: `3px solid ${data.icon.bgcolor}`,
          height:
            data.related_back_module_name === "cinfo"
              ? "65%"
              : data.related_back_module_name === "notes"
                ? "35%"
                : "100%",
          borderRadius: "0px",
          borderBottom: "2px solid #aeaeae",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              className={classes.avatar}
              style={{ background: data.icon.bgcolor }}
            >
              <FaIcon
                icon={`fas ${data.icon.faicon ? data.icon.faicon : "fas fa-cube"
                  }`}
                size="1x"
              />
            </Avatar>
          }
          action={
            data.related_back_module_name === "cinfo" ||
              data.related_back_module_name === "scrm_Accounts" ? (
              <></>
            ) : (
              <>
                <IconButton
                  disableFocusRipple
                  size="small"
                  disableRipple
                  disabled={page <= 1}
                  aria-label="settings"
                  onClick={() => previousPage()}
                  className={classes.pagination}
                >
                  <ChevronLeftOutlinedIcon />
                </IconButton>
                <IconButton
                  disableFocusRipple
                  disableRipple
                  size="small"
                  disabled={page >= countData / 5 || countData <= 5}
                  aria-label="settings"
                  onClick={() => nextPage()}
                  className={classes.pagination}
                >
                  <ChevronRightOutlinedIcon />
                </IconButton>
              </>
            )
          }
          title={`${
             data.related_module_name
          }  ${data.record_count ? "(" + data.record_count + ")" : ""}`}
        />
        {loading ? (
          <SkeletonShell layout="listView" display />
        ) : (
          <CardContent>
            {data.related_back_module_name !== "notes" ? (
              renderList(data)
            ) : (
              <Scrollbars
                autoHide={false}
                style={{
                  height: "28vh",
                }}
              >
                {renderList(data)}
              </Scrollbars>
            )}
          </CardContent>
        )}
      </Card>
    </MuiThemeProvider>
  );
}
