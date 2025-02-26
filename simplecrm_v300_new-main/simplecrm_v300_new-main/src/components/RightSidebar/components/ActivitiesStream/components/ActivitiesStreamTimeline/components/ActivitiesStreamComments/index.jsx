import React, { useEffect, useState } from "react";
import useStyles from "./styles";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Grid,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { toast } from "react-toastify";
import { deleteActivityFeed } from "../../../../../../../../store/actions/module.actions";

export default function ActivitiesStreamComments({ ActivityComments = [], parseFeedString }) {
  const classes = useStyles();
  const [data, setData] = useState(ActivityComments);
  let comments = [];
  data.map((e) =>
    comments.push({
      user: {
        name: e.comment_by,
      },
      comment: e.comment,
      time: e.ago,
      comment_id: e.id,
    }),
  );

  useEffect(() => {
    setData(ActivityComments);
  }, [ActivityComments]);

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

  return (
    <List className={classes.root}>
      {comments &&
        comments.map((comment, i) => (
          <>
            <ListItem
              alignItems="flex"
              className={i % 2 === 0 ? classes.tile1 : classes.tile2}
            >
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item className={classes.username}>
                        {parseFeedString(comment?.user?.name)}
                      </Grid>
                      <Grid item className={classes.commentTime}>
                        {parseFeedString(`${comment?.time}`)}
                      </Grid>
                    </Grid>
                    <Grid className={classes.comment}>
                      {parseFeedString(`${comment?.comment}`)}
                    </Grid>
                  </React.Fragment>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title={"Delete Comment"}>
                  <IconButton
                    aria-label="delete"
                    className={classes.deleteIcon}
                    size="small"
                    onClick={() => deleteReply(comment.comment_id)}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          </>
        ))}
    </List>
  );
}
