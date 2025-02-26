import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useTheme,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@material-ui/core";
import { Skeleton } from "../../../..";
import { toast } from "react-toastify";
import useStyles, { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { pathOr } from "ramda";
import { getModuleRecords } from "../../../../../store/actions/module.actions";
import Scrollbars from "react-custom-scrollbars";
import ShowEventDetail from "../../../../Calendar/components/ShowEventDetail";
import { useCallback } from "react";
export default function RecentInteractions({ data, id, page, setCountData }) {
  let seletedItem = null;
  const classes = useStyles();
  const currentTheme = useTheme();
  const { module } = useParams();
  const [loading1, setLoading1] = useState(false);
  const [detailViewData, setDetailViewData] = useState({});
  const [showDialogOpen, setShowDialogOpen] = useState({
    open: false,
    id: null,
    module: null,
    moduleLabel: null,
  });

  const [relateFieldData, setRelateFieldData] = useState({});
  let is_group_array = pathOr(
    [],
    ["data", "templateMeta", "data", "subpanel_tabs", 0, "listview", "data", 0],
    relateFieldData,
  );
  const parseModuleName = (module) => {
    let arr = [
      { module: "Calls", label: "Call" },
      { module: "Meetings", label: "Meeting" },
      { module: "Tasks", label: "Task" },
    ];
    let data = arr.filter((item) => item.module === module);
    return pathOr("", [0, "label"], data);
  };

  const getModuleRecordsData = useCallback(async () => {
    setLoading1(true);
    try {
      const res = await getModuleRecords(
        module,
        "",
        id,
        page ? page : 1,
        pathOr("", ["subpanel"], data),
        pathOr("", ["subpanel_module"], data),
      );

      setLoading1(false);
      if (res.ok) {
        setDetailViewData(res.data.data.templateMeta.data.subpanel_tabs[0]);
        setRelateFieldData((prevData) => {
          return { ...prevData, ...res.data };
        });
        var cnt =
          res.data.data.templateMeta.data.subpanel_tabs[0].listview.data[0]
            .length;
        setPageCnt=cnt;
        let count = res.data.data.templateMeta.data.subpanel_tabs[0].data_count;
        setCountData(count);
        return;
      }
    } catch (ex) {
      // toast("SOMETHING WENT_WRONG");
    }
  },[page]);
  useEffect(() => {
    getModuleRecordsData();
  }, [getModuleRecordsData]);

  const record_count = detailViewData.data_count;
  setCountData(record_count);

  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <Scrollbars autoHide={false} style={{ height: "28vh" }}>
        <List dense className={classes.root}>
          {loading1 ? (
            <Skeleton></Skeleton>
          ) : (
            is_group_array &&
            is_group_array.map((item, index) => {
              if (is_group_array.length === index + 1) {
                return (
                  <ListItem key={`records-${index}`}>
                    <ListItemText
                      id={`checkbox-list-secondary-label-${index}`}
                      primary={
                        <React.Fragment>
                          <Grid container xs={12} md={12}>
                            <Grid item className={classes.inline}>
                              {parseModuleName(item?.object_image)}{" "}
                              <span className={classes.inlineGrey}>
                                {" created on "}
                              </span>{" "}
                              {item?.date_start}
                            </Grid>
                          </Grid>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Grid container xs={12} md={12}>
                            <Grid item className={classes.inlineGrey1}>
                              {item?.eventtype_c || "Category | Sub-Category"}
                            </Grid>
                          </Grid>
                        </React.Fragment>
                      }
                    />

                    <Grid
                      item
                      xs={1}
                      md={1}
                      alignContent="right"
                      alignItems="right"
                    ></Grid>
                  </ListItem>
                );
              } else {
                return (
                  <ListItem key={`record-${index}`}>
                    <ListItemText
                      id={`checkbox-list-secondary-label-${index}`}
                      primary={
                        <React.Fragment>
                          <Grid container xs={12} md={12}>
                            <Grid item className={classes.inline}>
                              {parseModuleName(item?.object_image)}
                              <span className={classes.inlineGrey}>
                                {" created on "}
                              </span>{" "}
                              {item?.date_start}
                            </Grid>
                          </Grid>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Grid container xs={12} md={12}>
                            <Grid item className={classes.inlineGrey1}>
                              {item?.eventtype_c || "Category | Sub-Category"}
                            </Grid>
                          </Grid>
                        </React.Fragment>
                      }
                    />
                    <Grid
                      item
                      xs={1}
                      md={1}
                      alignContent="right"
                      alignItems="right"
                    ></Grid>
                  </ListItem>
                );
              }
            })
          )}
          {showDialogOpen.open ? (
            <ShowEventDetail
              showDialogOpen={showDialogOpen}
              setShowDialogOpen={setShowDialogOpen}
              size="md"
              id={id}
              data={seletedItem}
            />
          ) : null}
        </List>
      </Scrollbars>
    </MuiThemeProvider>
  );
}
