import React from "react";
import {
  BrowserRouter,
  Route,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import routes from "./config/routes";

const App: React.FunctionComponent<{}> = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        {routes.map((route, index) => {
          return route.isPrivate ? (
            <PrivateRoute
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ) : (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              render={(props: RouteComponentProps<any>) => (
                <route.component {...props} {...route.props} />
              )}
            />
          );
        })}
      </Switch>
    </BrowserRouter>
  );
};

export default App;
