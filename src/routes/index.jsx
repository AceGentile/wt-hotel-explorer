import React from 'react';
import Loadable from 'react-loadable';
import { hot } from 'react-hot-loader';
import {
  createStore, combineReducers, compose, applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import { Redirect } from 'react-router';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';

import reducers from '../reducers';
// Lazy loaded route with attributes is working in a weird way
import Hotel from './Hotel';
import ErrorPage from './ErrorPage';

import {
  Header, Footer, Disclaimer, Loader,
} from '../components';

// The following import path is interpreted by webpack
// eslint-disable-next-line import/no-unresolved
import createApp from './app.TARGET_ROUTER';

// Lazy loaded routes
const LoadableHome = Loadable({
  loader: () => import(
    /* webpackChunkName: "Home-page" */
    /* webpackMode: "lazy" */
    // eslint-disable-next-line comma-dangle
    './Home'
  ),
  loading() {
    return <Loader block={200} label="Loading..." />;
  },
});

const LoadableBookingWizard = Loadable({
  loader: () => import(
    /* webpackChunkName: "Booking-Wizard" */
    /* webpackMode: "lazy" */
    // eslint-disable-next-line comma-dangle
    './BookingWizard'
  ),
  loading() {
    return <Loader block={200} label="Loading..." />;
  },
});

const LoadableSearchOnMap = Loadable({
  loader: () => import(
    /* webpackChunkName: "Search-On-Map" */
    /* webpackMode: "lazy" */
    // eslint-disable-next-line comma-dangle
    './SearchOnMap'
  ),
  loading() {
    return <Loader block={200} label="Loading..." />;
  },
});

const Handle404 = () => <Redirect to="/error-page" />;

// Setup redux
const history = createBrowserHistory();
const routerMiddlewareInst = routerMiddleware(history);

const middleware = [thunk, routerMiddlewareInst];
const composeEnhancers = (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose; // eslint-disable-line
const store = (() => {
  const basicStore = createStore(
    combineReducers({
      router: connectRouter(history),
      ...reducers,
    }),
    composeEnhancers(applyMiddleware(...middleware)),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      // eslint-disable-next-line global-require
      const nextRootReducer = require('../reducers');
      basicStore.replaceReducer(nextRootReducer);
    });
  }

  return basicStore;
})();

// App itself
const AppContainer = () => {
  const routes = (
    <Switch>
      <Route exact path="/hotels/:hotelId" component={Hotel} />
      <Route exact path="/error-page" component={ErrorPage} />
      <Route exact path="/booking" component={LoadableBookingWizard} />
      <Route exact path="/search-on-map" component={LoadableSearchOnMap} />
      <Route exact path="/" component={LoadableHome} />
      <Route component={Handle404} />
    </Switch>
  );
  return (
    <React.Fragment>
      <Header />
      <div id="app-content" role="main">
        <div className="container">
          <Disclaimer />
          {routes}
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default hot(module)(createApp({ store, history, AppContainer }));
