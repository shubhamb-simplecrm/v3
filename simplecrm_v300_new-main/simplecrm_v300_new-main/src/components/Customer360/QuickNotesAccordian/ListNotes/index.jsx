import React, { useEffect, useState} from "react";
import { c360ListNotes } from "../../../../store/actions/customer360.actions";
import {
  Typography,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Divider,
  ListItem,
  List,
  useTheme,
  ListItemSecondaryAction,
  IconButton,
  Box,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import useStyles, { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import InfiniteScroll from "react-infinite-scroll-component";
import { pathOr, clone } from "ramda";
import { Scrollbars } from "react-custom-scrollbars";
import { LBL_LOADING } from "../../../../constant";
import { ShowEventDetail } from "../../../Calendar/components";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { stringToColor } from "../../../../common/utils";
export default function ListNotes({
  recordData,
  newNote = [],
  setUpdateListView,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingScroll, setLoadingScroll] = useState(false);
  const [showDialogOpen, setShowDialogOpen] = useState({
    open: false,
    id: null,
    module: null,
    moduleLabel: null,
  });
  const fetchMoreNotes = async (isInit = false) => {
    if (!hasMore) return;
    let pageSize = 5;
    let pageNo = 1;
    let newData = [];
    if (!isInit) {
      pageNo = page + 1;
      newData = clone(data);
    }

    let res = await c360ListNotes(recordData, pageNo, pageSize);
    res = pathOr([], ["data", "templateMeta", "data"], res);
    if (res) {
      newData = newData.concat(res);
      setUpdateListView(true);
      setData(newData);
      if (!isInit) {
        setPage(pageNo);
        if (!res?.length || res?.length < 0) {
          setHasMore(false);
        }
      }
    }
  };
  const trackScrolling = (event) => {
    const target = event.target;
    const bottom =
      parseInt(target.scrollHeight) - Math.abs(parseInt(target.scrollTop)) ===
        parseInt(target.clientHeight) ||
      parseInt(target.scrollHeight) - Math.abs(parseInt(target.scrollTop)) ===
        parseInt(target.clientHeight) + 1;
    if (bottom) {
      setLoadingScroll(true);
      fetchMoreNotes();
    }
  };
  const showDetail = (newId, newModule, moduleLabel, data) => {
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
  useEffect(() => {
    if (!data) {
      fetchMoreNotes(true);
    }
  }, []);

  useEffect(() => {
    if (newNote) {
      fetchMoreNotes(true);
    }
  }, [newNote]);

  const avtarName = (str) => {
    let userName = pathOr("", ["attributes", "created_by_name"], str);
    if (userName) {
      userName = userName
        .split(" ")
        .map((n) => n[0])
        .join("");
    }
    return userName ? userName.toUpperCase() : <AccountCircleIcon />;
  };
  const avtarColor=(str)=>{
    let color = stringToColor(pathOr("", ["attributes", "created_by_name"], str));
    return color;
  }
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <List className={classes.root}>
        <Scrollbars
          style={{ height: "20vh" }}
          onScroll={trackScrolling}
          id="quickNoteList"
          autoHide={true}
        >
          <InfiniteScroll
            dataLength={data.length}
            next={fetchMoreNotes}
            loader={
              data.length < 0 ? (
                <h4 style={{ textAlign: "center" }}>{LBL_LOADING}</h4>
              ) : null
            }
            scrollableTarget="quickNoteList"
            hasMore={hasMore}
          >
            {data.map((note, key) => (
              <>
                <ListItem alignItems="flex-start" key={note?.id}>
                  <ListItemAvatar>
                    <Avatar alt={note?.attributes?.assigned_user_name || ""} style={{backgroundColor:`#${avtarColor(note)}`}}>
                      {avtarName(note)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography className={classes.subject}>
                          {note?.attributes?.name || ""}
                        </Typography>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <Box>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.noteDesc}
                            color="textPrimary"
                          >
                            {note?.attributes?.date_entered || ""}
                          </Typography>
                        </Box>
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="view"
                      onClick={() => {
                        showDetail(note.id, "Notes", "Notes", note);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            ))}
          </InfiniteScroll>
        </Scrollbars>
      </List>
      {showDialogOpen.open ? (
        <ShowEventDetail
          showDialogOpen={showDialogOpen}
          setShowDialogOpen={setShowDialogOpen}
          size="md"
          calenderView={true}
        />
      ) : null}
    </MuiThemeProvider>
  );
}
