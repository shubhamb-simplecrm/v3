import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
// styles
import useStyles, { getMuiTheme } from "./styles";
import { pathOr } from "ramda";
import { Scrollbars } from "react-custom-scrollbars";
import {
  Grid,
  Link,
  Typography,
  ListItemText,
  ListItem,
  Card,
  useTheme,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
} from "@material-ui/core";
import { textEllipsis } from "../../../../common/utils";
import ShowEventDetail from "../../../../components/Calendar/components/ShowEventDetail";

export default function ProfileTile({ data, pid, pmodule }) {
  const classes = useStyles();
  const currentTheme = useTheme();
  const profileTitle = pathOr("", [Object.keys(data)[0]], data);
  const profileKey = Object.keys(data)[0];
  const [showDialogOpen, setShowDialogOpen] = useState({
    open: false,
    id: null,
    module: null,
  });
  const showDetail = (newId, newModule) => {
    setShowDialogOpen({ open: true, id: newId, module: newModule });
  };
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {profileTitle.charAt(0)}
            </Avatar>
          }
          title={
            <>
              <Link
                // href="javascript:void(0)"
                onClick={(e) => showDetail(pid, pmodule)}
                title={profileTitle}
              >
                {profileTitle}
              </Link>
              <IconButton
                className={classes.previewButton}
                aria-label="preview"
                size="small"
                onClick={(e) => showDetail(pid, pmodule)}
              >
                <VisibilityIcon />
              </IconButton>
            </>
          }
        />
        <CardContent>
          <Scrollbars autoHide={true} style={{ height: "33vh" }}>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  data &&
                  Object.keys(data).map((row, rowKey) =>
                    profileKey !== row ? (
                      <>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="left"
                        >
                          <Grid item xs={4}>
                            <Typography
                              variant="subtitle2"
                              className={classes.label}
                              gutterBottom
                            >
                              {row}
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                              title={data[row]}
                            >
                              : {data[row] && textEllipsis(data[row], 30)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    ) : null,
                  )
                }
              />
            </ListItem>
          </Scrollbars>
        </CardContent>
      </Card>
      {showDialogOpen.open ? (
        <ShowEventDetail
          showDialogOpen={showDialogOpen}
          setShowDialogOpen={setShowDialogOpen}
          size="sm"
        />
      ) : null}
    </MuiThemeProvider>
  );
}
