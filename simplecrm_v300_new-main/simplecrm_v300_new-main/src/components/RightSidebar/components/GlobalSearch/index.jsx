import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
// styles
import useStyles, { getMuiTheme } from "./styles";
import {
  useTheme,
  ButtonGroup,
  Badge,
  FormControl,
  Tab,
  Tabs,
  AppBar,
  Box,
  Input,
  InputAdornment,
  Divider,
  Typography,
  Grid,
  Tooltip,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import { Scrollbars } from "react-custom-scrollbars";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { pathOr, clone, isEmpty } from "ramda";
import InfiniteScroll from "react-infinite-scroll-component";
import { RecordItem, NoRecord } from "./components";
import {
  getGlobalSearch,
  getGlobalSearchSuccess,
} from "../../../../store/actions/module.actions";
import FileViewerComp from "../../../FileViewer/FileViewer";
import { FaIcon, Skeleton } from "../../../";
import { Button } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import {
  LBL_GLOBAL_SEARCH_TEXT_PLACEHOLDER,
  LBL_NO_RECORD,
  LBL_SEARCH_BUTTON_LABEL,
  LBL_GLOBAL_SEARCH_TITLE,
} from "../../../../constant";
import DrawerHeader from "../DrawerHeader";
import useDebounce from "@/hooks/useDebounce";
import ComposeEmail from "@/components/ComposeEmail";
import useComposeViewData from "@/components/ComposeEmail/hooks/useComposeViewData";

function TabPanel(props) {
  const { children, value, index, module, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      name={module}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function a11yProps(index, module) {
  return {
    id: `tab-${index}`,
    name: module,
    "aria-controls": `tabpanel-${index}`,
  };
}
export default function GlobalSearch({ onCloseRightSideBar }) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [queryString, setQueryString] = useState(null);
  const [queryResult, setQueryResult] = useState([]);
  const { globalSearchTabData, globalSearchLoading } = useSelector(
    (state) => state.modules,
  );
  const { config } = useSelector((state) => state.config);
  const { sidebarLinks } = useSelector((state) => state.layout);
  const [noRecordFlag, setNorRecordFlag] = useState(false);
  const [previewFile, setPreviewFile] = useState({
    open: false,
    filename: "",
    filepath: "",
  });
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailModal, setEmailModal] = useState({
    visible: false,
    to: "",
    parent_id: "",
    parent_name: "",
    parent_type: "",
  });
  const { emailCreateViewLoading } = useSelector((state) => state.emails);
  const [tabValue, setTabValue] = useState(0);
  const [tabPage, setTabPage] = useState({});
  const [currentModule, setCurrentModule] = useState("");
  const debouncedInputValue = useDebounce(queryString, 500);
  let tabIndex = 0;
  let panelIndex = 0;
  const templateMeta = pathOr(
    [],
    ["globalSearch", "data"],
    globalSearchTabData,
  );
  const { actions } = useComposeViewData((state) => ({
    emailLoading: state.emailLoading,
    actions: state.actions,
  }));

  useEffect(() => {
    if (
      queryResult &&
      currentModule &&
      tabPage &&
      tabPage[currentModule] &&
      tabPage[currentModule].page > 1
    ) {
      let newData = clone(queryResult);
      if (!newData[currentModule]) {
        newData = {
          ...newData,
          [currentModule]: {
            ...newData[currentModule],
            data: newData[currentModule].data
              ? newData[currentModule].data
              : [],
          },
        };
        newData[currentModule].data = newData[currentModule].data.concat(
          templateMeta[currentModule].data,
        );
      }

      setQueryResult(newData);
      setCurrentModule(currentModule);
    }
  }, [templateMeta, tabPage, currentModule]);

  const fetchMoreData = (module, type = "next") => {
    setTimeout(() => {
      let pageMeta = clone(tabPage);
      let offset = 0;
      if (type === "next") {
        if (
          queryResult[module].pagination_data["total-pages"] ===
          tabPage[module].page
        ) {
          pageMeta[module]["noRecord"] = true;
          setTabPage(pageMeta);
          return;
        }
        offset =
          queryResult[module].pagination_data &&
          queryResult[module].pagination_data["total-pages"] &&
          queryResult[module].pagination_data["total-pages"] >
            tabPage[module].page
            ? tabPage[module].page + 1
            : tabPage[module].page;
      }
      if (type === "previous") {
        offset =
          queryResult[module].pagination_data &&
          queryResult[module].pagination_data["total-pages"] &&
          queryResult[module].pagination_data["total-pages"] >
            tabPage[module].page
            ? tabPage[module].page - 1
            : tabPage[module].page;
      }

      let oldData = clone(queryResult);
      dispatch(getGlobalSearch(queryString, offset, module, config)).then(
        (res) => {
          if (res.data) {
            let result = pathOr([], ["data", "data", "templateMeta"], res);

            if (result && Object.keys(result).length > 0) {
              Object.keys(result).forEach((item, index) => {
                if (result[item].data && result[item].data.length > 0) {
                  if (pageMeta[item]) {
                    pageMeta[item]["page"] = offset;
                    pageMeta[item]["noRecord"] = false;
                    pageMeta[item]["module"] = item;
                    oldData[item].data = oldData[item].data.concat(
                      result[item].data,
                    );
                  } else {
                    pageMeta[item] = {
                      page: offset,
                      module: item,
                      noRecord: false,
                    };
                    result[item].pagination_data["total-pages"] = Math.round(
                      parseInt(result[item].pagination_data["total-records"]) /
                        50,
                    );
                    oldData[item] = result[item];
                  }
                  setCurrentModule(item);
                } else {
                  pageMeta[item]["noRecord"] = true;
                }
              });
              if (config.defaultSearchEngine === "ElasticSearchEngine") {
                oldData = clone(result);
              }
              res.data.data.templateMeta = clone(oldData);
              dispatch(getGlobalSearchSuccess(res.data));
              setQueryResult(oldData);
            } else {
              pageMeta[module]["noRecord"] = true;
            }
            setTabPage(pageMeta);
          }
        },
      );
    }, 500);
  };

  const handleClearSearch = () => {
    setQueryResult([]);
    setTabPage({});
    setQueryString("");
    dispatch(getGlobalSearchSuccess([]));
  };

  const handleChangeTab = (event, newValue) => {
    let pageMeta = clone(tabPage);
    pageMeta[event.target.name] = {
      page: pathOr(1, [event.target.name, "page"], pageMeta),
      module: event.target.name,
    };
    setTabPage(pageMeta);
    setTabValue(newValue);
    setCurrentModule(event.target.name);
  };
  const handleChange = (e) => {
    setQueryString(e.target.value);
  };
  const handleSubmit = async (str) => {
    setQueryResult([]);
    setNorRecordFlag(false);
    await dispatch(getGlobalSearch(str, 0, "", config)).then((res) => {
      if (res && res.ok && res.data) {
        let result = pathOr([], ["data", "data", "templateMeta"], res);
        if (result && Object.keys(result).length > 0) {
          let pageMeta = {};
          Object.keys(result).forEach((item, index) => {
            if (result[item].data && result[item].data.length > 0) {
              pageMeta[item] = { page: 0, module: item, noRecord: false };
              if (index === 0) {
                setCurrentModule(item);
              }
              if (!result[item].pagination_data["total-pages"]) {
                result[item].pagination_data["total-pages"] = Math.round(
                  parseInt(result[item].pagination_data["total-records"]) / 50,
                );
              }
            }
          });
          setQueryResult(result);
          setTabPage(pageMeta);
        } else {
          setNorRecordFlag(true);
        }
      }
    });
  };

  const handleEmailPopup = (data) => {
    setEmailModal(data);
    setEmailModalVisible(true);
    actions.handleOpenEmailCompose(
      {
        moduleName: emailModal.parent_type || "",
        recordId: emailModal.parent_id || "",
      },
      {
        to_addrs_names: emailModal && emailModal.to ? [emailModal.to] : [],
        parent_name: {
          parent_name: emailModal.parent_name || "",
          parent_id: emailModal.parent_id || "",
          parent_type: emailModal.parent_type || "",
        },
      },
      data?.type,
    );
  };
  const handleShowPreviewFile = (fname, url) => {
    let arr = fname.split(".");
    let ext = arr[arr.length - 1].toUpperCase();
    setPreviewFile({
      open: true,
      filename: fname,
      filepath: url,
      filetype: ext,
    });
  };

  const handlePagination = (type) => {
    let arr = Object.keys(queryResult);
    let module = pathOr("", [0], arr);
    fetchMoreData(module, type);
  };
  useEffect(() => {
    setQueryResult(queryResult);
  }, [queryResult]);
  useEffect(() => {
    setTabPage(tabPage);
  }, [tabPage]);
  useEffect(() => {
    setTabValue(tabValue);
  }, [tabValue]);
  useEffect(() => {
    setTabPage(tabPage);
  }, [tabPage]);
  useEffect(() => {
    setCurrentModule(currentModule);
  }, [currentModule]);
  useEffect(() => {
    if (debouncedInputValue && debouncedInputValue.length > 2) {
      handleSubmit(debouncedInputValue);
    } else {
      dispatch(getGlobalSearchSuccess([]));
      setQueryResult([]);
      setTabPage({});
    }
  }, [debouncedInputValue]);

  return (
    <>
      <DrawerHeader title={LBL_GLOBAL_SEARCH_TITLE} />
      <MuiThemeProvider theme={getMuiTheme(theme)}>
        <Grid className={classes.searchFieldDiv}>
          <FormControl fullWidth>
            <Input
              className={classes.searchField}
              id="Global-search"
              type="text"
              disabled={false}
              placeholder={LBL_GLOBAL_SEARCH_TEXT_PLACEHOLDER}
              name="globalSearch"
              onChange={(e) => handleChange(e)}
              value={queryString}
              endAdornment={
                <InputAdornment position="start">
                  <IconButton
                    className={classes.drawerHeaderClose}
                    size="small"
                    onClick={() => handleSubmit(queryString)}
                  >
                    <SearchIcon />
                  </IconButton>
                  {queryString ? (
                    <IconButton
                      className={classes.drawerHeaderClose}
                      size="small"
                      onClick={handleClearSearch}
                    >
                      <CloseIcon />
                    </IconButton>
                  ) : (
                    ""
                  )}
                </InputAdornment>
              }
              autoComplete="off"
            />
          </FormControl>
        </Grid>
        <Divider />
        {globalSearchLoading ? (
          <Skeleton layout={"Studio"} />
        ) : isEmpty(queryString) ? (
          <NoRecord type="warning" title={LBL_SEARCH_BUTTON_LABEL} />
        ) : Object.keys(queryResult).length <= 0 ? (
          <NoRecord type="warning" title={LBL_NO_RECORD} />
        ) : null}

        {!isEmpty(queryString) &&
        queryResult &&
        Object.keys(queryResult).length > 0 ? (
          <div>
            <AppBar
              position="static"
              style={{ backgroundColor: "transparent" }}
            >
              {config.defaultSearchEngine === "ElasticSearchEngine" ? (
                <>
                  {Object.keys(tabPage) &&
                  Object.keys(tabPage)[0] &&
                  tabPage[Object.keys(tabPage)[0]] ? (
                    <ButtonGroup
                      variant="text"
                      color="primary"
                      size="small"
                      aria-label="small outlined button group"
                    >
                      <Button
                        disabled={tabPage[Object.keys(tabPage)[0]].page === 0}
                        onClick={() => handlePagination("previous")}
                      >
                        <NavigateBeforeIcon /> Previous
                      </Button>
                      <Button disabled={true}>
                        {`${tabPage[Object.keys(tabPage)[0]].page + 1} of 
                        ${
                          queryResult[Object.keys(queryResult)[0]]
                            .pagination_data["total-pages"]
                        }`}
                      </Button>
                      <Button
                        disabled={
                          tabPage[Object.keys(tabPage)[0]].page + 1 >=
                          queryResult[Object.keys(queryResult)[0]]
                            .pagination_data["total-pages"]
                        }
                        onClick={() => handlePagination("next")}
                      >
                        Next <NavigateNextIcon />
                      </Button>
                    </ButtonGroup>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}

              <Tabs
                value={tabValue}
                onChange={handleChangeTab}
                variant="scrollable"
                indicatorColor="primary"
                textColor="primary"
                aria-label="icon tabs example"
                scrollButtons="auto"
              >
                {Object.keys(queryResult).map((module, tabKey) => {
                  let newTabIndex = tabIndex;
                  if (
                    queryResult[module].data &&
                    queryResult[module].data.length > 0
                  ) {
                    tabIndex++;
                  }
                  return queryResult[module].data &&
                    queryResult[module].data.length > 0 ? (
                    <Tooltip title={module} key={"tooltip" + newTabIndex}>
                      <Tab
                        key={newTabIndex}
                        icon={
                          config.defaultSearchEngine !=
                          "ElasticSearchEngine" ? (
                            <Badge
                              badgeContent={pathOr(
                                "",
                                [module, "pagination_data", "total-records"],
                                queryResult,
                              )}
                              color="primary"
                            >
                              <IconButton
                                size="small"
                                aria-label={module}
                                component="span"
                              >
                                <FaIcon
                                  icon={`fas ${pathOr(
                                    "fas fa-cube",
                                    ["attributes", module, "icon", "icon"],
                                    sidebarLinks,
                                  )}`}
                                  size="1x"
                                />
                              </IconButton>
                            </Badge>
                          ) : (
                            <IconButton
                              size="small"
                              aria-label={module}
                              component="span"
                            >
                              <FaIcon
                                icon={`fas ${pathOr(
                                  "fas fa-cube",
                                  ["attributes", module, "icon", "icon"],
                                  sidebarLinks,
                                )}`}
                                size="1x"
                              />
                            </IconButton>
                          )
                        }
                        aria-label="module"
                        {...a11yProps(newTabIndex, module)}
                      />
                    </Tooltip>
                  ) : (
                    ""
                  );
                })}
              </Tabs>
            </AppBar>
            <Scrollbars
              autoHide={true}
              style={{
                height:
                  config.defaultSearchEngine !== "ElasticSearchEngine"
                    ? "65vh"
                    : "75vh",
              }}
              id="scrollableDiv"
              className={classes.tabPanel}
            >
              {Object.keys(queryResult).map((moduleName, tabPanelKey) => {
                let newPanelIndex = panelIndex;
                if (
                  queryResult[moduleName].data &&
                  queryResult[moduleName].data.length > 0
                ) {
                  panelIndex++;
                }

                return queryResult[moduleName].data &&
                  queryResult[moduleName].data.length > 0 ? (
                  <TabPanel
                    module={moduleName}
                    value={tabValue}
                    index={newPanelIndex}
                    key={newPanelIndex}
                  >
                    {config.defaultSearchEngine !== "ElasticSearchEngine" ? (
                      <InfiniteScroll
                        dataLength={queryResult[moduleName].data.length}
                        next={() => fetchMoreData(moduleName, "next")}
                        hasMore={
                          tabPage[moduleName] && !tabPage[moduleName].noRecord
                        }
                        loader={
                          <Typography style={{ textAlign: "center" }}>
                            Loading...
                          </Typography>
                        }
                        scrollableTarget="scrollableDiv"
                        height={650}
                      >
                        {queryResult &&
                        queryResult[moduleName].data &&
                        queryResult[moduleName].data.length > 0 ? (
                          queryResult[moduleName].data.map(
                            (record, recordkey) => (
                              <RecordItem
                                key={"record-" + recordkey}
                                datalabels={queryResult[moduleName].datalabels}
                                id={record.id}
                                data={record.attributes}
                                module={moduleName}
                                color={pathOr(
                                  "#ccc",
                                  ["attributes", moduleName, "icon", "bgcolor"],
                                  sidebarLinks,
                                )}
                                icon={
                                  <FaIcon
                                    icon={`fas ${pathOr(
                                      "fas fa-cube",
                                      [
                                        "attributes",
                                        moduleName,
                                        "icon",
                                        "icon",
                                      ],
                                      sidebarLinks,
                                    )}`}
                                    size="1x"
                                  />
                                }
                                setEmailModal={(data) => handleEmailPopup(data)}
                                handleShowPreviewFile={(name, url) =>
                                  handleShowPreviewFile(name, url)
                                }
                                onCloseRightSideBar={onCloseRightSideBar}
                              />
                            ),
                          )
                        ) : (
                          <NoRecord />
                        )}
                      </InfiniteScroll>
                    ) : (
                      ""
                    )}
                    {config.defaultSearchEngine === "ElasticSearchEngine" ? (
                      queryResult &&
                      queryResult[moduleName].data &&
                      queryResult[moduleName].data.length > 0 ? (
                        queryResult[moduleName].data.map(
                          (record, recordkey) => (
                            <RecordItem
                              key={"record-" + recordkey}
                              datalabels={queryResult[moduleName].datalabels}
                              id={record.id}
                              data={record.attributes}
                              module={moduleName}
                              color={pathOr(
                                "#ccc",
                                ["attributes", moduleName, "icon", "bgcolor"],
                                sidebarLinks,
                              )}
                              icon={
                                <FaIcon
                                  icon={`fas ${pathOr(
                                    "fas fa-cube",
                                    ["attributes", moduleName, "icon", "icon"],
                                    sidebarLinks,
                                  )}`}
                                  size="1x"
                                />
                              }
                              setEmailModal={(data) => handleEmailPopup(data)}
                              handleShowPreviewFile={(name, url) =>
                                handleShowPreviewFile(name, url)
                              }
                              onCloseRightSideBar={onCloseRightSideBar}
                            />
                          ),
                        )
                      ) : (
                        <NoRecord />
                      )
                    ) : (
                      ""
                    )}
                  </TabPanel>
                ) : (
                  ""
                );
              })}
            </Scrollbars>
          </div>
        ) : (
          ""
        )}
        {emailModalVisible ? (
          <ComposeEmail
            handleClose={() => setEmailModalVisible(false)}
            open={emailModalVisible}
          />
        ) : null}
        {previewFile.open ? (
          <FileViewerComp
            previewFile={previewFile}
            setPreviewFile={setPreviewFile}
          />
        ) : (
          ""
        )}
      </MuiThemeProvider>
    </>
  );
}
