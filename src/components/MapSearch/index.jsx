import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { geolocated, geoPropTypes } from 'react-geolocated';

import HotelsMap from './hotels-map';
import SearchForm from './search-form';

class MapSearch extends React.PureComponent {
  state = {
    submittedCenterCoords: null,
    submittedBboxSide: null,
    submittedCenterPoint: null,
  };

  constructor(props) {
    super(props);
    this.performSearch = this.performSearch.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { coords } = this.props;
    const { coords: prevCoords } = prevProps;
    if (coords !== prevCoords) {
      fetch(`https://photon.komoot.de/reverse?lon=${coords.longitude}&lat=${coords.latitude}`)
        .then(resp => resp.json())
        .then((json) => {
          if (json.features && json.features.length) {
            const formatName = n => `${n.properties.city || n.properties.name}, ${n.properties.country}`;
            this.performSearch(
              formatName(json.features[0]),
              [coords.longitude, coords.latitude],
              30,
            );
          }
        }).catch((e) => {
          this.setState({
            lookupError: e.message,
          });
        });
    }
  }

  performSearch(centerPoint, centerCoords, bboxSide, category) {
    const { handleSearchFormSubmit } = this.props;
    // Photon and Leaflet use lng,lat and lat,lng :(
    // We need to do a copy to prevent reversing back and forth
    const revertedCoords = [].concat(centerCoords).reverse();
    this.setState({
      submittedCenterCoords: revertedCoords,
      submittedBboxSide: parseInt(bboxSide, 10),
      submittedCategory: category,
      submittedCenterPoint: centerPoint,
    });
    return handleSearchFormSubmit({
      centerCoords: revertedCoords,
      bboxSide,
      category,
    });
  }

  render() {
    const {
      submittedCenterCoords, submittedBboxSide, submittedCenterPoint,
      submittedCategory, lookupError,
    } = this.state;
    const { results, sortedResults, searchError } = this.props;
    const sortedResultsRows = sortedResults.map(s => (
      <tr key={s.id}>
        <td><Link to={`hotels/${s.id}`}>{s.hotel.name}</Link></td>
        <td>
          {`${s.score.value.toFixed(2)} KM`}
        </td>
      </tr>
    ));

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-12">
            <SearchForm onSubmit={this.performSearch} />
          </div>
        </div>
        {lookupError && (
          <div className="row mt-1">
            <div className="col-md-12">
              <div className="alert alert-danger">{`Cannot lookup location: ${lookupError}`}</div>
            </div>
          </div>
        )}
        {searchError && (
          <div className="row mt-1">
            <div className="col-md-12">
              <div className="alert alert-danger">{`Cannot search hotels: ${searchError}`}</div>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-md-12 map-container-lg">
            {(submittedBboxSide && (
              <h3>{`Showing ${submittedCategory ? `${submittedCategory.toLowerCase()}s` : 'hotels'} from ${submittedBboxSide} KM around ${submittedCenterPoint}`}</h3>
            ))}
            <HotelsMap
              centerpoint={submittedCenterCoords}
              centerpointName={submittedCenterPoint}
              bboxSide={submittedBboxSide}
              hotels={results}
            />
          </div>
        </div>
        {!!sortedResults.length && (
        <div className="row mt-2">
          <div className="col-md-12">
            <table className="table table-striped table-responsive-sm">
              <thead>
                <tr>
                  <th>Hotel name</th>
                  <th>{`Distance from ${submittedCenterPoint}`}</th>
                </tr>
              </thead>
              <tbody>
                {sortedResultsRows}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </React.Fragment>
    );
  }
}

MapSearch.defaultProps = {
  results: [],
  sortedResults: [],
  searchError: undefined,
};

MapSearch.propTypes = {
  handleSearchFormSubmit: PropTypes.func.isRequired,
  results: PropTypes.instanceOf(Array),
  sortedResults: PropTypes.instanceOf(Array),
  searchError: PropTypes.string,
  ...geoPropTypes,
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 10000,
})(MapSearch);
