import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  colors,
  Avatar,
  Checkbox,
  IconButton,
  ListItem,
  Tooltip,
  Typography,
} from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import OfflinePinIcon from "@material-ui/icons/OfflinePin";
import getInitials from "../../../../../../common/getInitials";
import { useHistory } from "react-router-dom";
import useStyles from "./styles";
import { getFirstAlphabet } from "@/common/utils";

const EmailItem = (props) => {
  const {
    email,
    id,
    crmEmailId,
    selected,
    onOpen,
    onToggle,
    className,
    handleMassAction,
    ...rest
  } = props;
  const history = useHistory();
  const classes = useStyles();

  const [favorited, setFavorited] = useState(email.flagged);

  const handleFavorite = () => {
    handleMassAction(favorited ? "unflagged" : "flagged", [email.uid]);
    setFavorited((favorited) => !favorited);
  };
  const getFromName = (name) => {
    name = name && name.length ? name : "A";
    let newName = name.indexOf("<");
    newName = name.substring(0, newName);
    return newName || name;
  };

  useEffect(() => {
    setFavorited(favorited);
  }, [favorited]);
  return (
    <ListItem
      {...rest}
      className={clsx(
        classes.root,
        {
          [classes.new]: email.status === "unread",
          [classes.selected]: selected,
        },
        className,
      )}
      divider
    >
      <Checkbox
        checked={selected}
        className={classes.checkbox}
        color="primary"
        onChange={onToggle}
      />
      <Tooltip title="Add to favs">
        <IconButton className={classes.favoriteButton} onClick={handleFavorite}>
          {favorited ? (
            <StarIcon
              className={clsx(classes.starIcon, classes.starFilledIcon)}
            />
          ) : (
            <StarBorderIcon className={classes.starIcon} />
          )}
        </IconButton>
      </Tooltip>
      <div
        className={classes.details}
        onClick={() => onOpen(id, email, crmEmailId)}
      >
        <Avatar className={classes.avatar} src={email.from_addr_name}>
          {getFirstAlphabet(email.from_addr_name)}
        </Avatar>
        <div className={classes.content}>
          <Typography className={classes.name}>
            {getFromName(email.from_addr_name)}
          </Typography>
          <Typography className={classes.subject}>{email.name}</Typography>

          <div className={classes.labels}>
            {email.is_imported ? (
              <OfflinePinIcon style={{ color: colors.green[500] }} />
            ) : (
              ""
            )}
          </div>
          <Typography className={classes.date} variant="body2">
            {email.date_sent_received}
          </Typography>
        </div>
      </div>
    </ListItem>
  );
};

EmailItem.propTypes = {
  className: PropTypes.string,
  email: PropTypes.object.isRequired,
  onOpen: PropTypes.func,
  onToggle: PropTypes.func,
  selected: PropTypes.bool.isRequired,
};

export default EmailItem;
