import React, { useCallback, useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, pathOr } from "ramda";
import useStyles, { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timelinePlugin from "@fullcalendar/timeline";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import DateRangeOutlinedIcon from "@material-ui/icons/DateRangeOutlined";
import ViewConfigIcon from "@material-ui/icons/ViewComfyOutlined";
import ViewWeekIcon from "@material-ui/icons/ViewWeekOutlined";
import ViewDayIcon from "@material-ui/icons/ViewDayOutlined";
import ViewAgendaIcon from "@material-ui/icons/ViewAgendaOutlined";
import { Card, CardContent, useTheme } from "@material-ui/core";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";
import { Skeleton, Error } from "../../components";
import { getCalendarListView } from "../../store/actions/calendar.actions";
import { Page, ShowEventDetail, Toolbar } from "./components";
import { textEllipsis } from "./../../common/utils";
import "./styles.css";
import {
  APP_CALENDAR_LOCALE,
  LBL_CALENDAR_VIEW_MONTH,
  LBL_CALENDAR_VIEW_WEEK,
  LBL_CALENDAR_VIEW_DAY,
  LBL_CALENDAR_VIEW_AGENDA,
  LBL_CALENDAR_VIEW_SHARED_MONTH,
  LBL_CALENDAR_VIEW_SHARED_WEEK,
  LBL_TODAY_OPEN_ITEM,
  LBL_PAST_OPEN_ITEM,
  LBL_FUTURE_OPEN_ITEM,
  LBL__COMPLETED_ITEM,
} from "../../constant";
import QuickCreate from "../QuickCreate";
import { toast } from "react-toastify";
import {
  LBL_NO_CREATE_ACCESS_CALENDER,
  LBL_NO_VIEW_ACCESS,
} from "../../constant/language/en_us";
import EventQuickCreateDialog from "./components/EventQuickCreateDialog";

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

const Calendar = () => {
  const module = "Calendar";
  const classes = useStyles();
  const currentTheme = useTheme();
  const [isMSSync, setIsMsSync] = useState(false);
  const dispatch = useDispatch();
  const {
    CalendarListViewLoading,
    CalendarListViewError,
    CalendarListViewTabData,
  } = useSelector((state) => state.calendar);
  const { userPreference } = useSelector((state) => state.config);
  const viewPrefType = pathOr(
    "week",
    ["attributes", "global", "v3CalendarType"],
    userPreference,
  );
  const calendarRef = useRef(null);
  const [data, setData] = useState([]);
  const prererenceCalendarType = pathOr(
    viewPrefType,
    ["data", "CalendarType"],
    CalendarListViewTabData[module],
  );
  const calenderData = pathOr(
    [],
    ["1", "attributes", "0", "0", "data", "0", "repeat"],
    data,
  );
  const recordAccess = pathOr(
    {},
    ["CalendarListViewTabData", module, "data", "ACLAccess"],
    useSelector((state) => state.calendar),
  );
  const EveryData = pathOr(
    [],
    ["1", "attributes", "0", "0", "data", "1", "end"],
    data,
  );
  const [viewOptions] = useState(
    window.innerWidth < 767
      ? []
      : [
          {
            label: LBL_CALENDAR_VIEW_MONTH,
            value: "dayGridMonth",
            icon: ViewConfigIcon,
            api: "month",
          },
          {
            label: LBL_CALENDAR_VIEW_WEEK,
            value: "timeGridWeek",
            icon: ViewWeekIcon,
            api: "agendaWeek",
          },
          {
            label: LBL_CALENDAR_VIEW_DAY,
            value: "timeGridDay",
            icon: ViewDayIcon,
            api: "agendaDay",
          },
          {
            label: LBL_CALENDAR_VIEW_AGENDA,
            value: "listWeek",
            icon: ViewAgendaIcon,
            api: "agendaWeek",
          },
          {
            label: LBL_CALENDAR_VIEW_SHARED_MONTH,
            value: "dayGridMonth", //'dayGridSharedMonth',
            icon: CalendarTodayOutlinedIcon,
            api: "sharedMonth",
          },
          {
            label: LBL_CALENDAR_VIEW_SHARED_WEEK,
            value: "timeGridWeek", //'timeGridSharedWeek',
            icon: DateRangeOutlinedIcon,
            api: "sharedWeek",
          },
        ],
  );
  let getCurrentView = viewOptions.find(
    (o) => o.api === prererenceCalendarType,
  );
  const [view, setView] = useState(getCurrentView ? getCurrentView.value : "");
  const [viewName, setViewName] = useState(
    getCurrentView ? getCurrentView.label : "",
  );
  const [date, setMainDate] = useState(new Date());
  const [calendarStartDate, setCalendarStartDate] = useState(new Date());
  const [calendarEndDate, setCalendarEndDate] = useState(new Date());
  const [isRecordCreated, setIsSubpanelUpdated] = useState(false);
  const [events, setEvents] = useState({});

  const { currentUserData } = useSelector((state) => state.config);
  const currentUser = pathOr([], ["data", "id"], currentUserData);
  let legendColor = pathOr(
    [],
    ["data", "legendColor"],
    CalendarListViewTabData[module],
  );
  const [userData, setUserData] = useState([currentUser]);
  const [defaultModule, setDefaultModule] = useState("Tasks");
  const size = useWindowSize();
  const [showDialogOpen, setShowDialogOpen] = useState({
    open: false,
    id: null,
    module: null,
  });
  const [openQuickCreateDialog, setOpenQuickCreateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [calendarViewType, setCalendarViewType] = useState(
    getCurrentView ? getCurrentView.api : "",
  );

  /* Added for agenda view color legend */
  if ("listWeek" === view) {
    legendColor = {
      [LBL_TODAY_OPEN_ITEM]: "#FFA500",
      [LBL_PAST_OPEN_ITEM]: "#d32f2f",
      [LBL_FUTURE_OPEN_ITEM]: currentTheme.palette.primary.main,
      [LBL__COMPLETED_ITEM]: "#3CD4A0",
    };
  }
  const formatDayNo = (no) => {
    return no < 10 ? "0" + no : no;
  };
  const handleSelectDefaultModule = () => {
    let modulesArr = [];
    if (recordAccess["Meetings"]?.edit) {
      modulesArr.push("Meetings");
    }
    if (recordAccess["Calls"]?.edit) {
      modulesArr.push("Calls");
    }
    if (recordAccess["Tasks"]?.edit) {
      modulesArr.push("Tasks");
    }
    if (!isEmpty(modulesArr)) {
      setDefaultModule(modulesArr[0]);
    }
  };
  const getCalenderViewData = useCallback(() => {
    let newDate = date;
    let month = formatDayNo(newDate.getMonth() + 1);
    let year = newDate.getFullYear();
    let firstDay = "";
    let lastDay = "";
    let calendarView = getCurrentView ? getCurrentView.api : "";
    let firstDate = "";
    let lastDate = "";
    switch (view) {
      case "timeGridDay":
        calendarView = "agendaDay";
        firstDay = new Date(newDate).getDate();
        lastDay = new Date(newDate).getDate();
        firstDate = year + "-" + month + "-" + formatDayNo(firstDay);
        lastDate = year + "-" + month + "-" + formatDayNo(lastDay);
        break;
      case "dayGridMonth":
        firstDay = new Date(
          newDate.getFullYear(),
          newDate.getMonth(),
          1,
        ).getDate();
        lastDay = new Date(
          newDate.getFullYear(),
          newDate.getMonth() + 1,
          0,
        ).getDate();
        calendarView = viewName === "Shared Month" ? "sharedMonth" : "month";
        firstDate = year + "-" + month + "-" + formatDayNo(firstDay);
        lastDate = year + "-" + month + "-" + formatDayNo(lastDay);
        break;
      default:
        calendarView = viewName === "Shared Week" ? "sharedWeek" : "agendaWeek";

        var first = new Date(
          newDate.getTime() - newDate.getDay() * 24 * 60 * 60 * 1000,
        );
        var last = new Date(
          newDate.getTime() + (6 - newDate.getDay()) * 24 * 60 * 60 * 1000,
        );
        firstDay = first.getDate();
        lastDay = last.getDate();
        let firstMonth = first.getMonth() + 1;
        let lastMonth = last.getMonth() + 1;
        firstDate =
          first.getFullYear() +
          "-" +
          formatDayNo(firstMonth) +
          "-" +
          formatDayNo(firstDay);
        lastDate =
          last.getFullYear() +
          "-" +
          formatDayNo(lastMonth) +
          "-" +
          formatDayNo(lastDay);

        break;
    }

    setCalendarViewType(calendarView);
    setCalendarStartDate(firstDate);
    setCalendarEndDate(lastDate);
    module &&
      dispatch(
        getCalendarListView(firstDate, lastDate, calendarView, userData),
      ).then((response) => {
        let [...rest] = [pathOr({}, ["data", "calendardata"], response)];
        if ("listWeek" === view) {
          /* Added for agenda view color scheme */
          rest[0].forEach((legendColor1, i) => {
            if (
              legendColor1.status === "Planned" ||
              legendColor1.status === "Not Started" ||
              legendColor1.status === "In Progress"
            ) {
              if (legendColor1.dayType === "today") {
                rest[0][i]["color"] = "#FFA500";
              } else if (legendColor1.dayType === "past") {
                rest[0][i]["color"] = "#d32f2f";
              } else if (legendColor1.dayType === "future") {
                rest[0][i]["color"] = currentTheme.palette.primary.main;
              }
            } else if (
              legendColor1.status === "Held" ||
              legendColor1.status === "Completed"
            ) {
              rest[0][i]["color"] = "#3CD4A0";
            }
          });
        }
        setIsMsSync(
          pathOr(false, ["data", "microsoft_calendar_sync "], response) == "1",
        );
        setEvents({ draft: [], events: rest[0] });
      });
  }, [dispatch, module, date, viewName, userData]);

  useEffect(() => {
    getCalenderViewData();
  }, [getCalenderViewData]);

  useEffect(() => {
    if (isRecordCreated) {
      getCalenderViewData();
      setIsSubpanelUpdated(false);
    }
  }, [isRecordCreated]);

  const handleEventClick = (info) => {
    const selected = events["events"].find(
      (event) => event.id === info.event.id,
    );

    setShowDialogOpen({
      open: true,
      id: selected.id,
      module: selected.module_name,
    });
  };
  const handleDateToday = () => {
    const calendarApi = calendarRef?.current?.getApi();

    calendarApi.today();
    setMainDate(calendarApi.getDate());
  };

  const handleViewChange = (view) => {
    const calendarApi = calendarRef?.current?.getApi();
    calendarApi?.changeView(view);
    setView(view);
  };

  const handleDatePrev = () => {
    const calendarApi = calendarRef?.current?.getApi();

    calendarApi?.prev();
    setMainDate(calendarApi.getDate());
  };

  const handleDateNext = () => {
    const calendarApi = calendarRef?.current?.getApi();

    calendarApi.next();
    setMainDate(calendarApi.getDate());
  };

  if (CalendarListViewError) {
    return <Error description={CalendarListViewError} />;
  }

  const handleDateClick = (info) => {
    let dd = info.date;
    let nd =
      dd.getFullYear() +
      "-" +
      ("0" + (dd.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + dd.getDate()).slice(-2) +
      " " +
      ("0" + dd.getHours()).slice(-2) +
      ":" +
      ("0" + dd.getMinutes()).slice(-2) +
      ":" +
      ("0" + dd.getSeconds()).slice(-2);
    var today = new Date();

    let todayCurrentTime =
      ("0" + today.getHours()).slice(-2) +
      ":" +
      ("0" + today.getMinutes()).slice(-2) +
      ":" +
      ("0" + today.getSeconds()).slice(-2);

    setSelectedDate(
      viewName === "month" || viewName === "Shared Month"
        ? info.dateStr.substring(0, 10) + " " + todayCurrentTime
        : nd,
    );
    const isHaveModulesAccess =
      recordAccess["Calls"]?.edit ||
      recordAccess["Meetings"]?.edit ||
      recordAccess["Tasks"]?.edit;
    if (isHaveModulesAccess) {
      setOpenQuickCreateDialog((v) => !v);
    } else {
      toast(LBL_NO_CREATE_ACCESS_CALENDER);
    }
  };
  const EventDetail = ({ event, el }) => {
    if (viewName !== "Agenda") {
      const content = (
        <div className="fc-content">
          <b>{event.extendedProps.start_time}</b>
          <span>{" " + textEllipsis(event.title, 25) + " "}</span>
          <br />
          <b>{event.extendedProps.assigned_user_name}</b>
        </div>
      );
      ReactDOM.render(content, el);
      return el;
    }
  };
  const handleCloseDialog = useCallback(() => {
    setOpenQuickCreateDialog(false);
  }, []);
  const handleOnRecordSuccess = useCallback(() => {
    setIsSubpanelUpdated(true);
    setOpenQuickCreateDialog(false);
  }, []);

  return (
    <Page className={classes.root} title="Calendar">
      <Toolbar
        data={data}
        EveryData={EveryData}
        calenderData={calenderData}
        date={date}
        onDateNext={handleDateNext}
        onDatePrev={handleDatePrev}
        onDateToday={handleDateToday}
        onViewChange={handleViewChange}
        calendarStartDate={calendarStartDate}
        calendarEndDate={calendarEndDate}
        view={view}
        viewName={viewName}
        setViewName={setViewName}
        setUserData={setUserData}
        currentUser={currentUser}
        userData={userData}
        setIsSubpanelUpdated={setIsSubpanelUpdated}
        legendColor={legendColor}
        CalendarListViewLoading={CalendarListViewLoading}
        viewOptions={viewOptions}
        getCalenderViewData={getCalenderViewData}
        isMSSync={isMSSync}
      />
      <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
        {CalendarListViewLoading ? (
          <Skeleton />
        ) : (
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <FullCalendar
                locale={APP_CALENDAR_LOCALE ? APP_CALENDAR_LOCALE : "en"}
                allDayMaintainDuration
                defaultDate={date}
                defaultView={window.innerWidth < 767 ? "listWeek" : view}
                droppable
                editable
                eventClick={handleEventClick}
                dateClick={(info) => handleDateClick(info)}
                eventResizableFromStart
                events={events}
                eventRender={EventDetail}
                header={false}
                height={size.height - 200 > 750 ? size.height - 200 : 550}
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                  timelinePlugin,
                ]}
                ref={calendarRef}
                rerenderDelay={10}
                selectable
                weekends
              />
            </CardContent>
          </Card>
        )}
      </MuiThemeProvider>
      {showDialogOpen.open ? (
        recordAccess[showDialogOpen.module]?.view ? (
          <ShowEventDetail
            showDialogOpen={showDialogOpen}
            view={view}
            setShowDialogOpen={setShowDialogOpen}
            setIsSubpanelUpdated={setIsSubpanelUpdated}
            calenderView={true}
            editRecordAccess={recordAccess[showDialogOpen.module]?.edit}
          />
        ) : (
          toast(LBL_NO_VIEW_ACCESS)
        )
      ) : null}
      {openQuickCreateDialog && (
        <EventQuickCreateDialog
          defaultModule={defaultModule}
          calendarSelectedDate={selectedDate}
          calendarViewType={calendarViewType}
          recordACLAccess={recordAccess}
          open={openQuickCreateDialog}
          onCloseDialog={handleCloseDialog}
          onRecordSuccess={handleOnRecordSuccess}
        />
      )}
    </Page>
  );
};

export default Calendar;
