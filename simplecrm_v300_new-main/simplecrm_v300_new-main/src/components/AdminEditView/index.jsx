import React, { useCallback } from "react";
import { FieldConfigurator } from "./components";
import { useParams } from "react-router-dom/cjs/react-router-dom";

const AdminEditView = () => {
  const { section } = useParams();

  const showView = useCallback(() => {
    switch (section) {
      case "FieldConfigurator":
        return <FieldConfigurator />;
      default:
        return "Invalid Section!";
    }
  }, [section]);

  return showView();
};

export default AdminEditView;
