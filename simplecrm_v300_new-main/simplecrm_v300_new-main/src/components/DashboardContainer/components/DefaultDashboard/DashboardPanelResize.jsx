import { useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useDispatch } from "react-redux";
import "react-resizable/css/styles.css";
import "react-grid-layout/css/styles.css";
import useStyles from "./styles";
import { changedDashboardLayoutPositionAction } from "../../../../store/actions/dashboard.actions";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const DashboardPanelResize = ({
  dashboardLayoutObj = [],
  isDashboardLayoutEditable,
  gridLayoutProps,
  children,
}) => {
  const classes = useStyles();
  const compactType = "vertical";
  const dispatch = useDispatch();

  // Create a lookup map for quick access to data by id
  const dashboardLayoutObjById = useMemo(() => {
    return dashboardLayoutObj.reduce((acc, item) => {
      acc[item.i || item.id] = item.data || {};
      return acc;
    }, {});
  }, [dashboardLayoutObj]);
  const onLayoutChange = (layout) => {
    const updatedLayout = layout.map((item) => ({
      ...item,
      data: dashboardLayoutObjById[item.i] || {},
    }));
    dispatch(changedDashboardLayoutPositionAction(updatedLayout));
  };

  return (
    <ResponsiveReactGridLayout
      {...gridLayoutProps}
      className={classes.grid}
      layouts={{ lg: dashboardLayoutObj }}
      useCSSTransforms={true}
      compactType={compactType}
      preventCollision={compactType === null}
      onLayoutChange={onLayoutChange}
      isResizable={isDashboardLayoutEditable}
      isDraggable={isDashboardLayoutEditable}
    >
      {children}
    </ResponsiveReactGridLayout>
  );
};

DashboardPanelResize.defaultProps = {
  gridLayoutProps: {
    // cols: { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 },
    cols: { lg: 30, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 30,
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    containerPadding: [5, 5],
    measureBeforeMount: false,
    margin: [5, 5],
  },
};

export default DashboardPanelResize;
