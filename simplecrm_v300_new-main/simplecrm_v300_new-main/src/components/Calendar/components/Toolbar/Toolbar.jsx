import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import useStyles from "./styles";
import {
  Grid,
  Hidden,
  Typography,
  Tooltip,
  ButtonGroup,
  Button,
} from "@material-ui/core";
import FormInput from "../../../FormInput";
import SelectAllIcon from "@material-ui/icons/SelectAll";
import {
  CALENDER_BUTTON_GROUP,
  LBL_SELECT_BUTTON_LABEL,
  THIS_WEEK,
} from "../../../../constant";
import dayjs from "dayjs";
import { LoginSocialMicrosoft } from "./MicrosoftLoginButton";
import useCommonUtils from "@/hooks/useCommonUtils";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import { setMicrosoft365Token } from "@/store/actions/module.actions";
const Toolbar = (props) => {
  const {
    date,
    calendarStartDate,
    calendarEndDate,
    view,
    viewName,
    setViewName,
    onDatePrev,
    onDateNext,
    onEventAdd,
    onViewChange,
    onDateToday,
    className,
    setUserData,
    currentUser,
    userData,
    setIsSubpanelUpdated,
    legendColor,
    CalendarListViewLoading,
    viewOptions,
    getCalenderViewData,
    isMSSync,
    ...rest
  } = props;
  const { microsoft365Configuration } = useCommonUtils();
  const classes = useStyles();
  const [seletedButton, setSeletedButton] = useState("");
  let relateField = {
    comment: null,
    field_key: "relatedRecords",
    label: "Users",
    massupdate: "false",
    name: "relatedRecords",
    required: "false",
    type: "relate",
    module: "Users",
  };

  const onCalenderButtonClick = (displayName) => {
    setSeletedButton(displayName);
    if (!!displayName && displayName === CALENDER_BUTTON_GROUP[0]) {
      onDatePrev();
    } else if (!!displayName && displayName === CALENDER_BUTTON_GROUP[1]) {
      onDateToday();
    } else if (!!displayName && displayName === CALENDER_BUTTON_GROUP[2]) {
      onDateNext();
    }
  };

  const handleChangeView = (viewOption) => {
    if (
      viewOption.label !== "Shared Month" &&
      viewOption.label !== "Shared Week"
    ) {
      setUserData(currentUser);
    }
    onViewChange(viewOption.value);
    setViewName(viewOption.label);
  };

  const handleChangeLengend = (legendColorIndex) => {};

  const handleChange = (field, val) => {
    let innerData = [];
    if (val?.idsArr.length) {
      val.idsArr.map((id) => innerData.push(id));
    }
    setUserData(innerData);
  };

  const showCalendarDate = () => {
    switch (view) {
      case "timeGridDay":
        return dayjs(new Date(date)).format("DD MMMM YYYY");
      default:
        return (
          dayjs(new Date(calendarStartDate)).format("DD MMMM YYYY") +
          " - " +
          dayjs(new Date(calendarEndDate)).format("DD MMMM YYYY")
        );
    }
  };
  const handleMicrosoftTokenStore = (data) => {
    const payload = {
      // access_token: data?.access_token,
      refresh_token: data?.refresh_token,
      expires_in: data?.expires_in,
      client_info: data?.client_info,
      code: data?.code,
    };
    setMicrosoft365Token(payload).then((res) => {
      getCalenderViewData();
    });
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Grid alignItems="center" container justify="space-between" spacing={1}>
        <Grid item style={{ padding: "0px 12px" }}>
          <ButtonGroup color="primary" variant="outlined">
            {CALENDER_BUTTON_GROUP.map((item) => {
              return (
                <Button
                  onClick={() => onCalenderButtonClick(item)}
                  className={`${
                    !!seletedButton && seletedButton === item
                      ? classes.selectedButtonCss
                      : ""
                  } ${classes.buttonGroupCss}`}
                >
                  {!!item &&
                  item === CALENDER_BUTTON_GROUP[1] &&
                  window.innerWidth < 788
                    ? THIS_WEEK
                    : item}
                </Button>
              );
            })}
          </ButtonGroup>
        </Grid>
        <Hidden>
          <Grid item>
            <Typography variant="h5" class={classes.dateFontMobileLayout}>
              {showCalendarDate()}
            </Typography>
          </Grid>
          <Grid item>
            <ButtonGroup>
              {viewOptions.map((viewOption) => {
                const Icon = viewOption.icon;

                return (
                  <Tooltip key={viewOption.value} title={viewOption.label}>
                    <Button
                      color={
                        viewOption.label === viewName ? "secondary" : "primary"
                      }
                      onClick={() => handleChangeView(viewOption)}
                    >
                      {Icon ? <Icon /> : viewOption.label}
                    </Button>
                  </Tooltip>
                );
              })}
              <Tooltip title={"Microsoft 365 Calendar Sync"}>
                <Button disabled={isMSSync}>
                  <LoginSocialMicrosoft
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    client_id={microsoft365Configuration?.clientID}
                    redirect_uri={microsoft365Configuration?.redirectURL}
                    onResolve={({ _provider, data }) => {
                      handleMicrosoftTokenStore(data);
                    }}
                    onReject={(err) => {
                      console.log(err);
                    }}
                    isOnlyGetCode={true}
                    // isOnlyGetToken={true}
                  >
                    <EventAvailableIcon />
                  </LoginSocialMicrosoft>
                </Button>
              </Tooltip>
              {viewName === "Shared Month" || viewName === "Shared Week" ? (
                <>
                  <FormInput
                    variant="outlined"
                    className={classes.textArea}
                    field={relateField}
                    color="primary"
                    initialValues={{ relatedRecords: [] }}
                    value=""
                    multiSelect="true"
                    isIconBtn="true"
                    isSelectBtn="true"
                    isIconBtnLabel={`${LBL_SELECT_BUTTON_LABEL} User`}
                    reportsTo={currentUser}
                    view={"calendar"}
                    userData={[...new Set(userData)]}
                    btnIcon={<SelectAllIcon />}
                    onChange={(val) => handleChange("relatedRecords", val)}
                  />
                </>
              ) : null}
            </ButtonGroup>
          </Grid>
        </Hidden>
      </Grid>
      <Grid
        alignItems="center"
        container
        justifyContent="space-between"
        spacing={1}
      >
        <Grid item></Grid>
        {
          <Hidden smDown>
            <Grid
              item
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                paddingTop: "0px",
                paddingBottom: "0px",
              }}
            >
              {!CalendarListViewLoading &&
                legendColor &&
                Object.keys(legendColor).map((legendColor1, i) => {
                  return (
                    <Grid
                      item
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Typography className={classes.recordGroup}>
                        {legendColor1}
                      </Typography>
                      <Button
                        onClick={() => handleChangeLengend(i)}
                        style={{
                          background: legendColor[legendColor1],
                          width: "10px",
                          height: "10px",
                          minWidth: "10px",
                          margin: "3px 15px 0px 8px",
                        }}
                      ></Button>
                    </Grid>
                  );
                })}
            </Grid>
          </Hidden>
        }
      </Grid>
    </div>
  );
};

Toolbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  date: PropTypes.any.isRequired,
  onDateNext: PropTypes.func,
  onDatePrev: PropTypes.func,
  onDateToday: PropTypes.func,
  onEventAdd: PropTypes.func,
  onViewChange: PropTypes.func,
  view: PropTypes.string.isRequired,
  legendColor: PropTypes.array,
  CalendarListViewLoading: PropTypes.string,
};

export default Toolbar;
