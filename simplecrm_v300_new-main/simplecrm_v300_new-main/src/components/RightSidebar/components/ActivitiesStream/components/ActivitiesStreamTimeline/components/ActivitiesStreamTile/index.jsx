import React, { useState } from "react";
import useStyles from "./styles";
import { Tooltip, Paper, Typography, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ReplyIcon from "@material-ui/icons/Reply";
import {
  TimelineSeparator,
  TimelineItem,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@material-ui/lab";
import {
  LBL_ACTIVITIES_STREAM_DELETE_BUTTON,
  LBL_ACTIVITIES_STREAM_REPLY_BUTTON,
} from "../../../../../../../../constant";
import parse from "html-react-parser";
import { deleteActivityFeed } from "../../../../../../../../store/actions/module.actions";
import { toast } from "react-toastify";
import ActivitiesStreamChatReply from "../ActivitiesStreamChatReply";
import ActivitiesStreamComments from "../ActivitiesStreamComments";

export default function ActivitiesStreamTile({
  data,
  setData,
  activity,
  index,
}) {
  const classes = useStyles();
  const [enterComment, setEnterComment] = useState(null);
  const deleteReply = async (reply_id) => {
    try {
      const res = await deleteActivityFeed(reply_id, 1);
      let resultArr = [];
      data.map((e) => {
        if (e.id !== reply_id) {
          resultArr.push(e);
        }
      });
      setData(resultArr);
    } catch (e) {
      toast(e);
    }
  };

  const parseFeedString = (feedStr = "") => {
    const regex = /\[([^\[\]]*)\]/gs;
    let m;
    let output = feedStr;
    while ((m = regex.exec(feedStr)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      let strArr = m[1].split(":");
      let link = `<a class="${
        classes.link
      }"  href="${`/app/detailview/${strArr[0]}/${strArr[1]}`}">${
        strArr[2]
      }</a>`;
      output = output.replace(m[0], link);
    }
    return output ? parse(output): "";
  };

  return (
    <TimelineItem key={index} id={"timeline" + index}>
      <TimelineOppositeContent
        className={classes.timelineFlex}
      ></TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot></TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="subtitle2" className={classes.content}>
            {parseFeedString(activity.name)}
          </Typography>
          <Typography
            variant="caption"
            display="block"
            color="textSecondary"
            className={classes.activityTime}
          >
            {activity.ago}
          </Typography>
          {activity?.comment?.length > 0 && (
            <ActivitiesStreamComments
              ActivityComments={activity.comment ? activity.comment : []}
              parseFeedString={parseFeedString}
            />
          )}
          {activity.id === enterComment && (
            <ActivitiesStreamChatReply
              activity_id={activity.id}
              setData={setData}
              allActivity={data}
            />
          )}
          <Tooltip title={LBL_ACTIVITIES_STREAM_REPLY_BUTTON}>
            <IconButton
              aria-label="reply"
              className={classes.icon1}
              size="small"
              onClick={() => setEnterComment(activity.id)}
            >
              <ReplyIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title={LBL_ACTIVITIES_STREAM_DELETE_BUTTON}>
            <IconButton
              aria-label="delete"
              className={classes.icon}
              size="small"
              onClick={() => deleteReply(activity.id)}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Paper>
      </TimelineContent>
    </TimelineItem>
  );
}
