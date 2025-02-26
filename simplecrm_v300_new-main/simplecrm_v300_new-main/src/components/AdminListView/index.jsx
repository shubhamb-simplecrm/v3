import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Paper, Typography } from "@material-ui/core";
import { ErrorBoundary } from "..";
import { ListView } from "./components";

const AdminListView = () => {
  let isAdmin = useSelector(
    (state) => state?.config?.currentUserData?.data?.attributes?.is_admin,
  );

  return (
    <ErrorBoundary>
      <Paper style={{ height: "100vh" }}>
        {isAdmin ? (
          <ListView />
        ) : (
          <Typography component={"span"} variant="h2">
            You don't have permission to access this.
          </Typography>
        )}
      </Paper>
    </ErrorBoundary>
  );
};

export default AdminListView;
