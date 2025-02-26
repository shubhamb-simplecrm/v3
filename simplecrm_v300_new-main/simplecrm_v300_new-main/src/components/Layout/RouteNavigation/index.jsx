import React, { Suspense, memo, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import { Skeleton } from "../..";
import AdminDropdownEditor from "@/components/AdminDropdownEditor";
import WrapRoute from "@/components/WrapRoute";
const Docs = lazy(() => import("@/pages/docs"));
const Calendar = lazy(() => import("../../Calendar"));
const Emails = lazy(() => import("../../../pages/emails"));
const Dashboard = lazy(() => import("../../../pages/dashboard"));
const Module = lazy(() => import("../../../pages/module"));
const Edit = lazy(() => import("../../../pages/edit"));
const Detail = lazy(() => import("../../../pages/detail"));
const Admin = lazy(() => import("../../../pages/admin"));
const Studio = React.lazy(() => import("../../../pages/studio"));
const PortalAdminListView = lazy(
  () => import("../../../pages/portaladminlistview"),
);
const PortalAdminEditView = lazy(
  () => import("../../../pages/portaladmineditview"),
);
function RouteNavigation() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Switch>
        <WrapRoute path="/app/docs" component={Docs} exact />
        <WrapRoute path="/app/Home" component={Dashboard} exact />
        <WrapRoute path="/app/administrator" component={Admin} exact />
        <WrapRoute
          path="/app/portalAdministrator"
          component={PortalAdminListView}
          exact
        />
        <WrapRoute
          path="/app/portalAdministrator/:section"
          component={PortalAdminListView}
          exact
        />
        <WrapRoute
          path="/app/portalAdministrator/:section/:module"
          component={PortalAdminListView}
          exact
        />
        <WrapRoute
          path="/app/portalAdministrator/:section"
          component={PortalAdminListView}
          exact
        />
        <WrapRoute
          path="/app/portalAdministrator/editview/:section/:module/:id"
          component={PortalAdminEditView}
          exact
        />
        <WrapRoute
          path="/app/dropdownEditor"
          component={AdminDropdownEditor}
          exact
        />
        <WrapRoute
          path="/app/dropdownEditor/:dropdown"
          component={AdminDropdownEditor}
          exact
        />
        <WrapRoute path="/app/studio" component={Studio} exact />
        <WrapRoute path="/app/studio/:module" component={Studio} exact />
        <WrapRoute
          path="/app/studio/:module/:manager"
          component={Studio}
          exact
        />
        <WrapRoute
          path="/app/studio/:module/:manager/:view"
          component={Studio}
          exact
        />
        <WrapRoute
          path="/app/studio/:module/:manager/:view/:action"
          component={Studio}
          exact
        />
        {/* <WrapRoute path="/app/Example/Demo" component={Demo} exact /> */}
        <WrapRoute path="/app/Calendar" component={Calendar} exact />
        <WrapRoute path="/app/Emails" component={Emails} exact />
        <WrapRoute path="/app/:module" component={Module} exact />

        {/* <WrapRoute path="/app/:module/:view/:returnModule/:returnRecord" component={Module} exact /> */}
        <WrapRoute path="/app/createview/:module" component={Edit} exact />
        <WrapRoute
          path="/app/createrelateview/:module/:returnModule/:returnRecord"
          component={Edit}
          exact
        />
        <WrapRoute
          path="/app/createrelateview/:module/:returnModule/:returnRecord/:relateBeanData"
          component={Edit}
          exact
        />
        <WrapRoute
          path="/app/duplicateview/:module/:id"
          component={Edit}
          exact
        />
        <WrapRoute
          path="/app/convert/:module/:id/:returnModule"
          component={Edit}
          exact
        />
        <WrapRoute path="/app/editview/:module/:id" component={Edit} exact />
        <WrapRoute path="/app/convertlead/:module/:id" component={Edit} exact />

        <WrapRoute
          path="/app/detailview/:module/:id"
          component={Detail}
          exact
        />
        <WrapRoute
          path="/app/detailview/:module/:id/:msgno/:uid"
          component={Detail}
          exact
        />
      </Switch>
    </Suspense>
  );
}

export default memo(RouteNavigation);
