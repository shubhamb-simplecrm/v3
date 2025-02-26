import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useStyles from "./styles";

import PropTypes from "prop-types";
import { makeStyles, styled, withStyles } from "@material-ui/core/styles";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  DialogTitle,
  Dialog,
  IconButton,
  CircularProgress,
} from "@material-ui/core";

import VisibilityIcon from "@material-ui/icons/Visibility";
import { toast } from "react-toastify";
import { pathOr } from "ramda";

import { getPDFTemplates } from "../../../../../store/actions/module.actions";
import CustomDialog from "@/components/SharedComponents/CustomDialog";
import GetApp from "@material-ui/icons/GetApp";
import { Skeleton } from "@/components";
import { Email } from "@material-ui/icons";
const StyledList = styled(List)(({ theme }) => ({
  width: "100%",
  // maxWidth: 360,
  // backgroundColor: theme.palette.background.paper,
}));
const ListItemWithWiderSecondaryAction = withStyles({
  secondaryAction: {
    paddingRight: 96,
  },
})(ListItem);

export default function AcitonPopup({
  actionName,
  module,
  selectedValue,
  setSelectedValue,
  actionPopupOpen,
  setActionPopupOpen,
  emailLoading,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const getListViewData = useCallback(() => {
    setLoading(true);
    dispatch(getPDFTemplates("AOS_PDF_Templates", module)).then(function (res) {
      setData(pathOr([], ["data", "templateMeta", "data"], res));
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    getListViewData();
  }, [getListViewData]);

  const handleClose = () => {
    setActionPopupOpen(false);
  };

  const handleListItemClick = (value) => {
    setSelectedValue(value);
    // setLoading(true);
  };
  const redirectOnPreview = (module, id) => {
    history.push("/app/detailview/" + module + "/" + id);
  };
  return (
    <CustomDialog
      isDialogOpen={actionPopupOpen}
      handleCloseDialog={handleClose}
      isLoading={loading}
      bodyContent={
        loading ? (
          <Skeleton layout={"EditView"} />
        ) : (
          <StyledList>
            {!!data &&
              data.map((row) => (
                <ListItemWithWiderSecondaryAction key={row.id}>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <PictureAsPdfIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={row.attributes.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="Preview"
                      onClick={() => handleListItemClick(row.id)}
                    >
                      {actionName == "LBL_EMAIL_QUOTE" ||
                      actionName == "LBL_EMAIL_PDF" ? (
                        emailLoading && selectedValue == row.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Email />
                        )
                      ) : (
                        <GetApp />
                      )}
                    </IconButton>
                    {data?.[0]?.type == "AOS_PDF_Templates" ? null : (
                      <a
                        target="_blank"
                        href={"/app/detailview/AOS_PDF_Templates/" + row.id}
                      >
                        <IconButton edge="end" aria-label="Preview">
                          <VisibilityIcon />
                        </IconButton>
                      </a>
                    )}
                  </ListItemSecondaryAction>
                </ListItemWithWiderSecondaryAction>
              ))}
          </StyledList>
        )
      }
      title={"Please Select a Template"}
      maxWidth={"xs"}
    />
  );
}

AcitonPopup.propTypes = {
  actionPopupOpen: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};
