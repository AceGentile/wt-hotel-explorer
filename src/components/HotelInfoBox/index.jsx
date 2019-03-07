import React from 'react';
import PropTypes from 'prop-types';

import ImageList from '../ImageList';
import { HotelContacts, Contact } from '../HotelContacts';
import CancellationForm from '../CancellationForm';
import { Address, LocationMap } from '../HotelLocation';

const HotelInfoBox = ({ hotel, handleCancellationFormSubmit }) => (
  <div className="row">
    <div className="col-md-12 bg-light rounded p-2 mt-1">
      <div className="row">
        {hotel.images && (
        <div className="col-lg-4">
          <div className="rounded box-shadow" style={{ overflow: 'hidden' }}>
            <ImageList list={hotel.images} height={300} />
          </div>
        </div>
        )}
        <div className="col-lg-4">
          <div className="box-shadow">
            <div className="mb-1 mb-lg-0 mt-1 mt-lg-0 mb-0 map-container">
              <LocationMap
                name={hotel.name}
                location={hotel.location}
                address={hotel.address}
              />
            </div>
          </div>

        </div>
        <div className="col-lg-4">
          <Address name={hotel.name} address={hotel.address} />
          <h5 className="mt-1">Contact</h5>
          <HotelContacts contacts={hotel.contacts} />
        </div>
      </div>
      {hotel.operator && (
        <div className="row pt-1">
          <div className="col-lg-2">
            <h5>Operated by</h5>
          </div>
          <div className="col-lg-5">
            <Address name={hotel.operator.name} address={hotel.operator.address} />
          </div>
          <div className="col-lg-5">
            <Contact contact={hotel.operator.contact} />
          </div>
        </div>
      )}
      {handleCancellationFormSubmit && hotel.bookingUri && (
        <React.Fragment>
          <div className="row pt-1">
            <div className="col">
              <h5>More actions</h5>
              <ul className="list-unstyled">
                <li>
                  <button type="button" className="btn btn-link" data-toggle="collapse" data-target="#form-cancellation" aria-expanded="false" aria-controls="form-cancellation">Cancel a booking?</button>
                </li>
              </ul>
            </div>
          </div>
          <div id="form-cancellation" className="row collapse">
            <CancellationForm hotel={hotel} handleSubmit={handleCancellationFormSubmit} />
          </div>
        </React.Fragment>
      )}
    </div>
  </div>
);

HotelInfoBox.defaultProps = {
  handleCancellationFormSubmit: undefined,
};

HotelInfoBox.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
  handleCancellationFormSubmit: PropTypes.func,
};

export default HotelInfoBox;
