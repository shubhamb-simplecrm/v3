import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useTheme,
  List,
  ListItem,
  ListItemText,
  Typography,
  Link,
  Chip,
} from "@material-ui/core";
import { Skeleton } from "../../../../../components";
import { toast } from "react-toastify";
import useStyles, { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { pathOr } from "ramda";
import { relateTicketSearch } from "../../../../../store/actions/module.actions";
import Scrollbars from "react-custom-scrollbars";
import ShowEventDetail from "../../../../Calendar/components/ShowEventDetail";
export default function TicketList({ id, page }) {
  let searchFields = {};
  let searchFieldsMeta = {};
  let hasMore = false;
  let listViewMeta = { page: 0 };
  const classes = useStyles();
  const currentTheme = useTheme();
  const { module } = useParams();
  const [loading1, setLoading1] = useState(false);
  const statusBackground = pathOr(
    [],
    ["config", "fields_background", "Cases", "status"],
    useSelector((state) => state.config.config),
  );
  const { selectedModule } = useSelector((state) => state.modules);
  const [showDialogOpen, setShowDialogOpen] = useState({
    open: false,
    id: null,
    module: null,
    moduleLabel: null,
  });

  const [relateFieldData, setRelateFieldData] = useState({});
  let is_group_array = pathOr(
    [],
    ["data", "templateMeta", "listview", "data"],
    relateFieldData,
  );

  const showDetail = (newId, newModule) => {
    setShowDialogOpen({
      open: true,
      id: newId,
      module: newModule,
      label: module,
    });
  };

  const buildFilterQuery = () => {
    let filterQuery = "";
    for (let key in searchFields) {
      let operator = "eq";
      let likeTypes = ["name", "url"];
      if (likeTypes.includes(searchFieldsMeta[key].type)) {
        operator = "lke";
      }
      let multiTypes = ["multienum"];
      if (multiTypes.includes(searchFieldsMeta[key].type)) {
        operator = "multi";
      }
      if (searchFields[key]) {
        if (typeof searchFields[key] !== "object") {
          if (
            searchFieldsMeta[key].type === "datetime" ||
            searchFieldsMeta[key].type === "datetimecombo"
          ) {
            let dateSingleValue = [
              "next_7_days",
              "last_7_days",
              "last_month",
              "this_month",
              "next_month",
              "last_30_days",
              "next_30_days",
              "this_year",
              "last_year",
              "next_year",
            ];
            let dateDoubleValue = [
              "=",
              "not_equal",
              "less_than",
              "greater_than",
              "less_than_equals",
              "greater_than_equals",
            ];
            let dateTripalValue = ["between"];
            if (dateSingleValue.some((item) => searchFields[key] === item)) {
              filterQuery =
                filterQuery +
                `filter[range_${key}][${`operator`}]=${searchFields[key]}&`;
            } else if (
              dateDoubleValue.some((item) => searchFields[key] === item)
            ) {
              filterQuery =
                filterQuery +
                `filter[range_${key}][${operator}]=${
                  searchFields["range_" + key]
                }&filter[${key}_range_choice][${`operator`}]=${
                  searchFields[key]
                }&`;
            } else if (
              dateTripalValue.some((item) => searchFields[key] === item)
            ) {
              filterQuery =
                filterQuery +
                `filter[start_range_${key}][${operator}]=${
                  searchFields["start_range_" + key]
                }&filter[end_range_${key}][${operator}]=${
                  searchFields["end_range_" + key]
                }&filter[${key}_range_choice][${`operator`}]=${
                  searchFields[key]
                }&`;
            }
          } else if (searchFieldsMeta[key].type === "bool") {
            filterQuery =
              filterQuery +
              `filter[${key}][${operator}]=${searchFields[key] ? 1 : 0}&`;
          } else {
            let fval = encodeURIComponent(searchFields[key]);
            filterQuery = filterQuery + `filter[${key}][${operator}]=${fval}&`;
          }
        } else if (operator === "multi") {
          if (searchFields[key].length > 0) {
            filterQuery =
              filterQuery +
              `filter[${key}][${operator}]=${searchFields[key] || []}&`;
          }
        } else if (searchFieldsMeta[key].type === "relate") {
          filterQuery =
            filterQuery + `filter[${key}][]=${searchFields[key].id}&`;
        } else if (searchFieldsMeta[key].type === "parent") {
          filterQuery =
            filterQuery +
            `filter[parent_type][${operator}]=${searchFields[key].parent_type}&filter[parent_name][${operator}]=${searchFields[key].parent_id}`;
        } else {
          filterQuery =
            filterQuery +
            `filter[${key}][${operator}]=${searchFields[key].id || []}&`;
        }
      }
    }
    return filterQuery;
  };
  const getTicketdata = async () => {
    setLoading1(true);
    try {
      id = "ccc26c18-285c-5452-6663-5d282ac9b44a&";
      const res = await relateTicketSearch(
        selectedModule,
        buildFilterQuery(),
        id,
        page ? page : 1,
      );
      hasMore = res.data.data.templateMeta.listview.data > 0;
      listViewMeta = {
        page: 0,
      };
      setLoading1(false);
      if (res.ok) {
        setRelateFieldData((prevData) => {
          return { ...prevData, ...res.data };
        });
        return;
      }
    } catch (ex) {
      // toast("SOMETHING_WENT_WRONG");
    }
  };
  useEffect(() => {
    getTicketdata();
  }, []);

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
                  <ListItem key={`ticket-${index}`}>
                    <ListItemText
                      id={`checkbox-list-secondary-label-${index}`}
                      primary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            <Link
                              href="#"
                              onClick={(e) => showDetail(id, selectedModule)}
                              variant="body2"
                            >
                              {item.attributes.case_number ||
                                "THTNB-EC-055265 "}
                            </Link>
                          </Typography>
                          {` created on ${
                            item.attributes.date_entered || "T30-03-2022"
                          }`}
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Chip
                            size="small"
                            style={{
                              backgroundColor: pathOr(
                                "#38c1ef",
                                [item.attributes.status, "background_color"],
                                statusBackground,
                              ),
                              color: "#fff",
                            }}
                            className={classes.inline}
                            label={item?.attributes.status || "TOpen"}
                          />

                          {` ${item?.attributes.type} | ${item?.attributes.call_type_c}`}
                        </React.Fragment>
                      }
                      className={classes.listItem}
                      style={{
                        borderLeftColor: pathOr(
                          "#38c1ef",
                          [item.attributes.status, "background_color"],
                          statusBackground,
                        ),
                      }}
                    />
                  </ListItem>
                );
              } else {
                return (
                  <ListItem key={`ticket-${index}`}>
                    <ListItemText
                      id={`checkbox-list-secondary-label-${index}`}
                      primary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            <Link
                              href="#"
                              onClick={(e) => showDetail(id, selectedModule)}
                              variant="body2"
                            >
                              {item.attributes.case_number ||
                                "THTNB-EC-055265 "}
                            </Link>
                          </Typography>
                          {` created on ${
                            item.attributes.date_entered || "T30-03-2022"
                          }`}
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Chip
                            size="small"
                            style={{
                              backgroundColor: pathOr(
                                "#38c1ef",
                                [item.attributes.status, "background_color"],
                                statusBackground,
                              ),
                              color: "#fff",
                            }}
                            className={classes.inline}
                            label={item?.attributes.status || "TOpen"}
                          />

                          {` ${item?.attributes.type} | ${item?.attributes.call_type_c}`}
                        </React.Fragment>
                      }
                      className={classes.listItem}
                      style={{
                        borderLeftColor: pathOr(
                          "#38c1ef",
                          [item.attributes.status, "background_color"],
                          statusBackground,
                        ),
                      }}
                    />
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
            />
          ) : null}
        </List>
      </Scrollbars>
    </MuiThemeProvider>
  );
}
