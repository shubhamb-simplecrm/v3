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
import { Skeleton } from "../../../..";
import { toast } from "react-toastify";
import useStyles, { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { pathOr } from "ramda";
import { getModuleRecords } from "../../../../../store/actions/module.actions";
import Scrollbars from "react-custom-scrollbars";
import ShowEventDetail from "../../../../Calendar/components/ShowEventDetail";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DetailTile from "../DetailTile";
export default function DefaultTile({
  data,
  id,
  page,
  setPageCnt,
  setCountData,
}) {
  const classes = useStyles();
  const currentTheme = useTheme();
  let selectedModule = data.related_back_module_name;
  const { module } = useParams();
  const [loading1, setLoading1] = useState(false);
  const [seletedItem, setSeletedItem] = useState(null);
  const [showDialogOpen, setShowDialogOpen] = useState({
    open: false,
    id: null,
    module: null,
    moduleLabel: null,
  });
  const [showHirePurchaseDialogOpen, setShowHirePurchaseDialogOpen] = useState({
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
    if (newModule === "AOS_Invoices") {
      setShowHirePurchaseDialogOpen({
        open: true,
        id: newId,
        module: newModule,
        data: data,
        label: moduleLabel,
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
      let query = "";
      if (selectedModule === "AOS_Invoices") {
        query = "hire_purchase_tile=true";
      }
      const res = await getModuleRecords(
        module,
        query,
        id,
        page ? page : 1,
        pathOr("", ["subpanel"], data),
        pathOr("", ["subpanel_module"], data),
      );
      if (res.ok) {
        setRelateFieldData((prevData) => {
          return { ...prevData, ...res.data };
        });
        var cnt =
          res.data.data.templateMeta.data.subpanel_tabs[0].listview.data[0]
            .length;
        setPageCnt=cnt;
        let count = res.data.data.templateMeta.data.subpanel_tabs[0].data_count;
        setCountData(count);
        setLoading1(false);
        return;
      }
    } catch (ex) {
      // toast("SOMETHING WENT_WRONG");
    }
  };
  useEffect(() => {
    const isAPiFire = pathOr(false, ["is_api_fire"], data);
    if (isAPiFire) getModuleRecordsData();
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
                  <ListItem key={`records-${index}`}>
                    <ListItemText
                      id={`checkbox-list-secondary-label-${index}`}
                      primary={
                        <React.Fragment>
                          <Grid container xs={12} md={12}>
                            <Grid item className={classes.inline}>
                              {item?.name || item?.document_name}
                            </Grid>
                          </Grid>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Grid container xs={12} md={12}>
                            <Grid item className={classes.inlineGrey1}>
                              {item?.status ||
                                item?.sales_stage ||
                                "Application"}
                              {" -"}
                            </Grid>
                            <Grid item className={classes.inlineGrey}>
                              {item?.status_id}
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
                              {item?.name || item?.document_name}
                            </Grid>
                          </Grid>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Grid container xs={12} md={12}>
                            <Grid item className={classes.inlineGrey1}>
                              {item?.status ||
                                item?.sales_stage ||
                                "Application"}
                              {" -"}
                            </Grid>
                            <Grid item className={classes.inlineGrey}>
                              {item?.status_id}
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
              calenderView={true}
            />
          ) : null}
          {showHirePurchaseDialogOpen.open ? (
            <DetailTile
              showDialogOpen={showHirePurchaseDialogOpen}
              setShowDialogOpen={setShowHirePurchaseDialogOpen}
            />
          ) : (
            ""
          )}
        </List>
      </Scrollbars>
    </MuiThemeProvider>
  );
}
