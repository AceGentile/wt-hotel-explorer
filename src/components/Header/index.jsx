import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, withRouter } from 'react-router-dom';

const Header = ({ location }) => {
  const showGetEstimates = /(^\/$)|^\/(hotels(\/.*)?)/.test(location.pathname);
  return (
    <div id="app-header">
      <nav className="navbar navbar-expand-lg navbar-light" id="navbar">
        <div className="container">
          <Link className="navbar-brand mr-2" to="/">Winding Tree</Link>
          <button className="border-0 navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-content" aria-controls="navbar-content" aria-expanded="false" aria-label="Toggle navigation">
            <i className="mdi mdi-24px mdi-menu" />
          </button>

          <div className="collapse navbar-collapse" id="navbar-content">
            <ul className="navbar-nav ml-auto" id="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link h5" exact to="/">Browse Hotels</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link h5" exact to="/search-on-map">Search on map</NavLink>
              </li>
            </ul>
            {showGetEstimates
            && (
            <div className="ml-lg-1">
              <button className="btn btn-block btn-primary" id="navbar-btn" type="button" data-toggle="collapse" data-target="#form-estimates" aria-expanded="false" aria-controls="form-estimates">
              Get Estimates!
              </button>
            </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

Header.propTypes = {
  location: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(Header);
