import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useTheme,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
} from "@material-ui/core";
import { Skeleton} from "../../../..";
import { toast } from "react-toastify";
import useStyles, { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { pathOr } from "ramda";
import { getModuleRecords } from "../../../../../store/actions/module.actions";
import Scrollbars from "react-custom-scrollbars";
import ShowEventDetail from "../../../../Calendar/components/ShowEventDetail";
import VisibilityIcon from "@material-ui/icons/Visibility";
export default function QuickNotesTile({ data, id, page, setPageCnt }) {
  const classes = useStyles();
  const currentTheme = useTheme();
  const { module } = useParams();
  const [loading1, setLoading1] = useState(false);
  const [seletedItem, setSeletedItem] = useState(null);
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

  const showDetail = (newId, newModule, moduleLabel, data) => {
    setSeletedItem(data);
    if (newModule === "Activities") {
      setShowDialogOpen({
        open: true,
        id: newId,
        module: newModule,
        label: module,
        data: data,
      });
    } else {
      setShowDialogOpen({
        open: true,
        id: newId,
        module: newModule,
        label: moduleLabel,
      });
    }
  };

  const getModuleRecordsData = async () => {
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
        setRelateFieldData((prevData) => {
          JSON.stringify(prevData) === "{}"
            ? (res.data.data.templateMeta.data.subpanel_tabs[0].listview.data[0] =
                res.data.data.templateMeta.data.subpanel_tabs[0].listview.data[0])
            : console.log(
                "response11",
                res.data.data.templateMeta.data.subpanel_tabs[0].listview
                  .data[0],
              );
          return { ...prevData, ...res.data };
        });
        var cnt =
          res.data.data.templateMeta.data.subpanel_tabs[0].listview.data[0]
            .length;
        setPageCnt(cnt);
        return;
      }
    } catch (ex) {
      toast("SOMETHING WENT_WRONG");
    }
  };

  useEffect(() => {
    getModuleRecordsData();
  }, [page]);
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
                  <ListItem
                    key={`records-${index}`}
                  >
                    <ListItemText
                      id={`checkbox-list-secondary-label-${index}`}
                      primary={
                        <React.Fragment>
                          <Grid container xs={12} md={12}>
                            <Grid item className={classes.inline}>
                              {item?.object_image}{" "}
                              <span style={{ fontWeight: "lighter" }}>
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
                    >
                      <IconButton
                        aria-label="preview"
                        size="small"
                        style={{ padding: "0px" }}
                        onClick={() => {
                          showDetail(
                            pathOr("", [index, "id"], is_group_array),
                            data.related_back_module_name,
                            data.related_module_name,
                            is_group_array[index],
                          );
                        }}
                      >
                        <VisibilityIcon className={classes.eyeIcon} />
                      </IconButton>
                    </Grid>
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
                              {item?.object_image}
                              <span style={{ fontWeight: "lighter" }}>
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
                    >
                      <IconButton
                        aria-label="preview"
                        size="small"
                        style={{ padding: "0px" }}
                        onClick={() => {
                          showDetail(
                            pathOr("", [index, "id"], is_group_array),
                            data.related_back_module_name,
                            data.related_module_name,
                            is_group_array[index],
                          );
                        }}
                      >
                        <VisibilityIcon className={classes.eyeIcon} />
                      </IconButton>
                    </Grid>
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
