import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { getMuiTheme } from "./styles";
import { textEllipsis } from "../../../../common/utils";
import { MuiThemeProvider } from "@material-ui/core/styles";
// styles
import useStyles from "./styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import IconButton from "@material-ui/core/IconButton";
import { getNewsFeeds } from "../../../../store/actions/module.actions";
import Divider from "@material-ui/core/Divider";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Link from "@material-ui/core/Link";
import InfiniteScroll from "react-infinite-scroll-component";
import { Scrollbars } from "react-custom-scrollbars";
import { pathOr } from "ramda";
import Alert from "@material-ui/lab/Alert";
import SkeletonShell from "../../../Skeleton/index";
import { NoRecord } from "../GlobalSearch/components";
import {
  LBL_NO_MORE_NEWS,
  LBL_LOADING,
  LBL_NEWS_SEARCH_TEXT_PLACEHOLDER,
  LBL_SEARCH_BUTTON_LABEL,
  LBL_NO_RECORD,
  LBL_NEWS_FEED_TITLE,
  LBL_NO_MORE_RECORD,
} from "../../../../constant";
import DrawerHeader from "../DrawerHeader";

export default function NewsFeeds() {
  const classes = useStyles();
  const currentTheme = useTheme();
  const location = useLocation();
  let splitPathName = location.pathname.split("/");
  let isDetail = pathOr([], [2], splitPathName);
  const module = isDetail === "detailview" ? splitPathName[3] : null;
  const id = isDetail === "detailview" ? splitPathName[4] : null;

  const { detailViewTabData } = useSelector((state) => state.detail);
  let recordSearchName = "";
  let recordName = pathOr(
    [],
    ["data", "templateMeta", "data"],
    detailViewTabData[module],
  );

  if (recordName.length > 0) {
    let accountName = recordName[0].attributes[0].find(
      (data) => data.field_key === "account_name",
    );
    let recordInfo = pathOr(
      [],
      ["data", "templateMeta", "recordInfo"],
      detailViewTabData[module],
    );
    recordSearchName = ["Accounts", "Leads", "Contacts"].includes(module)
      ? recordInfo.record_name
      : module === "Opportunities"
        ? accountName.value
        : "";
  }
  const [searchText, setSearchText] = useState(recordSearchName || "");
  const [noRecordFlag, setNoRecordFlag] = useState(false);

  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [dataLength, setDataLength] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadingScroll, setLoadingScroll] = useState(false);
  const [start, setStart] = useState(0);

  const renderLoader = () => <SkeletonShell layout="Subpanel" />;

  const dispatch = useDispatch();
  const handleChange = (e) => {
    setSearchText(e);
  };

  const onNewsClear = () => {
    setSearchText("");
  };
  const onNewsSearch = () => {
    setStart(0);
    getData(0);
  };
  const fetchMoreData = () => {
    let newStart = start + rowsPerPage;
    setStart(newStart);
    getData(newStart);
  };

  const trackScrolling = (event) => {
    const target = event.target;

    const bottom =
      parseInt(target.scrollHeight) - Math.abs(parseInt(target.scrollTop)) ===
        parseInt(target.clientHeight) ||
      parseInt(target.scrollHeight) - Math.abs(parseInt(target.scrollTop)) ===
        parseInt(target.clientHeight) + 1;

    if (bottom && !loadingScroll) {
      setLoadingScroll(true);
      fetchMoreData();
    }
  };

  const getData = (startRange) => {
    if (!searchText.length || searchText.length < 2) return;
    try {
      setLoading(true);
      setNoRecordFlag(true);
      dispatch(getNewsFeeds(searchText, startRange, "India"))
        .then(function (res) {
          setError(pathOr("", ["data", "error"], res));
          let newData = pathOr([], ["data", "news_results"], res);
          if (newData.length > 0) {
            setDataLength(
              pathOr([], ["data", "search_information", "total_results"], res),
            );
            if (startRange) {
              setData(data.concat(newData));
            } else {
              setData(newData);
            }
            setLoading(false);
            setLoadingScroll(false);
          } else {
            setLoading(false);
            setNoRecordFlag(true);
            if (!startRange) {
              setData([]);
            } else {
              setError(LBL_NO_MORE_RECORD);
            }
          }
        })
        .catch((e) => {
          setLoading(false);
          setNoRecordFlag(true);
          setData([]);
        });
    } catch (ex) {
      setLoading(false);
      setNoRecordFlag(true);
      setLoadingScroll(false);
      setData([]);
    }
  };

  const showNews = () => {
    return (
      data &&
      data.map((news, index) => (
        <Card className={classes.cardRoot}>
          <CardActionArea>
            <CardContent>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="flex-end"
                spacing={0}
              >
                <Grid item xs={8}>
                  <Typography variant="overline" display="block" gutterBottom>
                    <Link
                      onClick={() => window.open(news.link, "_blank")}
                      title={news.title}
                    >
                      {textEllipsis(news.title, 50)}
                    </Link>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {textEllipsis(news.snippet, 100)}
                  </Typography>
                </Grid>
                <Grid item xs={4} className={classes.mediaBox}>
                  <CardMedia
                    className={classes.media}
                    component="img"
                    src={news.thumbnail || ""}
                    title={news.title}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      ))
    );
  };

  return (
    <>
      <DrawerHeader title={LBL_NEWS_FEED_TITLE} />
      <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
        <Grid className={classes.searchFieldDiv}>
          <FormControl fullWidth>
            <Input
              placeholder={LBL_NEWS_SEARCH_TEXT_PLACEHOLDER}
              id="standard-adornment-news-feed"
              type="text"
              value={searchText}
              onChange={(e) => handleChange(e.target.value)}
              className={classes.searchField}
              required
              onKeyDown={(e) => (e.code == "Enter" ? onNewsSearch() : null)}
              endAdornment={
                <InputAdornment position="start">
                  <IconButton
                    disabled={!searchText || searchText.length < 2}
                    className={classes.iconButton}
                    size="small"
                    onClick={onNewsSearch}
                  >
                    <SearchIcon />
                  </IconButton>
                  {searchText ? (
                    <IconButton
                      className={classes.iconButton}
                      size="small"
                      onClick={onNewsClear}
                    >
                      <CloseIcon />
                    </IconButton>
                  ) : (
                    ""
                  )}
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Divider />
        {!noRecordFlag && data && !Object.keys(data).length > 0 ? (
          <NoRecord type="warning" title={LBL_SEARCH_BUTTON_LABEL} />
        ) : (
          ""
        )}
        {noRecordFlag && !loading && !Object.keys(data).length > 0 ? (
          <NoRecord type="error" title={LBL_NO_RECORD} />
        ) : (
          ""
        )}
        <div className={classes.tabpanelBox}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-end"
            spacing={0}
          >
            <Grid item xs={12}>
              <Scrollbars
                style={{ height: "70vh" }}
                onScroll={trackScrolling}
                id="scrollableDivRight"
                autoHide={true}
              >
                <InfiniteScroll
                  dataLength={data.length < dataLength ? true : false}
                  hasMore={true}
                  loader={
                    <h4 style={{ textAlign: "center" }}>{LBL_LOADING}</h4>
                  }
                  scrollableTarget="scrollableDivRight"
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>{LBL_NO_MORE_NEWS}</b>
                    </p>
                  }
                >
                  {error != "" && error != LBL_NO_MORE_RECORD ? (
                    <Alert variant="outlined" severity="error">
                      {error}
                    </Alert>
                  ) : null}

                  {loading ? (
                    <p
                      style={{
                        textAlign: "center",
                        height: "100vh",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      {renderLoader()}
                    </p>
                  ) : (
                    showNews()
                  )}
                  {error == LBL_NO_MORE_RECORD ? (
                    <p style={{ color: "gray", textAlign:"center" }}>{LBL_NO_MORE_RECORD}</p>
                  ) : null}
                </InfiniteScroll>
              </Scrollbars>
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    </>
  );
}
