import { Tabs, Tab, CircularProgress, IconButton } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";

export const SidePanelHeader = ({
  tabValue,
  onTabChange,
  onTabRefresh,
  tabList,
  loading,
  module
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Tabs
        style={{ width: "90%" }}
        variant="scrollable"
        scrollButtons="auto"
        value={tabValue}
        onChange={onTabChange}
        aria-label="scrollable"
      >
        {Object.values(tabList)
          .reverse()
          .map((tab) => (
            <Tab label={tab.title} value={tab.module_name} />
          ))}
      </Tabs>
      <div
        style={{
          width: "10%",
          borderBottom: "1px solid #cccccc",
          padding: "8.3px 0px",
          marginRight: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "Pointer",
        }}
      >
        <IconButton size="small">
        <RefreshIcon
          style={{
            color: "#6E6E6E",
          }}
          onClick={()=> onTabRefresh(true)}
        />
        </IconButton>
      </div>
    </div>
  );
};
